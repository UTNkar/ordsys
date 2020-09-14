from django_filters import rest_framework as filters
from django.utils import timezone
from datetime import timedelta
from .models import Order


class OrderFilter(filters.FilterSet):
    exclude_status = filters.ChoiceFilter(field_name='status', exclude=True, choices=Order.StatusEnum.choices)
    max_age = filters.NumberFilter(
        field_name='created_timestamp', method='get_past_n_hours', label="Past n hours")

    def get_past_n_hours(self, queryset, field_name, value):
        time_threshold = timezone.now() - timedelta(hours=int(value))
        return queryset.filter(created_timestamp__gte=time_threshold)


    class Meta:
        model = Order
        fields = ('beverages_only', 'event', 'exclude_status', 'max_age', 'user')
