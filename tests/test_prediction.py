from fastapi.testclient import TestClient

from api.app import app

client = TestClient(app)


def test_root():
    response = client.get("/")

    assert response.status_code == 200

    body = response.json()

    assert "message" in body


def test_health():
    response = client.get("/health")

    assert response.status_code == 200

    assert response.json()["status"] == "healthy"


def test_real_job_prediction():
    payload = {
        "title": "Senior Python Backend Developer",
        "company_profile": "Software company",
        "description": "We are looking for an experienced Python backend developer.",
        "requirements": "Python Django PostgreSQL REST API",
        "benefits": "Health insurance Remote work"
    }

    response = client.post(
        "/predict",
        json=payload,
    )

    assert response.status_code == 200

    body = response.json()

    assert "prediction" in body
    assert "label" in body
    assert "decision_score" in body


def test_fake_job_prediction():
    payload = {
        "title": "Work From Home Data Entry",
        "company_profile": "",
        "description": "Earn 5000 dollars every week. No experience required. Registration fee required.",
        "requirements": "Send bank details immediately.",
        "benefits": "Guaranteed income."
    }

    response = client.post(
        "/predict",
        json=payload,
    )

    assert response.status_code == 200

    body = response.json()

    assert "prediction" in body
    assert "label" in body


def test_empty_title():

    payload = {
        "title": "",
        "company_profile": "",
        "description": "Developer",
        "requirements": "",
        "benefits": ""
    }

    response = client.post(
        "/predict",
        json=payload,
    )

    assert response.status_code == 422


def test_empty_description():

    payload = {
        "title": "Developer",
        "company_profile": "",
        "description": "",
        "requirements": "",
        "benefits": ""
    }

    response = client.post(
        "/predict",
        json=payload,
    )

    assert response.status_code == 422