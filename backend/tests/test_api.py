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

def test_list_programmes_hides_drafts():
    response = client.get("/api/v1/programmes/")
    assert response.status_code == 200
    data = response.json()
    assert isinstance(data, list)
    # Seeded placeholder programmes are drafts until an admin publishes them.
    assert all(item["id"] != "programme-career-readiness" for item in data)


def test_filter_programmes_by_category():
    response = client.get("/api/v1/programmes/?category=student")
    assert response.status_code == 200
    assert all(item["category"] == "student" for item in response.json())


def test_draft_programme_not_found_publicly():
    assert client.get("/api/v1/programmes/programme-career-readiness").status_code == 404
    assert client.get("/api/v1/programmes/non-existent-id").status_code == 404


def test_list_opportunities_hides_drafts():
    response = client.get("/api/v1/opportunities/")
    assert response.status_code == 200
    assert all(item["id"] != "opportunity-research-internship" for item in response.json())


def test_filter_opportunities_by_type():
    response = client.get("/api/v1/opportunities/?type=internship")
    assert response.status_code == 200
    assert all(item["type"] == "internship" for item in response.json())


def test_draft_opportunity_not_found_publicly():
    assert client.get("/api/v1/opportunities/opportunity-research-internship").status_code == 404


def test_list_research_publications():
    response = client.get("/api/v1/research/publications")
    assert response.status_code == 200
    assert isinstance(response.json(), list)


def test_invented_research_endpoints_removed():
    assert client.get("/api/v1/research/experts").status_code == 404
    assert client.get("/api/v1/research/projects").status_code == 404


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

    # Uploaded documents must not be publicly readable.
    get_res = client.get(data["file_url"])
    assert get_res.status_code == 401

    # Verify an authenticated admin can download the document.
    from app.api.routes.uploads import admin_only

    app.dependency_overrides[admin_only] = lambda: {"role": "admin"}
    try:
        get_res = client.get(data["file_url"])
    finally:
        app.dependency_overrides.pop(admin_only, None)

    assert get_res.status_code == 200
    assert get_res.content == pdf_content
    assert "attachment" in get_res.headers.get("content-disposition", "")


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

    # New programmes start as drafts: hidden publicly, visible to admins
    assert all(p["id"] != prog_id for p in client.get("/api/v1/programmes/").json())
    drafts = client.get("/api/v1/admin/catalogue/programmes", headers=headers).json()
    assert any(p["id"] == prog_id and p["is_published"] is False for p in drafts)

    # Publish it, then it appears publicly
    pub = client.patch(f"/api/v1/admin/catalogue/programmes/{prog_id}", headers=headers, json={"is_published": True})
    assert pub.status_code == 200 and pub.json()["is_published"] is True
    assert any(p["id"] == prog_id for p in client.get("/api/v1/programmes/").json())
    assert client.get(f"/api/v1/programmes/{prog_id}").status_code == 200

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

    # Edits persist in the database
    upd = client.put(f"/api/v1/admin/opportunities/{opp_id}", headers=headers, json={"location": "Remote"})
    assert upd.json()["location"] == "Remote" and upd.json()["title"] == "Senior Econometrics Research Fellow"

    # Publications: create, validate https links, publish
    bad = client.post("/api/v1/admin/publications", headers=headers, json={"title": "Test brief", "url": "http://x.org"})
    assert bad.status_code == 422
    pub_res = client.post(
        "/api/v1/admin/publications",
        headers=headers,
        json={"title": "Test brief", "type": "policy_brief", "authors": ["Gmac Group"], "published_at": "2026-09-01", "url": "https://example.org/brief.pdf"},
    )
    assert pub_res.status_code == 201
    pub_id = pub_res.json()["id"]
    client.patch(f"/api/v1/admin/catalogue/publications/{pub_id}", headers=headers, json={"is_published": True})
    assert any(p["id"] == pub_id for p in client.get("/api/v1/research/publications").json())
    assert client.delete(f"/api/v1/admin/catalogue/publications/{pub_id}", headers=headers).status_code == 200

    # Non-admins cannot list drafts
    client.cookies.clear()
    assert client.get("/api/v1/admin/catalogue/programmes").status_code in (401, 403)

    # 5. Delete opportunity
    del_opp_res = client.delete(f"/api/v1/admin/opportunities/{opp_id}", headers=headers)
    assert del_opp_res.status_code == 200




