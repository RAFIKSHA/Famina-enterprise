from rest_framework import viewsets, filters
from .models import Admission
from .serializers import AdmissionSerializer

class AdmissionViewSet(viewsets.ModelViewSet):
    queryset = Admission.objects.all().order_by('-id')
    serializer_class = AdmissionSerializer
    filter_backends = [filters.SearchFilter]
    search_fields = ['student_name', 'course', 'batch', 'contact']
