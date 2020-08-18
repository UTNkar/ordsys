from django.urls import re_path, path
from channels.routing import URLRouter
from backend.consumers import ModelChangesConsumer
from django.conf import settings

base_url = settings.BASE_URL.lstrip("/")

websocket_urls = URLRouter([
    path(base_url, URLRouter([
        re_path(r'^ws/model_changes/$', ModelChangesConsumer),
    ])),
])
