"""
Django settings for the dagbok project.

This configuration handles core Django settings, authentication with django-allauth,
REST API setup with JWT authentication, CORS policies, and AWS S3 storage integration.

Environment variables are loaded from a .env file using python-dotenv.

Important notes:
- Updated allauth configuration using modern settings
- Consolidated security-related settings
- Improved documentation for maintainability
"""

from pathlib import Path
from dotenv import load_dotenv
import os
from datetime import timedelta


# Environment Setup =============================================================
load_dotenv()  # Load environment variables from .env file

# Base Directory Configuration ==================================================
BASE_DIR = Path(__file__).resolve().parent.parent
STATIC_ROOT = os.path.join(BASE_DIR, 'staticfiles')  # Diretório para coletar arquivos estáticos em produção
STATICFILES_DIRS = [os.path.join(BASE_DIR, 'files')]  # Diretório onde os arquivos estáticos estão localizados
STATIC_URL = '/static/'

# Security Settings =============================================================
SECRET_KEY = os.getenv('SECRET_KEY', 'django-insecure-default-key')
DEBUG = os.getenv('DEBUG', 'False') == 'True'
ALLOWED_HOSTS = [
    'auth.dagbok.pro', 
    'localhost', 
    '127.0.0.1', 
    'dagbok'
]

# Application Definition ========================================================
INSTALLED_APPS = [
    # Django Core Apps
    'django.contrib.admin',
    'django.contrib.auth',
    'django.contrib.contenttypes',
    'django.contrib.sessions',
    'django.contrib.messages',
    'django.contrib.staticfiles',
    'django.contrib.sites',
    
    # Third-Party Apps
    'rest_framework',
    'rest_framework.authtoken',
    'dj_rest_auth',
    'allauth',
    'allauth.account',
    'allauth.socialaccount',
    'allauth.socialaccount.providers.google',
    'allauth.socialaccount.providers.linkedin_oauth2',
    'corsheaders',
    'storages',
    
    # Local Apps
    'api',
]

# Middleware Configuration ======================================================
MIDDLEWARE = [
    'django.middleware.security.SecurityMiddleware',
    'django.contrib.sessions.middleware.SessionMiddleware',
    'corsheaders.middleware.CorsMiddleware',
    'django.middleware.common.CommonMiddleware',
    'django.middleware.csrf.CsrfViewMiddleware',
    'django.contrib.auth.middleware.AuthenticationMiddleware',
    'django.contrib.messages.middleware.MessageMiddleware',
    'django.middleware.clickjacking.XFrameOptionsMiddleware',
    'allauth.account.middleware.AccountMiddleware',
]

# Authentication Configuration ==================================================
AUTHENTICATION_BACKENDS = (
    'allauth.account.auth_backends.AuthenticationBackend',
)

SITE_ID = 1  # Required for allauth


# allauth Settings (Modern Configuration) =======================================
ACCOUNT_ALLOW_SIGNUPS = False  # Disable manual signups completely
ACCOUNT_LOGIN_METHODS = ['email']  # Required for social auth flow

# Use the new ACCOUNT_SIGNUP_FIELDS setting to define required fields
ACCOUNT_SIGNUP_FIELDS = ['email*', 'password1*', 'password2*']

# Redirect URL after login
LOGIN_REDIRECT_URL = os.getenv('PROFILE_PAGE_URL', 'https://auth.dagbok.pro/app1')

# Social Authentication Providers ===============================================rb
SOCIALACCOUNT_PROVIDERS = {
    'google': {
        'SCOPE': ['profile', 'email'],
        'AUTH_PARAMS': {'access_type': 'online'},
        'APP': {
            'client_id': os.getenv('GOOGLE_CLIENT_ID'),
            'secret': os.getenv('GOOGLE_CLIENT_SECRET'),
            'key': ''
        }
    },
    'linkedin_oauth2': {
        'SCOPE': ['r_liteprofile', 'r_emailaddress'],
        'PROFILE_FIELDS': [
            'id',
            'firstName',
            'lastName',
            'emailAddress',
            'profilePicture(displayImage~:playableStreams)',
        ],
        'APP': {
            'client_id': os.getenv('LINKEDIN_CLIENT_ID'),
            'secret': os.getenv('LINKEDIN_CLIENT_SECRET'),
            'key': ''
        }
    }
}

# CORS & Security Headers ======================================================
CORS_ALLOWED_ORIGINS = [
    'https://auth.dagbok.pro',
]

CSRF_TRUSTED_ORIGINS = [
    "https://auth.dagbok.pro",
    "https://auth.dagbok.pro/app1",
    "https://auth.dagbok.pro/app2"
]

CORS_ALLOW_CREDENTIALS = True

# REST Framework Configuration =================================================
REST_FRAMEWORK = {
    'DEFAULT_AUTHENTICATION_CLASSES': (
        'rest_framework_simplejwt.authentication.JWTAuthentication',
        'rest_framework.authentication.SessionAuthentication',
    ),
}

# JWT Settings =================================================================
SIMPLE_JWT = {
    'ACCESS_TOKEN_LIFETIME': timedelta(minutes=60),
    'REFRESH_TOKEN_LIFETIME': timedelta(days=1),
}

# Database Configuration =======================================================
DATABASES = {
    'default': {
        'ENGINE': 'django.db.backends.sqlite3',
        'NAME': BASE_DIR / 'db.sqlite3',
    }
}

# AWS S3 Storage Configuration =================================================
AWS_ACCESS_KEY_ID = os.getenv('AWS_ACCESS_KEY_ID')
AWS_SECRET_ACCESS_KEY = os.getenv('AWS_SECRET_ACCESS_KEY')
AWS_STORAGE_BUCKET_NAME = os.getenv('AWS_STORAGE_BUCKET_NAME')
AWS_S3_REGION_NAME = os.getenv('AWS_S3_REGION_NAME')

STATICFILES_STORAGE = 'storages.backends.s3boto3.S3Boto3Storage'
STATIC_URL = f'https://{AWS_STORAGE_BUCKET_NAME}.s3.amazonaws.com/static/'

# Template Configuration ========================================================
TEMPLATES = [
    {
        'BACKEND': 'django.template.backends.django.DjangoTemplates',
        'DIRS': [],
        'APP_DIRS': True,
        'OPTIONS': {
            'context_processors': [
                'django.template.context_processors.debug',
                'django.template.context_processors.request',
                'django.contrib.auth.context_processors.auth',
                'django.contrib.messages.context_processors.messages',
            ],
        },
    },
]

# Core Django Settings ==========================================================
ROOT_URLCONF = 'dagbok.urls'
WSGI_APPLICATION = 'dagbok.wsgi.application'
DEFAULT_AUTO_FIELD = 'django.db.models.BigAutoField'

# Password Validation ===========================================================
AUTH_PASSWORD_VALIDATORS = [
    {'NAME': 'django.contrib.auth.password_validation.UserAttributeSimilarityValidator'},
    {'NAME': 'django.contrib.auth.password_validation.MinimumLengthValidator'},
    {'NAME': 'django.contrib.auth.password_validation.CommonPasswordValidator'},
    {'NAME': 'django.contrib.auth.password_validation.NumericPasswordValidator'},
]

# Internationalization ==========================================================
LANGUAGE_CODE = 'en-us'
TIME_ZONE = 'UTC'
USE_I18N = True
USE_TZ = True