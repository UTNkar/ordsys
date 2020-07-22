import asyncio
import re
from typing import Coroutine, List

from channels.db import database_sync_to_async
from channels.generic.websocket import AsyncJsonWebsocketConsumer
from django.contrib.auth.models import AnonymousUser
from rest_framework.authtoken.models import Token

from backend.models import User


model_regex = re.compile('^backend\\.(Event|MenuItem|Order|OrderItem|Organisation|User)$')


@database_sync_to_async
def get_user_from_token(token: str):
    """
    Helper function to retrieve the user authenticated by token.

    :param token: the token
    :return: the user or an anonymous user if no user was found
    """
    try:
        return Token.objects.get(key=token).user
    except Token.DoesNotExist:
        return AnonymousUser()


@database_sync_to_async
def get_user_org_id(user: User):
    """
    Helper function to access a user's organisation ID in an asynchronous context.

    :param user: the user to operate upon
    :return: the id of the user's organisation
    """
    return user.org.id


class ModelChangesConsumer(AsyncJsonWebsocketConsumer):
    async def connect(self):
        query_string: bytes = self.scope.get('query_string', None)
        if query_string is not None:
            _, token = query_string.decode().split('=')
            user = await get_user_from_token(token)
            # Anonymous users always have an ID of "None"
            if user.id is not None:
                self.scope['user'] = user
                await self.accept()
                return
        await self.close()

    async def notify_model_change(self, event):
        user = self.scope['user']
        # Ensure user is still authenticated before sending any data, otherwise close the connection.
        if user.id is not None:
            user_org_id = await get_user_org_id(user)
            # Only send data to users that belong to the organisation of the updated model.
            # In case an organisation has multiple events running concurrently,
            # they will receive each other's model updates which would be problematic.
            # Django has no way to keep track of the active event as REST is stateless.
            if event['content']['model_org_id'] == user_org_id:
                await self.send_json(event['content'])
        else:
            await self.close()

    async def receive_json(self, content, **kwargs):
        if self.scope['user'].id is not None:
            group_names: List[str] = [name for name in content.get('models', ['']) if re.search(model_regex, name)]
            channel_groups_to_add: List[Coroutine] = []
            for group_name in group_names:
                if group_name not in self.groups:
                    self.groups.append(group_name)
                    channel_groups_to_add.append(self.channel_layer.group_add(group_name, self.channel_name))
            if len(channel_groups_to_add) > 0:
                await asyncio.wait(channel_groups_to_add)
        else:
            await self.close()
