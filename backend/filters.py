from django_filters import rest_framework as filters
from django.utils import timezone
from datetime import timedelta
from .models import Order


class OrderFilter(filters.FilterSet):
    exclude_status = filters.ChoiceFilter(
        field_name='status', exclude=True, choices=Order.StatusEnum.choices
    )
    max_hours = filters.NumberFilter(
        field_name='created_timestamp',
        method='get_younger_than_n_hours',
        label='Get orders younger than n hours',
    )
    # DateTime for the following functions must be in ISO format
    # as per https://www.w3.org/TR/NOTE-datetime
    # In short: YYYY-MM-DDThh:mm:ss.sTZD
    # For this, the javascript date function .toISOString() can be used
    younger_than = filters.DateTimeFilter(
        field_name='created_timestamp',
        method='get_younger_than_datetime',
        label='Get orders younger than the given datetime'
    )
    older_than = filters.DateTimeFilter(
        field_name='created_timestamp',
        method='get_older_than_datetime',
        label='Get orders older than the given datetime'
    )

    def get_younger_than_n_hours(self, queryset, field_name, value):
        time_threshold = timezone.now() - timedelta(hours=int(value))
        return queryset.filter(created_timestamp__gte=time_threshold)

    def get_younger_than_datetime(self, queryset, field_name, value):
        return queryset.filter(created_timestamp__lte=value)

    def get_older_than_datetime(self, queryset, field_name, value):
        return queryset.filter(created_timestamp__gte=value)

    class Meta:
        model = Order
        fields = (
            'beverages_only', 'exclude_status',
            'max_hours', 'younger_than', 'older_than', 'user'
        )
