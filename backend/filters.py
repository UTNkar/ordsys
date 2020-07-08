from django_filters import rest_framework as filters
from .models import Order


class OrderFilter(filters.FilterSet):
    exclude_status = filters.ChoiceFilter(field_name='status', exclude=True, choices=Order.StatusEnum.choices)

    class Meta:
        model = Order
        fields = ('beverages_only', 'event', 'exclude_status', 'user')
