# Diabetic Retinopathy Detection System

An AI-powered web application for early detection and risk assessment of diabetic retinopathy through automated analysis of retinal fundus images.

[![Live Demo](https://img.shields.io/badge/demo-live-brightgreen)](https://rishi5377.github.io/Diabetic-Retinopathy-Detector_2/)
[![License](https://img.shields.io/badge/license-MIT-blue.svg)](LICENSE)

## Overview

This application provides a comprehensive 4-step screening process:
1. **Patient Information** — Basic demographic data collection
2. **Health Questionnaire** — 6 vision and diabetes-related questions
3. **Retina Scan Upload** — Upload fundus image for AI analysis
4. **Results & PDF Report** — Detailed diagnosis with personalized management plan

### Key Features

- **AI-Powered Diagnosis**: EfficientNet-B0 model classifying 5 severity levels (No DR → Proliferative DR)
- **Risk Assessment**: Automated risk stratification (Low/Moderate/High)
- **Personalized Recommendations**: Risk-specific guidance on diet, sleep, and activity
- **PDF Report Generation**: Downloadable clinical report with patient information
- **Responsive Design**: Mobile-first UI built with React and Tailwind CSS
- **Privacy-Focused**: In-memory processing, no server-side data storage

## Tech Stack

**Frontend**
- React 18 + TypeScript
- Vite 5 (build tool)
- Tailwind CSS + Shadcn/ui components
- React Router DOM (HashRouter)
- jsPDF (PDF generation)

**Backend**
- FastAPI + Uvicorn
- PyTorch 2.1 (CPU)
- EfficientNet-B0 architecture
- Pillow + OpenCV (image processing)

**Deployment**
- Frontend: GitHub Pages
- Backend: Render.com
- CI/CD: GitHub Actions

## Quick Start

### Prerequisites

- **Frontend**: Node.js 20+
- **Backend**: Python 3.11+

### Local Development

#### Frontend

```bash
# Install dependencies
npm install

# Start dev server (default: http://localhost:8080)
npm run dev

# Build for production
npm run build
```

#### Backend

```bash
# Navigate to backend directory
cd backend

# Install Python dependencies
pip install -r requirements.txt

# Start FastAPI server (default: http://localhost:8000)
uvicorn server.main:app --reload
```

### Environment Configuration

Create a `.env` file in the root directory:

```env
# Frontend build-time variable
VITE_API_BASE_URL=http://localhost:8000

# Backend runtime variable
FRONTEND_ORIGIN=http://localhost:8080
MODEL_PATH=./Dect/best_model.pth
```

## API Reference

### Endpoints

#### Health Check
```http
GET /health
```
**Response:**
```json
{
  "status": "ok",
  "model_loaded": true
}
```

#### Predict
```http
POST /api/v1/predict
```
**Request Body:**
```json
{
  "image_base64": "base64_encoded_image_without_prefix",
  "mime_type": "image/jpeg",
  "preprocessing_method": "rescale_1_255"
}
```
**Response:**
```json
{
  "diagnosis": "Moderate",
  "confidence": 87.34,
  "riskLevel": "High",
  "recommendations": "Moderate NPDR likely. Consult an ophthalmologist...",
  "rawPrediction": {
    "index": 2,
    "logits": [0.12, 0.34, 2.45, 0.89, 0.23]
  }
}
```

## Model Details

- **Architecture**: EfficientNet-B0 (pre-trained on ImageNet, fine-tuned)
- **Input Size**: 224×224 RGB
- **Classes**: 5 (No DR, Mild, Moderate, Severe, Proliferative DR)
- **Preprocessing**: ImageNet normalization (mean: [0.485, 0.456, 0.406], std: [0.229, 0.224, 0.225])
- **Model File**: `Dect/best_model.pth` (~17MB)

## Deployment

### Backend (Render)

1. Push repository to GitHub
2. Connect Render to your repository
3. Render auto-detects `render.yaml` configuration
4. Ensure `Dect/best_model.pth` is committed to the repository
5. Deploy with default settings (Python 3.11, CPU)

### Frontend (GitHub Pages)

1. Add GitHub repository secret: `BACKEND_URL` (your Render backend URL)
2. Push to `main` branch
3. GitHub Actions workflow (`.github/workflows/deploy.yml`) automatically:
   - Builds the Vite app with `VITE_API_BASE_URL` set to `BACKEND_URL`
   - Deploys `dist/` to GitHub Pages

**Live URL**: `https://<username>.github.io/<repository-name>/`

## Project Structure

```
.
├── backend/
│   ├── server/
│   │   ├── main.py           # FastAPI application
│   │   ├── inference.py      # EfficientNet-B0 classifier
│   │   └── schemas.py        # Pydantic models
│   ├── requirements.txt
│   └── runtime.txt
├── source/
│   ├── components/           # Reusable UI components
│   ├── contexts/             # React Context (state management)
│   ├── pages/                # Route components
│   │   ├── Welcome.tsx
│   │   ├── UserInfo.tsx
│   │   ├── Quiz.tsx
│   │   ├── Upload.tsx
│   │   └── Results.tsx
│   ├── data/
│   │   └── quiz.ts           # Health questionnaire questions
│   └── main.tsx
├── Dect/
│   └── best_model.pth        # Trained PyTorch model
├── .github/
│   └── workflows/
│       └── deploy.yml        # GitHub Actions CI/CD
├── package.json
├── vite.config.ts
└── README.md
```

## Medical Disclaimer

⚠️ **This tool is for educational and screening purposes only.**

- Not a replacement for professional medical diagnosis
- Always consult a qualified ophthalmologist or healthcare provider
- Early detection and proper management are key to preserving vision

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## Acknowledgments

- EfficientNet architecture by Google Research
- Shadcn/ui component library
- Render.com for backend hosting
- GitHub Pages for frontend hosting

---

**Developed for early diabetic retinopathy screening and awareness**
