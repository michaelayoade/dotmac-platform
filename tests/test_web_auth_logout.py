from __future__ import annotations

import re


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
