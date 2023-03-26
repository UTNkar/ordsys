"""
ASGI config for ordsys project.

It exposes the ASGI callable as a module-level variable named ``application``.

The ASGI configuration is taken from the channels package
https://channels.readthedocs.io/en/stable/topics/routing.html

"""

import os
from channels.routing import ProtocolTypeRouter
from channels.auth import AuthMiddlewareStack
from backend import routing
from django.core.asgi import get_asgi_application

os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'ordsys.settings.dev')
# Initialize Django ASGI application early to ensure the AppRegistry
# is populated before importing code that may import ORM models.
django_asgi_app = get_asgi_application()

application = ProtocolTypeRouter({
    "http": django_asgi_app,
    'websocket': AuthMiddlewareStack(routing.websocket_urls)
})
