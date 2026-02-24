"""
Platform Settings Service — Read/write platform-level configuration.

Stores settings in the DomainSetting table under the 'platform' domain.
"""

from __future__ import annotations

import logging

from sqlalchemy import select
from sqlalchemy.orm import Session

from app.models.domain_settings import (
    DomainSetting,
    SettingDomain,
    SettingValueType,
)
from app.services.settings_crypto import resolve_setting_value

logger = logging.getLogger(__name__)

# Default values for platform settings
PLATFORM_DEFAULTS: dict[str, str] = {
    # Deprecated: source-build removed — kept for stored data backward compatibility
    "dotmac_git_repo_url": "",
    "dotmac_git_branch": "main",
    "dotmac_source_path": "/opt/dotmac/src",
    "default_deploy_path": "/opt/dotmac/instances",
    "server_selection_strategy": "least_instances",
    "signup_token_ttl_hours": "48",
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
        if row:
            resolved = resolve_setting_value(row.value_text, row.value_json, row.is_secret)
            if resolved is not None:
                return resolved
        return PLATFORM_DEFAULTS.get(key, "")

    def get_json(self, key: str) -> dict | None:
        """Get a JSON platform setting value if present."""
        stmt = select(DomainSetting).where(
            DomainSetting.domain == SettingDomain.platform,
            DomainSetting.key == key,
            DomainSetting.is_active.is_(True),
        )
        row = self.db.scalar(stmt)
        if not row:
            return None
        if row.value_json is not None:
            return row.value_json
        return None

    def get_all(self) -> dict[str, str]:
        """Get all platform settings, merged with defaults."""
        result = dict(PLATFORM_DEFAULTS)
        stmt = select(DomainSetting).where(
            DomainSetting.domain == SettingDomain.platform,
            DomainSetting.is_active.is_(True),
        )
        rows = self.db.scalars(stmt).all()
        for row in rows:
            resolved = resolve_setting_value(row.value_text, row.value_json, row.is_secret)
            if resolved is not None:
                result[row.key] = resolved
        return result

    def set(self, key: str, value: str) -> None:
        """Set a platform setting value (upsert)."""
        if key not in PLATFORM_DEFAULTS:
            raise ValueError(f"Unknown platform setting key: {key}")
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
        unknown = [key for key in settings.keys() if key not in PLATFORM_DEFAULTS]
        if unknown:
            raise ValueError(f"Unknown platform setting keys: {', '.join(sorted(unknown))}")
        for key, value in settings.items():
            self.set(key, value)
