from django_filters import rest_framework as filters
from django.utils import timezone
from datetime import timedelta
from .models import Order


class OrderFilter(filters.FilterSet):
    exclude_status = filters.ChoiceFilter(
        field_name='status', exclude=True, choices=Order.StatusEnum.choices
    )
    max_age = filters.NumberFilter(
        field_name='created_timestamp',
        method='get_younger_than_n_hours',
        label='Get orders younger than n hours',
    )
    min_age = filters.NumberFilter(
        field_name='created_timestamp',
        method='get_older_than_n_hours',
        label='Get orders older than n hours',
    )

    def get_younger_than_n_hours(self, queryset, field_name, value):
        time_threshold = timezone.now() - timedelta(hours=int(value))
        return queryset.filter(created_timestamp__gte=time_threshold)

    def get_older_than_n_hours(self, queryset, field_name, value):
        time_threshold = timezone.now() - timedelta(hours=int(value))
        return queryset.filter(created_timestamp__lte=time_threshold)

    class Meta:
        model = Order
        fields = (
            'beverages_only', 'exclude_status',
            'max_age', 'min_age', 'user'
        )
