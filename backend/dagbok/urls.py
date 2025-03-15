

from django.urls import path
"""
URL configuration for the dagbok application.

This module defines the URL patterns for the dagbok application, mapping the
'resume/' URL to the ResumeAPIView.

Routes:
    - 'resume/': Maps to ResumeAPIView.as_view(), accessible with the name 'resume'.

Imports:
    - path: Function to define URL patterns.
    - ResumeAPIView: View to handle requests to the 'resume/' URL.
"""
from api.views import ResumeAPIView

# Define the URL patterns for the dagbok application.
urlpatterns = [
    path('resume/', ResumeAPIView.as_view(), name='resume'),
]
