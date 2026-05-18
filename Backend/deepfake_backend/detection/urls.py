from django.urls import path
from .views import UploadImageView,DetectionHistoryView

urlpatterns = [
    path('upload/', UploadImageView.as_view()),
    path('history/', DetectionHistoryView.as_view()),
]