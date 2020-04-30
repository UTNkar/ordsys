from rest_framework import viewsets, generics, status
from rest_framework.filters import SearchFilter
from rest_framework.response import Response
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


class CreateOrderView(generics.CreateAPIView):
    serializer_class = OrderWithOrderItemsSerializer

    def create(self, request, *args, **kwargs):
        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        serializer.save(user=self.request.user)
        headers = self.get_success_headers(serializer.data)
        return Response(serializer.data, status=status.HTTP_201_CREATED, headers=headers)


class OrderWithOrderItemsView(viewsets.ReadOnlyModelViewSet):
    filterset_class = OrderFilter
    serializer_class = OrderWithOrderItemsSerializer
    queryset = Order.objects.prefetch_related('order_items')


class OrganisationWithUsersView(viewsets.ReadOnlyModelViewSet):
    serializer_class = OrganisationWithUsersSerializer
    queryset = Organisation.objects.all().prefetch_related('users')
