from rest_framework import serializers
from .models import Admission

class AdmissionSerializer(serializers.ModelSerializer):
    balance_due = serializers.ReadOnlyField()

    class Meta:
        model = Admission
        fields = '__all__'

    def to_internal_value(self, data):
        data = data.copy() if hasattr(data, 'copy') else dict(data)
        if data.get('total_fees') == '' or data.get('total_fees') is None:
            data['total_fees'] = 0.00
        if data.get('amount_paid') == '' or data.get('amount_paid') is None:
            data['amount_paid'] = 0.00
        if not data.get('student_name'):
            data['student_name'] = 'Student Record'
        if not data.get('contact'):
            data['contact'] = 'N/A'
        if not data.get('course'):
            data['course'] = 'Professional Makeup & Hairstyling Diploma'
        if not data.get('batch'):
            data['batch'] = 'Morning Batch (10:00 - 13:00)'
        return super().to_internal_value(data)
