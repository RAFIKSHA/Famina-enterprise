from rest_framework import serializers
from .models import Appointment

class AppointmentSerializer(serializers.ModelSerializer):
    patient_name = serializers.ReadOnlyField(source='patient.name')
    patient_mobile = serializers.ReadOnlyField(source='patient.mobile_no')
    patient_id_str = serializers.ReadOnlyField(source='patient.patient_id')

    class Meta:
        model = Appointment
        fields = '__all__'
