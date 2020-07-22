from django.urls import re_path

from backend.consumers import ModelChangesConsumer


websocket_urls = [
    re_path(r'^ws/model_changes/$', ModelChangesConsumer),
]
