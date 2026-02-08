"""
Feature Flag Service — Manage per-instance feature flags.

Flags are injected into the instance .env file as FEATURE_* environment
variables so the ERP application can read them at startup.
"""

from __future__ import annotations

import logging
from uuid import UUID

from sqlalchemy import select
from sqlalchemy.orm import Session

from app.models.feature_flag import InstanceFlag

logger = logging.getLogger(__name__)

# Default feature flags with descriptions
AVAILABLE_FLAGS: dict[str, dict] = {
    "FEATURE_MULTI_CURRENCY": {
        "description": "Enable multi-currency transactions and reporting",
        "default": "false",
    },
    "FEATURE_IPSAS_REPORTS": {
        "description": "Enable IPSAS-specific financial reports",
        "default": "false",
    },
    "FEATURE_API_ACCESS": {
        "description": "Enable external REST API access for integrations",
        "default": "true",
    },
    "FEATURE_SSO_ENABLED": {
        "description": "Enable Single Sign-On (SAML/OIDC) authentication",
        "default": "false",
    },
    "FEATURE_FUND_ACCOUNTING": {
        "description": "Enable fund accounting for public sector organizations",
        "default": "false",
    },
    "FEATURE_COMMITMENT_CONTROL": {
        "description": "Enable commitment/encumbrance tracking for budgets",
        "default": "false",
    },
    "FEATURE_ADVANCED_ANALYTICS": {
        "description": "Enable advanced dashboards and data visualization",
        "default": "false",
    },
    "FEATURE_AUDIT_TRAIL": {
        "description": "Enable detailed field-level audit trail",
        "default": "true",
    },
    "FEATURE_BULK_IMPORT": {
        "description": "Enable CSV/Excel bulk data import tools",
        "default": "true",
    },
    "FEATURE_WEBHOOK_NOTIFICATIONS": {
        "description": "Enable webhook-based event notifications",
        "default": "false",
    },
}


class FeatureFlagService:
    def __init__(self, db: Session):
        self.db = db

    def list_for_instance(self, instance_id: UUID) -> list[dict]:
        """List all available flags with their current values for an instance."""
        stmt = select(InstanceFlag).where(InstanceFlag.instance_id == instance_id)
        set_flags = {f.flag_key: f.flag_value for f in self.db.scalars(stmt).all()}

        result = []
        for key, meta in AVAILABLE_FLAGS.items():
            result.append(
                {
                    "key": key,
                    "description": meta["description"],
                    "value": set_flags.get(key, meta["default"]),
                    "is_custom": key in set_flags,
                }
            )
        return result

    def get_flag(self, instance_id: UUID, flag_key: str) -> str:
        """Get a single flag value, falling back to default."""
        stmt = select(InstanceFlag).where(
            InstanceFlag.instance_id == instance_id,
            InstanceFlag.flag_key == flag_key,
        )
        flag = self.db.scalar(stmt)
        if flag:
            return flag.flag_value
        meta = AVAILABLE_FLAGS.get(flag_key)
        return meta["default"] if meta else "false"

    def set_flag(self, instance_id: UUID, flag_key: str, flag_value: str) -> InstanceFlag:
        """Set a feature flag for an instance (upsert)."""
        stmt = select(InstanceFlag).where(
            InstanceFlag.instance_id == instance_id,
            InstanceFlag.flag_key == flag_key,
        )
        flag = self.db.scalar(stmt)
        if flag:
            flag.flag_value = flag_value
        else:
            flag = InstanceFlag(
                instance_id=instance_id,
                flag_key=flag_key,
                flag_value=flag_value,
            )
            self.db.add(flag)
        self.db.flush()
        logger.info("Flag %s=%s for instance %s", flag_key, flag_value, instance_id)
        return flag

    def delete_flag(self, instance_id: UUID, flag_key: str) -> None:
        """Remove a custom flag, reverting to default."""
        stmt = select(InstanceFlag).where(
            InstanceFlag.instance_id == instance_id,
            InstanceFlag.flag_key == flag_key,
        )
        flag = self.db.scalar(stmt)
        if flag:
            self.db.delete(flag)
            self.db.flush()

    def get_env_vars(self, instance_id: UUID) -> dict[str, str]:
        """Get all flags as env vars for .env generation."""
        env = {}
        for entry in self.list_for_instance(instance_id):
            env[entry["key"]] = entry["value"]
        return env
