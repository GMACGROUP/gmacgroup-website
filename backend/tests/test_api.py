"""Comprehensive endpoint tests for the GMACGROUP API."""

from fastapi.testclient import TestClient
from app.main import app

client = TestClient(app)


def test_root():
    response = client.get("/")
    assert response.status_code == 200
    data = response.json()
    assert data["status"] == "ok"
    assert data["name"] == "GMACGROUP API"


def test_health():
    response = client.get("/health")
    assert response.status_code == 200
    assert response.json()["status"] == "healthy"


# ---------------------------------------------------------------------------
# Services
# ---------------------------------------------------------------------------

def test_list_services():
    response = client.get("/api/v1/services/")
    assert response.status_code == 200
    data = response.json()
    assert isinstance(data, list)
    assert len(data) >= 3
    first = data[0]
    assert "id" in first
    assert "slug" in first
    assert "title" in first
    assert "summary" in first


def test_get_service_by_slug():
    response = client.get("/api/v1/services/education-employability")
    assert response.status_code == 200
    data = response.json()
    assert data["slug"] == "education-employability"
    assert data["title"] == "Education and Employability"


def test_get_service_not_found():
    response = client.get("/api/v1/services/non-existent-slug")
    assert response.status_code == 404


# ---------------------------------------------------------------------------
# Programmes
# ---------------------------------------------------------------------------

def test_list_programmes():
    response = client.get("/api/v1/programmes/")
    assert response.status_code == 200
    data = response.json()
    assert isinstance(data, list)
    assert len(data) >= 2


def test_filter_programmes_by_category():
    response = client.get("/api/v1/programmes/?category=student")
    assert response.status_code == 200
    data = response.json()
    assert all(item["category"] == "student" for item in data)


def test_get_programme_by_id():
    response = client.get("/api/v1/programmes/programme-career-readiness")
    assert response.status_code == 200
    data = response.json()
    assert data["id"] == "programme-career-readiness"
    assert data["category"] == "student"


def test_get_programme_not_found():
    response = client.get("/api/v1/programmes/non-existent-id")
    assert response.status_code == 404


# ---------------------------------------------------------------------------
# Opportunities
# ---------------------------------------------------------------------------

def test_list_opportunities():
    response = client.get("/api/v1/opportunities/")
    assert response.status_code == 200
    data = response.json()
    assert isinstance(data, list)
    assert len(data) >= 1


def test_filter_opportunities_by_type():
    response = client.get("/api/v1/opportunities/?type=internship")
    assert response.status_code == 200
    data = response.json()
    assert all(item["type"] == "internship" for item in data)


def test_get_opportunity_by_id():
    response = client.get("/api/v1/opportunities/opportunity-research-internship")
    assert response.status_code == 200
    data = response.json()
    assert data["id"] == "opportunity-research-internship"
    assert data["type"] == "internship"


def test_get_opportunity_not_found():
    response = client.get("/api/v1/opportunities/non-existent-id")
    assert response.status_code == 404


# ---------------------------------------------------------------------------
# Research
# ---------------------------------------------------------------------------

def test_list_research_projects():
    response = client.get("/api/v1/research/projects")
    assert response.status_code == 200
    data = response.json()
    assert isinstance(data, list)
    assert len(data) >= 1
    assert "title" in data[0]


def test_list_research_publications():
    response = client.get("/api/v1/research/publications")
    assert response.status_code == 200
    data = response.json()
    assert isinstance(data, list)


def test_list_research_experts():
    response = client.get("/api/v1/research/experts")
    assert response.status_code == 200
    data = response.json()
    assert isinstance(data, list)
