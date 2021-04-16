from asgiref.sync import async_to_sync
from channels.layers import get_channel_layer
from django.db.models.signals import post_delete, post_save
from django.dispatch import receiver

from backend.models import Event, MenuItem, Order, Organisation, User
from backend.serializers import (
    BaseOrderWithOrderItemsSerializer, EventSerializer, MenuItemSerializer,
    OrganisationWithUsersSerializer, UserPublicSerializer
)


async def _send_to_group(channel, group, payload):
    await channel.group_send(group, payload)


@receiver((post_delete, post_save), sender=Event, dispatch_uid='event_signal')
@receiver(
    (post_delete, post_save), sender=MenuItem, dispatch_uid='menu_item_signal'
)
@receiver((post_delete, post_save), sender=Order, dispatch_uid='order_signal')
@receiver(
    (post_delete, post_save), sender=Organisation,
    dispatch_uid='organisation_signal'
)
@receiver((post_delete, post_save), sender=User, dispatch_uid='user_signal')
def notify_model_changed(sender, instance, **kwargs):
    is_newly_created = kwargs.get('created', None)
    if is_newly_created is True:
        message_type = 'create'
    elif is_newly_created is False:
        message_type = 'update'
    else:
        # is_newly_created is None
        message_type = 'delete'
    if sender is Order:
        if is_newly_created is False:
            # If the order was updated we must get fresh data from the
            # database to avoid # using stale order items data from the
            # cache maintained by Django.
            instance = Order.objects.get(id=instance.id)
        serializer = BaseOrderWithOrderItemsSerializer(instance)
    elif sender is Event:
        serializer = EventSerializer(instance)
    elif sender is MenuItem:
        serializer = MenuItemSerializer(instance)
    elif sender is User:
        serializer = UserPublicSerializer(instance)
    elif sender is Organisation:
        serializer = OrganisationWithUsersSerializer(instance)
    else:
        raise NotImplementedError
    async_to_sync(_send_to_group)(
        get_channel_layer(),
        serializer.get_group_name(),
        {
            'type': 'notify_model_change',
            'content': {
                'type': message_type,
                'payload': serializer.data,
                'model_name': serializer.Meta.model.__name__,
                'model_org_id': instance.get_org_id(),
            },
        }
    )
