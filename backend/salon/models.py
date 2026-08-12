from django.db import models
from django.utils import timezone

class SalonBooking(models.Model):
    SERVICE_TYPE_CHOICES = (
        ('Salon', 'Salon Services'),
        ('Makeup', 'Makeup Services'),
    )

    STATUS_CHOICES = (
        ('Scheduled', 'Scheduled'),
        ('Completed', 'Completed'),
        ('Cancelled', 'Cancelled'),
    )

    customer_name = models.CharField(max_length=255, blank=True, default='')
    service_type = models.CharField(max_length=20, choices=SERVICE_TYPE_CHOICES, default='Salon', blank=True)
    service_name = models.CharField(max_length=255, blank=True, default='')
    booking_date = models.DateField(default=timezone.now)
    
    amount_charged = models.DecimalField(max_digits=10, decimal_places=2, default=0.00)
    amount_paid = models.DecimalField(max_digits=10, decimal_places=2, default=0.00)
    payment_mode = models.CharField(max_length=50, default='Cash')
    
    staff_assigned = models.CharField(max_length=100, blank=True, null=True)
    status = models.CharField(max_length=20, choices=STATUS_CHOICES, default='Scheduled')

    def __str__(self):
        return f"{self.customer_name} - {self.service_name} ({self.get_service_type_display()})"
