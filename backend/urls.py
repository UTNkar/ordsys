from django.conf.urls import url
from django.urls import path, include
from .views import (
    CreateOrderView, EventView, MenuItemView, OrderView, OrderWithOrderItemsView,
    OrganisationWithUsersView
)
from rest_framework import routers


router = routers.DefaultRouter()
router.register('events', EventView, 'event')
router.register('menu_items', MenuItemView, 'menu_item')
router.register('orders', OrderView, 'order')
router.register('orders_with_order_items', OrderWithOrderItemsView, 'order_with_order_items')
router.register('organisations_with_users', OrganisationWithUsersView, 'organisation_with_users')

urlpatterns = [
    path('api/', include(router.urls)),
    url(r'^api/create_order/$', CreateOrderView.as_view(), name='create_order'),
]
