from django.test import TestCase
from django.contrib.auth.models import User
from django.core.exceptions import ValidationError
from .models import Detection


class DetectionModelTest(TestCase):
    def setUp(self):
        self.user = User.objects.create_user(
            username="testuser",
            password="testpass123"
        )
        self.detection = Detection.objects.create(
            user=self.user,
            image="uploads/test.jpg",
            prediction="Fake",
            confidence=0.95
        )

    def test_detection_creation(self):
        """Test if the detection object is created successfully"""
        self.assertEqual(self.detection.prediction, "Fake")
        self.assertEqual(self.detection.confidence, 0.95)
        self.assertEqual(self.detection.user.username, "testuser")

    def test_detection_str(self):
        """Test the string representation of Detection"""
        expected = "testuser - Fake (0.95)"
        self.assertEqual(str(self.detection), expected)

    def test_prediction_max_length(self):
        """Test prediction field max_length"""
        max_length = self.detection._meta.get_field('prediction').max_length
        self.assertEqual(max_length, 10)

    def test_prediction_exceed_max_length(self):
        """Test that prediction exceeding max_length raises ValidationError"""
        detection_invalid = Detection(
            user=self.user,
            image="uploads/test.jpg",
            prediction="A" * 11,  # Exceeds max_length of 10
            confidence=0.5
        )
        with self.assertRaises(ValidationError):
            detection_invalid.full_clean()

    def test_user_cascade_delete(self):
        """Test that deleting user also deletes their detections"""
        user_id = self.user.id
        self.user.delete()
        self.assertEqual(Detection.objects.filter(user_id=user_id).count(), 0)


class DetectionAPITest(TestCase):
    def setUp(self):
        self.user = User.objects.create_user(
            username="apiuser",
            password="testpass123"
        )

    def test_history_requires_auth(self):
        """Test that history endpoint requires authentication"""
        response = self.client.get('/api/detect/history/')
        self.assertIn(response.status_code, [401, 403])

    def test_upload_requires_auth(self):
        """Test that upload endpoint requires authentication"""
        response = self.client.post('/api/detect/upload/')
        self.assertIn(response.status_code, [401, 403])
