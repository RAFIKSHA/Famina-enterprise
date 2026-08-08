from django.db import models
from django.utils import timezone

class Admission(models.Model):
    student_name = models.CharField(max_length=255)
    course = models.CharField(max_length=255)
    admission_date = models.DateField(default=timezone.now)
    
    total_fees = models.DecimalField(max_digits=10, decimal_places=2, default=0.00)
    amount_paid = models.DecimalField(max_digits=10, decimal_places=2, default=0.00)
    
    contact = models.CharField(max_length=15)
    batch = models.CharField(max_length=100)
    notes = models.TextField(blank=True, null=True)

    @property
    def balance_due(self):
        return max(0.0, float(self.total_fees) - float(self.amount_paid))

    def __str__(self):
        return f"{self.student_name} - {self.course}"
