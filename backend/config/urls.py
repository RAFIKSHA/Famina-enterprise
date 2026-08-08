from django.contrib import admin
from django.urls import path, include
from django.http import JsonResponse
from rest_framework.routers import DefaultRouter
from rest_framework_simplejwt.views import TokenObtainPairView, TokenRefreshView

from accounts.views import UserProfileView
from patients.views import PatientViewSet, VisitViewSet
from payments.views import PaymentViewSet
from appointments.views import AppointmentViewSet
from academy.views import AdmissionViewSet
from salon.views import SalonBookingViewSet
from dashboard.views import MasterDashboardView

def health_check(request):
    return JsonResponse({'status': 'ok', 'message': 'Femina Backend API is healthy and active'})

router = DefaultRouter()
router.register(r'patients', PatientViewSet, basename='patient')
router.register(r'visits', VisitViewSet, basename='visit')
router.register(r'payments', PaymentViewSet, basename='payment')
router.register(r'appointments', AppointmentViewSet, basename='appointment')
router.register(r'academy', AdmissionViewSet, basename='academy')
router.register(r'salon', SalonBookingViewSet, basename='salon')

urlpatterns = [
    path('', health_check, name='root_health'),
    path('health/', health_check, name='health'),
    path('api/health/', health_check, name='api_health'),
    path('admin/', admin.site.urls),
    
    # DRF API Routes
    path('api/', include(router.urls)),
    
    # Authentication Routes
    path('api/auth/token/', TokenObtainPairView.as_view(), name='token_obtain_pair'),
    path('api/auth/token/refresh/', TokenRefreshView.as_view(), name='token_refresh'),
    path('api/auth/profile/', UserProfileView.as_view(), name='user_profile'),
    
    # Custom Analytics Dashboard
    path('api/dashboard/analytics/', MasterDashboardView.as_view(), name='dashboard_analytics'),
]

