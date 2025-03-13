from django.urls import path
from api.views import ResumeAPIView

urlpatterns = [
    path('api/resume/', ResumeAPIView.as_view(), name='resume'),
]
