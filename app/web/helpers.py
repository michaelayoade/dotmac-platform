"""
Shared web helpers — brand context, template context builder, and CSRF protection.
"""
from __future__ import annotations

import hashlib
import hmac
import secrets
import time

from fastapi import HTTPException, Request

from app.config import settings


def brand() -> dict:
    """Build brand context dict for templates."""
    name = settings.brand_name
    parts = [p for p in name.split() if p]
    if len(parts) >= 2:
        mark = (parts[0][0] + parts[1][0]).upper()
    elif parts:
        mark = parts[0][:2].upper()
    else:
        mark = "DP"
    return {
        "name": name,
        "tagline": settings.brand_tagline,
        "logo_url": settings.brand_logo_url,
        "mark": mark,
    }


def ctx(request, auth, title: str, active_page: str = "", **extra) -> dict:
    """Build standard template context."""
    return {
        "request": request,
        "title": title,
        "brand": brand(),
        "auth": auth,
        "active_page": active_page,
        "csrf_token": generate_csrf_token(request),
        **extra,
    }


# ---------------------------------------------------------------------------
# CSRF protection
# ---------------------------------------------------------------------------

_CSRF_SECRET_KEY = secrets.token_bytes(32)
_CSRF_TOKEN_TTL = 3600 * 4  # 4 hours


def generate_csrf_token(request: Request) -> str:
    """Generate a CSRF token tied to the session cookie."""
    session_id = request.cookies.get("access_token", "anonymous")
    timestamp = str(int(time.time()))
    payload = f"{session_id}:{timestamp}"
    sig = hmac.new(_CSRF_SECRET_KEY, payload.encode(), hashlib.sha256).hexdigest()
    return f"{timestamp}:{sig}"


def validate_csrf_token(request: Request, token: str | None) -> None:
    """Validate a CSRF token. Raises HTTPException(403) on failure."""
    if not token:
        raise HTTPException(status_code=403, detail="Missing CSRF token")

    parts = token.split(":", 1)
    if len(parts) != 2:
        raise HTTPException(status_code=403, detail="Invalid CSRF token")

    timestamp_str, provided_sig = parts
    try:
        timestamp = int(timestamp_str)
    except ValueError:
        raise HTTPException(status_code=403, detail="Invalid CSRF token")

    if time.time() - timestamp > _CSRF_TOKEN_TTL:
        raise HTTPException(status_code=403, detail="CSRF token expired")

    session_id = request.cookies.get("access_token", "anonymous")
    payload = f"{session_id}:{timestamp_str}"
    expected_sig = hmac.new(_CSRF_SECRET_KEY, payload.encode(), hashlib.sha256).hexdigest()

    if not hmac.compare_digest(provided_sig, expected_sig):
        raise HTTPException(status_code=403, detail="Invalid CSRF token")


def require_admin(auth) -> None:
    """Raise 403 if the authenticated user is not an admin."""
    if not auth or not getattr(auth, "is_admin", False):
        raise HTTPException(status_code=403, detail="Admin access required")
