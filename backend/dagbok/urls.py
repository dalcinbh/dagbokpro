from django.urls import path, include
from django.contrib import admin
from api.views import ResumeAPIView, google_login

urlpatterns = [
    path('resume/', ResumeAPIView.as_view(), name='resume'),
    path('admin/', admin.site.urls),
    path('api-auth/', include('dj_rest_auth.urls')),
    path('api-auth/registration/', include('dj_rest_auth.registration.urls')),
    path('accounts/', include('allauth.urls')),
    path('api/auth/google/', google_login, name='google_login'),  # Novo endpoint
]