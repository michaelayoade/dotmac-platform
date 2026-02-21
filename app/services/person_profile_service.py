from __future__ import annotations

import logging
from datetime import UTC, datetime

from fastapi import UploadFile
from sqlalchemy import select
from sqlalchemy.orm import Session

from app.models.auth import UserCredential
from app.models.person import Person
from app.services import avatar as avatar_service
from app.services.auth_flow import hash_password, revoke_sessions_for_person, verify_password
from app.services.common import coerce_uuid

logger = logging.getLogger(__name__)

_ME_UPDATABLE_FIELDS = {
    "first_name",
    "last_name",
    "display_name",
    "phone",
    "date_of_birth",
    "gender",
    "preferred_contact_method",
    "locale",
    "timezone",
}


def _get_person_or_raise(db: Session, person_id: str) -> Person:
    person = db.get(Person, coerce_uuid(person_id))
    if not person:
        raise ValueError("User not found")
    return person


def get_profile(db: Session, person_id: str) -> Person:
    """Fetch a person by ID or raise ValueError."""
    return _get_person_or_raise(db, person_id)


def update_profile(db: Session, person_id: str, fields: dict[str, object]) -> Person:
    """Update allowed profile fields for a person. Returns the refreshed person."""
    person = _get_person_or_raise(db, person_id)
    for field, value in fields.items():
        if field in _ME_UPDATABLE_FIELDS:
            setattr(person, field, value)
    db.flush()
    db.refresh(person)
    return person


async def upload_avatar(db: Session, person_id: str, file: UploadFile) -> str:
    """Delete old avatar, save new one, update person record. Returns new avatar URL."""
    person = _get_person_or_raise(db, person_id)
    avatar_service.delete_avatar(person.avatar_url)
    avatar_url = await avatar_service.save_avatar(file, str(person.id))
    person.avatar_url = avatar_url
    db.flush()
    return avatar_url


def delete_avatar(db: Session, person_id: str) -> None:
    """Delete avatar file and clear the person's avatar_url."""
    person = _get_person_or_raise(db, person_id)
    avatar_service.delete_avatar(person.avatar_url)
    person.avatar_url = None
    db.flush()


def change_password(db: Session, person_id: str, current_password: str, new_password: str) -> datetime:
    """Verify current password, set new one, revoke all sessions. Returns changed_at timestamp."""
    stmt = (
        select(UserCredential)
        .where(UserCredential.person_id == coerce_uuid(person_id))
        .where(UserCredential.is_active.is_(True))
    )
    credential = db.scalar(stmt)
    if not credential:
        raise ValueError("No credentials found")

    if not verify_password(current_password, credential.password_hash):
        raise ValueError("Current password is incorrect")

    if current_password == new_password:
        raise ValueError("New password must be different")

    now = datetime.now(UTC)
    credential.password_hash = hash_password(new_password)
    credential.password_updated_at = now
    credential.must_change_password = False
    revoke_sessions_for_person(db, person_id)
    db.flush()
    return now
