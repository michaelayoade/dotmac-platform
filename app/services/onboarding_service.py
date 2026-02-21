from __future__ import annotations

import logging
from uuid import UUID

from sqlalchemy import func, select
from sqlalchemy.orm import Session

from app.models.git_repository import GitRepository
from app.models.instance import Instance, InstanceStatus
from app.models.person import Person
from app.models.server import Server

logger = logging.getLogger(__name__)


class OnboardingService:
    def __init__(self, db: Session) -> None:
        self.db = db

    def get_checklist(self, person_id: UUID) -> dict:
        """Dynamically compute onboarding checklist progress from real state."""
        has_server = (self.db.scalar(select(func.count(Server.server_id))) or 0) > 0
        has_instance = (self.db.scalar(select(func.count(Instance.instance_id))) or 0) > 0
        has_domain = (
            self.db.scalar(
                select(func.count(Instance.instance_id)).where(Instance.domain.isnot(None)).where(Instance.domain != "")
            )
            or 0
        ) > 0
        has_git_repo = (self.db.scalar(select(func.count(GitRepository.repo_id))) or 0) > 0
        has_running = (
            self.db.scalar(select(func.count(Instance.instance_id)).where(Instance.status == InstanceStatus.running))
            or 0
        ) > 0

        steps: list[dict] = [
            {
                "key": "add_server",
                "title": "Add a server",
                "description": "Register your first VPS or local server to host instances.",
                "completed": has_server,
                "url": "/servers/new",
            },
            {
                "key": "create_instance",
                "title": "Create your first instance",
                "description": "Provision an ERP tenant on one of your servers.",
                "completed": has_instance,
                "url": "/instances/new",
            },
            {
                "key": "configure_domain",
                "title": "Configure a domain",
                "description": "Assign a custom domain to an instance for production access.",
                "completed": has_domain,
                "url": "/domains",
            },
            {
                "key": "setup_git_repo",
                "title": "Set up a Git repository",
                "description": "Connect a Git repo to enable version-controlled deployments.",
                "completed": has_git_repo,
                "url": "/git-repos/new",
            },
            {
                "key": "first_deploy",
                "title": "Run your first deployment",
                "description": "Deploy an instance and confirm it's running successfully.",
                "completed": has_running,
                "url": "/instances",
            },
        ]

        completed_count = sum(1 for s in steps if s["completed"])
        total_count = len(steps)
        percent = int((completed_count / total_count) * 100) if total_count else 0

        return {
            "steps": steps,
            "completed_count": completed_count,
            "total_count": total_count,
            "percent": percent,
        }

    def get_checklist_safe(self, person_id: UUID | None) -> dict:
        """Return onboarding checklist, or an empty default if person_id is invalid."""
        if person_id:
            return self.get_checklist(person_id)
        return {"steps": [], "completed_count": 0, "total_count": 0, "percent": 0}

    def should_show_onboarding(self, person_id: UUID) -> bool:
        """Return True if onboarding hasn't been dismissed by this person."""
        person = self.db.get(Person, person_id)
        if not person:
            return False
        return not person.onboarding_completed

    def mark_completed(self, person_id: UUID) -> None:
        """Mark onboarding as completed for the person."""
        person = self.db.get(Person, person_id)
        if person:
            person.onboarding_completed = True
            self.db.flush()
