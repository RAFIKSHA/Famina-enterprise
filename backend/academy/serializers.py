from rest_framework import serializers
from .models import Admission

class AdmissionSerializer(serializers.ModelSerializer):
    balance_due = serializers.ReadOnlyField()

    class Meta:
        model = Admission
        fields = '__all__'
