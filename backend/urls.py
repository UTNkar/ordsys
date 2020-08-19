from django.urls import path, include, re_path
from .views import (
    EventView, MenuItemView, OrderView, OrderWithOrderItemsView,
    ManageOrderWithOrderItemsView, OrganisationWithUsersView,
    LoginView, LogoutView
)
from rest_framework import routers


router = routers.DefaultRouter()
router.register('events', EventView, 'event')
router.register('menu_items', MenuItemView, 'menu_item')
router.register('orders', OrderView, 'order')
router.register('orders_with_order_items', OrderWithOrderItemsView, 'order_with_order_items')
router.register('manage_orders_with_order_items', ManageOrderWithOrderItemsView, 'manage_order_with_order_items')
router.register('organisations_with_users', OrganisationWithUsersView, 'organisation_with_users')

urlpatterns = [
    path('api/', include(router.urls)),
    path('auth/', include([
        re_path(r'^login/', LoginView.as_view(), name='login'),
        re_path(r'^logout/', LogoutView.as_view(), name='logout'),
    ]))
]
