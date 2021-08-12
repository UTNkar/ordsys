from django.urls import re_path
from channels.routing import URLRouter
from backend.consumers import ModelChangesConsumer

websocket_urls = URLRouter([
    re_path(r'^admin/ws/model_changes/$', ModelChangesConsumer.as_asgi()),
])
