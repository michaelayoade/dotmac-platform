"""
Platform Settings Service — Read/write platform-level configuration.

Stores settings in the DomainSetting table under the 'platform' domain.
"""
from __future__ import annotations

import logging
from typing import Optional

from sqlalchemy import select
from sqlalchemy.orm import Session

from app.models.domain_settings import (
    DomainSetting,
    SettingDomain,
    SettingValueType,
)

logger = logging.getLogger(__name__)

# Default values for platform settings
PLATFORM_DEFAULTS: dict[str, str] = {
    "dotmac_git_repo_url": "https://github.com/michaelayoade/dotmac.git",
    "dotmac_git_branch": "main",
    "dotmac_source_path": "/opt/dotmac/src",
    "default_deploy_path": "/opt/dotmac/instances",
}


class PlatformSettingsService:
    """Read/write platform-level settings from the domain_settings table."""

    def __init__(self, db: Session):
        self.db = db

    def get(self, key: str) -> str:
        """Get a platform setting value, falling back to defaults."""
        stmt = select(DomainSetting).where(
            DomainSetting.domain == SettingDomain.platform,
            DomainSetting.key == key,
            DomainSetting.is_active.is_(True),
        )
        row = self.db.scalar(stmt)
        if row and row.value_text is not None:
            return row.value_text
        return PLATFORM_DEFAULTS.get(key, "")

    def get_all(self) -> dict[str, str]:
        """Get all platform settings, merged with defaults."""
        result = dict(PLATFORM_DEFAULTS)
        stmt = select(DomainSetting).where(
            DomainSetting.domain == SettingDomain.platform,
            DomainSetting.is_active.is_(True),
        )
        rows = self.db.scalars(stmt).all()
        for row in rows:
            if row.value_text is not None:
                result[row.key] = row.value_text
        return result

    def set(self, key: str, value: str) -> None:
        """Set a platform setting value (upsert)."""
        stmt = select(DomainSetting).where(
            DomainSetting.domain == SettingDomain.platform,
            DomainSetting.key == key,
        )
        row = self.db.scalar(stmt)
        if row:
            row.value_text = value
            row.is_active = True
        else:
            row = DomainSetting(
                domain=SettingDomain.platform,
                key=key,
                value_type=SettingValueType.string,
                value_text=value,
                is_active=True,
            )
            self.db.add(row)
        self.db.flush()
        logger.info("Platform setting updated: %s", key)

    def set_many(self, settings: dict[str, str]) -> None:
        """Set multiple platform settings at once."""
        for key, value in settings.items():
            self.set(key, value)
