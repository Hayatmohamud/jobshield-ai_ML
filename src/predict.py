from pathlib import Path
import re

import joblib


PROJECT_ROOT = Path(__file__).resolve().parent.parent

MODEL_PATH = PROJECT_ROOT / "models" / "linear_svm_balanced.pkl"
VECTORIZER_PATH = PROJECT_ROOT / "models" / "tfidf_vectorizer.pkl"


def clean_text(text: str) -> str:
    """Clean job-posting text using the same rules used during training."""
    text = str(text).lower()

    text = re.sub(r"<[^>]+>", " ", text)
    text = re.sub(r"http\S+|www\.\S+", " ", text)
    text = re.sub(r"\S+@\S+", " ", text)
    text = re.sub(r"[^a-z\s]", " ", text)
    text = re.sub(r"\s+", " ", text).strip()

    return text


def load_artifacts():
    """Load the trained model and TF-IDF vectorizer."""
    if not MODEL_PATH.exists():
        raise FileNotFoundError(
            f"Model not found: {MODEL_PATH}\n"
            "Run python src/train.py first."
        )

    if not VECTORIZER_PATH.exists():
        raise FileNotFoundError(
            f"Vectorizer not found: {VECTORIZER_PATH}\n"
            "Run python src/train.py first."
        )

    model = joblib.load(MODEL_PATH)
    vectorizer = joblib.load(VECTORIZER_PATH)

    return model, vectorizer


MODEL, VECTORIZER = load_artifacts()


def predict_job(
    title: str,
    company_profile: str,
    description: str,
    requirements: str,
    benefits: str,
) -> dict:
    """Predict whether a job posting is real or fake."""

    combined_text = " ".join(
        [
            title or "",
            company_profile or "",
            description or "",
            requirements or "",
            benefits or "",
        ]
    )

    cleaned_text = clean_text(combined_text)

    if not cleaned_text:
        raise ValueError("Job posting text cannot be empty.")

    text_vector = VECTORIZER.transform([cleaned_text])

    prediction = int(MODEL.predict(text_vector)[0])

    # LinearSVC returns a decision score rather than probability.
    decision_score = float(MODEL.decision_function(text_vector)[0])

    label = "Fake" if prediction == 1 else "Real"

    return {
        "prediction": prediction,
        "label": label,
        "decision_score": round(decision_score, 4),
    }


if __name__ == "__main__":
    sample_job = {
    "title": "Work From Home Data Entry",
    "company_profile": "",
    "description": (
        "Earn thousands of dollars every week from home. "
        "No interview and no experience required. "
        "Start immediately after paying the registration fee."
    ),
    "requirements": (
        "Send your personal information and bank details today."
    ),
    "benefits": (
        "Guaranteed income and instant payment."
    ),

    }

    result = predict_job(**sample_job)

    print("Prediction result:")
    print(result)