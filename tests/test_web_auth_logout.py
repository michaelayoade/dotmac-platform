from __future__ import annotations

import re
import uuid

from starlette.requests import Request

from app.models.auth import AuthProvider, UserCredential
from app.services.auth_flow import AuthFlow, hash_password


def _extract_csrf_token(html: str) -> str:
    match = re.search(r'name="csrf_token"\s+value="([^"]+)"', html)
    assert match, "csrf_token hidden input not found"
    return match.group(1)


def test_logout_allows_expired_csrf(client, auth_token, monkeypatch):
    from app.web import helpers as web_helpers

    client.cookies.set("access_token", auth_token)
    client.cookies.set("refresh_token", "dummy-refresh")

    page = client.get("/dashboard")
    assert page.status_code == 200
    csrf_token = _extract_csrf_token(page.text)

    # Force previously-rendered token to be treated as expired.
    monkeypatch.setattr(web_helpers, "_CSRF_TOKEN_TTL", -1)

    response = client.post("/logout", data={"csrf_token": csrf_token}, follow_redirects=False)

    assert response.status_code == 302
    assert response.headers.get("location") == "/login"
    assert "access_token" not in client.cookies
    assert "refresh_token" not in client.cookies


def test_logout_rejects_invalid_csrf(client, auth_token):
    client.cookies.set("access_token", auth_token)

    response = client.post("/logout", data={"csrf_token": "invalid-token"}, follow_redirects=False)

    assert response.status_code == 403


def test_dashboard_uses_refresh_cookie_when_access_token_is_missing(client, db_session, person, person_org_code):
    username = f"refresh-web-{uuid.uuid4().hex[:8]}@example.com"
    credential = UserCredential(
        person_id=person.id,
        provider=AuthProvider.local,
        username=username,
        password_hash=hash_password("secret123"),
        is_active=True,
    )
    db_session.add(credential)
    db_session.commit()

    request = Request(
        {
            "type": "http",
            "method": "POST",
            "path": "/auth/login",
            "headers": [],
            "client": ("127.0.0.1", 12345),
        }
    )
    tokens = AuthFlow.login(db_session, username, "secret123", request, None, person_org_code)

    client.cookies.set("access_token", "expired-or-invalid")
    client.cookies.set("refresh_token", tokens["refresh_token"])
    response = client.get("/dashboard", follow_redirects=False)

    assert response.status_code == 200
