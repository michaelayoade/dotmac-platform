from __future__ import annotations

import logging
from datetime import UTC, datetime

from sqlalchemy import select
from sqlalchemy.orm import Session

from app.models.auth import Session as AuthSession
from app.models.auth import SessionStatus
from app.services.auth_flow import decode_access_token
from app.services.common import coerce_uuid

logger = logging.getLogger(__name__)


def list_for_person(db: Session, person_id: str) -> list[AuthSession]:
    """Return all active sessions for a person, newest first."""
    stmt = (
        select(AuthSession)
        .where(AuthSession.person_id == coerce_uuid(person_id))
        .where(AuthSession.status == SessionStatus.active)
        .where(AuthSession.revoked_at.is_(None))
        .order_by(AuthSession.created_at.desc())
    )
    return list(db.scalars(stmt).all())


def revoke_session(db: Session, person_id: str, session_id: str) -> datetime:
    """Revoke a single session owned by person_id. Returns revoked_at timestamp."""
    stmt = (
        select(AuthSession)
        .where(AuthSession.id == coerce_uuid(session_id))
        .where(AuthSession.person_id == coerce_uuid(person_id))
    )
    session = db.scalar(stmt)
    if not session:
        raise ValueError("Session not found")
    if session.status == SessionStatus.revoked:
        raise ValueError("Session already revoked")

    now = datetime.now(UTC)
    session.status = SessionStatus.revoked
    session.revoked_at = now
    db.flush()
    return now


def revoke_all_others(db: Session, person_id: str, current_session_id: str | None) -> tuple[datetime, int]:
    """Revoke all active sessions except the current one. Returns (revoked_at, count)."""
    current_uuid = coerce_uuid(current_session_id) if current_session_id else None

    stmt = (
        select(AuthSession)
        .where(AuthSession.person_id == coerce_uuid(person_id))
        .where(AuthSession.status == SessionStatus.active)
        .where(AuthSession.revoked_at.is_(None))
    )
    if current_uuid:
        stmt = stmt.where(AuthSession.id != current_uuid)

    sessions = list(db.scalars(stmt).all())
    now = datetime.now(UTC)
    for session in sessions:
        session.status = SessionStatus.revoked
        session.revoked_at = now
    db.flush()
    return now, len(sessions)


def revoke_by_access_token(db: Session, access_token: str) -> None:
    """Best-effort session revocation from an access token (used by web logout)."""
    try:
        payload = decode_access_token(db, access_token)
        session_id = payload.get("session_id")
        if not session_id:
            return
        session = db.get(AuthSession, coerce_uuid(session_id))
        if session and session.status == SessionStatus.active:
            session.status = SessionStatus.revoked
            db.flush()
    except Exception:
        logger.debug("Failed to revoke session from access token", exc_info=True)
