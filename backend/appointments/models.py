from django.db import models
from django.utils import timezone
from patients.models import Patient

class Appointment(models.Model):
    STATUS_CHOICES = (
        ('Scheduled', 'Scheduled'),
        ('Completed', 'Completed'),
        ('Cancelled', 'Cancelled'),
        ('Missed', 'Missed'),
    )

    patient = models.ForeignKey(Patient, on_delete=models.CASCADE, related_name='appointments')
    appointment_date = models.DateField(default=timezone.localdate)
    appointment_time = models.TimeField(default="10:00")
    
    department = models.CharField(max_length=100, blank=True, default='Skin & Laser') # Skin & Laser, Hair Treatment, etc.
    subcategory = models.CharField(max_length=100, blank=True, null=True) # e.g. Laser Hair Reduction
    
    notes = models.TextField(blank=True, null=True)
    status = models.CharField(max_length=20, choices=STATUS_CHOICES, default='Scheduled')

    # Follow-up Checklist (manual checkboxes)
    patient_data_saved = models.BooleanField(default=False)
    whatsapp_reminder_sent = models.BooleanField(default=False)
    sms_reminder_sent = models.BooleanField(default=False)
    call_reminder_done = models.BooleanField(default=False)

    class Meta:
        ordering = ['appointment_date', 'appointment_time']

    def __str__(self):
        return f"{self.patient.name} - {self.appointment_date} at {self.appointment_time}"
