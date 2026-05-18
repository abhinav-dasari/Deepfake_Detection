from django.shortcuts import render

# Create your views here.
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from rest_framework.permissions import IsAuthenticated
from rest_framework import serializers as drf_serializers
from .models import Detection
from .serializers import DetectionSerializer
from .ml.model_loader import predict_image


class UploadSerializer(drf_serializers.Serializer):
    """Used only to render a file picker in the DRF browsable API."""
    image = drf_serializers.ImageField()


class UploadImageView(APIView):
    serializer_class = UploadSerializer  # enables file picker in browsable API
    permission_classes = [IsAuthenticated]

    def post(self, request):
        if 'image' not in request.FILES:
            return Response(
                {"error": "Image file is required"},
                status=status.HTTP_400_BAD_REQUEST
            )

        image_file = request.FILES['image']

        # First save temporarily
        detection = Detection.objects.create(
            user=request.user,
            image=image_file,
            prediction="Processing",
            confidence=0.0
        )

        # Run prediction
        prediction, confidence = predict_image(detection.image.path)

        # Update result
        detection.prediction = prediction
        detection.confidence = confidence
        detection.save()

        serializer = DetectionSerializer(detection, context={'request': request})

        return Response(serializer.data, status=status.HTTP_201_CREATED)


class DetectionHistoryView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        detections = Detection.objects.filter(user=request.user).order_by('-created_at')
        serializer = DetectionSerializer(detections, many=True, context={'request': request})
        return Response(serializer.data)