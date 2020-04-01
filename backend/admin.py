from django.contrib import admin
from django.contrib.auth.admin import UserAdmin as BaseUserAdmin
from .forms import UserForm
from .models import Event, MenuItem, Order, OrderItem, Organisation, User


@admin.register(User)
class UserAdmin(BaseUserAdmin):
    form = UserForm
    add_form = UserForm
    list_display = ['username', 'org', 'is_staff', 'is_superuser']
    list_filter = ['org', 'is_staff', 'is_superuser']
    search_fields = ['org__name', 'username']


admin.site.register(Event)
admin.site.register(MenuItem)
admin.site.register(Order)
admin.site.register(OrderItem)
admin.site.register(Organisation)
