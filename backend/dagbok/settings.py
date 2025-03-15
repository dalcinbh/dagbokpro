
from pathlib import Path
"""
Django settings for the dagbok project.

This module contains the settings for the Django project, including configurations
for installed applications, middleware, database, static files, and other settings.

Attributes:
    BASE_DIR (Path): The base directory of the project.
    SECRET_KEY (str): The secret key for the Django project, loaded from environment variables.
    DEBUG (bool): Debug mode flag, loaded from environment variables.
    ALLOWED_HOSTS (list): List of allowed hosts for the Django project.
    INSTALLED_APPS (list): List of installed applications for the Django project.
    MIDDLEWARE (list): List of middleware for the Django project.
    CORS_ALLOWED_ORIGINS (list): List of allowed origins for CORS.
    CSRF_TRUSTED_ORIGINS (list): List of trusted origins for CSRF.
    ROOT_URLCONF (str): The root URL configuration module for the Django project.
    TEMPLATES (list): List of template configurations for the Django project.
    WSGI_APPLICATION (str): The WSGI application module for the Django project.
    DATABASES (dict): Database configurations for the Django project.
    AUTH_PASSWORD_VALIDATORS (list): List of password validators for the Django project.
    LANGUAGE_CODE (str): The language code for the Django project.
    TIME_ZONE (str): The time zone for the Django project.
    USE_I18N (bool): Flag to enable internationalization.
    USE_TZ (bool): Flag to enable timezone support.
    AWS_ACCESS_KEY_ID (str): AWS access key ID for S3, loaded from environment variables.
    AWS_SECRET_ACCESS_KEY (str): AWS secret access key for S3, loaded from environment variables.
    AWS_STORAGE_BUCKET_NAME (str): AWS S3 bucket name for static files, loaded from environment variables.
    AWS_S3_REGION_NAME (str): AWS S3 region name for static files, loaded from environment variables.
    STATICFILES_STORAGE (str): Storage backend for static files.
    STATIC_URL (str): URL for serving static files.
    DEFAULT_AUTO_FIELD (str): Default primary key field type for models.
"""
from dotenv import load_dotenv  # Importe load_dotenv
import os

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

ALLOWED_HOSTS = ['*']  # Permita todos os hosts para facilitar o desenvolvimento


# Application definition

INSTALLED_APPS = [
    'django.contrib.admin',
    'django.contrib.auth',
    'django.contrib.contenttypes',
    'django.contrib.sessions',
    'django.contrib.messages',
    'django.contrib.staticfiles',
    'rest_framework',
    'api',
    'corsheaders',
    'storages',  # Adicione 'storages' para usar o S3
]

MIDDLEWARE = [
    'django.middleware.security.SecurityMiddleware',
    'django.contrib.sessions.middleware.SessionMiddleware',
    'django.middleware.common.CommonMiddleware',
    'django.middleware.csrf.CsrfViewMiddleware',
    'django.contrib.auth.middleware.AuthenticationMiddleware',
    'django.contrib.messages.middleware.MessageMiddleware',
    'django.middleware.clickjacking.XFrameOptionsMiddleware',
    'corsheaders.middleware.CorsMiddleware',
    'django.middleware.common.CommonMiddleware',
]

CORS_ALLOWED_ORIGINS = [
    "http://dagbok:3000",
    "http://192.168.1.160:8000",
    "https://api.dagbok.pro",
]

CSRF_TRUSTED_ORIGINS = [
    "https://api.dagbok.pro",
]


ROOT_URLCONF = 'dagbok.urls'

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
        'ENGINE': 'django.db.backends.dummy'
    }
}


# Password validation
# https://docs.djangoproject.com/en/5.1/ref/settings/#auth-password-validators

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
# https://docs.djangoproject.com/en/5.1/topics/i18n/

LANGUAGE_CODE = 'en-us'

TIME_ZONE = 'UTC'

USE_I18N = True

USE_TZ = True


# Static files (CSS, JavaScript, Images)
# https://docs.djangoproject.com/en/5.1/howto/static-files/

# Configurações do S3 para arquivos estáticos
AWS_ACCESS_KEY_ID = os.getenv('AWS_ACCESS_KEY_ID')
AWS_SECRET_ACCESS_KEY = os.getenv('AWS_SECRET_ACCESS_KEY')
AWS_STORAGE_BUCKET_NAME = os.getenv('AWS_STORAGE_BUCKET_NAME')
AWS_S3_REGION_NAME = os.getenv('AWS_S3_REGION_NAME')

STATICFILES_STORAGE = 'storages.backends.s3boto3.S3Boto3Storage'
STATIC_URL = f'https://{AWS_STORAGE_BUCKET_NAME}.s3.amazonaws.com/static/'

# Default primary key field type
# https://docs.djangoproject.com/en/5.1/ref/settings/#default-auto-field

DEFAULT_AUTO_FIELD = 'django.db.models.BigAutoField'