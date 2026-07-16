from pathlib import Path
import json

import joblib
import pandas as pd

from sklearn.feature_extraction.text import TfidfVectorizer
from sklearn.model_selection import train_test_split
from sklearn.svm import LinearSVC
from sklearn.metrics import (
    accuracy_score,
    precision_score,
    recall_score,
    f1_score,
)


# Project paths
PROJECT_ROOT = Path(__file__).resolve().parent.parent

DATA_PATH = (
    PROJECT_ROOT
    / "dataset"
    / "processed"
    / "fake_job_postings_features.csv"
)

MODELS_DIR = PROJECT_ROOT / "models"

MODEL_PATH = MODELS_DIR / "linear_svm_balanced.pkl"
VECTORIZER_PATH = MODELS_DIR / "tfidf_vectorizer.pkl"
METADATA_PATH = MODELS_DIR / "model_metadata.json"


def load_data() -> pd.DataFrame:
    """Load and validate the feature-engineered dataset."""
    if not DATA_PATH.exists():
        raise FileNotFoundError(
            f"Dataset not found: {DATA_PATH}\n"
            "Run feature_engineering.ipynb first."
        )

    df = pd.read_csv(DATA_PATH)

    required_columns = ["clean_text", "fraudulent"]
    missing_columns = [
        column
        for column in required_columns
        if column not in df.columns
    ]

    if missing_columns:
        raise ValueError(
            f"Missing required columns: {missing_columns}"
        )

    df = df.dropna(
        subset=["clean_text", "fraudulent"]
    ).copy()

    df = df[
        df["clean_text"].str.strip().ne("")
    ].copy()

    df["fraudulent"] = df["fraudulent"].astype(int)

    return df


def train_model():
    """Train and save the final fake-job detection model."""
    df = load_data()

    X = df["clean_text"]
    y = df["fraudulent"]

    X_train, X_test, y_train, y_test = train_test_split(
        X,
        y,
        test_size=0.20,
        random_state=42,
        stratify=y,
    )

    vectorizer = TfidfVectorizer(
        stop_words="english",
        max_features=20000,
        ngram_range=(1, 2),
        min_df=2,
        max_df=0.95,
        sublinear_tf=True,
    )

    X_train_tfidf = vectorizer.fit_transform(X_train)
    X_test_tfidf = vectorizer.transform(X_test)

    model = LinearSVC(
        random_state=42,
        class_weight="balanced",
    )

    model.fit(X_train_tfidf, y_train)

    predictions = model.predict(X_test_tfidf)

    metrics = {
        "accuracy": float(
            accuracy_score(y_test, predictions)
        ),
        "precision": float(
            precision_score(
                y_test,
                predictions,
                zero_division=0,
            )
        ),
        "recall": float(
            recall_score(
                y_test,
                predictions,
                zero_division=0,
            )
        ),
        "f1_score": float(
            f1_score(
                y_test,
                predictions,
                zero_division=0,
            )
        ),
    }

    MODELS_DIR.mkdir(
        parents=True,
        exist_ok=True,
    )

    joblib.dump(
        model,
        MODEL_PATH,
    )

    joblib.dump(
        vectorizer,
        VECTORIZER_PATH,
    )

    metadata = {
        "model_name": "Linear SVM Balanced",
        "model_type": "LinearSVC",
        "target_column": "fraudulent",
        "class_labels": {
            "0": "Real",
            "1": "Fake",
        },
        "training_rows": len(X_train),
        "testing_rows": len(X_test),
        "tfidf_features": X_train_tfidf.shape[1],
        "metrics": metrics,
    }

    with open(
        METADATA_PATH,
        "w",
        encoding="utf-8",
    ) as file:
        json.dump(
            metadata,
            file,
            indent=4,
        )

    print("=" * 50)
    print("Training completed successfully")
    print("=" * 50)

    print(f"Training rows: {len(X_train)}")
    print(f"Testing rows: {len(X_test)}")
    print(
        f"TF-IDF features: "
        f"{X_train_tfidf.shape[1]}"
    )

    print("\nMetrics")

    for metric_name, metric_value in metrics.items():
        print(
            f"{metric_name}: "
            f"{metric_value:.4f}"
        )

    print("\nSaved files")

    print(MODEL_PATH)
    print(VECTORIZER_PATH)
    print(METADATA_PATH)


if __name__ == "__main__":
    train_model()