from channels.auth import AuthMiddlewareStack
from channels.routing import ProtocolTypeRouter, URLRouter
from backend import routing


application = ProtocolTypeRouter({
    # automatically handles http requests
    'websocket': AuthMiddlewareStack(URLRouter(routing.websocket_urls))
})
