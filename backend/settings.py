"""
Django settings for backend project.
"""

from pathlib import Path
import os
from decouple import config
import dj_database_url
import logging
import warnings

# Suppress broken pipe errors in development
logging.getLogger('django.server').handlers = []
warnings.filterwarnings('ignore', message='.*Broken pipe.*')

# Build paths
BASE_DIR = Path(__file__).resolve().parent.parent

# ============================================
# 1. ENVIRONMENT DETECTION
# ============================================
# If RENDER is set, we're in production
IS_PRODUCTION = os.environ.get('RENDER', False)

# ============================================
# 2. SECURITY SETTINGS
# ============================================
SECRET_KEY = config('SECRET_KEY')
DEBUG = config('DEBUG', default=False, cast=bool)

if IS_PRODUCTION:
    # Get host from environment or use hardcoded
    render_host = os.environ.get('RENDER_EXTERNAL_HOSTNAME', 'github-analytics-7o5a.onrender.com')
    ALLOWED_HOSTS = [
        'localhost',
        '127.0.0.1',
        render_host,
        'github-analytics-7o5a.onrender.com',  
    ]
else:
    ALLOWED_HOSTS = ['localhost', '127.0.0.1']


# ============================================
# 3. INSTALLED APPS
# ============================================
INSTALLED_APPS = [
    'django.contrib.admin',
    'django.contrib.auth',
    'django.contrib.contenttypes',
    'django.contrib.sessions',
    'django.contrib.messages',
    'django.contrib.staticfiles',
    'django.contrib.postgres',
    'rest_framework',
    'corsheaders',
    'api',
    'graphene_django',
    'django_redis',
]

# ============================================
# 4. MIDDLEWARE
# ============================================
MIDDLEWARE = [
    'django.middleware.security.SecurityMiddleware',
    'corsheaders.middleware.CorsMiddleware',
    'django.contrib.sessions.middleware.SessionMiddleware',
    'django.middleware.common.CommonMiddleware',
    'django.middleware.csrf.CsrfViewMiddleware',
    'django.contrib.auth.middleware.AuthenticationMiddleware',
    'django.contrib.messages.middleware.MessageMiddleware',
    'django.middleware.clickjacking.XFrameOptionsMiddleware',
]

ROOT_URLCONF = 'backend.urls'

TEMPLATES = [
    {
        'BACKEND': 'django.template.backends.django.DjangoTemplates',
        'DIRS': [],
        'APP_DIRS': True,
        'OPTIONS': {
            'context_processors': [
                'django.template.context_processors.request',
                'django.contrib.auth.context_processors.auth',
                'django.contrib.messages.context_processors.messages',
            ],
        },
    },
]

WSGI_APPLICATION = 'backend.wsgi.application'

# ============================================
# 5. DATABASE (PostgreSQL)
# ============================================
if IS_PRODUCTION:
    # Production: Use DATABASE_URL from Render
    DATABASES = {
        'default': dj_database_url.config(
            default=os.environ.get('DATABASE_URL'),
            conn_max_age=600,
            ssl_require=True
        )
    }
else:
    # Local: Use .env settings
    DATABASES = {
        'default': {
            'ENGINE': 'django.db.backends.postgresql',
            'NAME': config('DB_NAME'),
            'USER': config('DB_USER'),
            'PASSWORD': config('DB_PASSWORD'),
            'HOST': config('DB_HOST'),
            'PORT': config('DB_PORT', default='6543'),
            'OPTIONS': {
                'sslmode': 'require',
                'options': '-c search_path=public --project=poxyrqsmxbpxnbgktyyr',
                'connect_timeout': 10,
                'keepalives': 1,
                'keepalives_idle': 60,
                'keepalives_interval': 10,
                'keepalives_count': 5,
            },
            'CONN_MAX_AGE': 0,
            'CONN_HEALTH_CHECKS': True,
        }
    }

# ============================================
# 6. REDIS CACHE
# ============================================
if IS_PRODUCTION:
    # Production: Use REDIS_URL from Render
    REDIS_URL = os.environ.get('REDIS_URL', 'redis://localhost:6379/1')
    KEY_PREFIX = 'github_analytics_prod'
else:
    # Local: Use local Redis
    REDIS_URL = 'redis://127.0.0.1:6379/1'
    KEY_PREFIX = 'github_analytics'

CACHES = {
    'default': {
        'BACKEND': 'django_redis.cache.RedisCache',
        'LOCATION': REDIS_URL,
        'OPTIONS': {
            'CLIENT_CLASS': 'django_redis.client.DefaultClient',
            'CONNECTION_POOL_CLASS': 'redis.BlockingConnectionPool',
            'CONNECTION_POOL_CLASS_KWARGS': {
                'max_connections': 50,
                'timeout': 20,
            },
            'MAX_CONNECTIONS': 1000,
            'PICKLE_VERSION': -1,
        },
        'KEY_PREFIX': KEY_PREFIX,
    }
}

CACHE_TTL = 3600  # 1 hour

# ============================================
# 7. GRAPHQL
# ============================================
GRAPHENE = {
    'SCHEMA': 'backend.schema.schema'
}

# ============================================
# 8. CORS
# ============================================
if IS_PRODUCTION:
    CORS_ALLOWED_ORIGINS = [
        'https://github-analytics-7dkv.vercel.app',
        'https://github-analytics-7o5a.onrender.com',
    ]
else:
    CORS_ALLOWED_ORIGINS = ['http://localhost:3000']

# ============================================
# 9. GITHUB API
# ============================================
GITHUB_TOKEN = config('GITHUB_TOKEN', default='')
GITHUB_API_URL = 'https://api.github.com'

# ============================================
# 10. STATIC FILES
# ============================================
STATIC_URL = 'static/'
STATIC_ROOT = os.path.join(BASE_DIR, 'staticfiles')

# ============================================
# 11. REST FRAMEWORK
# ============================================
REST_FRAMEWORK = {
    'DEFAULT_RENDERER_CLASSES': [
        'rest_framework.renderers.JSONRenderer',
    ],
    'DEFAULT_PARSER_CLASSES': [
        'rest_framework.parsers.JSONParser',
    ],
    'DEFAULT_THROTTLE_CLASSES': [
        'rest_framework.throttling.AnonRateThrottle',
        'rest_framework.throttling.UserRateThrottle',
    ],
    'DEFAULT_THROTTLE_RATES': {
        'anon': '100/day',
        'user': '1000/day',
    }
}

# ============================================
# 12. OTHER
# ============================================
DEFAULT_AUTO_FIELD = 'django.db.models.BigAutoField'
LANGUAGE_CODE = 'en-us'
TIME_ZONE = 'UTC'
USE_I18N = True
USE_TZ = True

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

# ============================================
# 13. PRODUCTION SECURITY (Auto-enabled)
# ============================================
if IS_PRODUCTION:
    SECURE_SSL_REDIRECT = True
    SESSION_COOKIE_SECURE = True
    CSRF_COOKIE_SECURE = True
    SECURE_BROWSER_XSS_FILTER = True
    SECURE_CONTENT_TYPE_NOSNIFF = True