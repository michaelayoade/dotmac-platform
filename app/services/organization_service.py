"""Organization Service — manage platform organizations (tenants)."""

from __future__ import annotations

import logging
from uuid import UUID

from sqlalchemy import func, select
from sqlalchemy.orm import Session

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

    @staticmethod
    def _member_counts_subquery():
        return (
            select(
                OrganizationMember.org_id.label("org_id"),
                func.count(OrganizationMember.person_id).label("member_count"),
            )
            .where(OrganizationMember.is_active.is_(True))
            .group_by(OrganizationMember.org_id)
            .subquery()
        )

    def get_by_id_with_member_count(self, org_id: UUID) -> tuple[Organization, int] | None:
        member_counts_sq = self._member_counts_subquery()
        stmt = (
            select(
                Organization,
                func.coalesce(member_counts_sq.c.member_count, 0).label("member_count"),
            )
            .outerjoin(member_counts_sq, member_counts_sq.c.org_id == Organization.org_id)
            .where(Organization.org_id == org_id)
        )
        row = self.db.execute(stmt).one_or_none()
        if row is None:
            return None
        org, member_count = row
        return org, int(member_count)

    def list_with_member_counts(
        self,
        *,
        limit: int = 50,
        offset: int = 0,
        org_id: UUID | None = None,
    ) -> list[tuple[Organization, int]]:
        member_counts_sq = self._member_counts_subquery()
        stmt = (
            select(
                Organization,
                func.coalesce(member_counts_sq.c.member_count, 0).label("member_count"),
            )
            .outerjoin(member_counts_sq, member_counts_sq.c.org_id == Organization.org_id)
            .order_by(Organization.created_at.desc())
            .limit(limit)
            .offset(offset)
        )
        if org_id is not None:
            stmt = stmt.where(Organization.org_id == org_id)
        rows = self.db.execute(stmt).all()
        return [(org, int(member_count)) for org, member_count in rows]

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

    def create(self, org_code: str, org_name: str) -> Organization:
        return self.get_or_create(org_code, org_name)

    def update(self, org_id: UUID, payload) -> Organization:
        org = self.get_by_id(org_id)
        if not org:
            raise ValueError("Organization not found")
        data = payload.model_dump(exclude_unset=True)
        for key, value in data.items():
            if hasattr(org, key):
                setattr(org, key, value)
        self.db.flush()
        return org

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
    def serialize(org: Organization, *, member_count: int | None = None) -> dict:
        return {
            "org_id": str(org.org_id),
            "org_code": org.org_code,
            "org_name": org.org_name,
            "is_active": org.is_active,
            "member_count": member_count,
            "created_at": org.created_at.isoformat() if org.created_at else None,
            "updated_at": org.updated_at.isoformat() if org.updated_at else None,
        }

    @staticmethod
    def serialize_member(member: OrganizationMember) -> dict:
        return {
            "org_id": str(member.org_id),
            "person_id": str(member.person_id),
            "is_active": member.is_active,
            "created_at": member.created_at.isoformat() if member.created_at else None,
        }
