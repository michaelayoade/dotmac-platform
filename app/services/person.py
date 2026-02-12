from __future__ import annotations

import logging
import uuid
from typing import Any

from fastapi import HTTPException
from sqlalchemy import func
from sqlalchemy import select as sa_select
from sqlalchemy.orm import Session

logger = logging.getLogger(__name__)

from app.models.person import Person, PersonStatus
from app.models.rbac import PersonRole, Role
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
        data = payload.model_dump()
        org_id = data.pop("org_id", None)
        person = Person(**data)
        db.add(person)
        db.flush()
        db.refresh(person)
        if org_id:
            from app.models.organization_member import OrganizationMember

            db.add(OrganizationMember(org_id=coerce_uuid(org_id), person_id=person.id, is_active=True))
            db.flush()
        if not org_id:
            logger.warning("Person %s created without org membership", person.id)
        return person

    @staticmethod
    def get(db: Session, person_id: str, org_id: str | None = None):
        person = db.get(Person, coerce_uuid(person_id))
        if not person:
            raise HTTPException(status_code=404, detail="Person not found")
        if org_id and not _has_org_access(db, person.id, org_id):
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
        org_id: str | None = None,
    ):
        stmt = sa_select(Person)
        if org_id:
            from app.models.organization_member import OrganizationMember

            stmt = stmt.join(OrganizationMember, OrganizationMember.person_id == Person.id).where(
                OrganizationMember.org_id == coerce_uuid(org_id),
                OrganizationMember.is_active.is_(True),
            )
        if email:
            stmt = stmt.where(Person.email.ilike(f"%{email}%"))
        if status:
            stmt = stmt.where(Person.status == _validate_enum(status, PersonStatus, "status"))
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

    @staticmethod
    def list_for_web(
        db: Session,
        q: str,
        status: str | None,
        is_active: bool | None,
        page: int,
        page_size: int,
        org_id: str | None = None,
    ) -> tuple[list[Person], int, dict]:
        q = (q or "").strip()
        q_like = f"%{q}%" if q else None
        stmt = sa_select(Person)
        if org_id:
            from app.models.organization_member import OrganizationMember

            stmt = stmt.join(OrganizationMember, OrganizationMember.person_id == Person.id).where(
                OrganizationMember.org_id == coerce_uuid(org_id),
                OrganizationMember.is_active.is_(True),
            )
        if q_like:
            stmt = stmt.where(
                (Person.email.ilike(q_like))
                | (Person.first_name.ilike(q_like))
                | (Person.last_name.ilike(q_like))
                | (Person.display_name.ilike(q_like))
            )
        if status:
            try:
                stmt = stmt.where(Person.status == PersonStatus(status))
            except ValueError:
                pass
        if is_active is not None:
            stmt = stmt.where(Person.is_active == is_active)

        offset = (page - 1) * page_size
        stmt = stmt.order_by(Person.created_at.desc()).limit(page_size).offset(offset)
        items = list(db.scalars(stmt).all())

        total_stmt = sa_select(func.count(Person.id))
        if org_id:
            from app.models.organization_member import OrganizationMember

            total_stmt = total_stmt.join(OrganizationMember, OrganizationMember.person_id == Person.id).where(
                OrganizationMember.org_id == coerce_uuid(org_id),
                OrganizationMember.is_active.is_(True),
            )
        if q_like:
            total_stmt = total_stmt.where(
                (Person.email.ilike(q_like))
                | (Person.first_name.ilike(q_like))
                | (Person.last_name.ilike(q_like))
                | (Person.display_name.ilike(q_like))
            )
        if status:
            try:
                total_stmt = total_stmt.where(Person.status == PersonStatus(status))
            except ValueError:
                pass
        if is_active is not None:
            total_stmt = total_stmt.where(Person.is_active == is_active)
        total = db.scalar(total_stmt) or 0

        person_ids = [p.id for p in items]
        roles_map: dict = {pid: [] for pid in person_ids}
        if person_ids:
            roles_stmt = (
                sa_select(PersonRole.person_id, Role.name)
                .join(Role, Role.id == PersonRole.role_id)
                .where(PersonRole.person_id.in_(person_ids))
            )
            rows = db.execute(roles_stmt).all()
            for person_id, role_name in rows:
                roles_map.setdefault(person_id, []).append(role_name)

        return items, total, roles_map

    _UPDATABLE_FIELDS = {
        "first_name",
        "last_name",
        "display_name",
        "avatar_url",
        "bio",
        "email",
        "email_verified",
        "phone",
        "date_of_birth",
        "gender",
        "preferred_contact_method",
        "locale",
        "timezone",
        "address_line1",
        "address_line2",
        "city",
        "region",
        "postal_code",
        "country_code",
        "status",
        "is_active",
        "marketing_opt_in",
        "notes",
        "metadata_",
    }

    @staticmethod
    def update(db: Session, person_id: str, payload: PersonUpdate, org_id: str | None = None):
        person = db.get(Person, coerce_uuid(person_id))
        if not person:
            raise HTTPException(status_code=404, detail="Person not found")
        if org_id and not _has_org_access(db, person.id, org_id):
            raise HTTPException(status_code=404, detail="Person not found")
        for key, value in payload.model_dump(exclude_unset=True).items():
            if key in People._UPDATABLE_FIELDS:
                setattr(person, key, value)
        db.flush()
        db.refresh(person)
        return person

    @staticmethod
    def delete(db: Session, person_id: str, org_id: str | None = None):
        person = db.get(Person, coerce_uuid(person_id))
        if not person:
            raise HTTPException(status_code=404, detail="Person not found")
        if org_id and not _has_org_access(db, person.id, org_id):
            raise HTTPException(status_code=404, detail="Person not found")
        db.delete(person)
        db.flush()


people = People()


def _has_org_access(db: Session, person_id: uuid.UUID, org_id: str) -> bool:
    from app.models.organization_member import OrganizationMember

    stmt = (
        sa_select(OrganizationMember)
        .where(OrganizationMember.person_id == person_id)
        .where(OrganizationMember.org_id == coerce_uuid(org_id))
        .where(OrganizationMember.is_active.is_(True))
    )
    return db.scalar(stmt) is not None
