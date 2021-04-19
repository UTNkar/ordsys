from django.apps import AppConfig


class BackendConfig(AppConfig):
    name = 'backend'

    def ready(self):
        # Models cannot be imported until app is at 'ready' stage.
        # Importing signals here ensures models are ready and automatically
        # hooks them up to the signals.
        # https://docs.djangoproject.com/en/stable/topics/signals/#connecting-receiver-functions

        from . import signals # noqa
