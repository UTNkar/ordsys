from ordsys.settings.base import *

# SECURITY WARNING: keep the secret key used in production secret!
SECRET_KEY = "'d49+(^=+2=y%$&jsp*()214p@+%e!ao#kl)i*#%n=$8j%p@^1w'"

# SECURITY WARNING: don't run with debug turned on in production!
DEBUG = True

CORS_ORIGIN_WHITELIST = (
    'http://localhost:3000',
)

CSRF_TRUSTED_ORIGINS = ['http://localhost:3000']

DATABASES = {
    'default': {
        'ENGINE': 'django.db.backends.sqlite3',
        'NAME': os.path.join(BASE_DIR, 'db.sqlite3'),
    }
}
