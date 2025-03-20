from django.contrib import admin
from django.urls import path, include

urlpatterns = [
    path('admin/', admin.site.urls),
    path('app2/api/', include('api.urls')),
    path('auth/', include('social_django.urls', namespace='social')),  # URLs para autenticação social
]