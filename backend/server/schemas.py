from pydantic import BaseModel, Field, constr
from typing import Optional, Literal, Any

RiskLevel = Literal['Low', 'Medium', 'High', 'Critical', 'Unknown']

class PredictRequest(BaseModel):
    image_base64: constr(strip_whitespace=True, min_length=10) = Field(
        ..., description="Base64-encoded image data without data URL prefix"
    )
    mime_type: Optional[Literal['image/jpeg', 'image/png', 'image/jpg']] = Field(
        None, description="MIME type of the image"
    )
    preprocessing_method: Optional[str] = Field(
        default="rescale_1_255",
        description="Name of preprocessing method applied or to apply on server",
    )

class PredictResponse(BaseModel):
    diagnosis: str
    confidence: float = Field(ge=0, le=100)
    riskLevel: RiskLevel
    recommendations: str
    rawPrediction: Optional[Any] = None

class HealthResponse(BaseModel):
    status: Literal['ok'] = 'ok'
    model_loaded: bool
