from django.contrib import admin
from django.contrib.auth.admin import UserAdmin as BaseUserAdmin
from .forms import ModelWithOrganisationForm, UserForm
from .models import Event, MenuItem, Order, OrderItem, Organisation, User


class ForeignKeyModelAdmin(admin.ModelAdmin):
    def formfield_for_foreignkey(self, db_field, request, **kwargs):
        if db_field.name == 'user':
            kwargs['queryset'] = User.objects.all() if request.user.is_superuser \
                                 else User.objects.filter(org=request.user.org)
            kwargs['initial'] = 0
        elif db_field.name == 'order':
            kwargs['queryset'] = Order.objects.all() if request.user.is_superuser \
                                 else Order.objects.filter(user__org=request.user.org)
            kwargs['initial'] = 0
        elif db_field.name == 'menu':
            kwargs['queryset'] = MenuItem.objects.all() if request.user.is_superuser \
                                 else MenuItem.objects.filter(org=request.user.org)
            kwargs['initial'] = 0
        return super().formfield_for_foreignkey(db_field, request, **kwargs)


@admin.register(Event)
class EventAdmin(ForeignKeyModelAdmin):
    form = ModelWithOrganisationForm

    def get_form(self, request, obj=None, **kwargs):
        form = super().get_form(request, obj, **kwargs)
        if not request.user.is_superuser:
            form.org = request.user.org
        return form

    def get_fieldsets(self, request, obj=None):
        if not request.user.is_superuser:
            return (
                (None, {'fields': ['name']}),
            )
        return (
            (None, {'fields': ['name', 'org']}),
        )

    def get_queryset(self, request):
        if not request.user.is_superuser:
            return Event.objects.filter(org=request.user.org)
        return Event.objects.all()


@admin.register(MenuItem)
class MenuItemAdmin(ForeignKeyModelAdmin):
    form = ModelWithOrganisationForm

    def get_form(self, request, obj=None, **kwargs):
        form = super().get_form(request, obj, **kwargs)
        if not request.user.is_superuser:
            form.org = request.user.org
        return form

    def get_fieldsets(self, request, obj=None):
        if not request.user.is_superuser:
            return (
                (None, {'fields': ['item_name']}),
            )
        return (
            (None, {'fields': ['item_name', 'org']}),
        )

    def get_queryset(self, request):
        if not request.user.is_superuser:
            return MenuItem.objects.filter(org=request.user.org)
        return MenuItem.objects.all()


@admin.register(Order)
class OrderAdmin(ForeignKeyModelAdmin):
    form = ModelWithOrganisationForm

    def get_fieldsets(self, request, obj=None):
        return (
            (None, {'fields': [
                'customer_number', 'created_timestamp', 'delivered_timestamp', 'note', 'status', 'event', 'user'
            ]}),
        )

    def get_readonly_fields(self, request, obj=None):
        if not request.user.is_superuser:
            field_list = ['created_timestamp', 'delivered_timestamp', 'status']
            if obj is not None:
                field_list.append('user')
            return field_list
        return []

    def get_queryset(self, request):
        if not request.user.is_superuser:
            return Order.objects.filter(user__org=request.user.org)
        return Order.objects.all()


@admin.register(OrderItem)
class OrderItemAdmin(ForeignKeyModelAdmin):
    def get_readonly_fields(self, request, obj=None):
        if not request.user.is_superuser and obj is not None:
            return ['order']
        return []

    def get_queryset(self, request):
        if not request.user.is_superuser:
            return OrderItem.objects.filter(menu__org=request.user.org)
        return OrderItem.objects.all()


@admin.register(Organisation)
class OrganisationAdmin(admin.ModelAdmin):
    def get_queryset(self, request):
        if not request.user.is_superuser:
            return Organisation.objects.filter(id=request.user.org.id)
        return Organisation.objects.all()


@admin.register(User)
class UserAdmin(BaseUserAdmin, ForeignKeyModelAdmin):
    form = UserForm
    add_form = UserForm
    list_display = ['username', 'org', 'is_staff', 'is_superuser']
    list_filter = ['org', 'is_staff', 'is_superuser']
    search_fields = ['org__name', 'username']

    def get_form(self, request, obj=None, **kwargs):
        form = super().get_form(request, obj, **kwargs)
        if not request.user.is_superuser:
            form.org = request.user.org
        return form

    def get_fieldsets(self, request, obj=None):
        if not request.user.is_superuser:
            return (
                (None, {'fields': ['username', 'password', 'confirm_password']}),
            )
        return (
            (None, {'fields': ['username', 'password', 'confirm_password', 'org']}),
            ('Permissions', {'fields': ['is_staff', 'is_superuser', 'groups']}),
        )

    def get_queryset(self, request):
        if not request.user.is_superuser:
            return User.objects.filter(org=request.user.org)
        return User.objects.all()
