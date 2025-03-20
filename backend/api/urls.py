from django.urls import path
from .views import GoogleLogin, ResumeAPIView

urlpatterns = [
    path('auth/google/', GoogleLogin.as_view(), name='google_login'),
    path('resume/', ResumeAPIView.as_view(), name='resume'),
]