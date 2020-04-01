from django.urls import path, include
from .views import EventView, MenuItemView, OrderView, OrderWithOrderItemsView
from rest_framework import routers


router = routers.DefaultRouter()
router.register('events', EventView, 'event')
router.register('menu_items', MenuItemView, 'menu_item')
router.register('orders', OrderView, 'order')
router.register('orders_with_order_items', OrderWithOrderItemsView, 'order_with_order_items')

urlpatterns = [
    path('api/', include(router.urls)),
]
