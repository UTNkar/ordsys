from rest_framework import viewsets, generics, status
from rest_framework.filters import SearchFilter
from rest_framework.permissions import AllowAny, IsAuthenticated
from rest_framework.response import Response
from .models import Event, MenuItem, Order, Organisation
from .filters import OrderFilter
from .serializers import (
    EventSerializer, MenuItemSerializer, OrderSerializer, OrderWithOrderItemsSerializer,
    OrganisationWithUsersSerializer,
)


class EventView(viewsets.ModelViewSet):
    filter_backends = (SearchFilter,)
    permission_classes = [IsAuthenticated]
    search_fields = ('name',)
    serializer_class = EventSerializer

    def get_queryset(self):
        user = self.request.user
        if not user.is_superuser and user.is_active:
            return Event.objects.filter(org=user.org)
        elif user.is_active:
            return Event.objects.all()
        return Event.objects.none()


class MenuItemView(viewsets.ModelViewSet):
    filterset_fields = ('item_name', 'active', 'org')
    permission_classes = [IsAuthenticated]
    serializer_class = MenuItemSerializer

    def get_queryset(self):
        user = self.request.user
        if not user.is_superuser and user.is_active:
            return MenuItem.objects.filter(org=user.org)
        elif user.is_active:
            return MenuItem.objects.all()
        return Order.objects.none()


class OrderView(viewsets.ModelViewSet):
    filterset_class = OrderFilter
    permission_classes = [IsAuthenticated]
    serializer_class = OrderSerializer

    def get_queryset(self):
        user = self.request.user
        if not user.is_superuser and user.is_active:
            return Order.objects.filter(user__org=user.org)
        elif user.is_active:
            return Order.objects.all()
        return Order.objects.none()


class CreateOrderView(generics.CreateAPIView):
    permission_classes = [IsAuthenticated]
    serializer_class = OrderWithOrderItemsSerializer

    def create(self, request, *args, **kwargs):
        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        serializer.save(user=self.request.user)
        headers = self.get_success_headers(serializer.data)
        return Response(serializer.data, status=status.HTTP_201_CREATED, headers=headers)


class OrderWithOrderItemsView(viewsets.ReadOnlyModelViewSet):
    filterset_class = OrderFilter
    permission_classes = [IsAuthenticated]
    serializer_class = OrderWithOrderItemsSerializer

    def get_queryset(self):
        user = self.request.user
        if not user.is_superuser and user.is_active:
            return Order.objects.filter(user__org=user.org).prefetch_related('order_items')
        elif user.is_active:
            return Order.objects.prefetch_related('order_items')
        return Order.objects.none()


class OrganisationWithUsersView(viewsets.ReadOnlyModelViewSet):
    permission_classes = [AllowAny]
    serializer_class = OrganisationWithUsersSerializer
    queryset = Organisation.objects.all().prefetch_related('users')