def test_admin_gets_short_lived_signed_document_link():
    import asyncio

    from app.services.storage.service import storage_service

    pdf = b"%PDF-1.4\n%%EOF"
    up = client.post("/api/v1/uploads/document", files={"file": ("cv.pdf", pdf, "application/pdf")}).json()
    signed = asyncio.run(storage_service.signed_document_url(up["file_url"]))
    assert signed and signed.startswith("/api/v1/uploads/signed/")
    res = client.get(signed)
    assert res.status_code == 200 and res.content == pdf
    assert client.get("/api/v1/uploads/signed/not-a-token").status_code == 404
    # Links to anything that is not one of our stored documents are never signed
    assert asyncio.run(storage_service.signed_document_url("/etc/passwd")) is None
    assert asyncio.run(storage_service.signed_document_url("/api/v1/uploads/files/../../x")) is None


def test_cannot_self_register_as_admin():
    from app.core import ratelimit

    ratelimit._hits.clear()
    res = client.post(
        "/api/v1/auth/register",
        json={"email": "would-be-admin@example.com", "password": "longenough123", "role": "admin"},
    )
    assert res.status_code in (201, 400)
    login = client.post("/api/v1/auth/login", json={"email": "would-be-admin@example.com", "password": "longenough123"})
    token = login.json()["access_token"]
    me = client.get("/api/v1/auth/me", headers={"Authorization": f"Bearer {token}"}).json()
    assert me["role"] != "admin"
    assert client.get("/api/v1/admin/catalogue/programmes", headers={"Authorization": f"Bearer {token}"}).status_code == 403


def test_login_is_rate_limited():
    from app.core import ratelimit

    ratelimit._hits.clear()
    codes = [client.post("/api/v1/auth/login", json={"email": "nobody@example.com", "password": "wrongpass1"}).status_code for _ in range(11)]
    assert codes[-1] == 429
    ratelimit._hits.clear()



def test_session_cookie_login_logout_and_password_change():
    from app.core import ratelimit

    ratelimit._hits.clear()
    c = TestClient(app)
    email = "cookie-test@example.com"
    from app.core.database import SessionLocal as _S
    from app.models.user import User as _U

    with _S() as db:
        db.query(_U).filter(_U.email == email).delete()
        db.commit()
    c.post("/api/v1/auth/register", json={"email": email, "password": "firstpass123"})
    res = c.post("/api/v1/auth/login", json={"email": email, "password": "firstpass123"})
    cookie = res.headers.get("set-cookie", "")
    assert "gmac_session=" in cookie and "HttpOnly" in cookie
    assert c.get("/api/v1/auth/me").status_code == 200  # cookie alone is enough
    old_token = res.json()["access_token"]

    # A reset link works once, and changing the password ends old sessions
    from app.api.dependencies import create_password_reset_token
    from app.core.database import SessionLocal
    from app.models.user import User

    with SessionLocal() as db:
        user = db.query(User).filter(User.email == email).first()
        link = create_password_reset_token(email, user.password_hash)
    assert c.post("/api/v1/auth/reset-password", json={"token": link, "new_password": "secondpass123"}).status_code == 200
    assert c.post("/api/v1/auth/reset-password", json={"token": link, "new_password": "thirdpass123"}).status_code == 400
    assert c.get("/api/v1/auth/me", headers={"Authorization": f"Bearer {old_token}"}).status_code == 401

    # Sign out clears the cookie
    c.post("/api/v1/auth/login", json={"email": email, "password": "secondpass123"})
    assert c.post("/api/v1/auth/logout").status_code == 204
    c.cookies.clear()
    assert c.get("/api/v1/auth/me").status_code == 401
    ratelimit._hits.clear()


def test_reset_token_is_not_a_session():
    from app.api.dependencies import create_password_reset_token

    token = create_password_reset_token("someone@example.com")
    assert client.get("/api/v1/auth/me", headers={"Authorization": f"Bearer {token}"}).status_code == 401


def test_action_token_for_admins_only():
    from app.api.dependencies import create_action_token

    good = create_action_token({"id": "x", "role": "admin"}, "revalidate")
    bad = create_action_token({"id": "x", "role": "student"}, "revalidate")
    assert client.post("/api/v1/auth/action-token/verify", json={"token": good}).status_code == 200
    assert client.post("/api/v1/auth/action-token/verify", json={"token": bad}).status_code == 401
    assert client.post("/api/v1/auth/action-token/verify", json={"token": "nonsense"}).status_code == 401
