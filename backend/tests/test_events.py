"""Tests for events listing and admin management."""

import io
from datetime import datetime, timedelta, timezone

from fastapi.testclient import TestClient

from app.api.routes.events import admin_only
from app.main import app

client = TestClient(app)
PNG = bytes.fromhex(
    "89504e470d0a1a0a0000000d4948445200000001000000010806000000"
    "1f15c4890000000d49444154789c6360000002000154a24f5d0000000049454e44ae426082"
)


def _admin(on=True):
    if on:
        app.dependency_overrides[admin_only] = lambda: {"role": "admin"}
    else:
        app.dependency_overrides.pop(admin_only, None)


def test_upcoming_and_past_are_split():
    now = datetime.now(timezone.utc)
    up = client.get("/api/v1/events?when=upcoming").json()
    past = client.get("/api/v1/events?when=past").json()
    for e in past:
        end = datetime.fromisoformat((e["end_at"] or e["start_at"]).replace("Z", "+00:00"))
        assert end < now
    for e in up:
        if e["start_at"]:
            end = datetime.fromisoformat((e["end_at"] or e["start_at"]).replace("Z", "+00:00"))
            assert end >= now
    starts = [e["start_at"] for e in past]
    assert starts == sorted(starts, reverse=True)


def test_drafts_hidden_and_admin_required():
    _admin(False)
    slugs = [e["slug"] for e in client.get("/api/v1/events").json()]
    assert "research-methods-workshop-2026" not in slugs
    assert client.get("/api/v1/admin/events").status_code in (401, 403)


def test_admin_event_lifecycle():
    _admin(True)
    try:
        start = datetime.now(timezone.utc) + timedelta(days=30)
        body = {
            "slug": "test-event-lifecycle",
            "title": "Test briefing",
            "summary": "A short test briefing for the events API.",
            "format": "online",
            "start_at": start.isoformat(),
            "end_at": (start + timedelta(hours=2)).isoformat(),
            "timezone": "Africa/Accra",
            "registration_url": "https://example.org/register",
        }
        r = client.post("/api/v1/admin/events", json=body)
        assert r.status_code == 201, r.text
        eid = r.json()["id"]

        assert client.post("/api/v1/admin/events", json=body).status_code == 409  # duplicate slug
        assert client.post("/api/v1/admin/events", json={**body, "slug": "x-bad", "timezone": "Mars/Base"}).status_code == 422
        assert client.post("/api/v1/admin/events", json={**body, "slug": "x-bad2", "registration_url": "http://plain"}).status_code == 422
        assert client.patch(f"/api/v1/admin/events/{eid}", json={"end_at": (start - timedelta(days=1)).isoformat()}).status_code == 422

        assert "test-event-lifecycle" in [e["slug"] for e in client.get("/api/v1/events?when=upcoming").json()]
        assert client.get("/api/v1/events/test-event-lifecycle").status_code == 200

        img = client.post(f"/api/v1/admin/events/{eid}/image", files={"file": ("f.png", io.BytesIO(PNG), "image/png")})
        assert img.status_code == 200 and img.json()["image_url"].endswith(".png")

        client.patch(f"/api/v1/admin/events/{eid}", json={"is_published": False})
        assert client.get("/api/v1/events/test-event-lifecycle").status_code == 404

        assert client.delete(f"/api/v1/admin/events/{eid}").status_code == 204
    finally:
        _admin(False)
