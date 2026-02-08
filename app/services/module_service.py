"""
Module Service — Manage ERP modules and per-instance module assignments.

Maps the 32 ERP database schemas to logical modules that can be toggled
per tenant instance.
"""

from __future__ import annotations

import logging
from uuid import UUID

from sqlalchemy import select
from sqlalchemy.orm import Session

from app.models.module import InstanceModule, Module

logger = logging.getLogger(__name__)

# Seed data: module slug -> (name, description, schemas, dependencies, is_core)
DEFAULT_MODULES: list[dict] = [
    {
        "slug": "core",
        "name": "Core Platform",
        "description": "Organization setup, users, RBAC, audit, and shared types",
        "schemas": ["core_config", "core_org", "core_fx", "platform", "audit", "common"],
        "dependencies": [],
        "is_core": True,
    },
    {
        "slug": "gl",
        "name": "General Ledger",
        "description": "Chart of accounts, journal entries, trial balance, and financial statements",
        "schemas": ["gl"],
        "dependencies": ["core"],
        "is_core": True,
    },
    {
        "slug": "ap",
        "name": "Accounts Payable",
        "description": "Vendor management, purchase invoices, and payment processing",
        "schemas": ["ap", "payments"],
        "dependencies": ["core", "gl"],
        "is_core": False,
    },
    {
        "slug": "ar",
        "name": "Accounts Receivable",
        "description": "Customer management, sales invoices, and receipt processing",
        "schemas": ["ar"],
        "dependencies": ["core", "gl"],
        "is_core": False,
    },
    {
        "slug": "banking",
        "name": "Banking & Reconciliation",
        "description": "Bank accounts, statement import, and reconciliation",
        "schemas": ["banking", "fin_inst"],
        "dependencies": ["core", "gl"],
        "is_core": False,
    },
    {
        "slug": "inventory",
        "name": "Inventory Management",
        "description": "Stock tracking, warehousing, and inventory valuation",
        "schemas": ["inv"],
        "dependencies": ["core", "gl"],
        "is_core": False,
    },
    {
        "slug": "procurement",
        "name": "Procurement",
        "description": "Purchase requisitions, purchase orders, and vendor sourcing",
        "schemas": ["proc"],
        "dependencies": ["core", "gl", "ap"],
        "is_core": False,
    },
    {
        "slug": "fixed_assets",
        "name": "Fixed Assets",
        "description": "Asset register, depreciation, and disposal",
        "schemas": ["fa"],
        "dependencies": ["core", "gl"],
        "is_core": False,
    },
    {
        "slug": "tax",
        "name": "Tax Management",
        "description": "Tax rules, withholding, VAT/GST, and tax returns",
        "schemas": ["tax"],
        "dependencies": ["core", "gl"],
        "is_core": False,
    },
    {
        "slug": "budgeting",
        "name": "Budgeting & Expenses",
        "description": "Budget preparation, tracking, and expense management",
        "schemas": ["exp", "expense"],
        "dependencies": ["core", "gl"],
        "is_core": False,
    },
    {
        "slug": "consolidation",
        "name": "Consolidation",
        "description": "Multi-entity consolidation and intercompany elimination",
        "schemas": ["cons"],
        "dependencies": ["core", "gl"],
        "is_core": False,
    },
    {
        "slug": "ipsas",
        "name": "IPSAS Public Sector",
        "description": "IPSAS-specific reporting, fund accounting, and commitment control",
        "schemas": ["ipsas"],
        "dependencies": ["core", "gl"],
        "is_core": False,
    },
    {
        "slug": "leasing",
        "name": "Lease Accounting",
        "description": "IFRS 16 / IPSAS 43 lease management and amortization",
        "schemas": ["lease"],
        "dependencies": ["core", "gl"],
        "is_core": False,
    },
    {
        "slug": "hr",
        "name": "Human Resources",
        "description": "Employee records, attendance, leave, payroll, recruitment, and training",
        "schemas": ["attendance", "leave", "recruit", "training", "perf", "scheduling"],
        "dependencies": ["core"],
        "is_core": False,
    },
    {
        "slug": "fleet",
        "name": "Fleet Management",
        "description": "Vehicle tracking, maintenance, fuel, and driver management",
        "schemas": ["fleet"],
        "dependencies": ["core"],
        "is_core": False,
    },
    {
        "slug": "projects",
        "name": "Project Management",
        "description": "Project tracking, time sheets, and project costing",
        "schemas": ["pm"],
        "dependencies": ["core", "gl"],
        "is_core": False,
    },
    {
        "slug": "support",
        "name": "Support & Helpdesk",
        "description": "Ticket management, SLA tracking, and knowledge base",
        "schemas": ["support"],
        "dependencies": ["core"],
        "is_core": False,
    },
    {
        "slug": "reporting",
        "name": "Reporting & Analytics",
        "description": "Custom reports, dashboards, and data export",
        "schemas": ["rpt"],
        "dependencies": ["core"],
        "is_core": False,
    },
    {
        "slug": "automation",
        "name": "Automation & Integration",
        "description": "Workflow automation, data sync, and third-party integrations",
        "schemas": ["automation", "sync"],
        "dependencies": ["core"],
        "is_core": False,
    },
]


