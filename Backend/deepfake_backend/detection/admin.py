from django.contrib import admin

# Register your models here.
from .models import Detection


@admin.register(Detection)
class DetectionAdmin(admin.ModelAdmin):
    list_display = ('user', 'prediction', 'confidence', 'created_at')
    list_filter = ('prediction',)
    search_fields = ('user__username',)