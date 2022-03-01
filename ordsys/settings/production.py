from ordsys.settings.base import *
from decouple import config
import sentry_sdk
from sentry_sdk.integrations.django import DjangoIntegration

# SECURITY WARNING: keep the secret key used in production secret!
SECRET_KEY = config('SECRET_KEY')

ALLOWED_HOSTS = [".utn.se"]

CSRF_COOKIE_SECURE = True

SESSION_COOKIE_DOMAIN = '.utn.se'

SESSION_COOKIE_SECURE = True

CORS_ORIGIN_WHITELIST = (
    'https://ordsys.utn.se',
)

CSRF_TRUSTED_ORIGINS = ['https://ordsys.utn.se']

DATABASES = {
    'default': {
        'ENGINE': 'django.db.backends.postgresql',
        'NAME': config('DB_NAME', default="ordsys"),
        'USER': config('DB_USER', default="ordsys"),
        'PASSWORD': config('DB_PASSWORD'),
        'HOST': config('DB_HOST', default="127.0.0.1"),
        'PORT': config('DB_PORT', default=5432),
    }
}

sentry_sdk.init(
    dsn=config("SENTRY_DSN", default=""),
    integrations=[DjangoIntegration()],

    # If you wish to associate users to errors (assuming you are using
    # django.contrib.auth) you may enable sending PII data.
    send_default_pii=True
)
