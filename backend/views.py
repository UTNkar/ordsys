from django.contrib.auth import login as django_login, logout as django_logout
from rest_framework import viewsets, status, mixins
from rest_framework.filters import SearchFilter
from rest_framework.generics import GenericAPIView
from rest_framework.permissions import AllowAny, IsAuthenticated
from rest_framework.response import Response
from .models import Event, MenuItem, Order, Organisation
from .filters import OrderFilter
from .serializers import (
    EventSerializer, MenuItemSerializer, RestrictiveUpdateOrderSerializer,
    BaseOrderWithOrderItemsSerializer, CreatableOrderWithOrderItemsSerializer,
    RestrictiveUpdateOrderWithOrderItemsSerializer,
    OrganisationWithUsersSerializer, LoginSerializer
)


class EventView(viewsets.ModelViewSet):
    filter_backends = (SearchFilter,)
    permission_classes = [IsAuthenticated]
    search_fields = ('name',)
    serializer_class = EventSerializer

    def create(self, request, *args, **kwargs):
        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        serializer.save(org=self.request.user.org)
        headers = self.get_success_headers(serializer.data)
        return Response(
            serializer.data, status=status.HTTP_201_CREATED, headers=headers
        )

    def get_queryset(self):
        user = self.request.user
        if not user.is_superuser and user.is_active:
            return Event.objects.filter(org=user.org)
        elif user.is_active:
            return Event.objects.all()
        return Event.objects.none()


class MenuItemView(viewsets.ModelViewSet):
    filterset_fields = ('item_name', 'active', 'beverage', 'org')
    permission_classes = [IsAuthenticated]
    serializer_class = MenuItemSerializer

    def get_queryset(self):
        user = self.request.user
        if not user.is_superuser and user.is_active:
            return MenuItem.objects.filter(org=user.org)
        elif user.is_active:
            return MenuItem.objects.all()
        return Order.objects.none()


class OrderView(
    viewsets.GenericViewSet, mixins.DestroyModelMixin,
    mixins.ListModelMixin, mixins.UpdateModelMixin
):
    filterset_class = OrderFilter
    permission_classes = [IsAuthenticated]
    serializer_class = RestrictiveUpdateOrderSerializer

    def get_queryset(self):
        user = self.request.user
        if not user.is_superuser and user.is_active:
            return Order.objects.filter(user__org=user.org)
        elif user.is_active:
            return Order.objects.all()
        return Order.objects.none()


class ManageOrderWithOrderItemsView(
    viewsets.GenericViewSet, mixins.CreateModelMixin, mixins.UpdateModelMixin
):
    filterset_class = OrderFilter
    permission_classes = [IsAuthenticated]

    def create(self, request, *args, **kwargs):
        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        serializer.save(user=self.request.user)
        headers = self.get_success_headers(serializer.data)
        return Response(
            serializer.data, status=status.HTTP_201_CREATED, headers=headers
        )

    def get_queryset(self):
        user = self.request.user
        if not user.is_superuser and user.is_active:
            return Order.objects.filter(
                user__org=user.org
            ).prefetch_related('order_items')
        elif user.is_active:
            return Order.objects.prefetch_related('order_items')
        return Order.objects.none()

    def get_serializer_class(self):
        if self.request.method in ('PATCH', 'POST', 'PUT'):
            return CreatableOrderWithOrderItemsSerializer
        return RestrictiveUpdateOrderWithOrderItemsSerializer


class OrderWithOrderItemsView(viewsets.ReadOnlyModelViewSet):
    filterset_class = OrderFilter
    permission_classes = [IsAuthenticated]
    serializer_class = BaseOrderWithOrderItemsSerializer

    def get_queryset(self):
        user = self.request.user
        if not user.is_superuser and user.is_active:
            return Order.objects.filter(
                user__org=user.org
            ).prefetch_related('order_items')
        elif user.is_active:
            return Order.objects.prefetch_related('order_items')
        return Order.objects.none()


class OrganisationWithUsersView(viewsets.ReadOnlyModelViewSet):
    permission_classes = [AllowAny]
    serializer_class = OrganisationWithUsersSerializer
    queryset = Organisation.objects.all().prefetch_related('users')


class LoginView(GenericAPIView):
    permission_classes = [AllowAny]
    serializer_class = LoginSerializer

    def post(self, request, *args, **kwargs):
        serializer = self.get_serializer(
            data=self.request.data, context={'request': request}
        )
        serializer.is_valid(raise_exception=True)
        django_login(
            request=request, user=serializer.validated_data.get('user')
        )
        return Response(status=status.HTTP_204_NO_CONTENT)


class LogoutView(GenericAPIView):
    permission_classes = [IsAuthenticated]

    # Function must exist on class for view to accept POST
    # noinspection PyMethodMayBeStatic
    def post(self, request, *args, **kwargs):
        django_logout(request)
        return Response(status=status.HTTP_204_NO_CONTENT)
