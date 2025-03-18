"""
Django settings for the dagbok project.

This module contains the settings for the Django project, including configurations
for installed apps, middleware, authentication, database, internationalization, 
static files, and third-party integrations.

Environment variables are loaded from a .env file using the `python-dotenv` package.

Attributes:
    BASE_DIR (Path): The base directory of the project.
    SECRET_KEY (str): The secret key for the Django project, loaded from environment variables.
    PROFILE_PAGE_URL (str): The URL for the profile page, loaded from environment variables.
    DEBUG (bool): Debug mode flag, loaded from environment variables.
    ALLOWED_HOSTS (list): List of allowed hosts for the Django project.
    INSTALLED_APPS (list): List of installed applications for the Django project.
    MIDDLEWARE (list): List of middleware for the Django project.
    SITE_ID (int): The ID of the Django site.
    AUTHENTICATION_BACKENDS (tuple): Tuple of authentication backends for the Django project.
    ACCOUNT_SIGNUP_FIELDS (dict): Dictionary of required fields for account signup.
    CORS_ALLOWED_ORIGINS (list): List of allowed origins for CORS.
    CSRF_TRUSTED_ORIGINS (list): List of trusted origins for CSRF.
    CORS_ALLOW_CREDENTIALS (bool): Flag to allow credentials for CORS.
    REST_FRAMEWORK (dict): Configuration for Django REST Framework.
    SIMPLE_JWT (dict): Configuration for SimpleJWT.
    ROOT_URLCONF (str): The root URL configuration module.
    ACCOUNT_LOGOUT_ON_GET (bool): Flag to log out on GET request.
    ACCOUNT_EMAIL_VERIFICATION (str): Email verification setting for accounts.
    LOGIN_REDIRECT_URL (str): URL to redirect to after login.
    TEMPLATES (list): List of template configurations.
    WSGI_APPLICATION (str): The WSGI application module.
    DATABASES (dict): Database configurations.
    AUTH_PASSWORD_VALIDATORS (list): List of password validators.
    LANGUAGE_CODE (str): The language code for the project.
    TIME_ZONE (str): The time zone for the project.
    USE_I18N (bool): Flag to enable internationalization.
    USE_TZ (bool): Flag to enable time zone support.
    AWS_ACCESS_KEY_ID (str): AWS access key ID, loaded from environment variables.
    AWS_SECRET_ACCESS_KEY (str): AWS secret access key, loaded from environment variables.
    AWS_STORAGE_BUCKET_NAME (str): AWS S3 storage bucket name, loaded from environment variables.
    AWS_S3_REGION_NAME (str): AWS S3 region name, loaded from environment variables.
    STATICFILES_STORAGE (str): Storage backend for static files.
    STATIC_URL (str): URL for serving static files.
    DEFAULT_AUTO_FIELD (str): Default primary key field type.
"""

from pathlib import Path
from dotenv import load_dotenv
import os
from datetime import timedelta

# Carregue as variáveis de ambiente do arquivo .env
load_dotenv()

# Build paths inside the project like this: BASE_DIR / 'subdir'.
BASE_DIR = Path(__file__).resolve().parent.parent

# Quick-start development settings - unsuitable for production
# See https://docs.djangoproject.com/en/5.1/howto/deployment/checklist/

# SECURITY WARNING: keep the secret key used in production secret!
SECRET_KEY = os.getenv('SECRET_KEY', 'django-insecure-default-key')

# SECURITY WARNING: don't run with debug turned on in production!
DEBUG = os.getenv('DEBUG', 'False') == 'True'  # Converte DEBUG para booleano

ALLOWED_HOSTS = ['auth.dagbok.pro', 'localhost', '127.0.0.1']  # Restringir hosts para segurança

# Application definition
INSTALLED_APPS = [
    'django.contrib.admin',
    'django.contrib.auth',
    'django.contrib.contenttypes',
    'django.contrib.sessions',
    'django.contrib.messages',
    'django.contrib.staticfiles',
    'django.contrib.sites',
    'rest_framework',
    'rest_framework.authtoken',
    'dj_rest_auth',
    'allauth',
    'allauth.account',
    'allauth.socialaccount',
    'allauth.socialaccount.providers.google',
    'allauth.socialaccount.providers.linkedin_oauth2',
    'corsheaders',
    'api',
    'storages',
]

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

# Configurações do django-allauth
SITE_ID = 1
AUTHENTICATION_BACKENDS = (
    'django.contrib.auth.backends.ModelBackend',
    'allauth.account.auth_backends.AuthenticationBackend',
)

# Configurações novas do django-allauth (substitui as depreciadas)
ACCOUNT_SIGNUP_FIELDS = {
    'username': {'required': True},
    'email': {'required': True},
}

# Configurações do django-cors-headers
CORS_ALLOWED_ORIGINS = [
    "https://auth.dagbok.pro",  # Domínio base sem caminhos
]

CSRF_TRUSTED_ORIGINS = [
    "https://auth.dagbok.pro",  # Domínio base sem caminhos
]
CORS_ALLOW_CREDENTIALS = True

# Configurações do REST Framework e dj-rest-auth
REST_FRAMEWORK = {
    'DEFAULT_AUTHENTICATION_CLASSES': (
        'rest_framework_simplejwt.authentication.JWTAuthentication',
        'rest_framework.authentication.SessionAuthentication',
    ),
}

# Configurações do SimpleJWT
SIMPLE_JWT = {
    'ACCESS_TOKEN_LIFETIME': timedelta(minutes=60),
    'REFRESH_TOKEN_LIFETIME': timedelta(days=1),
}

ROOT_URLCONF = 'dagbok.urls'

# URLs de redirecionamento para logins sociais
ACCOUNT_LOGOUT_ON_GET = True
ACCOUNT_EMAIL_VERIFICATION = "none"  # Desativa verificação de e-mail
LOGIN_REDIRECT_URL = os.getenv('PROFILE_PAGE_URL', 'https://auth.dagbok.pro/app1/profile')

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

WSGI_APPLICATION = 'dagbok.wsgi.application'

# Database
DATABASES = {
    'default': {
        'ENGINE': 'django.db.backends.sqlite3',
        'NAME': BASE_DIR / 'db.sqlite3',
    }
}

# Password validation
AUTH_PASSWORD_VALIDATORS = [
    {
        'NAME': 'django.contrib.auth.password_validation.UserAttributeSimilarityValidator',
    },
    {
        'NAME': 'django.contrib.auth.password_validation.MinimumLengthValidator',
    },
    {
        'NAME': 'django.contrib.auth.password_validation.CommonPasswordValidator',
    },
    {
        'NAME': 'django.contrib.auth.password_validation.NumericPasswordValidator',
    },
]

# Internationalization
LANGUAGE_CODE = 'en-us'
TIME_ZONE = 'UTC'
USE_I18N = True
USE_TZ = True

# Configurações do S3 para arquivos estáticos
AWS_ACCESS_KEY_ID = os.getenv('AWS_ACCESS_KEY_ID')
AWS_SECRET_ACCESS_KEY = os.getenv('AWS_SECRET_ACCESS_KEY')
AWS_STORAGE_BUCKET_NAME = os.getenv('AWS_STORAGE_BUCKET_NAME')
AWS_S3_REGION_NAME = os.getenv('AWS_S3_REGION_NAME')

STATICFILES_STORAGE = 'storages.backends.s3boto3.S3Boto3Storage'
STATIC_URL = f'https://{AWS_STORAGE_BUCKET_NAME}.s3.amazonaws.com/static/'

# Default primary key field type
DEFAULT_AUTO_FIELD = 'django.db.models.BigAutoField'