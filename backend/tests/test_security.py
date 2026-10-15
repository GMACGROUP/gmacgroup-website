"""Cross-site request guard, security headers and error alerts."""

from fastapi.testclient import TestClient

from app.main import app


def _boom():
    raise RuntimeError("test failure")


app.add_api_route("/__test_boom", _boom, methods=["GET"])


def test_security_headers_present():
    res = TestClient(app).get("/health")
    assert res.headers["x-content-type-options"] == "nosniff"
    assert res.headers["x-frame-options"] == "DENY"


def test_cookie_request_from_unknown_origin_is_blocked():
    c = TestClient(app)
    c.cookies.set("gmac_session", "anything")
    res = c.post("/api/v1/auth/logout", headers={"Origin": "https://evil.example"})
    assert res.status_code == 403
    ok = c.post("/api/v1/auth/logout", headers={"Origin": "http://localhost:3000"})
    assert ok.status_code == 204


def test_unhandled_error_returns_clean_500_and_alerts(monkeypatch):
    from app.services.notifications import notification_service

    sent = []

    def capture(coro):
        sent.append(coro)
        coro.close()

    monkeypatch.setattr(notification_service, "fire_and_forget", capture)
    c = TestClient(app, raise_server_exceptions=False)
    res = c.get("/__test_boom")
    assert res.status_code == 500
    assert "test failure" not in res.text
    c.get("/__test_boom")
    assert len(sent) == 1  # throttled to one alert per hour per error


def test_payment_webhook_requires_shared_secret(monkeypatch):
    from app.api.routes import payments

    c = TestClient(app)
    monkeypatch.setattr(payments.settings, "FLW_WEBHOOK_SECRET_HASH", "")
    assert c.post("/api/v1/payments/webhook", json={"data": {}}).status_code == 503
    monkeypatch.setattr(payments.settings, "FLW_WEBHOOK_SECRET_HASH", "s3cret")
    assert c.post("/api/v1/payments/webhook", json={"data": {}}, headers={"verif-hash": "wrong"}).status_code == 401
    assert c.post("/api/v1/payments/webhook", json={"data": {}}, headers={"verif-hash": "s3cret"}).status_code == 200


def test_application_rejects_unsafe_links():
    from app.schemas.opportunity import ApplicationCreate
    import pytest

    with pytest.raises(Exception):
        ApplicationCreate(resume_url="javascript:alert(1)")
    with pytest.raises(Exception):
        ApplicationCreate(linkedin_url="http://linkedin.com/in/x")
    assert ApplicationCreate(resume_url="/api/v1/uploads/files/abc/cv.pdf?folder=resumes").resume_url
