from rest_framework import serializers
from .models import SalonBooking

class SalonBookingSerializer(serializers.ModelSerializer):
    class Meta:
        model = SalonBooking
        fields = '__all__'
