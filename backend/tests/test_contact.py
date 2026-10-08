"""Contact form: validation, honeypot and rate limiting."""

from fastapi.testclient import TestClient
from sqlalchemy import select

from app.core import ratelimit
from app.core.database import SessionLocal
from app.main import app
from app.models.contact import ContactRequest

client = TestClient(app)
BASE = {
    "name": "Ama Test",
    "email": "contact.test@example.com",
    "subject": "Scoping a labour market study",
    "message": "We would like to discuss a baseline study in two regions.",
    "topic": "institution",
    "consent": True,
}


def setup_function():
    ratelimit._hits.clear()


def _count(email):
    with SessionLocal() as db:
        return len(db.scalars(select(ContactRequest).where(ContactRequest.email == email)).all())


def test_valid_message_is_stored():
    before = _count(BASE["email"])
    res = client.post("/api/v1/contact/", json=BASE)
    assert res.status_code == 201
    assert _count(BASE["email"]) == before + 1


def test_consent_and_lengths_are_required():
    assert client.post("/api/v1/contact/", json={**BASE, "consent": False}).status_code == 422
    assert client.post("/api/v1/contact/", json={**BASE, "message": "hi"}).status_code == 422


def test_unknown_topic_falls_back_to_other():
    res = client.post("/api/v1/contact/", json={**BASE, "topic": "not-a-topic"})
    assert res.status_code == 201
    with SessionLocal() as db:
        row = db.get(ContactRequest, res.json()["id"])
        assert row.topic == "other"


def test_honeypot_pretends_success_but_stores_nothing():
    email = "bot.test@example.com"
    before = _count(email)
    res = client.post("/api/v1/contact/", json={**BASE, "email": email, "website": "http://spam"})
    assert res.status_code == 201
    assert _count(email) == before


def test_rate_limit_after_five_messages():
    codes = [client.post("/api/v1/contact/", json={**BASE, "email": "rate.test@example.com"}).status_code for _ in range(6)]
    assert codes[:5] == [201] * 5
    assert codes[5] == 429


def teardown_module():
    ratelimit._hits.clear()
    with SessionLocal() as db:
        for row in db.scalars(select(ContactRequest).where(ContactRequest.email.like("%.test@example.com"))).all():
            db.delete(row)
        db.commit()
