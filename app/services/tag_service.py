"""Instance Tag Service — manage key-value labels on instances."""

from __future__ import annotations

import logging
from uuid import UUID

from sqlalchemy import select
from sqlalchemy.orm import Session

from app.models.instance_tag import InstanceTag

logger = logging.getLogger(__name__)


class TagService:
    def __init__(self, db: Session):
        self.db = db

    def get_tags(self, instance_id: UUID) -> list[InstanceTag]:
        stmt = select(InstanceTag).where(InstanceTag.instance_id == instance_id).order_by(InstanceTag.key)
        return list(self.db.scalars(stmt).all())

    @staticmethod
    def serialize_tag(tag: InstanceTag) -> dict:
        return {"key": tag.key, "value": tag.value}

    def set_tag(self, instance_id: UUID, key: str, value: str) -> InstanceTag:
        key = key.strip().lower()
        if not key or len(key) > 60:
            raise ValueError("Tag key must be 1-60 characters")
        if len(value) > 200:
            raise ValueError("Tag value must be <= 200 characters")

        stmt = select(InstanceTag).where(
            InstanceTag.instance_id == instance_id,
            InstanceTag.key == key,
        )
        existing = self.db.scalar(stmt)
        if existing:
            existing.value = value
            self.db.flush()
            return existing

        tag = InstanceTag(instance_id=instance_id, key=key, value=value)
        self.db.add(tag)
        self.db.flush()
        return tag

    def delete_tag(self, instance_id: UUID, key: str) -> None:
        stmt = select(InstanceTag).where(
            InstanceTag.instance_id == instance_id,
            InstanceTag.key == key,
        )
        tag = self.db.scalar(stmt)
        if tag:
            self.db.delete(tag)
            self.db.flush()

    def find_by_tag(self, key: str, value: str | None = None) -> list[UUID]:
        """Find instance IDs that have a given tag key (and optionally value)."""
        stmt = select(InstanceTag.instance_id).where(InstanceTag.key == key)
        if value is not None:
            stmt = stmt.where(InstanceTag.value == value)
        return list(self.db.scalars(stmt).all())
