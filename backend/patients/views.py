from rest_framework import viewsets, filters
from django_filters.rest_framework import DjangoFilterBackend
from .models import Patient, Visit
from .serializers import PatientSerializer, VisitSerializer

class PatientViewSet(viewsets.ModelViewSet):
    queryset = Patient.objects.all().order_by('-id')
    serializer_class = PatientSerializer
    filter_backends = [filters.SearchFilter, filters.OrderingFilter]
    search_fields = ['patient_id', 'name', 'mobile_no', 'category', 'subcategory']
    ordering_fields = ['id', 'name', 'registration_date', 'status']

    def get_queryset(self):
        queryset = super().get_queryset()
        category = self.request.query_params.get('category')
        subcategory = self.request.query_params.get('subcategory')
        status = self.request.query_params.get('status')

        if category:
            queryset = queryset.filter(category__iexact=category)
        if subcategory:
            queryset = queryset.filter(subcategory__iexact=subcategory)
        if status:
            queryset = queryset.filter(status__iexact=status)
            
        return queryset


class VisitViewSet(viewsets.ModelViewSet):
    queryset = Visit.objects.all().order_by('-visit_date', '-id')
    serializer_class = VisitSerializer

    def get_queryset(self):
        queryset = super().get_queryset()
        patient_id = self.request.query_params.get('patient_id')
        if patient_id:
            queryset = queryset.filter(patient_id=patient_id)
        return queryset

    def perform_create(self, serializer):
        user = self.request.user if self.request.user.is_authenticated else None
        visit = serializer.save(staff_attended=user)
        # Automate: create a payment record corresponding to this visit
        from payments.models import Payment
        
        # If amount_charged or amount_paid is > 0, log it in payments
        if visit.amount_charged > 0 or visit.amount_paid > 0:
            # Check if patient already has a package payment
            # Fetch latest payment or create new one
            latest_payment = Payment.objects.filter(patient=visit.patient).order_by('-id').first()
            package_amount = latest_payment.total_package_amount if latest_payment else visit.amount_charged
            
            Payment.objects.create(
                patient=visit.patient,
                visit=visit,
                payment_date=visit.visit_date,
                total_package_amount=package_amount,
                amount_paid=visit.amount_paid,
                payment_mode=visit.payment_mode,
                collected_by=visit.staff_attended
            )

    def perform_update(self, serializer):
        visit = serializer.save()
        # Sync the corresponding Payment
        from payments.models import Payment
        
        payment = Payment.objects.filter(visit=visit).first()
        if payment:
            if visit.amount_charged == 0 and visit.amount_paid == 0:
                payment.delete()
            else:
                payment.payment_date = visit.visit_date
                payment.amount_paid = visit.amount_paid
                payment.payment_mode = visit.payment_mode
                payment.save()
        else:
            if visit.amount_charged > 0 or visit.amount_paid > 0:
                latest_payment = Payment.objects.filter(patient=visit.patient).order_by('-id').first()
                package_amount = latest_payment.total_package_amount if latest_payment else visit.amount_charged
                
                Payment.objects.create(
                    patient=visit.patient,
                    visit=visit,
                    payment_date=visit.visit_date,
                    total_package_amount=package_amount,
                    amount_paid=visit.amount_paid,
                    payment_mode=visit.payment_mode,
                    collected_by=visit.staff_attended
                )

