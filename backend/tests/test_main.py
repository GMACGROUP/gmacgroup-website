"""Smoke tests for the FastAPI app. TODO: expand with real route/auth tests."""

from fastapi.testclient import TestClient
from app.main import app

client = TestClient(app)


def test_root_ok():
    response = client.get("/")
    assert response.status_code == 200
    assert response.json()["status"] == "ok"


def test_health_ok():
    response = client.get("/health")
    assert response.status_code == 200
