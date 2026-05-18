from django.apps import AppConfig


class DetectionConfig(AppConfig):
    default_auto_field = 'django.db.models.BigAutoField'
    name = 'detection'

    def ready(self):
        from .ml.model_loader import load_model
        load_model()