import asyncio
import re
from typing import Coroutine, List
from channels.auth import get_user
from channels.db import database_sync_to_async
from channels.generic.websocket import AsyncJsonWebsocketConsumer
from backend.models import User


model_regex = re.compile(
    '^backend\\.(MenuItem|Order|OrderItem|Organisation|User)$'
)


@database_sync_to_async
def get_user_org_id(user: User):
    """
    Helper function to access a user's organisation ID in an asynchronous
    context.

    :param user: the user to operate upon
    :return: the id of the user's organisation
    """
    return user.org.id


def user_is_authenticated(user):
    return user.id is not None


class ModelChangesConsumer(AsyncJsonWebsocketConsumer):
    async def connect(self):
        if user_is_authenticated(await get_user(self.scope)):
            await self.accept()
        else:
            await self.close()

    async def notify_model_change(self, event):
        # Ensure user is still authenticated before sending any data,
        # otherwise close the connection.
        user = await get_user(self.scope)
        if user_is_authenticated(user):
            user_org_id = await get_user_org_id(user)
            # Only send data to users that belong to the organisation of the
            # updated model. In case an organisation has multiple events
            # running concurrently, they will receive each other's model
            # updates which would be problematic. Django has no way to
            # keep track of the active event as REST is stateless.
            if event['content']['model_org_id'] == user_org_id:
                await self.send_json(event['content'])
        else:
            await self.close()

    async def receive_json(self, content, **kwargs):
        user = await get_user(self.scope)

        if user_is_authenticated(user):
            group_names: List[str] = [
                name for name in content.get('models', [''])
                if re.search(model_regex, name)
            ]

            channel_groups_to_add: List[Coroutine] = []
            for group_name in group_names:
                if group_name not in self.groups:
                    self.groups.append(group_name)
                    channel_groups_to_add.append(
                        self.channel_layer.group_add(
                            group_name, self.channel_name
                        )
                    )

            if len(channel_groups_to_add) > 0:
                await asyncio.wait(channel_groups_to_add)
        else:
            await self.close()
