
from pathlib import Path
"""
Django settings for the Dagbok project.

This module contains the settings and configuration for the Django project,
including installed applications, middleware, authentication backends, CORS
settings, REST framework settings, and static file storage configuration.

Environment variables are loaded from a .env file using the `dotenv` package.

Attributes:
    BASE_DIR (Path): The base directory of the project.
    SECRET_KEY (str): The secret key for the Django project, loaded from the environment.
    PROFILE_PAGE_URL (str): The URL for the profile page, loaded from the environment.
    DEBUG (bool): Debug mode flag, loaded from the environment.
    ALLOWED_HOSTS (list): List of allowed hosts for the Django project.
    INSTALLED_APPS (list): List of installed applications for the Django project.
    MIDDLEWARE (list): List of middleware for the Django project.
    SITE_ID (int): The site ID for the django-allauth configuration.
    AUTHENTICATION_BACKENDS (tuple): Tuple of authentication backends for the Django project.
    CORS_ALLOWED_ORIGINS (list): List of allowed origins for CORS.
    CSRF_TRUSTED_ORIGINS (list): List of trusted origins for CSRF.
    CORS_ALLOW_CREDENTIALS (bool): Flag to allow credentials for CORS.
    REST_FRAMEWORK (dict): Configuration for the Django REST framework.
    SIMPLE_JWT (dict): Configuration for the SimpleJWT package.
    ROOT_URLCONF (str): The root URL configuration for the Django project.
    ACCOUNT_LOGOUT_ON_GET (bool): Flag to log out on GET request for django-allauth.
    ACCOUNT_EMAIL_VERIFICATION (str): Email verification setting for django-allauth.
    LOGIN_REDIRECT_URL (str): URL to redirect to after login.
    TEMPLATES (list): List of template configurations for the Django project.
    WSGI_APPLICATION (str): The WSGI application for the Django project.
    DATABASES (dict): Database configuration for the Django project.
    AUTH_PASSWORD_VALIDATORS (list): List of password validators for the Django project.
    LANGUAGE_CODE (str): The language code for the Django project.
    TIME_ZONE (str): The time zone for the Django project.
    USE_I18N (bool): Flag to enable internationalization.
    USE_TZ (bool): Flag to enable time zone support.
    AWS_ACCESS_KEY_ID (str): AWS access key ID for S3 storage, loaded from the environment.
    AWS_SECRET_ACCESS_KEY (str): AWS secret access key for S3 storage, loaded from the environment.
    AWS_STORAGE_BUCKET_NAME (str): AWS storage bucket name for S3 storage, loaded from the environment.
    AWS_S3_REGION_NAME (str): AWS S3 region name for S3 storage, loaded from the environment.
    STATICFILES_STORAGE (str): Storage backend for static files.
    STATIC_URL (str): URL for serving static files.
    DEFAULT_AUTO_FIELD (str): Default primary key field type.
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
PROFILE_PAGE_URL = os.getenv('PROFILE_PAGE_URL', 'http://dagbok:3000')

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
    'django.contrib.sites',
    'rest_framework',
    'rest_framework.authtoken',
    'dj_rest_auth',
    'allauth',
    'allauth.account',
    'allauth.socialaccount',
    'allauth.socialaccount.providers.google',  # Provedor Google
    'allauth.socialaccount.providers.linkedin_oauth2',  # Provedor LinkedIn
    'corsheaders',  # Para CORS
    'api',
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
    'allauth.account.middleware.AccountMiddleware',
]

# Configurações do django-allauth
SITE_ID = 1
AUTHENTICATION_BACKENDS = (
    'django.contrib.auth.backends.ModelBackend',
    'allauth.account.auth_backends.AuthenticationBackend',
)

CORS_ALLOWED_ORIGINS = [
    "http://dagbok:3000",
    "http://192.168.1.160:8000",
    "https://api.dagbok.pro",
]

CSRF_TRUSTED_ORIGINS = [
    "https://api.dagbok.pro",
]

CORS_ALLOW_CREDENTIALS = True

# Configurações do REST Framework e dj-rest-auth
REST_FRAMEWORK = {
    'DEFAULT_AUTHENTICATION_CLASSES': (
        'rest_framework_simplejwt.authentication.JWTAuthentication',
        'rest_framework.authentication.SessionAuthentication',
    ),
}

# Configurações do SimpleJWT (opcional, para tokens JWT)
from datetime import timedelta
SIMPLE_JWT = {
    'ACCESS_TOKEN_LIFETIME': timedelta(minutes=60),
    'REFRESH_TOKEN_LIFETIME': timedelta(days=1),
}

ROOT_URLCONF = 'dagbok.urls'


# URLs de redirecionamento para logins sociais
ACCOUNT_LOGOUT_ON_GET = True
ACCOUNT_EMAIL_VERIFICATION = "none"  # Desativa verificação de e-mail para simplificar
LOGIN_REDIRECT_URL = PROFILE_PAGE_URL  # Redireciona após login

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