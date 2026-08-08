from rest_framework import viewsets
from django.utils import timezone
from .models import Appointment
from .serializers import AppointmentSerializer

class AppointmentViewSet(viewsets.ModelViewSet):
    queryset = Appointment.objects.all().order_by('appointment_date', 'appointment_time')
    serializer_class = AppointmentSerializer

    def get_queryset(self):
        queryset = super().get_queryset()
        patient_id = self.request.query_params.get('patient_id')
        date = self.request.query_params.get('date')
        status = self.request.query_params.get('status')
        upcoming = self.request.query_params.get('upcoming')
        missed = self.request.query_params.get('missed')
        today = timezone.localtime().date()

        if patient_id:
            queryset = queryset.filter(patient_id=patient_id)
        if date:
            queryset = queryset.filter(appointment_date=date)
        if status:
            queryset = queryset.filter(status=status)
            
        if upcoming == 'true':
            queryset = queryset.filter(appointment_date__gte=today, status='Scheduled')
        elif missed == 'true':
            queryset = queryset.filter(appointment_date__lt=today, status='Scheduled')
            
        return queryset
