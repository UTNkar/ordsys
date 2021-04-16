from django.contrib import admin
from django.contrib.auth.admin import UserAdmin as BaseUserAdmin
from .forms import ModelWithOrganisationForm, UserForm
from .models import Event, MenuItem, Order, OrderItem, Organisation, User


class ForeignKeyModelAdmin(admin.ModelAdmin):
    def formfield_for_foreignkey(self, db_field, request, **kwargs):
        if db_field.name == 'user':
            model = User
        elif db_field.name == 'order':
            model = Order
        elif db_field.name == 'menu':
            model = MenuItem

        if model:
            kwargs['queryset'] = model.objects.all() \
                if request.user.is_superuser \
                else model.objects.filter(org=request.user.org)
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

    def get_list_display(self, request):
        if not request.user.is_superuser:
            return ['name']
        return ['name', 'org']

    def get_list_filter(self, request):
        if not request.user.is_superuser:
            return []
        return ['org']

    def get_queryset(self, request):
        if not request.user.is_superuser:
            return Event.objects.filter(org=request.user.org)
        return Event.objects.all()

    def get_search_fields(self, request):
        if not request.user.is_superuser:
            return ['name']
        return ['name', 'org__name']


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
                (None, {'fields': ['item_name', 'active', 'beverage']}),
            )
        return (
            (None, {'fields': ['item_name', 'active', 'beverage', 'org']}),
        )

    def get_list_display(self, request):
        if not request.user.is_superuser:
            return ['item_name', 'active', 'beverage']
        return ['item_name', 'active', 'beverage', 'org']

    def get_list_filter(self, request):
        if not request.user.is_superuser:
            return ['active', 'beverage']
        return ['active', 'beverage', 'org']

    def get_queryset(self, request):
        if not request.user.is_superuser:
            return MenuItem.objects.filter(org=request.user.org)
        return MenuItem.objects.all()

    def get_search_fields(self, request):
        if not request.user.is_superuser:
            return []
        return ['org__name']


@admin.register(Order)
class OrderAdmin(ForeignKeyModelAdmin):
    form = ModelWithOrganisationForm
    list_display = [
        'get_order_name', 'get_event_name', 'beverages_only', 'created_timestamp',
        'status', 'get_delivered_timestamp', 'user'
    ]

    def get_delivered_timestamp(self, obj):
        return obj.delivered_timestamp
    get_delivered_timestamp.empty_value_display = '(Not delivered)'
    get_delivered_timestamp.short_description = 'Order delivered'

    def get_event_name(self, obj):
        return obj.event.name
    get_event_name.short_description = 'Event'

    def get_order_name(self, obj):
        return f'Order #{obj.id}'
    get_order_name.short_description = 'Order'

    def get_fieldsets(self, request, obj=None):
        return (
            (None, {'fields': [
                'beverages_only', 'customer_number', 'note', 'status', 'event', 'user'
            ]}),
        )

    def get_list_filter(self, request):
        if not request.user.is_superuser:
            return ['beverages_only', 'status', 'event', 'user']
        return ['beverages_only', 'status', 'event', 'user', 'user__org']

    def get_readonly_fields(self, request, obj=None):
        field_list = ['status']
        if not request.user.is_superuser and obj is not None:
            field_list.append('user')
            field_list.append('beverages_only')
        return field_list

    def get_queryset(self, request):
        if not request.user.is_superuser:
            return Order.objects.filter(user__org=request.user.org)
        return Order.objects.all()

    def get_search_fields(self, request):
        if not request.user.is_superuser:
            return ['event__name', 'user__username']
        return ['event__name', 'user__org__name', 'user__username']


@admin.register(OrderItem)
class OrderItemAdmin(ForeignKeyModelAdmin):
    list_display = ['get_menu_name', 'get_order_name', 'get_event_name', 'quantity', 'special_requests']
    list_filter = ['menu', 'order']
    search_fields = ['menu__item_name', 'order__event__name']

    def get_event_name(self, obj):
        return obj.order.event.name
    get_event_name.short_description = 'Event'

    def get_menu_name(self, obj):
        return obj.menu.item_name
    get_menu_name.short_description = 'Item ordered'

    def get_order_name(self, obj):
        return f'Order #{obj.order.id}'
    get_order_name.short_description = 'Order'

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
    # Must be overridden as superclass lists contains missing fields.
    # The lists are dynamically obtained in their respective methods.
    list_display = []
    list_filter = []

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

    def get_list_display(self, request):
        if not request.user.is_superuser:
            return ['username', 'is_staff']
        return ['username', 'org', 'is_staff', 'is_superuser']

    def get_list_filter(self, request):
        if not request.user.is_superuser:
            return []
        return ['org', 'is_staff', 'is_superuser']

    def get_queryset(self, request):
        if not request.user.is_superuser:
            return User.objects.filter(org=request.user.org)
        return User.objects.all()

    def get_search_fields(self, request):
        if not request.user.is_superuser:
            return ['username']
        return ['org__name', 'username']
