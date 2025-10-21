# Diabetic Retinopathy Detector

A Vite + React (TypeScript) frontend with a FastAPI backend for diabetic retinopathy screening.

## Local development

Frontend:

1. Install Node 20+
2. Install deps
3. Run dev server

Backend:

1. Python 3.11
2. `cd backend`
3. `pip install -r requirements.txt`
4. `uvicorn server.main:app --reload`

## Frontend configuration

Set `VITE_API_BASE_URL` to your backend URL at build time. See `.env.example`.

- Local dev example: `http://localhost:8000`
- Production example: `https://<your-render-service>.onrender.com`

## Deploy

### Backend (Render)
Render will read `render.yaml` and create a web service for the FastAPI app. Ensure the `Dect/best_model.pth` file is present in the repo.

### Frontend (GitHub Pages)
This repo includes `.github/workflows/deploy.yml`. Create a repository secret `BACKEND_URL` set to your Render backend URL. On push to `main`, the workflow builds the app and deploys `dist/` to GitHub Pages.

## API

- `GET /health` -> `{ status: "ok", model_loaded: boolean }`
- `POST /api/v1/predict` -> `{ diagnosis, confidence (0-100), riskLevel, recommendations, rawPrediction }`

Request body contains `image_base64` (no data URL prefix), optional `mime_type`, and `preprocessing_method`.
