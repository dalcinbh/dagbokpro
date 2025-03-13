from django.urls import path
from api.views import ResumeAPIView

urlpatterns = [
    path('resume/', ResumeAPIView.as_view(), name='resume'),
]
