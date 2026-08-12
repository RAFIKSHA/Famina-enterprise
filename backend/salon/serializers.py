from rest_framework import serializers
from .models import SalonBooking

class SalonBookingSerializer(serializers.ModelSerializer):
    class Meta:
        model = SalonBooking
        fields = '__all__'

    def to_internal_value(self, data):
        data = data.copy() if hasattr(data, 'copy') else dict(data)
        if data.get('amount_charged') == '' or data.get('amount_charged') is None:
            data['amount_charged'] = 0.00
        if data.get('amount_paid') == '' or data.get('amount_paid') is None:
            data['amount_paid'] = 0.00
        if not data.get('customer_name'):
            data['customer_name'] = 'Walk-in Customer'
        if not data.get('service_name'):
            data['service_name'] = 'Salon Service'
        return super().to_internal_value(data)
