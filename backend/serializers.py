from django.contrib.auth.models import AnonymousUser
from django.utils.timezone import now
from rest_framework import serializers
from .models import Event, MenuItem, Order, OrderItem, User, Organisation


class EventSerializer(serializers.ModelSerializer):
    org = serializers.PrimaryKeyRelatedField(required=False, read_only=True)

    class Meta:
        model = Event
        fields = '__all__'


class MenuItemSerializer(serializers.ModelSerializer):
    class Meta:
        model = MenuItem
        fields = '__all__'
        read_only_fields = ('org',)


class BaseOrderSerializer(serializers.ModelSerializer):
    def update(self, instance, validated_data):
        if instance.status != Order.StatusEnum.DELIVERED and validated_data['status'] == Order.StatusEnum.DELIVERED:
            validated_data['delivered_timestamp'] = now()
        return super().update(instance, validated_data)

    class Meta:
        model = Order
        fields = '__all__'
        read_only_fields = ('delivered_timestamp', )


class OrderItemSerializer(serializers.ModelSerializer):
    class Meta:
        model = OrderItem
        fields = '__all__'
        read_only_fields = ('order',)


class RestrictiveUpdateOrderSerializer(BaseOrderSerializer):
    class Meta(BaseOrderSerializer.Meta):
        read_only_fields = BaseOrderSerializer.Meta.read_only_fields + ('created_timestamp', 'event', 'user')


class BaseOrderWithOrderItemsSerializer(BaseOrderSerializer):
    order_items = OrderItemSerializer(many=True)

    class Meta(BaseOrderSerializer.Meta):
        fields = (
            'id', 'created_timestamp', 'delivered_timestamp', 'event',
            'customer_number', 'note', 'status', 'user', 'order_items'
        )
        read_only_fields = BaseOrderSerializer.Meta.read_only_fields + ('created_timestamp', 'user')


class RestrictiveUpdateOrderWithOrderItemsSerializer(BaseOrderWithOrderItemsSerializer):
    class Meta(BaseOrderWithOrderItemsSerializer.Meta):
        read_only_fields = BaseOrderWithOrderItemsSerializer.Meta.read_only_fields + ('event',)


class CreatableOrderWithOrderItemsSerializer(BaseOrderWithOrderItemsSerializer):
    def create(self, validated_data):
        """
        Creates an order and all related order items.
        """
        assert validated_data.__contains__('user') and not isinstance(validated_data['user'], AnonymousUser), \
            'Creating an order requires a non-anonymous user instance passed as an argument "user"' \
            'when calling the serializer\'s save() function, (serializer.save(user=user).'
        order_items = validated_data.pop('order_items')
        order = Order.objects.create(**validated_data)
        batch = [OrderItem(
            menu=order_item['menu'], order=order, quantity=order_item['quantity'],
            special_requests=order_item.get('special_requests', '')) for order_item in order_items
        ]
        OrderItem.objects.bulk_create(batch)
        return order


class UserPublicSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ('id', 'username')


class OrganisationWithUsersSerializer(serializers.ModelSerializer):
    users = UserPublicSerializer(many=True)

    class Meta:
        model = Organisation
        fields = ('id', 'name', 'users')
