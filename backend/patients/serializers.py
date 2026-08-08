from rest_framework import serializers
from .models import Patient, Visit

class VisitSerializer(serializers.ModelSerializer):
    staff_name = serializers.ReadOnlyField(source='staff_attended.username')

    class Meta:
        model = Visit
        fields = '__all__'
        read_only_fields = ['staff_attended']

    def validate(self, data):
        patient = data.get('patient')
        session_no = data.get('session_no')
        
        # Check if same session already exists for this patient
        instance = self.instance
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

    def get_total_paid(self, obj):
        # Sum of amount_paid from all visits and direct payments
        from payments.models import Payment
        visit_payments = sum(v.amount_paid for v in obj.visits.all())
        direct_payments = sum(p.amount_paid for p in obj.payments.all() if p.visit is None)
        return float(visit_payments + direct_payments)

    def get_balance_due(self, obj):
        # We need the most recent package total or we calculate total package cost - paid till date
        # Let's inspect the latest payment record package cost or sum visit charge - paid.
        # Standard approach for this schema: Total Package Amount - (Total Paid + Total Discounts)
        from payments.models import Payment
        latest_payment = obj.payments.order_by('-id').first()
        if latest_payment:
            total_package = float(latest_payment.total_package_amount)
            total_paid = float(self.get_total_paid(obj))
            total_discount = float(sum(p.discount_given for p in obj.payments.all()))
            return max(0.0, total_package - total_paid - total_discount)
        
        # Fallback: if no package payment has been logged, calculate based on visits
        total_charged = sum(v.amount_charged for v in obj.visits.all())
        total_paid = sum(v.amount_paid for v in obj.visits.all())
        return max(0.0, float(total_charged - total_paid))
