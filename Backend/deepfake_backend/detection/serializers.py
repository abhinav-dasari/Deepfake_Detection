from rest_framework import serializers
from .models import Detection


class DetectionSerializer(serializers.ModelSerializer):
    image = serializers.SerializerMethodField()

    class Meta:
        model = Detection
        fields = ['id', 'image', 'prediction', 'confidence', 'created_at']
        read_only_fields = ['prediction', 'confidence', 'created_at']

    def get_image(self, obj):
        request = self.context.get('request')
        if obj.image and request:
            return request.build_absolute_uri(obj.image.url)
        return None