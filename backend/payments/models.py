from django.db import models
from django.utils import timezone
from django.conf import settings
from patients.models import Patient, Visit

class Payment(models.Model):
    PAYMENT_MODE_CHOICES = (
        ('Cash', 'Cash'),
        ('UPI', 'UPI'),
        ('Card', 'Card'),
        ('Online', 'Online'),
    )

    patient = models.ForeignKey(Patient, on_delete=models.CASCADE, related_name='payments')
    visit = models.ForeignKey(Visit, on_delete=models.SET_NULL, null=True, blank=True, related_name='payments')
    payment_date = models.DateField(default=timezone.localdate)
    receipt_no = models.CharField(max_length=50, unique=True, blank=True)

    total_package_amount = models.DecimalField(max_digits=10, decimal_places=2, default=0.00)
    amount_paid = models.DecimalField(max_digits=10, decimal_places=2, default=0.00)
    payment_mode = models.CharField(max_length=20, choices=PAYMENT_MODE_CHOICES, default='Cash')
    
    discount_given = models.DecimalField(max_digits=10, decimal_places=2, default=0.00)
    discount_reason = models.CharField(max_length=255, blank=True, null=True)
    
    collected_by = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.SET_NULL, null=True, related_name='payments_collected')

    def save(self, *args, **kwargs):
        if not self.receipt_no:
            year = timezone.now().year
            prefix = f"REC-{year}-"
            existing_recs = Payment.objects.filter(receipt_no__startswith=prefix).values_list('receipt_no', flat=True)
            max_num = 0
            for r in existing_recs:
                try:
                    parts = r.split('-')
                    if len(parts) >= 3 and parts[-1].isdigit():
                        num = int(parts[-1])
                        if num > max_num:
                            max_num = num
                except (ValueError, IndexError):
                    pass
            next_num = max_num + 1
            candidate_rec = f"{prefix}{next_num:05d}"
            while Payment.objects.filter(receipt_no=candidate_rec).exists():
                next_num += 1
                candidate_rec = f"{prefix}{next_num:05d}"
            self.receipt_no = candidate_rec
        super().save(*args, **kwargs)

    @property
    def balance_due(self):
        # The prompt says: "Balance Due (auto-calculated: Total - Paid till date)"
        # Let's calculate total paid till date for this patient's package
        # In a real app, patients can have multiple packages, but here we can calculate:
        # Total Package - Sum of amount_paid and sum of discounts for this patient.
        # Or simply Total Package Amount - (Sum of paid till date). Let's implement this logic.
        all_payments = Payment.objects.filter(patient=self.patient, total_package_amount=self.total_package_amount)
        total_paid = sum(p.amount_paid for p in all_payments) + sum(p.discount_given for p in all_payments)
        return max(0.0, float(self.total_package_amount) - float(total_paid))

    def __str__(self):
        return f"Receipt {self.receipt_no} for {self.patient.name} - ₹{self.amount_paid}"
