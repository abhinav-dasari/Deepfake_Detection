import torch
from pathlib import Path
from django.conf import settings
from .model import build_model
import torchvision.transforms as transforms
from PIL import Image

# Device configuration
device = torch.device("cuda" if torch.cuda.is_available() else "cpu")

# Global model instance
model = None


def load_model():
    global model

    if model is None:
        model_path = Path(settings.BASE_DIR) / "model" / "model.pth"

        model = build_model()
        model.load_state_dict(torch.load(model_path, map_location=device))
        model.to(device)
        model.eval()

    return model

    # Image transform (match training input size)
transform = transforms.Compose([
    transforms.Resize((224, 224)),
    transforms.ToTensor(),
])


def predict_image(image_path):
    model = load_model()

    image = Image.open(image_path).convert("RGB")
    image = transform(image).unsqueeze(0).to(device)

    with torch.no_grad():
        output = model(image)
        prob = torch.sigmoid(output).item()

    prediction = "Fake" if prob > 0.5 else "Real"
    confidence = prob if prob > 0.5 else 1 - prob

    return prediction, float(confidence)