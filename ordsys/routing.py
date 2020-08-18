from channels.auth import AuthMiddlewareStack
from channels.routing import ProtocolTypeRouter
from backend import routing


application = ProtocolTypeRouter({
    # automatically handles http requests
    'websocket': AuthMiddlewareStack(routing.websocket_urls)
})
