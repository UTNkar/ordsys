from rest_framework import viewsets
from rest_framework.filters import SearchFilter
from .models import Event, MenuItem, Order, Organisation
from .filters import OrderFilter
from .serializers import (
    EventSerializer, MenuItemSerializer, OrderSerializer, OrderWithOrderItemsSerializer,
    OrganisationWithUsersSerializer,
)


class EventView(viewsets.ModelViewSet):
    filter_backends = (SearchFilter,)
    search_fields = ('name',)
    serializer_class = EventSerializer
    queryset = Event.objects.all()


class MenuItemView(viewsets.ModelViewSet):
    filterset_fields = ('item_name', 'active', 'org')
    serializer_class = MenuItemSerializer
    queryset = MenuItem.objects.all()


class OrderView(viewsets.ModelViewSet):
    filterset_class = OrderFilter
    serializer_class = OrderSerializer
    queryset = Order.objects.all()


class OrderWithOrderItemsView(viewsets.ReadOnlyModelViewSet):
    filterset_class = OrderFilter
    serializer_class = OrderWithOrderItemsSerializer
    queryset = Order.objects.prefetch_related('order_items')


class OrganisationWithUsersView(viewsets.ReadOnlyModelViewSet):
    serializer_class = OrganisationWithUsersSerializer
    queryset = Organisation.objects.all().prefetch_related('users')
