from __future__ import annotations

import logging
from typing import Any

from fastapi import HTTPException
from sqlalchemy import select as sa_select
from sqlalchemy.orm import Session

logger = logging.getLogger(__name__)

from app.models.person import Person
from app.models.person import PersonStatus
from app.schemas.person import PersonCreate, PersonUpdate
from app.services.common import apply_ordering, apply_pagination, coerce_uuid
from app.services.response import ListResponseMixin


def _validate_enum(value: str | None, enum_cls: type, label: str) -> Any:
    if value is None:
        return None
    try:
        return enum_cls(value)
    except ValueError as exc:
        raise HTTPException(status_code=400, detail=f"Invalid {label}") from exc


class People(ListResponseMixin):
    @staticmethod
    def create(db: Session, payload: PersonCreate):
        person = Person(**payload.model_dump())
        db.add(person)
        db.flush()
        db.refresh(person)
        return person

    @staticmethod
    def get(db: Session, person_id: str):
        person = db.get(Person, coerce_uuid(person_id))
        if not person:
            raise HTTPException(status_code=404, detail="Person not found")
        return person

    @staticmethod
    def list(
        db: Session,
        email: str | None,
        status: str | None,
        is_active: bool | None,
        order_by: str,
        order_dir: str,
        limit: int,
        offset: int,
    ):
        stmt = sa_select(Person)
        if email:
            stmt = stmt.where(Person.email.ilike(f"%{email}%"))
        if status:
            stmt = stmt.where(
                Person.status == _validate_enum(status, PersonStatus, "status")
            )
        if is_active is not None:
            stmt = stmt.where(Person.is_active == is_active)
        stmt = apply_ordering(
            stmt,
            order_by,
            order_dir,
            {
                "created_at": Person.created_at,
                "last_name": Person.last_name,
                "email": Person.email,
            },
        )
        stmt = apply_pagination(stmt, limit, offset)
        return list(db.scalars(stmt).all())

    _UPDATABLE_FIELDS = {
        "first_name", "last_name", "display_name", "avatar_url", "bio",
        "email", "email_verified", "phone", "date_of_birth", "gender",
        "preferred_contact_method", "locale", "timezone",
        "address_line1", "address_line2", "city", "region",
        "postal_code", "country_code", "status", "is_active",
        "marketing_opt_in", "notes", "metadata_",
    }

    @staticmethod
    def update(db: Session, person_id: str, payload: PersonUpdate):
        person = db.get(Person, coerce_uuid(person_id))
        if not person:
            raise HTTPException(status_code=404, detail="Person not found")
        for key, value in payload.model_dump(exclude_unset=True).items():
            if key in People._UPDATABLE_FIELDS:
                setattr(person, key, value)
        db.flush()
        db.refresh(person)
        return person

    @staticmethod
    def delete(db: Session, person_id: str):
        person = db.get(Person, coerce_uuid(person_id))
        if not person:
            raise HTTPException(status_code=404, detail="Person not found")
        db.delete(person)
        db.flush()


people = People()
