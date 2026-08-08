from django.db.models import Sum, Count
from django.utils import timezone
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated, AllowAny
from patients.models import Patient, Visit
from payments.models import Payment
from appointments.models import Appointment
from academy.models import Admission
from salon.models import SalonBooking
import datetime

class MasterDashboardView(APIView):
    permission_classes = [AllowAny] # Set to IsAuthenticated if you want strict auth. Keeping it AllowAny for demo flexibility.

    def get(self, request):
        today = timezone.localtime().date()
        start_of_week = today - datetime.timedelta(days=today.weekday())
        start_of_month = today.replace(day=1)

        # Allow filtering by date range for the revenue section
        start_date_str = request.query_params.get('start_date')
        end_date_str = request.query_params.get('end_date')
        
        if start_date_str:
            revenue_start = datetime.datetime.strptime(start_date_str, '%Y-%m-%d').date()
        else:
            revenue_start = start_of_month

        if end_date_str:
            revenue_end = datetime.datetime.strptime(end_date_str, '%Y-%m-%d').date()
        else:
            revenue_end = today

        # ----------------------------------------------------
        # 1. Today's Snapshot
        # ----------------------------------------------------
        # Collections
        today_payments_sum = Payment.objects.filter(payment_date=today).aggregate(Sum('amount_paid'))['amount_paid__sum'] or 0
        today_salon_sum = SalonBooking.objects.filter(booking_date=today).aggregate(Sum('amount_paid'))['amount_paid__sum'] or 0
        today_academy_sum = Admission.objects.filter(admission_date=today).aggregate(Sum('amount_paid'))['amount_paid__sum'] or 0
        today_collection = float(today_payments_sum + today_salon_sum + today_academy_sum)

        # Appointments
        today_appointments = Appointment.objects.filter(appointment_date=today)
        today_appointments_count = today_appointments.count()
        today_appointments_list = [
            {
                "id": appt.id,
                "patient_name": appt.patient.name,
                "patient_mobile": appt.patient.mobile_no,
                "time": appt.appointment_time.strftime('%H:%M'),
                "department": appt.department,
                "subcategory": appt.subcategory,
                "status": appt.status
            } for appt in today_appointments
        ]

        # New Patients Today
        today_new_patients = Patient.objects.filter(registration_date=today).count()

        # Pending Follow-ups (overdue scheduled appointments)
        pending_followups_count = Appointment.objects.filter(appointment_date__lt=today, status='Scheduled').count()

        # ----------------------------------------------------
        # 2. Revenue Section (Date Range Filtered)
        # ----------------------------------------------------
        # Fetch collections in date range
        range_payments = Payment.objects.filter(payment_date__range=[revenue_start, revenue_end])
        range_salon = SalonBooking.objects.filter(booking_date__range=[revenue_start, revenue_end])
        range_academy = Admission.objects.filter(admission_date__range=[revenue_start, revenue_end])

        total_range_revenue = float(
            (range_payments.aggregate(Sum('amount_paid'))['amount_paid__sum'] or 0) +
            (range_salon.aggregate(Sum('amount_paid'))['amount_paid__sum'] or 0) +
            (range_academy.aggregate(Sum('amount_paid'))['amount_paid__sum'] or 0)
        )

        # Revenue by Department
        skin_laser_rev = float(range_payments.filter(patient__category__iexact='Skin & Laser').aggregate(Sum('amount_paid'))['amount_paid__sum'] or 0)
        hair_rev = float(range_payments.filter(patient__category__iexact='Hair Treatment').aggregate(Sum('amount_paid'))['amount_paid__sum'] or 0)
        gents_rev = float(range_payments.filter(patient__category__iexact='Gents Skin & Hair Treatment').aggregate(Sum('amount_paid'))['amount_paid__sum'] or 0)
        
        salon_rev = float(range_salon.filter(service_type='Salon').aggregate(Sum('amount_paid'))['amount_paid__sum'] or 0)
        makeup_rev = float(range_salon.filter(service_type='Makeup').aggregate(Sum('amount_paid'))['amount_paid__sum'] or 0)
        academy_rev = float(range_academy.aggregate(Sum('amount_paid'))['amount_paid__sum'] or 0)

        dept_revenue = [
            {"name": "Skin & Laser", "value": skin_laser_rev},
            {"name": "Hair Treatment", "value": hair_rev},
            {"name": "Salon Services", "value": salon_rev},
            {"name": "Makeup Services", "value": makeup_rev},
            {"name": "Academy", "value": academy_rev},
            {"name": "Gents Services", "value": gents_rev},
        ]

        # Revenue by Treatment Type (Top treatments within Skin, Hair, Gents)
        treatment_rev_dict = {}
        for p in range_payments.select_related('patient'):
            subcat = p.patient.subcategory or "General / Other"
            treatment_rev_dict[subcat] = treatment_rev_dict.get(subcat, 0.0) + float(p.amount_paid)
            
        treatment_revenue = [
            {"name": name, "value": val} for name, val in sorted(treatment_rev_dict.items(), key=lambda x: x[1], reverse=True)[:8]
        ]

        # Total Dues Outstanding
        # 1) Patient dues: sum(total_package_amount) - sum(amount_paid + discount_given) grouped by patient
        patient_dues = 0.0
        for patient in Patient.objects.all():
            latest_payment = patient.payments.order_by('-id').first()
            if latest_payment:
                total_package = float(latest_payment.total_package_amount)
                total_paid = float(sum(p.amount_paid for p in patient.payments.all()))
                total_disc = float(sum(p.discount_given for p in patient.payments.all()))
                patient_dues += max(0.0, total_package - total_paid - total_disc)
            else:
                total_charged = sum(v.amount_charged for v in patient.visits.all())
                total_paid = sum(v.amount_paid for v in patient.visits.all())
                patient_dues += max(0.0, float(total_charged - total_paid))

        # 2) Academy dues
        academy_dues = sum(float(a.total_fees - a.amount_paid) for a in Admission.objects.all())
        # 3) Salon bookings remaining dues
        salon_dues = sum(float(s.amount_charged - s.amount_paid) for s in SalonBooking.objects.all())
        total_outstanding_dues = patient_dues + academy_dues + salon_dues

        # Payment Mode Split (Cash vs UPI vs Card vs Online)
        payment_modes = {}
        for p in range_payments:
            payment_modes[p.payment_mode] = payment_modes.get(p.payment_mode, 0.0) + float(p.amount_paid)
        for s in range_salon:
            payment_modes[s.payment_mode] = payment_modes.get(s.payment_mode, 0.0) + float(s.amount_paid)
            
        payment_mode_split = [
            {"name": mode, "value": amount} for mode, amount in payment_modes.items()
        ]

        # ----------------------------------------------------
        # 3. Patient Analytics
        # ----------------------------------------------------
        total_patients = Patient.objects.count()
        new_patients_this_month = Patient.objects.filter(registration_date__gte=start_of_month).count()

        # Department wise patient count
        dept_patient_counts = Patient.objects.values('category').annotate(count=Count('id'))
        dept_patients = [
            {"name": item['category'], "value": item['count']} for item in dept_patient_counts
        ]

        # Repeat vs One-time patients
        # Repeat means patient has more than 1 visit
        patient_visit_counts = Patient.objects.annotate(visit_count=Count('visits'))
        repeat_patients = patient_visit_counts.filter(visit_count__gt=1).count()
        one_time_patients = patient_visit_counts.filter(visit_count=1).count()
        no_visits = patient_visit_counts.filter(visit_count=0).count()
        
        patient_type_split = [
            {"name": "Repeat Patients", "value": repeat_patients},
            {"name": "One-time Patients", "value": one_time_patients + no_visits}
        ]

        # Patients with sessions remaining
        # Find patients whose last visit session_no is less than total_sessions_in_package
        sessions_remaining_count = 0
        for patient in Patient.objects.all():
            last_visit = patient.visits.order_by('-visit_date', '-id').first()
            if last_visit and last_visit.session_no < last_visit.total_sessions_in_package:
                sessions_remaining_count += 1

        # ----------------------------------------------------
        # Assemble Response
        # ----------------------------------------------------
        data = {
            "today_snapshot": {
                "collection": today_collection,
                "appointments_count": today_appointments_count,
                "appointments": today_appointments_list,
                "new_patients": today_new_patients,
                "pending_followups": pending_followups_count
            },
            "revenue": {
                "total_revenue": total_range_revenue,
                "dept_revenue": dept_revenue,
                "treatment_revenue": treatment_revenue,
                "total_outstanding_dues": total_outstanding_dues,
                "payment_mode_split": payment_mode_split,
            },
            "patients": {
                "total_patients": total_patients,
                "new_patients_this_month": new_patients_this_month,
                "dept_patients": dept_patients,
                "patient_type_split": patient_type_split,
                "sessions_remaining": sessions_remaining_count
            }
        }

        return Response(data)
