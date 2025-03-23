from rest_framework import serializers
from django.contrib.auth.models import User
from .models import UserProfile, Resume

class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ('id', 'username', 'email', 'first_name', 'last_name')

class UserProfileSerializer(serializers.ModelSerializer):
    user = UserSerializer(read_only=True)

    class Meta:
        model = UserProfile
        fields = ('user', 'avatar', 'bio')

class ResumeSerializer(serializers.ModelSerializer):
    class Meta:
        model = Resume
        fields = (
            'id',
            'title',
            'summary',
            'education',
            'experience',
            'skills',
            'additional_information',
            'created_at',
            'updated_at'
        )
        read_only_fields = ('created_at', 'updated_at') 