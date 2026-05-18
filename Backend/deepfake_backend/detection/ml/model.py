import torch.nn as nn
from torchvision.models import efficientnet_b0, EfficientNet_B0_Weights


class EfficientNetModel(nn.Module):
    def __init__(self):
        super(EfficientNetModel, self).__init__()

        weights = EfficientNet_B0_Weights.DEFAULT
        self.base_model = efficientnet_b0(weights=weights)

        # Freeze feature layers (same as training)
        for param in self.base_model.features.parameters():
            param.requires_grad = False

        in_features = self.base_model.classifier[1].in_features

        self.base_model.classifier = nn.Sequential(
            nn.Dropout(0.5),
            nn.Linear(in_features, 1)
        )

    def forward(self, x):
        return self.base_model(x)


def build_model():
    return EfficientNetModel()