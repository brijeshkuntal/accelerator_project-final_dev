"""
Django settings for accelerator_project project.

Generated by 'django-admin startproject' using Django 4.0.2.

For more information on this file, see
https://docs.djangoproject.com/en/4.0/topics/settings/

For the full list of settings and their values, see
https://docs.djangoproject.com/en/4.0/ref/settings/
"""

import os
# from app_layer.features.grapheneData.identiity_controller import JWT_CONFIGURATION

# Build paths inside the project like this: os.path.join(BASE_DIR, ...)
BASE_DIR = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))

# Quick-start development settings - unsuitable for production
# See https://docs.djangoproject.com/en/4.0/howto/deployment/checklist/

# SECURITY WARNING: keep the secret key used in production secret!
SECRET_KEY = 'django-insecure-o&h42fzsfp$sag_aplpl$f@f60$dk9x1@f1l0f7mi2b#^d&3!1'

# SECURITY WARNING: don't run with debug turned on in production!
DEBUG = False

ALLOWED_HOSTS = ['*']

# Application definition
SHARED_APPS = [
    "django_tenants",
    "multitenant_app",
    "django.contrib.contenttypes",
    'django.contrib.admin',
    "django.contrib.auth",
    "django.contrib.sessions",
    "django.contrib.messages",
    "django.contrib.staticfiles",
    "app_layer",
]
TENANT_APPS = [
    "app_layer",
    "django.contrib.contenttypes",
    'django.contrib.admin',
    "django.contrib.auth",
]

INSTALLED_APPS = [
    "django_tenants",
    "multitenant_app",
    'corsheaders',
    'django.contrib.admin',
    'django.contrib.auth',
    'django.contrib.contenttypes',
    'django.contrib.sessions',
    'django.contrib.messages',
    'django.contrib.staticfiles',
    'app_layer',
    'django_filters',
]

TENANT_MODEL = "multitenant_app.Client"

TENANT_DOMAIN_MODEL = "multitenant_app.Domain"

MIDDLEWARE = [
    # 'multitenant_app.middleware.verify_host_middleware.VerifyHostMiddleware',
    'django_tenants.middleware.main.TenantMainMiddleware',
    'django.middleware.security.SecurityMiddleware',
    'django.contrib.sessions.middleware.SessionMiddleware',
    "corsheaders.middleware.CorsMiddleware",
    'django.middleware.common.CommonMiddleware',
    'django.middleware.csrf.CsrfViewMiddleware',
    'django.contrib.auth.middleware.AuthenticationMiddleware',
    'django.contrib.messages.middleware.MessageMiddleware',
    'django.middleware.clickjacking.XFrameOptionsMiddleware',
]


# ROOT_URLCONF = "tenant_tutorial.urls_tenants"
# PUBLIC_SCHEMA_URLCONF = "tenant_tutorial.urls_public"

ROOT_URLCONF = 'accelerator_project.urls'

PUBLIC_SCHEMA_URLCONF = 'accelerator_project.urls_public'

DEFAULT_FILE_STORAGE = "tenant_schemas.storage.TenantFileSystemStorage"

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

# TEMPLATE_CONTEXT_PROCESSORS = ("django.core.context_processors.request", )

WSGI_APPLICATION = 'accelerator_project.wsgi.application'

# Database
# https://docs.djangoproject.com/en/4.0/ref/settings/#databases

# DATABASES = {
#     'default': {
#         'ENGINE': 'django.db.backends.sqlite3',
#         'NAME': os.path.join(BASE_DIR, 'db.sqlite3'),
#     }
# }

DATABASES = {
    "default": {
        "ENGINE": "django_tenants.postgresql_backend",  # Add 'postgresql_psycopg2', 'mysql', 'sqlite3' or 'oracle'.
        "NAME": "tenant_tutorial",  # Or path to database file if using sqlite3.
        "USER": "postgres",
        "PASSWORD": "passw0rd",
        "HOST": "localhost",  # Empty for localhost through domain sockets or '127.0.0.1' for localhost through TCP.
        "PORT": "",  # Set to empty string for default.
    }
}

DATABASE_ROUTERS = (
    'django_tenants.routers.TenantSyncRouter',
)

# Password validation
# https://docs.djangoproject.com/en/4.0/ref/settings/#auth-password-validators

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
# https://docs.djangoproject.com/en/4.0/topics/i18n/

LANGUAGE_CODE = 'en-us'

TIME_ZONE = 'UTC'

USE_I18N = True

USE_L10N = True

USE_TZ = True

# Static files (CSS, JavaScript, Images)
# https://docs.djangoproject.com/en/4.0/howto/static-files/

STATIC_URL = '/static/'

# Default primary key field type
# https://docs.djangoproject.com/en/4.0/ref/settings/#default-auto-field

DEFAULT_AUTO_FIELD = 'django.db.models.BigAutoField'
# GRAPHQL_AUTH = {
#     "UPDATE_MUTATION_FIELDS": {"display_name": "String"}
# }
AUTHENTICATION_BACKENDS = [
#     "graphql_jwt.backends.JSONWebTokenBackend",
#     "graphql_auth.backends.GraphQLAuthBackend",
    "django.contrib.auth.backends.ModelBackend",
]

# Auth User Model
AUTH_USER_MODEL = 'app_layer.CustomUser'

# GRAPHENE = {
#     "SCHEMA": "authentication.schema.schema",
#     'MIDDLEWARE': [
#         'graphql_jwt.middleware.JSONWebTokenMiddleware',
#     ]
# }
#
# GRAPHQL_JWT = JWT_CONFIGURATION
# GRAPHQL_JWT['JWT_SECRET_KEY'] = SECRET_KEY

EMAIL_BACKEND = "django.core.mail.backends.console.EmailBackend"

SEND_ACTIVATION_EMAIL = False
CORS_ALLOW_ALL_ORIGINS = False

CSRF_TRUSTED_ORIGINS = [
    "http://localhost:3000",
    "http://127.0.0.1:3000",
]
CORS_ALLOWED_ORIGINS = [
    "http://localhost:3000",
    "http://127.0.0.1:3000",
]
