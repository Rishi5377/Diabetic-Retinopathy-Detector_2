import base64
import io
import logging
import os
from typing import Optional
from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from PIL import Image
from dotenv import load_dotenv
from .schemas import PredictRequest, PredictResponse, HealthResponse
from .inference import EfficientNetB0Classifier

LOG_LEVEL = os.getenv("LOG_LEVEL", "INFO").upper()
logging.basicConfig(
    level=LOG_LEVEL,
    format="%(asctime)s %(levelname)s [%(name)s] %(message)s",
)
logger = logging.getLogger("retinopathy.api")

load_dotenv()
app = FastAPI(title="Diabetic Retinopathy Backend", version="1.0.0")

frontend_origin = os.getenv("FRONTEND_ORIGIN", "*")
app.add_middleware(
    CORSMiddleware,
    allow_origins=[frontend_origin] if frontend_origin != "*" else ["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

class ModelWrapper:
    def __init__(self) -> None:
        self._clf: Optional[EfficientNetB0Classifier] = None

    def load(self) -> None:
        repo_root = os.path.abspath(os.path.join(os.path.dirname(__file__), os.pardir, os.pardir))
        default_path = os.path.join(repo_root, "Dect", "best_model.pth")
        model_path = os.getenv("MODEL_PATH", default_path)
        clf = EfficientNetB0Classifier(model_path=model_path)
        clf.load()
        self._clf = clf
        logger.info("EfficientNetB0 model loaded from %s", model_path)

    @property
    def loaded(self) -> bool:
        return self._clf is not None and self._clf.loaded

    def predict(self, img: Image.Image, preprocessing_method: str) -> PredictResponse:
        assert self._clf is not None
        pred = self._clf.predict(img)
        label_to_risk = {
            "No DR": "Low",
            "Mild": "Medium",
            "Moderate": "High",
            "Severe": "Critical",
            "Proliferative DR": "Critical",
        }
        risk = label_to_risk.get(pred.label, "Unknown")
        recs = {
            "No DR": "No signs of DR detected. Maintain routine eye exams and glycemic control.",
            "Mild": "Mild indications present. Schedule a follow-up screening and monitor glucose levels.",
            "Moderate": "Moderate NPDR likely. Consult an ophthalmologist and manage glucose/BP/cholesterol.",
            "Severe": "Severe NPDR suspected. Seek prompt specialist evaluation.",
            "Proliferative DR": "Proliferative DR suspected. Urgent ophthalmological care recommended.",
        }.get(pred.label, "Consult a qualified eye care professional for a comprehensive evaluation.")
        return PredictResponse(
            diagnosis=pred.label,
            confidence=round(pred.confidence * 100.0, 2),
            riskLevel=risk,  # type: ignore
            recommendations=recs,
            rawPrediction={"index": pred.index, "logits": pred.logits, "preprocessing": preprocessing_method},
        )

model = ModelWrapper()

@app.on_event("startup")
def on_startup() -> None:
    try:
        model.load()
    except Exception:
        logger.exception("Failed to load model on startup")

@app.get("/health", response_model=HealthResponse)
def health() -> HealthResponse:
    return HealthResponse(model_loaded=model.loaded)

@app.post("/api/v1/predict", response_model=PredictResponse)
def predict(req: PredictRequest) -> PredictResponse:
    if not model.loaded:
        logger.error("Model not loaded")
        raise HTTPException(status_code=503, detail="Model not loaded")
    try:
        img_bytes = base64.b64decode(req.image_base64)
    except Exception:
        logger.exception("Invalid base64 image payload")
        raise HTTPException(status_code=400, detail="Invalid base64 image payload")
    try:
        img = Image.open(io.BytesIO(img_bytes)).convert("RGB")
    except Exception:
        logger.exception("Could not decode image bytes")
        raise HTTPException(status_code=400, detail="Invalid image data")
    try:
        result = model.predict(img, req.preprocessing_method or "rescale_1_255")
        logger.info("Prediction success: diagnosis=%s confidence=%.2f", result.diagnosis, result.confidence)
        return result
    except HTTPException:
        raise
    except Exception:
        logger.exception("Inference error")
        raise HTTPException(status_code=500, detail="Inference error")

@app.get("/")
def root() -> dict:
    return {"message": "Backend is running", "docs": "/docs"}
