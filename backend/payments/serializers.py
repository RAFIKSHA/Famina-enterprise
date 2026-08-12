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

    def to_internal_value(self, data):
        data = data.copy() if hasattr(data, 'copy') else dict(data)
        if data.get('total_package_amount') == '' or data.get('total_package_amount') is None:
            data['total_package_amount'] = 0.00
        if data.get('amount_paid') == '' or data.get('amount_paid') is None:
            data['amount_paid'] = 0.00
        if data.get('discount_given') == '' or data.get('discount_given') is None:
            data['discount_given'] = 0.00
        return super().to_internal_value(data)
