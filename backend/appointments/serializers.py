from rest_framework import serializers
from .models import Appointment

class AppointmentSerializer(serializers.ModelSerializer):
    patient_name = serializers.ReadOnlyField(source='patient.name')
    patient_mobile = serializers.ReadOnlyField(source='patient.mobile_no')
    patient_id_str = serializers.ReadOnlyField(source='patient.patient_id')

    class Meta:
        model = Appointment
        fields = '__all__'

    def to_internal_value(self, data):
        data = data.copy() if hasattr(data, 'copy') else dict(data)
        if not data.get('department'):
            data['department'] = 'Skin & Laser'
        if not data.get('appointment_time'):
            data['appointment_time'] = '10:00'
        return super().to_internal_value(data)
