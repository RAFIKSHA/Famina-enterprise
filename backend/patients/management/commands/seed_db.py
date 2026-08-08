from django.core.management.base import BaseCommand
from django.contrib.auth import get_user_model
from django.utils import timezone
from patients.models import Patient, Visit
from payments.models import Payment
from appointments.models import Appointment
from academy.models import Admission
from salon.models import SalonBooking
import datetime

User = get_user_model()

class Command(BaseCommand):
    help = 'Seed database with realistic mock data for Femina Skin Clinic'

    def handle(self, *args, **options):
        self.stdout.write('Clearing existing database records...')
        User.objects.filter(is_superuser=False).delete()
        Patient.objects.all().delete()
        Visit.objects.all().delete()
        Payment.objects.all().delete()
        Appointment.objects.all().delete()
        Admission.objects.all().delete()
        SalonBooking.objects.all().delete()

        # ----------------------------------------------------
        # 1. Create Staff Users
        # ----------------------------------------------------
        self.stdout.write('Creating staff users...')
        admin_user = User.objects.create_user(
            username='admin',
            email='admin@feminaclinic.com',
            password='adminpassword123',
            role='admin',
            first_name='Femina',
            last_name='Admin'
        )
        
        doctor_user = User.objects.create_user(
            username='doctor',
            email='doctor@feminaclinic.com',
            password='doctorpassword123',
            role='doctor',
            first_name='Dr. Anjali',
            last_name='Deshmukh'
        )
        
        recep_user = User.objects.create_user(
            username='receptionist',
            email='receptionist@feminaclinic.com',
            password='receppassword123',
            role='receptionist',
            first_name='Kiran',
            last_name='Joshi'
        )

        today = timezone.localtime().date()
        yesterday = today - datetime.timedelta(days=1)
        tomorrow = today + datetime.timedelta(days=1)
        three_days_ago = today - datetime.timedelta(days=3)

        # ----------------------------------------------------
        # 2. Create Patients & Visit History
        # ----------------------------------------------------
        self.stdout.write('Creating patients and visit logs...')
        
        # Patient 1: Pooja Sharma (Laser Hair Reduction)
        p1 = Patient.objects.create(
            name='Pooja Sharma',
            age=28,
            gender='Female',
            mobile_no='9876543210',
            address='Sahara City, Sillod',
            occupation='IT Consultant',
            category='Skin & Laser',
            subcategory='Laser Hair Reduction',
            has_pcod_pcos=True,
            treatment_area='Full Face & Arms',
            hair_type='Coarse',
            diagnosis='Hirsutism due to PCOD. Scheduled for 6 sessions of Diode Laser.',
            photographs_taken=True,
            inst_spf_sunscreen=True,
            inst_no_waxing_threading=True,
            inst_avoid_hot_water_steam=True,
            inst_use_moisturizer=True,
            inst_attend_next_session=True,
            custom_post_instructions='Apply soothing gel if skin gets red.',
            registration_date=three_days_ago
        )
        
        # Sessions for Patient 1
        v1_p1 = Visit.objects.create(
            patient=p1,
            visit_date=three_days_ago,
            session_no=1,
            total_sessions_in_package=6,
            treatment_given='Diode Laser Hair Reduction - Session 1',
            notes='Tolerated well. Mild erythema post-laser, soothing gel applied.',
            amount_charged=18000.00, # Full package cost
            amount_paid=6000.00,
            payment_mode='UPI',
            next_appointment_date=today,
            staff_attended=doctor_user
        )
        
        # Payment record matching v1
        Payment.objects.create(
            patient=p1,
            visit=v1_p1,
            payment_date=three_days_ago,
            total_package_amount=18000.00,
            amount_paid=6000.00,
            payment_mode='UPI',
            collected_by=recep_user
        )

        # Patient 2: Anita Desai (Chemical Peeling)
        p2 = Patient.objects.create(
            name='Anita Desai',
            age=34,
            gender='Female',
            mobile_no='9922114455',
            address='Aurangabad Road, Sillod',
            occupation='Teacher',
            category='Skin & Laser',
            subcategory='Chemical Peeling',
            has_skin_allergy=True,
            other_medical_history='Mild sensitive skin history.',
            treatment_area='Face',
            diagnosis='Epidermal Pigmentation / Melasma. Scheduled for 3 Glycolic peel sessions.',
            photographs_taken=True,
            inst_spf_sunscreen=True,
            inst_use_moisturizer=True,
            inst_attend_next_session=True,
            registration_date=yesterday
        )
        
        v1_p2 = Visit.objects.create(
            patient=p2,
            visit_date=yesterday,
            session_no=1,
            total_sessions_in_package=3,
            treatment_given='35% Glycolic Acid Peel - Session 1',
            notes='Neutralized after 2 mins. No frosting. Instructed on strict SPF application.',
            amount_charged=4500.00,
            amount_paid=4500.00,
            payment_mode='Cash',
            next_appointment_date=tomorrow,
            staff_attended=doctor_user
        )
        
        Payment.objects.create(
            patient=p2,
            visit=v1_p2,
            payment_date=yesterday,
            total_package_amount=4500.00,
            amount_paid=4500.00,
            payment_mode='Cash',
            collected_by=recep_user
        )

        # Patient 3: Rahul Verma (Hair PRP)
        p3 = Patient.objects.create(
            name='Rahul Verma',
            age=31,
            gender='Male',
            mobile_no='9890123456',
            address='Sillod City',
            occupation='Bank Manager',
            category='Hair Treatment',
            subcategory='Hair PRP',
            treatment_area='Scalp (Vertex & Frontal)',
            diagnosis='Male Pattern Baldness (Grade III). Scheduled for 4 PRP sessions.',
            photographs_taken=True,
            inst_spf_sunscreen=False,
            inst_use_moisturizer=False,
            inst_attend_next_session=True,
            custom_post_instructions='Do not wash hair for 24 hours. Avoid heavy exercise today.',
            registration_date=yesterday
        )

        v1_p3 = Visit.objects.create(
            patient=p3,
            visit_date=yesterday,
            session_no=1,
            total_sessions_in_package=4,
            treatment_given='Autologous PRP Injection with Dermaroller',
            notes='Activated PRP injected. Minimal pain, scalp wash done.',
            amount_charged=16000.00,
            amount_paid=8000.00,
            payment_mode='Card',
            next_appointment_date=today,
            staff_attended=doctor_user
        )
        
        Payment.objects.create(
            patient=p3,
            visit=v1_p3,
            payment_date=yesterday,
            total_package_amount=16000.00,
            amount_paid=8000.00,
            payment_mode='Card',
            collected_by=recep_user
        )

        # Patient 4: Kabir Malhotra (Dandruff Treatment - Gents)
        p4 = Patient.objects.create(
            name='Kabir Malhotra',
            age=29,
            gender='Male',
            mobile_no='9900887766',
            address='Sahara City, Sillod',
            occupation='Shop Owner',
            category='Gents Skin & Hair Treatment',
            subcategory='Dandruff Treatment',
            diagnosis='Severe Seborrheic Dermatitis. Recommended anti-dandruff scalp peeling treatment.',
            registration_date=yesterday
        )

        v1_p4 = Visit.objects.create(
            patient=p4,
            visit_date=yesterday,
            session_no=1,
            total_sessions_in_package=3,
            treatment_given='Anti-dandruff clarifying scalp peel + steam therapy',
            notes='Scalp scaling cleared by 60%. Advised ketoconazole shampoo.',
            amount_charged=3500.00,
            amount_paid=1500.00,
            payment_mode='UPI',
            next_appointment_date=today,
            staff_attended=doctor_user
        )
        
        Payment.objects.create(
            patient=p4,
            visit=v1_p4,
            payment_date=yesterday,
            total_package_amount=3500.00,
            amount_paid=1500.00,
            payment_mode='UPI',
            collected_by=recep_user
        )

        # ----------------------------------------------------
        # 3. Create Appointments
        # ----------------------------------------------------
        self.stdout.write('Creating appointments...')
        # Today's appointments
        Appointment.objects.create(
            patient=p1,
            appointment_date=today,
            appointment_time="11:30:00",
            department="Skin & Laser",
            subcategory="Laser Hair Reduction",
            notes="Session 2 follow-up.",
            status="Scheduled",
            whatsapp_reminder_sent=True,
            sms_reminder_sent=True
        )
        
        Appointment.objects.create(
            patient=p3,
            appointment_date=today,
            appointment_time="14:30:00",
            department="Hair Treatment",
            subcategory="Hair PRP",
            notes="Verify scalp healing.",
            status="Scheduled",
            whatsapp_reminder_sent=True,
            call_reminder_done=True
        )

        # Yesterday's Missed Appointment
        Appointment.objects.create(
            patient=p4,
            appointment_date=yesterday,
            appointment_time="10:00:00",
            department="Gents Skin & Hair Treatment",
            subcategory="Dandruff Treatment",
            notes="Scheduled checkup.",
            status="Missed"
        )

        # Tomorrow's Scheduled Appointment
        Appointment.objects.create(
            patient=p2,
            appointment_date=tomorrow,
            appointment_time="16:00:00",
            department="Skin & Laser",
            subcategory="Chemical Peeling",
            notes="Session 2 peel.",
            status="Scheduled"
        )

        # ----------------------------------------------------
        # 4. Create Academy Admissions
        # ----------------------------------------------------
        self.stdout.write('Creating academy admissions...')
        Admission.objects.create(
            student_name='Priyanka Patil',
            course='Professional Makeup & Styling Course',
            admission_date=three_days_ago,
            total_fees=45000.00,
            amount_paid=15000.00,
            contact='9822334455',
            batch='Morning Batch (09:00 - 12:00)',
            notes='Rs. 30000 due by 15th Aug.'
        )
        
        Admission.objects.create(
            student_name='Ritu Kale',
            course='Clinical Aesthetician & Laser Diploma',
            admission_date=yesterday,
            total_fees=75000.00,
            amount_paid=75000.00,
            contact='9955772211',
            batch='Afternoon Batch (13:00 - 16:00)',
            notes='Paid full fees with 5% early bird discount.'
        )

        # ----------------------------------------------------
        # 5. Create Salon & Makeup Bookings
        # ----------------------------------------------------
        self.stdout.write('Creating salon/makeup bookings...')
        SalonBooking.objects.create(
            customer_name='Snehal Gade',
            service_type='Makeup',
            service_name='Bridal HD Makeup Package',
            booking_date=today,
            amount_charged=15000.00,
            amount_paid=5000.00,
            payment_mode='UPI',
            staff_assigned='Shreya (Senior Artist)',
            status='Scheduled'
        )

        SalonBooking.objects.create(
            customer_name='Megha Shah',
            service_type='Salon',
            service_name='Keratin Hair Treatment + HydraFacial',
            booking_date=yesterday,
            amount_charged=7500.00,
            amount_paid=7500.00,
            payment_mode='Card',
            staff_assigned='Nilima',
            status='Completed'
        )

        self.stdout.write(self.style.SUCCESS('Successfully seeded database with realistic records!'))
