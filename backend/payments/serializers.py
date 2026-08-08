from rest_framework import serializers
from .models import Payment

class PaymentSerializer(serializers.ModelSerializer):
    patient_name = serializers.ReadOnlyField(source='patient.name')
    patient_id_str = serializers.ReadOnlyField(source='patient.patient_id')
    staff_name = serializers.ReadOnlyField(source='collected_by.username')
    balance_due = serializers.ReadOnlyField()

    class Meta:
        model = Payment
        fields = '__all__'
