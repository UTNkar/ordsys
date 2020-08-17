from django.db import models
from django.contrib.auth.models import AbstractBaseUser, PermissionsMixin
from django.utils.timezone import now
from django.utils.translation import gettext_lazy as _
from .managers import UserManager


class Event(models.Model):
    id = models.AutoField(primary_key=True)
    name = models.CharField(
        max_length=100,
        verbose_name=_('event name'),
    )
    org = models.ForeignKey(
        to='Organisation',
        on_delete=models.CASCADE,
        verbose_name=_('organisation'),
        help_text=_('The organisation that arranged this event.'),
    )

    def __str__(self):
        return f'{self.name} ({self.org})'

    def get_org_id(self):
        return self.org.id

    class Meta:
        db_table = 'event'
        ordering = ['org', 'name']
        constraints = [
            models.UniqueConstraint(fields=['name', 'org'], name='event_name__org_key'),
        ]


class MenuItem(models.Model):
    id = models.AutoField(primary_key=True)
    item_name = models.CharField(
        max_length=100,
        verbose_name=_('name'),
    )
    active = models.BooleanField(
        default=True,
        verbose_name=_('active'),
        help_text=_('Designates whether or not this item is currently on the menu.')
    )
    beverage = models.BooleanField(
        default=False,
        verbose_name=_('beverage'),
        help_text=_('Designates whether or not this item is a beverage.'),
    )
    org = models.ForeignKey(
        to='Organisation',
        on_delete=models.CASCADE,
        verbose_name=_('organisation'),
        help_text=_('The organisation this item belongs to.'),
    )

    def __str__(self):
        return f'{self.item_name} ({self.org.name})'

    def get_org_id(self):
        return self.org.id

    class Meta:
        db_table = 'menu_item'
        ordering = ['org', 'beverage', 'item_name']
        constraints = [
            models.UniqueConstraint(fields=['item_name', 'org'], name='item_name__org_key'),
        ]
        indexes = [
            models.Index(fields=['active'], name='menu_item_active_idx'),
            models.Index(fields=['beverage'], name='menu_item_beverage_idx'),
            models.Index(fields=['org', 'beverage', 'item_name'], name='menu_item_ordering_idx'),
        ]


class Order(models.Model):
    class StatusEnum(models.TextChoices):
        WAITING = 'Waiting'
        IN_PROGRESS = 'In progress'
        DONE = 'Done'
        DELIVERED = 'Delivered'

    id = models.AutoField(primary_key=True)
    beverages_only = models.BooleanField(
        help_text=_('Specifies if the order contains only beverages or only food.')
    )
    # Represented as 'NN - X'
    customer_number = models.CharField(
        max_length=6,
        verbose_name=_('customer_number')
    )
    created_timestamp = models.DateTimeField(
        default=now,
        editable=False,
        verbose_name=_('order placed'),
    )
    delivered_timestamp = models.DateTimeField(
        default=None,
        null=True,
        verbose_name=_('order delivered'),
    )
    note = models.TextField(
        blank=True,
        verbose_name=_('note'),
        help_text=_('Additional information provided by the customer.'),
    )
    status = models.CharField(
        max_length=11,
        choices=StatusEnum.choices,
        default=StatusEnum.WAITING,
        verbose_name=_('status'),
        help_text=_('The current status of the order.'),
    )
    event = models.ForeignKey(
        to=Event,
        on_delete=models.CASCADE,
        verbose_name=_('event'),
        help_text=_('During which event the order was placed.'),
    )
    user = models.ForeignKey(
        to='User',
        on_delete=models.CASCADE,
        verbose_name=_('user'),
        help_text=_('Which user that submitted the order.'),
    )

    def __str__(self):
        return f'Order #{self.id} ({self.event})'

    def get_org_id(self):
        return self.event.org.id

    class Meta:
        db_table = 'order'
        ordering = ['id']
        indexes = [
            models.Index(fields=['beverages_only'], name='order_beverages_only_idx'),
        ]


class OrderItem(models.Model):
    id = models.AutoField(primary_key=True)
    menu = models.ForeignKey(
        to=MenuItem,
        on_delete=models.CASCADE,
        verbose_name=_('menu item'),
        help_text=_('Which item that was ordered.'),
    )
    order = models.ForeignKey(
        to=Order,
        on_delete=models.CASCADE,
        related_name='order_items',
        verbose_name=_('order'),
        help_text=_('Which order this item belongs to.'),
    )
    quantity = models.PositiveIntegerField()
    special_requests = models.CharField(
        max_length=128,
        blank=True,
        verbose_name=_('note'),
        help_text=_('Modifications to the item requested by the customer'),
    )

    def __str__(self):
        return f'Item #{self.id} ({self.order}, {self.quantity}x {self.menu})'

    class Meta:
        db_table = 'order_item'
        ordering = ['order', 'id']
        indexes = [
            models.Index(fields=['order', 'id'], name='order_item_order_id__id_idx'),
        ]


class Organisation(models.Model):
    class ThemesEnum(models.TextChoices):
        UTN = 'utn', 'UTN'
        UTNARM = 'utnarm', 'Utnarm'
        TEKNOLOG_DATAVETARMOTTAGNINGEN = 'td', 'Teknolog- och datavetarmottagningen'
        KLUBBVERKET = 'klubbverket', 'Klubbverket'
        FORSRANNINGEN = 'forsranningen', 'Forsränningen'
        REBUSRALLYT = 'rebusrallyt', 'Rebusrallyt'

    id = models.AutoField(primary_key=True)
    name = models.CharField(
        max_length=128,
        unique=True,
        verbose_name=_('organisation name'),
    )
    theme = models.CharField(
        max_length=20,
        choices=ThemesEnum.choices,
        default=ThemesEnum.UTN,
        verbose_name=_('theme'),
        help_text=_('Which theme to apply to the organisation.'),
    )

    def __str__(self):
        return self.name

    def get_org_id(self):
        return self.id

    class Meta:
        db_table = 'organisation'
        ordering = ['name']


class User(AbstractBaseUser, PermissionsMixin):
    id = models.AutoField(primary_key=True)
    username = models.CharField(
        max_length=40,
        unique=True,
        verbose_name=_('username'),
    )
    password = models.CharField(
        max_length=128,
        verbose_name=_('password'),
    )
    is_staff = models.BooleanField(
        verbose_name=_('staff status'),
        default=False,
        help_text=_('Designates whether the user can log into this admin site.'),
    )
    org = models.ForeignKey(
        to=Organisation,
        on_delete=models.CASCADE,
        related_name='users',
        verbose_name=_('organisation'),
        help_text=_('Which organisation this user belongs to.'),
    )
    USERNAME_FIELD = 'username'
    REQUIRED_FIELDS = ['org']
    objects = UserManager()

    def __str__(self):
        return self.username

    def get_org_id(self):
        return self.org.id

    class Meta:
        ordering = ['username']
