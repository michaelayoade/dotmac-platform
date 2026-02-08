"""
Plan Service — Manage tenant subscription plans/tiers.

Plans define resource limits, allowed modules, and available feature flags.
"""

from __future__ import annotations

import logging
from uuid import UUID

from sqlalchemy import select
from sqlalchemy.orm import Session

from app.models.plan import Plan

logger = logging.getLogger(__name__)

DEFAULT_PLANS: list[dict] = [
    {
        "name": "starter",
        "description": "Basic plan for small organizations — core financials only",
        "max_users": 10,
        "max_storage_gb": 5,
        "allowed_modules": ["core", "gl", "ap", "ar", "banking", "tax", "reporting"],
        "allowed_flags": [
            "FEATURE_API_ACCESS",
            "FEATURE_AUDIT_TRAIL",
            "FEATURE_BULK_IMPORT",
        ],
    },
    {
        "name": "professional",
        "description": "Full financials with HR, inventory, and procurement",
        "max_users": 50,
        "max_storage_gb": 25,
        "allowed_modules": [
            "core",
            "gl",
            "ap",
            "ar",
            "banking",
            "tax",
            "reporting",
            "inventory",
            "procurement",
            "fixed_assets",
            "budgeting",
            "hr",
            "projects",
            "automation",
        ],
        "allowed_flags": [
            "FEATURE_API_ACCESS",
            "FEATURE_AUDIT_TRAIL",
            "FEATURE_BULK_IMPORT",
            "FEATURE_MULTI_CURRENCY",
            "FEATURE_ADVANCED_ANALYTICS",
            "FEATURE_WEBHOOK_NOTIFICATIONS",
        ],
    },
    {
        "name": "enterprise",
        "description": "Full platform access with all modules and features",
        "max_users": 0,  # unlimited
        "max_storage_gb": 0,  # unlimited
        "allowed_modules": [],  # empty = all modules
        "allowed_flags": [],  # empty = all flags
    },
]


class PlanService:
    def __init__(self, db: Session):
        self.db = db

    def seed_plans(self) -> int:
        """Seed default plans if they don't exist."""
        created = 0
        for plan_data in DEFAULT_PLANS:
            existing = self.db.scalar(select(Plan).where(Plan.name == plan_data["name"]))
            if not existing:
                plan = Plan(**plan_data)
                self.db.add(plan)
                created += 1
        if created:
            self.db.flush()
            logger.info("Seeded %d plans", created)
        return created

    def list_all(self) -> list[Plan]:
        return list(self.db.scalars(select(Plan).where(Plan.is_active.is_(True)).order_by(Plan.name)).all())

    def get_by_id(self, plan_id: UUID) -> Plan | None:
        return self.db.get(Plan, plan_id)

    def get_by_name(self, name: str) -> Plan | None:
        return self.db.scalar(select(Plan).where(Plan.name == name))

    def create(self, **kwargs) -> Plan:
        plan = Plan(**kwargs)
        self.db.add(plan)
        self.db.flush()
        logger.info("Created plan: %s", plan.name)
        return plan

    def update(self, plan_id: UUID, **kwargs) -> Plan:
        plan = self.get_by_id(plan_id)
        if not plan:
            raise ValueError(f"Plan {plan_id} not found")
        for k, v in kwargs.items():
            if hasattr(plan, k):
                setattr(plan, k, v)
        self.db.flush()
        return plan

    def delete(self, plan_id: UUID) -> None:
        plan = self.get_by_id(plan_id)
        if not plan:
            raise ValueError(f"Plan {plan_id} not found")
        plan.is_active = False
        self.db.flush()

    def is_module_allowed(self, plan: Plan, module_slug: str) -> bool:
        """Check if a module is allowed by the plan. Empty list = all allowed."""
        if not plan.allowed_modules:
            return True
        return module_slug in plan.allowed_modules

    def is_flag_allowed(self, plan: Plan, flag_key: str) -> bool:
        """Check if a feature flag is allowed by the plan. Empty list = all allowed."""
        if not plan.allowed_flags:
            return True
        return flag_key in plan.allowed_flags
