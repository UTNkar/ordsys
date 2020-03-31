from django.contrib import admin
from .models import Event, MenuItem, Order, OrderItem, Organisation


admin.site.register(Event)
admin.site.register(MenuItem)
admin.site.register(Order)
admin.site.register(OrderItem)
admin.site.register(Organisation)
