from django.urls import path
from .views import GoogleLogin, ResumeAPIView, SocialTokenLoginView
from rest_framework_simplejwt.views import TokenObtainPairView, TokenRefreshView, TokenVerifyView

urlpatterns = [
    path('auth/google/', GoogleLogin.as_view(), name='google_login'),
    path('resume/', ResumeAPIView.as_view(), name='resume'),
    path('auth/token_login/<str:provider>/', SocialTokenLoginView.as_view(), name='social_token_login'),
    
    # JWT Auth
    path('token/', TokenObtainPairView.as_view(), name='token_obtain_pair'),
    path('token/refresh/', TokenRefreshView.as_view(), name='token_refresh'),
    path('token/verify/', TokenVerifyView.as_view(), name='token_verify'),
]
