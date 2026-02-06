"""
Web authentication dependencies for platform routes.

Uses cookie-based JWT auth with the starter's existing auth system.
"""
from __future__ import annotations

from fastapi import Depends, HTTPException, Request
from sqlalchemy.orm import Session

from app.db import SessionLocal
from app.models.auth import Session as AuthSession, SessionStatus
from app.models.person import Person
from app.services.auth_flow import decode_access_token
from app.services.common import coerce_uuid


def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()


class WebAuthContext:
    """Authentication context for web routes."""

    def __init__(
        self,
        is_authenticated: bool = False,
        person_id: str | None = None,
        user_name: str = "Guest",
        user_initials: str = "G",
        roles: list[str] | None = None,
    ):
        self.is_authenticated = is_authenticated
        self.person_id = person_id
        self.user_name = user_name
        self.user_initials = user_initials
        self.roles = roles or []

    @property
    def is_admin(self) -> bool:
        return "admin" in self.roles


def _extract_token(request: Request) -> str | None:
    """Extract JWT from cookie or Authorization header."""
    # Check cookie first
    token = request.cookies.get("access_token")
    if token:
        return token

    # Fall back to Authorization header
    auth_header = request.headers.get("Authorization")
    if auth_header and auth_header.startswith("Bearer "):
        return auth_header[7:]

    return None


def require_web_auth(
    request: Request,
    db: Session = Depends(get_db),
) -> WebAuthContext:
    """Require authentication for web routes. Redirects to login if not authenticated."""
    token = _extract_token(request)
    if not token:
        raise HTTPException(status_code=302, headers={"Location": "/login"})

    try:
        from datetime import datetime, timezone

        payload = decode_access_token(db, token)
        person_id = payload.get("sub")
        session_id = payload.get("session_id")

        if not person_id or not session_id:
            raise HTTPException(status_code=302, headers={"Location": "/login"})

        # Validate session
        now = datetime.now(timezone.utc)
        session = db.get(AuthSession, coerce_uuid(session_id))
        if not session or session.status != SessionStatus.active:
            raise HTTPException(status_code=302, headers={"Location": "/login"})
        if session.expires_at and session.expires_at <= now:
            raise HTTPException(status_code=302, headers={"Location": "/login"})

        person = db.get(Person, coerce_uuid(person_id))
        if not person:
            raise HTTPException(status_code=302, headers={"Location": "/login"})

        name = person.display_name or f"{person.first_name} {person.last_name}"
        first_initial = person.first_name[0] if person.first_name else ""
        last_initial = person.last_name[0] if person.last_name else ""
        initials = (first_initial + last_initial).upper() or "?"

        roles = payload.get("roles", [])

        return WebAuthContext(
            is_authenticated=True,
            person_id=person_id,
            user_name=name,
            user_initials=initials,
            roles=roles,
        )
    except HTTPException:
        raise
    except Exception:
        raise HTTPException(status_code=302, headers={"Location": "/login"})


def optional_web_auth(
    request: Request,
    db: Session = Depends(get_db),
) -> WebAuthContext:
    """Optional auth — returns unauthenticated context if no valid token."""
    token = _extract_token(request)
    if not token:
        return WebAuthContext()

    try:
        payload = decode_access_token(db, token)
        person_id = payload.get("sub")
        session_id = payload.get("session_id")

        if not person_id or not session_id:
            return WebAuthContext()

        # Validate session is still active (matches require_web_auth behaviour)
        session = db.get(AuthSession, coerce_uuid(session_id))
        if not session or session.status != SessionStatus.active:
            return WebAuthContext()

        person = db.get(Person, coerce_uuid(person_id))
        if not person:
            return WebAuthContext()

        name = person.display_name or f"{person.first_name} {person.last_name}"
        first_initial = person.first_name[0] if person.first_name else ""
        last_initial = person.last_name[0] if person.last_name else ""
        initials = (first_initial + last_initial).upper() or "?"

        return WebAuthContext(
            is_authenticated=True,
            person_id=person_id,
            user_name=name,
            user_initials=initials,
            roles=payload.get("roles", []),
        )
    except Exception:
        return WebAuthContext()
