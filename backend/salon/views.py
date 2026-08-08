from rest_framework import viewsets, filters
from django_filters.rest_framework import DjangoFilterBackend
from .models import SalonBooking
from .serializers import SalonBookingSerializer

class SalonBookingViewSet(viewsets.ModelViewSet):
    queryset = SalonBooking.objects.all().order_by('-booking_date', '-id')
    serializer_class = SalonBookingSerializer
    filter_backends = [filters.SearchFilter]
    search_fields = ['customer_name', 'service_name', 'staff_assigned']

    def get_queryset(self):
        queryset = super().get_queryset()
        service_type = self.request.query_params.get('service_type')
        date = self.request.query_params.get('date')

        if service_type:
            queryset = queryset.filter(service_type__iexact=service_type)
        if date:
            queryset = queryset.filter(booking_date=date)
            
        return queryset
