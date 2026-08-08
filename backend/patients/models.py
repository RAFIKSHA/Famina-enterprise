from django.db import models
from django.utils import timezone
from django.conf import settings

class Patient(models.Model):
    GENDER_CHOICES = (
        ('Female', 'Female'),
        ('Male', 'Male'),
        ('Other', 'Other'),
    )
    
    STATUS_CHOICES = (
        ('Active', 'Active'),
        ('Completed', 'Completed'),
    )

    # Patient Information
    patient_id = models.CharField(max_length=50, unique=True, blank=True)
    registration_date = models.DateField(default=timezone.now)
    name = models.CharField(max_length=255)
    age = models.IntegerField()
    gender = models.CharField(max_length=10, choices=GENDER_CHOICES)
    mobile_no = models.CharField(max_length=15)
    address = models.TextField(blank=True, null=True)
    occupation = models.CharField(max_length=100, blank=True, null=True)

    # Department structure placement
    category = models.CharField(max_length=100) # e.g. Skin & Laser, Hair Treatment, Gents
    subcategory = models.CharField(max_length=100, blank=True, null=True) # e.g. Laser Hair Reduction

    # Medical History (Checkboxes)
    has_diabetes = models.BooleanField(default=False)
    has_high_bp = models.BooleanField(default=False)
    has_pcod_pcos = models.BooleanField(default=False)
    has_skin_allergy = models.BooleanField(default=False)
    has_keloid_history = models.BooleanField(default=False)
    other_medical_history = models.TextField(blank=True, null=True)

    # Clinical Assessment
    treatment_area = models.CharField(max_length=255, blank=True, null=True)
    hair_type = models.CharField(max_length=50, blank=True, null=True) # Fine / Medium / Coarse
    diagnosis = models.TextField(blank=True, null=True)
    photographs_taken = models.BooleanField(default=False)

    # Custom Department-specific fields (e.g. HIFU notes, Scar types etc.)
    custom_clinical_fields = models.JSONField(default=dict, blank=True)

    # Post Treatment Instructions (Checklist)
    inst_spf_sunscreen = models.BooleanField(default=False)
    inst_no_waxing_threading = models.BooleanField(default=False)
    inst_avoid_hot_water_steam = models.BooleanField(default=False)
    inst_use_moisturizer = models.BooleanField(default=False)
    inst_attend_next_session = models.BooleanField(default=False)
    custom_post_instructions = models.TextField(blank=True, null=True)

    # Status
    status = models.CharField(max_length=20, choices=STATUS_CHOICES, default='Active')

    def save(self, *args, **kwargs):
        if not self.patient_id:
            # Auto generate unique patient ID: FEM-YYYY-XXXX
            year = timezone.now().year
            count = Patient.objects.filter(registration_date__year=year).count() + 1
            self.patient_id = f"FEM-{year}-{count:04d}"
        super().save(*args, **kwargs)

    def __str__(self):
        return f"{self.name} ({self.patient_id})"


class Visit(models.Model):
    PAYMENT_MODE_CHOICES = (
        ('Cash', 'Cash'),
        ('UPI', 'UPI'),
        ('Card', 'Card'),
        ('Online', 'Online'),
    )

    patient = models.ForeignKey(Patient, on_delete=models.CASCADE, related_name='visits')
    visit_date = models.DateField(default=timezone.now)
    session_no = models.IntegerField()
    total_sessions_in_package = models.IntegerField(default=1)
    
    treatment_given = models.TextField()
    notes = models.TextField(blank=True, null=True)
    
    # Store images as Base64 text or URL path for flexibility
    before_photo = models.TextField(blank=True, null=True)
    after_photo = models.TextField(blank=True, null=True)

    amount_charged = models.DecimalField(max_digits=10, decimal_places=2, default=0.00)
    amount_paid = models.DecimalField(max_digits=10, decimal_places=2, default=0.00)
    payment_mode = models.CharField(max_length=20, choices=PAYMENT_MODE_CHOICES, default='Cash')
    
    next_appointment_date = models.DateField(blank=True, null=True)
    staff_attended = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.SET_NULL, null=True, related_name='visits_attended')

    class Meta:
        ordering = ['-visit_date', '-id']

    def __str__(self):
        return f"Visit {self.session_no} on {self.visit_date} for {self.patient.name}"
