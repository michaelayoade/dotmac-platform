"""Organization Service — manage platform organizations (tenants)."""

from __future__ import annotations

import logging
from uuid import UUID

from sqlalchemy import func, or_, select
from sqlalchemy.orm import Session, object_session

from app.models.instance import Instance
from app.models.organization import Organization
from app.models.organization_member import OrganizationMember
from app.models.person import Person
from app.services.common import coerce_uuid

logger = logging.getLogger(__name__)


class OrganizationService:
    def __init__(self, db: Session):
        self.db = db

    def get_by_id(self, org_id: UUID) -> Organization | None:
        return self.db.get(Organization, org_id)

    def get_by_code(self, org_code: str) -> Organization | None:
        return self.db.scalar(select(Organization).where(Organization.org_code == org_code))

    def get_or_create(self, org_code: str, org_name: str) -> Organization:
        org_code = org_code.strip().upper()
        org = self.get_by_code(org_code)
        if org:
            if org_name and org.org_name != org_name:
                org.org_name = org_name
                self.db.flush()
            return org
        org = Organization(org_code=org_code, org_name=org_name, is_active=True)
        self.db.add(org)
        self.db.flush()
        return org

    def create(
        self,
        org_code: str,
        org_name: str,
        contact_email: str | None = None,
        contact_phone: str | None = None,
        notes: str | None = None,
    ) -> Organization:
        org_code = org_code.strip().upper()
        existing = self.get_by_code(org_code)
        if existing:
            raise ValueError(f"Organization with code '{org_code}' already exists")
        org = Organization(
            org_code=org_code,
            org_name=org_name,
            is_active=True,
            contact_email=contact_email or None,
            contact_phone=contact_phone or None,
            notes=notes or None,
        )
        self.db.add(org)
        self.db.flush()
        return org

    def update(self, org_id: UUID, payload: object) -> Organization:
        org = self.get_by_id(org_id)
        if not org:
            raise ValueError("Organization not found")
        data: dict[str, object] = payload.model_dump(exclude_unset=True)  # type: ignore[attr-defined]
        for key, value in data.items():
            if hasattr(org, key):
                setattr(org, key, value)
        self.db.flush()
        return org

    def list_for_web(
        self,
        q: str = "",
        is_active: bool | None = None,
        page: int = 1,
        page_size: int = 25,
    ) -> tuple[list[Organization], int]:
        """Search/filter/paginate organizations for the web list page."""
        stmt = select(Organization)
        count_stmt = select(func.count()).select_from(Organization)

        if q:
            pattern = f"%{q}%"
            filter_clause = or_(
                Organization.org_name.ilike(pattern),
                Organization.org_code.ilike(pattern),
                Organization.contact_email.ilike(pattern),
            )
            stmt = stmt.where(filter_clause)
            count_stmt = count_stmt.where(filter_clause)

        if is_active is not None:
            stmt = stmt.where(Organization.is_active == is_active)
            count_stmt = count_stmt.where(Organization.is_active == is_active)

        total: int = self.db.scalar(count_stmt) or 0
        offset = (page - 1) * page_size
        stmt = stmt.order_by(Organization.org_name).offset(offset).limit(page_size)
        items = list(self.db.scalars(stmt).all())
        return items, total

    def list_all(self, active_only: bool = True) -> list[Organization]:
        """Return all organizations — for dropdowns."""
        stmt = select(Organization).order_by(Organization.org_name)
        if active_only:
            stmt = stmt.where(Organization.is_active.is_(True))
        return list(self.db.scalars(stmt).all())

    def get_instances(self, org_id: UUID) -> list[Instance]:
        """Return instances belonging to an organization."""
        stmt = select(Instance).where(Instance.org_id == org_id).order_by(Instance.org_code)
        return list(self.db.scalars(stmt).all())

    def instance_counts_batch(self, org_ids: list[UUID]) -> dict[UUID, int]:
        """Count instances per org in a single query — avoids N+1."""
        if not org_ids:
            return {}
        stmt = select(Instance.org_id, func.count()).where(Instance.org_id.in_(org_ids)).group_by(Instance.org_id)
        return {row[0]: row[1] for row in self.db.execute(stmt).all()}

    def member_counts_batch(self, org_ids: list[UUID]) -> dict[UUID, int]:
        """Count active members per org in a single query — avoids N+1."""
        if not org_ids:
            return {}
        stmt = (
            select(OrganizationMember.org_id, func.count())
            .where(OrganizationMember.org_id.in_(org_ids))
            .where(OrganizationMember.is_active.is_(True))
            .group_by(OrganizationMember.org_id)
        )
        return {row[0]: row[1] for row in self.db.execute(stmt).all()}

    def list_members(self, org_id: UUID, limit: int = 50, offset: int = 0) -> list[OrganizationMember]:
        stmt = (
            select(OrganizationMember)
            .where(OrganizationMember.org_id == org_id)
            .order_by(OrganizationMember.created_at.desc())
            .limit(limit)
            .offset(offset)
        )
        return list(self.db.scalars(stmt).all())

    def add_member(self, org_id: UUID, person_id: UUID) -> OrganizationMember:
        org = self.get_by_id(org_id)
        if not org:
            raise ValueError("Organization not found")
        person = self.db.get(Person, coerce_uuid(str(person_id)))
        if not person:
            raise ValueError("Person not found")
        existing = self.db.scalar(
            select(OrganizationMember)
            .where(OrganizationMember.org_id == org_id)
            .where(OrganizationMember.person_id == person.id)
        )
        if existing:
            existing.is_active = True
            self.db.flush()
            return existing
        member = OrganizationMember(org_id=org_id, person_id=person.id, is_active=True)
        self.db.add(member)
        self.db.flush()
        return member

    def remove_member(self, org_id: UUID, person_id: UUID) -> None:
        member = self.db.scalar(
            select(OrganizationMember)
            .where(OrganizationMember.org_id == org_id)
            .where(OrganizationMember.person_id == coerce_uuid(str(person_id)))
        )
        if not member:
            raise ValueError("Membership not found")
        member.is_active = False
        self.db.flush()

    @staticmethod
    def serialize(org: Organization) -> dict[str, object]:
        db = object_session(org)
        instance_count = 0
        if db is not None:
            instance_count = (
                db.scalar(select(func.count(Instance.instance_id)).where(Instance.org_id == org.org_id)) or 0
            )
        return {
            "org_id": str(org.org_id),
            "org_code": org.org_code,
            "org_name": org.org_name,
            "is_active": org.is_active,
            "contact_email": org.contact_email,
            "contact_phone": org.contact_phone,
            "notes": org.notes,
            "instance_count": instance_count,
            "created_at": org.created_at.isoformat() if org.created_at else None,
            "updated_at": org.updated_at.isoformat() if org.updated_at else None,
        }

    @staticmethod
    def serialize_member(member: OrganizationMember) -> dict[str, object]:
        return {
            "org_id": str(member.org_id),
            "person_id": str(member.person_id),
            "is_active": member.is_active,
            "created_at": member.created_at.isoformat() if member.created_at else None,
        }
