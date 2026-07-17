from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel, Field

from src.predict import predict_job


app = FastAPI(
    title="JobShield AI API",
    description="API for detecting fake job postings using machine learning.",
    version="1.0.0",
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:3000",
        "http://127.0.0.1:3000",
        "https://jobshield-ai-ml-coral.vercel.app",
        "https://jobshield-ai-ml-hayats-projects-a679eba8.vercel.app",
        "https://jobshield-ai-ml-git-main-hayats-projects-a679eba8.vercel.app",
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


class JobPostingRequest(BaseModel):
    title: str = Field(..., min_length=2)
    company_profile: str = ""
    description: str = Field(..., min_length=10)
    requirements: str = ""
    benefits: str = ""


class PredictionResponse(BaseModel):
    prediction: int
    label: str
    decision_score: float


@app.get("/")
def root():
    return {
        "message": "JobShield AI API is running",
        "docs": "/docs",
    }


@app.get("/health")
def health_check():
    return {
        "status": "healthy",
    }


@app.post(
    "/predict",
    response_model=PredictionResponse,
)
def predict_job_posting(data: JobPostingRequest):
    try:
        result = predict_job(
            title=data.title,
            company_profile=data.company_profile,
            description=data.description,
            requirements=data.requirements,
            benefits=data.benefits,
        )

        return result

    except ValueError as error:
        raise HTTPException(
            status_code=400,
            detail=str(error),
        )

    except Exception as error:
        raise HTTPException(
            status_code=500,
            detail=f"Prediction failed: {error}",
        )