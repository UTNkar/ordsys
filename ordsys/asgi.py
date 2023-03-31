"""
ASGI config for ordsys project.

It exposes the ASGI callable as a module-level variable named ``application``.

The ASGI configuration is taken from the channels package
https://channels.readthedocs.io/en/stable/topics/routing.html

"""

import os
from channels.routing import ProtocolTypeRouter
from channels.auth import AuthMiddlewareStack
from django.core.asgi import get_asgi_application

os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'ordsys.settings.dev')
django_asgi_app = get_asgi_application()

# Backend routing must be imported after get_asgi_application to avoid
# 'Apps arent loaded yet' problem since it tries to load models that haven't
# been loaded yet
from backend import routing  # noqa:E402

application = ProtocolTypeRouter({
    "http": django_asgi_app,
    'websocket': AuthMiddlewareStack(routing.websocket_urls)
})
