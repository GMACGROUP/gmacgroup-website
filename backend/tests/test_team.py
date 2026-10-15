"""Tests for the team directory and its admin management."""

import io

from fastapi.testclient import TestClient

from app.api.routes.team import admin_only
from app.main import app

client = TestClient(app)

PNG_1PX = bytes.fromhex(
    "89504e470d0a1a0a0000000d4948445200000001000000010806000000"
    "1f15c4890000000d49444154789c6360000002000154a24f5d0000000049454e44ae426082"
)


def _as_admin():
    app.dependency_overrides[admin_only] = lambda: {"role": "admin"}


def _clear():
    app.dependency_overrides.pop(admin_only, None)


def test_public_team_lists_published_members_in_order():
    res = client.get("/api/v1/team")
    assert res.status_code == 200
    data = res.json()
    assert isinstance(data, list)
    orders = [m["sort_order"] for m in data]
    assert orders == sorted(orders)
    assert all("is_published" not in m for m in data)


def test_admin_routes_require_admin():
    _clear()
    assert client.get("/api/v1/admin/team").status_code in (401, 403)
    assert client.post("/api/v1/admin/team", json={}).status_code in (401, 403, 422)


def test_admin_crud_photo_and_visibility():
    _as_admin()
    try:
        res = client.post(
            "/api/v1/admin/team",
            json={"name": "  Test   Person ", "position": "Analyst", "country": "Ghana", "team": "Research"},
        )
        assert res.status_code == 201, res.text
        member = res.json()
        assert member["name"] == "Test Person"
        mid = member["id"]

        # invalid team rejected
        bad = client.patch(f"/api/v1/admin/team/{mid}", json={"team": "Marketing"})
        assert bad.status_code == 422

        # non LinkedIn link rejected
        bad = client.patch(f"/api/v1/admin/team/{mid}", json={"linkedin_url": "https://evil.example.com"})
        assert bad.status_code == 422

        # photo upload validates real image bytes
        fake = client.post(
            f"/api/v1/admin/team/{mid}/photo",
            files={"file": ("photo.png", io.BytesIO(b"<script>alert(1)</script>"), "image/png")},
        )
        assert fake.status_code == 400
        ok = client.post(
            f"/api/v1/admin/team/{mid}/photo",
            files={"file": ("photo.png", io.BytesIO(PNG_1PX), "image/png")},
        )
        assert ok.status_code == 200, ok.text
        url = ok.json()["photo_url"]
        assert url and url.endswith(".png")

        served = client.get(url.split("http://localhost:8000")[-1])
        assert served.status_code == 200
        assert served.headers["content-type"] == "image/png"

        # hide from public list
        client.patch(f"/api/v1/admin/team/{mid}", json={"is_published": False})
        assert mid not in [m["id"] for m in client.get("/api/v1/team").json()]

        assert client.delete(f"/api/v1/admin/team/{mid}").status_code == 204
        assert client.patch(f"/api/v1/admin/team/{mid}", json={"name": "x"}).status_code == 404
    finally:
        _clear()


def test_media_route_rejects_path_tricks():
    assert client.get("/api/v1/uploads/media/team/..%2F..%2Fetc%2Fpasswd").status_code == 404
    assert client.get("/api/v1/uploads/media/resumes/anything.png").status_code == 404
