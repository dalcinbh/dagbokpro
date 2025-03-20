from django.contrib import admin
from django.urls import path, include

urlpatterns = [
    path('admin/', admin.site.urls),
    path('app2/api/', include('api.urls')),
    path('app2/api-auth/', include('dj_rest_auth.urls')),
]