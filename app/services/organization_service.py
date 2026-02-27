"""Organization Service — manage platform organizations (tenants)."""

from __future__ import annotations

import logging
from uuid import UUID

from sqlalchemy import and_, func, select
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
            .where(OrganizationMember.is_active.is_(True))
            .order_by(OrganizationMember.created_at.desc())
            .limit(limit)
            .offset(offset)
        )
        return list(self.db.scalars(stmt).all())

    def count_members(self, org_id: UUID) -> int:
        stmt = select(func.count(OrganizationMember.id)).where(
            and_(
                OrganizationMember.org_id == org_id,
                OrganizationMember.is_active.is_(True)
            )
        )
        return self.db.scalar(stmt) or 0

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
    def serialize(org: Organization) -> dict:
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
            "instance_count": instance_count,
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
