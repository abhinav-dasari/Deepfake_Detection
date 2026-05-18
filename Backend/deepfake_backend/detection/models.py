from django.db import models

# Create your models here.
from django.contrib.auth.models import User


class Detection(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name="detections")
    image = models.ImageField(upload_to='uploads/')
    prediction = models.CharField(max_length=10)
    confidence = models.FloatField()
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"{self.user.username} - {self.prediction} ({self.confidence})"