class ModuleService:
    def __init__(self, db: Session):
        self.db = db

    def seed_modules(self) -> int:
        """Seed default modules if they don't exist. Returns count of modules created."""
        created = 0
        for mod_data in DEFAULT_MODULES:
            existing = self.db.scalar(select(Module).where(Module.slug == mod_data["slug"]))
            if not existing:
                module = Module(
                    name=mod_data["name"],
                    slug=mod_data["slug"],
                    description=mod_data["description"],
                    schemas=mod_data["schemas"],
                    dependencies=mod_data["dependencies"],
                    is_core=mod_data["is_core"],
                )
                self.db.add(module)
                created += 1
        if created:
            self.db.flush()
            logger.info("Seeded %d modules", created)
        return created

    def list_all(self) -> list[Module]:
        stmt = select(Module).where(Module.is_active.is_(True)).order_by(Module.name)
        return list(self.db.scalars(stmt).all())

    def get_by_slug(self, slug: str) -> Module | None:
        return self.db.scalar(select(Module).where(Module.slug == slug))

    def get_by_id(self, module_id: UUID) -> Module | None:
        return self.db.get(Module, module_id)

    # -- Instance module management --

    def get_instance_modules(self, instance_id: UUID) -> list[dict]:
        """Get all modules with their enabled status for an instance."""
        modules = self.list_all()
        enabled_map: dict[UUID, bool] = {}

        stmt = select(InstanceModule).where(InstanceModule.instance_id == instance_id)
        for im in self.db.scalars(stmt).all():
            enabled_map[im.module_id] = im.enabled

        result = []
        for mod in modules:
            result.append(
                {
                    "module": mod,
                    "enabled": enabled_map.get(mod.module_id, mod.is_core),
                }
            )
        return result

    def get_enabled_schemas(self, instance_id: UUID) -> list[str]:
        """Get the list of database schemas that should be created for an instance."""
        schemas: list[str] = []
        for entry in self.get_instance_modules(instance_id):
            if entry["enabled"]:
                schemas.extend(entry["module"].schemas)
        return sorted(set(schemas))

    def set_module_enabled(self, instance_id: UUID, module_id: UUID, enabled: bool) -> InstanceModule:
        """Enable or disable a module for an instance."""
        module = self.get_by_id(module_id)
        if not module:
            raise ValueError(f"Module {module_id} not found")

        if not enabled and module.is_core:
            raise ValueError(f"Cannot disable core module: {module.slug}")

        # Check dependencies when enabling
        if enabled:
            self._check_dependencies(instance_id, module)

        stmt = select(InstanceModule).where(
            InstanceModule.instance_id == instance_id,
            InstanceModule.module_id == module_id,
        )
        im = self.db.scalar(stmt)
        if im:
            im.enabled = enabled
        else:
            im = InstanceModule(
                instance_id=instance_id,
                module_id=module_id,
                enabled=enabled,
            )
            self.db.add(im)
        self.db.flush()
        logger.info(
            "Module %s %s for instance %s",
            module.slug,
            "enabled" if enabled else "disabled",
            instance_id,
        )
        return im

    def enable_core_modules(self, instance_id: UUID) -> None:
        """Enable all core modules for a new instance."""
        for mod in self.list_all():
            if mod.is_core:
                self.set_module_enabled(instance_id, mod.module_id, True)

    def _check_dependencies(self, instance_id: UUID, module: Module) -> None:
        """Ensure all dependency modules are enabled."""
        if not module.dependencies:
            return
        for dep_slug in module.dependencies:
            dep_mod = self.get_by_slug(dep_slug)
            if not dep_mod:
                continue
            stmt = select(InstanceModule).where(
                InstanceModule.instance_id == instance_id,
                InstanceModule.module_id == dep_mod.module_id,
                InstanceModule.enabled.is_(True),
            )
            if not self.db.scalar(stmt):
                # Core modules are implicitly enabled
                if dep_mod.is_core:
                    continue
                raise ValueError(f"Module '{module.slug}' requires '{dep_slug}' to be enabled first")
