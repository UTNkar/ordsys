from django.contrib.auth.models import AnonymousUser
from rest_framework import serializers
from .models import Event, MenuItem, Order, OrderItem, User, Organisation


class EventSerializer(serializers.ModelSerializer):
    class Meta:
        model = Event
        fields = '__all__'


class MenuItemSerializer(serializers.ModelSerializer):
    class Meta:
        model = MenuItem
        fields = '__all__'


class OrderSerializer(serializers.ModelSerializer):
    class Meta:
        model = Order
        fields = '__all__'


class OrderItemSerializer(serializers.ModelSerializer):
    class Meta:
        model = OrderItem
        fields = '__all__'


class CreateOrderItemSerializer(OrderItemSerializer):
    order = serializers.PrimaryKeyRelatedField(required=False, read_only=True)


class OrderWithOrderItemsSerializer(serializers.ModelSerializer):
    order_items = CreateOrderItemSerializer(many=True)
    user = serializers.PrimaryKeyRelatedField(read_only=True, required=False)

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

    class Meta:
        model = Order
        fields = (
            'id', 'created_timestamp', 'delivered_timestamp', 'event', 'customer_number',
            'note', 'status', 'user', 'order_items'
        )


class UserPublicSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ('id', 'username')


class OrganisationWithUsersSerializer(serializers.ModelSerializer):
    users = UserPublicSerializer(many=True)

    class Meta:
        model = Organisation
        fields = ('id', 'name', 'users')
