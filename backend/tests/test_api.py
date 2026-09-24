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


# ---------------------------------------------------------------------------
# Document Uploads
# ---------------------------------------------------------------------------

def test_upload_valid_pdf_document():
    # Valid PDF header
    pdf_content = b"%PDF-1.4\n1 0 obj\n<<\n>>\nendobj\ntrailer\n<<\n>>\n%%EOF"
    response = client.post(
        "/api/v1/uploads/document",
        files={"file": ("kwame_mensah_resume.pdf", pdf_content, "application/pdf")},
    )
    assert response.status_code == 201
    data = response.json()
    assert "file_url" in data
    assert "file_id" in data
    assert data["content_type"] == "application/pdf"
    assert data["filename"] == "kwame_mensah_resume.pdf"
    assert data["size_bytes"] == len(pdf_content)

    # Test downloading / viewing the file
    get_res = client.get(data["file_url"])
    assert get_res.status_code == 200
    assert get_res.content == pdf_content
    assert "inline" in get_res.headers.get("content-disposition", "")


def test_upload_invalid_file_type():
    invalid_content = b"echo 'malicious script'"
    response = client.post(
        "/api/v1/uploads/document",
        files={"file": ("malicious.sh", invalid_content, "application/x-sh")},
    )
    assert response.status_code == 400
    assert "Unsupported file format" in response.json()["detail"]


def test_upload_empty_file():
    response = client.post(
        "/api/v1/uploads/document",
        files={"file": ("empty.pdf", b"", "application/pdf")},
    )
    assert response.status_code == 400
    assert "empty" in response.json()["detail"].lower()


# ---------------------------------------------------------------------------
# Password Reset Flow (Option B)
# ---------------------------------------------------------------------------

from app.api.dependencies import create_password_reset_token


def test_forgot_and_reset_password_flow():
    # 1. Register a test user
    email = "reset_test@gmacgroup.org"
    reg_res = client.post(
        "/api/v1/auth/register",
        json={"email": email, "password": "initialpassword123", "full_name": "Reset Test User", "role": "student"},
    )
    assert reg_res.status_code in (201, 400)

    # 2. Request forgot password
    forgot_res = client.post(
        "/api/v1/auth/forgot-password",
        json={"email": email},
    )
    assert forgot_res.status_code == 200
    assert "sent" in forgot_res.json()["message"]

    # 3. Generate token for verification
    reset_token = create_password_reset_token(email)

    # 4. Reset password with token
    new_password = "newsecretpassword456"
    reset_res = client.post(
        "/api/v1/auth/reset-password",
        json={"token": reset_token, "new_password": new_password},
    )
    assert reset_res.status_code == 200
    assert reset_res.json()["status"] == "success"

    # 5. Verify sign in with new password
    login_res = client.post(
        "/api/v1/auth/login",
        json={"email": email, "password": new_password},
    )
    assert login_res.status_code == 200
    assert "access_token" in login_res.json()


def test_reset_password_invalid_token():
    res = client.post(
        "/api/v1/auth/reset-password",
        json={"token": "invalid.jwt.token", "new_password": "password123"},
    )
    assert res.status_code == 400


def test_notifications_are_dispatched_without_blocking_the_request(monkeypatch):
    import asyncio
    import time

    from app.services.notifications import notification_service

    async def slow_email(*args, **kwargs):
        await asyncio.sleep(0.35)

    start = time.perf_counter()
    notification_service.fire_and_forget(slow_email())
    elapsed = time.perf_counter() - start

    assert elapsed < 0.2, f"Notification dispatch blocked the request thread: {elapsed:.3f}s"


# ---------------------------------------------------------------------------
# Admin Dynamic Catalog Management (Option C)
# ---------------------------------------------------------------------------

def test_admin_programme_and_opportunity_crud():
    from app.core.database import SessionLocal
    from app.models.user import User

    # Register/login an admin user
    admin_email = "superadmin@gmacgroup.org"
    client.post(
        "/api/v1/auth/register",
        json={"email": admin_email, "password": "password123", "full_name": "Super Admin"},
    )
    # Elevate user to admin in DB for testing admin routes
    with SessionLocal() as db:
        user = db.query(User).filter(User.email == admin_email).first()
        if user:
            user.role = "admin"
            db.commit()

    login_res = client.post(
        "/api/v1/auth/login",
        json={"email": admin_email, "password": "password123"},
    )
    admin_token = login_res.json()["access_token"]
    headers = {"Authorization": f"Bearer {admin_token}"}


    # 1. Create a programme
    prog_res = client.post(
        "/api/v1/admin/programmes",
        headers=headers,
        json={
            "title": "AI in Evidence & Policy Analysis",
            "category": "training",
            "description": "Executive masterclass on using AI tools for econometric and policy synthesis.",
            "offers": [
                {"type": "free", "label": "Free Audit", "amount": 0, "currency": "GHS"},
                {"type": "vip", "label": "VIP Certificate", "amount": 450, "currency": "GHS"},
            ],
        },
    )
    assert prog_res.status_code == 201
    created_prog = prog_res.json()
    prog_id = created_prog["id"]
    assert "AI in Evidence" in created_prog["title"]

    # Verify programme appears in public list
    list_res = client.get("/api/v1/programmes/")
    assert any(p["id"] == prog_id for p in list_res.json())

    # 2. Update programme
    update_res = client.put(
        f"/api/v1/admin/programmes/{prog_id}",
        headers=headers,
        json={"title": "AI in Evidence & Policy Analysis (Updated Edition)"},
    )
    assert update_res.status_code == 200
    assert "Updated Edition" in update_res.json()["title"]

    # 3. Delete programme
    del_res = client.delete(f"/api/v1/admin/programmes/{prog_id}", headers=headers)
    assert del_res.status_code == 200
    assert del_res.json()["status"] == "deleted"

    # 4. Create an opportunity
    opp_res = client.post(
        "/api/v1/admin/opportunities",
        headers=headers,
        json={
            "title": "Senior Econometrics Research Fellow",
            "type": "fellowship",
            "organization": "GMAC Applied Policy Lab",
            "location": "Accra / Remote",
            "description": "Lead applied labor transition modeling.",
            "offers": [{"type": "free", "label": "Standard", "amount": 0, "currency": "GHS"}],
        },
    )
    assert opp_res.status_code == 201
    created_opp = opp_res.json()
    opp_id = created_opp["id"]

    # 5. Delete opportunity
    del_opp_res = client.delete(f"/api/v1/admin/opportunities/{opp_id}", headers=headers)
    assert del_opp_res.status_code == 200


