from django.urls import path
from .views import GoogleLogin, ResumeAPIView, SocialTokenLoginView

urlpatterns = [
    path('auth/google/', GoogleLogin.as_view(), name='google_login'),
    path('resume/', ResumeAPIView.as_view(), name='resume'),
    path('auth/token_login/<str:provider>/', SocialTokenLoginView.as_view(), name='social_token_login'),
]
