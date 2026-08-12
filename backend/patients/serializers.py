from rest_framework import serializers
from .models import Patient, Visit

class VisitSerializer(serializers.ModelSerializer):
    staff_name = serializers.ReadOnlyField(source='staff_attended.username')

    class Meta:
        model = Visit
        fields = '__all__'
        read_only_fields = ['staff_attended']

    def to_internal_value(self, data):
        data = data.copy() if hasattr(data, 'copy') else dict(data)
        if data.get('next_appointment_date') == '':
            data['next_appointment_date'] = None
        if data.get('session_no') == '' or data.get('session_no') is None:
            data['session_no'] = 1
        if data.get('amount_charged') == '' or data.get('amount_charged') is None:
            data['amount_charged'] = 0.00
        if data.get('amount_paid') == '' or data.get('amount_paid') is None:
            data['amount_paid'] = 0.00
        if data.get('treatment_given') == '' or data.get('treatment_given') is None:
            data['treatment_given'] = 'General Treatment Session'
        return super().to_internal_value(data)

    def to_representation(self, instance):
        if hasattr(instance, 'visit_date') and hasattr(instance.visit_date, 'date'):
            instance.visit_date = instance.visit_date.date()
        if hasattr(instance, 'next_appointment_date') and hasattr(instance.next_appointment_date, 'date'):
            instance.next_appointment_date = instance.next_appointment_date.date()
        return super().to_representation(instance)

    def validate(self, data):
        patient = data.get('patient')
        session_no = data.get('session_no')
        
        # Check if same session already exists for this patient
        instance = self.instance
        if patient and session_no:
            queryset = Visit.objects.filter(patient=patient, session_no=session_no)
            if instance:
                queryset = queryset.exclude(pk=instance.pk)
                
            if queryset.exists():
                raise serializers.ValidationError(
                    {"session_no": f"Session {session_no} is already logged for this patient."}
                )
        return data


class PatientSerializer(serializers.ModelSerializer):
    visits = VisitSerializer(many=True, read_only=True)
    total_paid = serializers.SerializerMethodField()
    balance_due = serializers.SerializerMethodField()

    class Meta:
        model = Patient
        fields = '__all__'

    def to_representation(self, instance):
        if hasattr(instance, 'registration_date') and hasattr(instance.registration_date, 'date'):
            instance.registration_date = instance.registration_date.date()
        return super().to_representation(instance)

    def to_internal_value(self, data):
        data = data.copy() if hasattr(data, 'copy') else dict(data)
        # Handle empty string for age
        if data.get('age') == '' or data.get('age') is None:
            data['age'] = 0
        elif isinstance(data.get('age'), str) and data.get('age').isdigit():
            data['age'] = int(data.get('age'))
        
        if not data.get('name'):
            data['name'] = 'Patient Record'
        if not data.get('category'):
            data['category'] = 'Skin & Laser'

        # Remove extra keys that might come from frontend state
        extra_keys = ['amount_charged', 'amount_paid', 'payment_mode', 'next_appointment_date', 'visits', 'total_paid', 'balance_due']
        for k in extra_keys:
            data.pop(k, None)

        return super().to_internal_value(data)

    def get_total_paid(self, obj):
        visit_payments = sum(v.amount_paid for v in obj.visits.all())
        direct_payments = sum(p.amount_paid for p in obj.payments.all() if p.visit is None)
        return float(visit_payments + direct_payments)

    def get_balance_due(self, obj):
        latest_payment = obj.payments.order_by('-id').first()
        if latest_payment:
            total_package = float(latest_payment.total_package_amount)
            total_paid = float(self.get_total_paid(obj))
            total_discount = float(sum(p.discount_given for p in obj.payments.all()))
            return max(0.0, total_package - total_paid - total_discount)
        
        total_charged = sum(v.amount_charged for v in obj.visits.all())
        total_paid = sum(v.amount_paid for v in obj.visits.all())
        return max(0.0, float(total_charged - total_paid))
