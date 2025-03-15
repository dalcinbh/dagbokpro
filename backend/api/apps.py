
from django.apps import AppConfig
"""
This module defines the configuration for the 'api' application.

Classes:
    ApiConfig: Configures the 'api' application with default settings.
"""


class ApiConfig(AppConfig):
    default_auto_field = 'django.db.models.BigAutoField'
    name = 'api'
