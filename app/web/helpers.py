"""
Shared web helpers — brand context, template context builder, and CSRF protection.
"""

from __future__ import annotations

import hashlib
import hmac
import logging
import os
import secrets
import time

from fastapi import HTTPException, Request

from app.config import settings

logger = logging.getLogger(__name__)


CSRF_COOKIE_NAME = "csrf_session"


def _csrf_session_id(request: Request) -> str:
    """Return a per-client binding for CSRF tokens.

    Uses the access_token cookie when present (authenticated users).
    For anonymous visitors, derives a binding from client IP + User-Agent.
    """
    token = request.cookies.get("access_token")
    if token:
        return token
    csrf_session = request.cookies.get(CSRF_COOKIE_NAME)
    if csrf_session:
        return csrf_session
    csrf_session = getattr(request.state, "csrf_session", None)
    if csrf_session:
        return csrf_session
    return "anonymous"


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
        "testing": settings.testing,
        "use_cdn_assets": settings.use_cdn_assets,
        **extra,
    }


# ---------------------------------------------------------------------------
# CSRF protection
# ---------------------------------------------------------------------------

_csrf_env = os.getenv("CSRF_SECRET_KEY")
if not _csrf_env:
    logger.warning("CSRF_SECRET_KEY not set — using random key (tokens won't survive restarts)")
_CSRF_SECRET_KEY = bytes.fromhex(_csrf_env) if _csrf_env else secrets.token_bytes(32)
_CSRF_TOKEN_TTL = 3600 * 4  # 4 hours


def generate_csrf_token(request: Request) -> str:
    """Generate a CSRF token tied to the session cookie."""
    session_id = _csrf_session_id(request)
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

    session_id = _csrf_session_id(request)
    payload = f"{session_id}:{timestamp_str}"
    expected_sig = hmac.new(_CSRF_SECRET_KEY, payload.encode(), hashlib.sha256).hexdigest()

    if not hmac.compare_digest(provided_sig, expected_sig):
        raise HTTPException(status_code=403, detail="Invalid CSRF token")


def require_admin(auth) -> None:
    """Raise 403 if the authenticated user is not an admin."""
    if not auth or not getattr(auth, "is_admin", False):
        raise HTTPException(status_code=403, detail="Admin access required")
