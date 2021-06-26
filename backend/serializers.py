from django.contrib.auth import authenticate
from django.contrib.auth.models import AnonymousUser
from django.db.models.signals import post_save
from django.utils.timezone import now
from django.utils.translation import ugettext_lazy as _
from rest_framework import serializers, exceptions
from .models import MenuItem, Order, OrderItem, User, Organisation


def _get_group_name(caller):
    if isinstance(caller, BaseOrderSerializer):
        return 'backend.Order'
    elif isinstance(caller, MenuItemSerializer):
        return 'backend.MenuItem'
    elif isinstance(caller, UserPublicSerializer):
        return 'backend.User'
    elif isinstance(caller, OrganisationWithUsersSerializer):
        return 'backend.Organisation'
    elif isinstance(caller, OrderItemSerializer):
        return 'backend.OrderItem'
    raise NotImplementedError


class _BaseSerializer(serializers.ModelSerializer):
    def get_group_name(self):
        return _get_group_name(self)


class MenuItemSerializer(_BaseSerializer):
    class Meta:
        model = MenuItem
        fields = '__all__'
        read_only_fields = ('org',)


class BaseOrderSerializer(_BaseSerializer):
    def update(self, instance, validated_data):
        if (
            instance.status != Order.StatusEnum.DELIVERED and
            validated_data['status'] == Order.StatusEnum.DELIVERED
        ):
            validated_data['delivered_timestamp'] = now()
        return super().update(instance, validated_data)

    class Meta:
        model = Order
        fields = '__all__'
        read_only_fields = ('delivered_timestamp', )


class OrderItemSerializer(_BaseSerializer):
    class Meta:
        model = OrderItem
        fields = '__all__'
        read_only_fields = ('order',)


class RestrictiveUpdateOrderSerializer(BaseOrderSerializer):
    class Meta(BaseOrderSerializer.Meta):
        read_only_fields = BaseOrderSerializer.Meta.read_only_fields + \
            ('created_timestamp', 'user')


class BaseOrderWithOrderItemsSerializer(BaseOrderSerializer):
    order_items = OrderItemSerializer(many=True)

    class Meta(BaseOrderSerializer.Meta):
        fields = (
            'id', 'beverages_only', 'created_timestamp', 'delivered_timestamp',
            'customer_number', 'note', 'status', 'user', 'order_items'
        )
        read_only_fields = BaseOrderSerializer.Meta.read_only_fields + \
            ('created_timestamp', 'user')


class RestrictiveUpdateOrderWithOrderItemsSerializer(BaseOrderWithOrderItemsSerializer):  # noqa
    class Meta(BaseOrderWithOrderItemsSerializer.Meta):
        read_only_fields = \
            BaseOrderWithOrderItemsSerializer.Meta.read_only_fields
# + \('event',)


class CreatableOrderWithOrderItemsSerializer(BaseOrderWithOrderItemsSerializer):  # noqa
    patchable_field_names = ('menu', 'quantity', 'special_requests')

    def create(self, validated_data):
        """
        Creates an order and all related order items.
        """
        assert (
            validated_data.__contains__('user') and
            not isinstance(validated_data['user'], AnonymousUser)
        ), (
            'Creating an order requires a non-anonymous user instance '
            'passed as an argument "user" when calling the serializer\'s '
            'save() function, (serializer.save(user=user).'
        )
        order_items = validated_data.pop('order_items')

        # We want to avoid sending a post_save signal before all
        # OrderItems are created, otherwise duplicate orders would
        # appear on the front-end until the page is refreshed.
        #
        # For this purpose, no_signal is used until the post_save signal
        # is manually sent further below.
        order = Order(
            **validated_data
        )
        order.no_signal = True
        order.save()

        batch = [
            OrderItem(
                menu=order_item['menu'],
                order=order,
                quantity=order_item['quantity'],
                special_requests=order_item.get('special_requests', '')
            ) for order_item in order_items
        ]
        OrderItem.objects.bulk_create(batch)

        # Manually send the post save signal now that all OrderItems have been
        # created.
        post_save.send(
            sender=Order, instance=order, created=True,
            update_fields=None, raw=False, using=None,
        )
        return order

    def update(self, instance, validated_data):
        new_order_items_data = validated_data.pop('order_items', None)

        if new_order_items_data is not None:
            order_items = OrderItem.objects.filter(order=instance)
            db_items_len = len(order_items)
            new_order_items_len = len(new_order_items_data)

            for index in range(new_order_items_len, db_items_len):
                order_items[index].delete()

            update_loop_length = db_items_len \
                if db_items_len < new_order_items_len else new_order_items_len

            update_batch = []
            for index in range(update_loop_length):
                order_item = order_items[index]

                for attr, value in new_order_items_data[index].items():
                    setattr(order_item, attr, value)

                update_batch.append(order_item)

            OrderItem.objects.bulk_update(
                update_batch,
                self.patchable_field_names
            )
            if new_order_items_len > db_items_len:
                create_batch = []
                for index in range(
                    new_order_items_len - db_items_len,
                    new_order_items_len
                ):
                    data = new_order_items_data[index]
                    req = data.get('special_requests', '')
                    create_batch.append(
                        OrderItem(
                            menu=data['menu'],
                            order=instance,
                            quantity=data['quantity'],
                            special_requests=req
                        )
                    )

                OrderItem.objects.bulk_create(create_batch)

        for attr, value in validated_data.items():
            setattr(instance, attr, value)

        instance.save()
        return instance


class UserPublicSerializer(_BaseSerializer):
    class Meta:
        model = User
        fields = ('id', 'username')


class OrganisationWithUsersSerializer(_BaseSerializer):
    users = UserPublicSerializer(many=True)

    class Meta:
        model = Organisation
        fields = ('id', 'name', 'theme', 'users')


# The unimplemented methods 'create' and 'update' will never be called as we
# have no model.
class LoginSerializer(serializers.Serializer):
    username = serializers.CharField()
    password = serializers.CharField(style={'input_type': 'password'})

    def validate(self, attrs):
        username = attrs.get('username')
        password = attrs.get('password')

        if username and password:
            user = authenticate(
                self.context['request'], username=username, password=password
            )
            if user:
                attrs['user'] = user
                return attrs
            raise exceptions.ValidationError(
                _('Unable to log in with the provided credentials.')
            )
        raise exceptions.ValidationError(
            _('Must include both "username" and "password".')
        )
