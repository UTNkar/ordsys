from rest_framework import viewsets
from .models import Event, MenuItem, Order
from .serializers import (
    EventSerializer, MenuItemSerializer, OrderSerializer, OrderWithOrderItemsSerializer
)


class EventView(viewsets.ModelViewSet):
    serializer_class = EventSerializer
    queryset = Event.objects.all()


class MenuItemView(viewsets.ModelViewSet):
    serializer_class = MenuItemSerializer
    queryset = MenuItem.objects.all()


class OrderView(viewsets.ModelViewSet):
    serializer_class = OrderSerializer
    queryset = Order.objects.all()


class OrderWithOrderItemsView(viewsets.ReadOnlyModelViewSet):
    serializer_class = OrderWithOrderItemsSerializer
    queryset = Order.objects.prefetch_related('order_items')
