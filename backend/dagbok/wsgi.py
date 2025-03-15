
import os
"""
WSGI config for the dagbok project.

This module contains the WSGI application used by Django's development server
and any production WSGI deployments. It exposes a module-level variable named
`application` which is a WSGI callable.

Django's `get_wsgi_application` function is used to initialize the WSGI application
with the settings specified in the 'dagbok.settings' module.

For more information on this file, see:
https://docs.djangoproject.com/en/4.0/howto/deployment/wsgi/
"""

# Set the DJANGO_SETTINGS_MODULE environment variable to 'dagbok.settings'.
from django.core.wsgi import get_wsgi_application

# Set the DJANGO_SETTINGS_MODULE environment variable to 'dagbok.settings'.
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'dagbok.settings')

# Initialize the WSGI application with the Django settings.
application = get_wsgi_application()
