

from django.urls import path
"""
This module defines the URL patterns for the dagbok application.

It includes the following URL patterns:
- 'resume/': Maps to the ResumeAPIView for handling resume-related requests.
- 'admin/': Maps to the Django admin interface.
- 'api-auth/': Includes the authentication endpoints provided by dj_rest_auth.
- 'api-auth/registration/': Includes the registration endpoints provided by dj_rest_auth.
- 'accounts/': Includes the URLs provided by django-allauth for account management.

Imports:
- path: Function to define URL patterns.
- ResumeAPIView: View for handling resume-related requests.
- admin: Django admin site.
- include: Function to include other URL configurations.
"""



from api.views import ResumeAPIView
from django.contrib import admin
from django.urls import path, include

# Define the URL patterns for the dagbok application.
urlpatterns = [
    path('resume/', ResumeAPIView.as_view(), name='resume'),
    path('admin/', admin.site.urls),
    path('api-auth/', include('dj_rest_auth.urls')),  # Endpoints de autenticação
    path('api-auth/registration/', include('dj_rest_auth.registration.urls')),  # Registro
    path('accounts/', include('allauth.urls')),  # URLs do django-allauth
]
