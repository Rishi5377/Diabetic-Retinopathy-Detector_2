from __future__ import annotations
import os
from dataclasses import dataclass
from typing import List, Optional
import torch
import torch.nn as nn
from PIL import Image
from torchvision import models, transforms

IMAGENET_MEAN = [0.485, 0.456, 0.406]
IMAGENET_STD = [0.229, 0.224, 0.225]
IMG_SIZE = 224
CLASS_LABELS: List[str] = [
    "No DR",
    "Mild",
    "Moderate",
    "Severe",
    "Proliferative DR",
]

def _project_root() -> str:
    return os.path.abspath(os.path.join(os.path.dirname(__file__), "..", ".."))

def _default_model_path() -> str:
    return os.path.join(_project_root(), "Dect", "best_model.pth")

@dataclass
class Prediction:
    label: str
    confidence: float  # 0-1
    logits: List[float]
    index: int

class EfficientNetB0Classifier:
    def __init__(self, model_path: Optional[str] = None, device: Optional[str] = None):
        self.device = torch.device(device or ("cuda" if torch.cuda.is_available() else "cpu"))
        self.model_path = model_path or _default_model_path()
        self.labels = CLASS_LABELS
        self.model: Optional[nn.Module] = None
        self.transform = transforms.Compose([
            transforms.Resize((IMG_SIZE, IMG_SIZE)),
            transforms.ToTensor(),
            transforms.Normalize(IMAGENET_MEAN, IMAGENET_STD),
        ])

    def load(self) -> None:
        model = models.efficientnet_b0(weights=None)
        num_ftrs = model.classifier[1].in_features
        model.classifier[1] = nn.Linear(num_ftrs, len(self.labels))
        state = torch.load(self.model_path, map_location=self.device)
        model.load_state_dict(state)
        model.to(self.device)
        model.eval()
        self.model = model

    @property
    def loaded(self) -> bool:
        return self.model is not None

    def predict(self, img: Image.Image) -> Prediction:
        assert self.model is not None, "Model not loaded"
        x = self.transform(img).unsqueeze(0).to(self.device)
        with torch.no_grad():
            logits = self.model(x)
            probs = torch.softmax(logits, dim=1)
            conf, idx = torch.max(probs, dim=1)
        idx_int = int(idx.item())
        return Prediction(
            label=self.labels[idx_int],
            confidence=float(conf.item()),
            logits=logits.squeeze(0).tolist(),
            index=idx_int,
        )
