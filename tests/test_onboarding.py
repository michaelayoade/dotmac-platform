from __future__ import annotations

import uuid

import pytest

from app.models.git_repository import GitRepository
from app.models.health_check import HealthCheck
from app.models.instance import Instance, InstanceStatus
from app.models.server import Server, ServerStatus
from app.services.onboarding_service import OnboardingService


@pytest.fixture(autouse=True)
def _clean_onboarding_tables(db_session):
    """Clear tables that OnboardingService queries globally."""
    db_session.query(HealthCheck).delete()
    db_session.query(Instance).delete()
    db_session.query(Server).delete()
    db_session.query(GitRepository).delete()
    db_session.commit()
    yield


class TestOnboardingService:
    def test_empty_state_all_incomplete(self, db_session, person):
        """With no servers/instances, all steps should be incomplete."""
        svc = OnboardingService(db_session)
        checklist = svc.get_checklist(person.id)
        assert checklist["completed_count"] == 0
        assert checklist["total_count"] == 5
        assert checklist["percent"] == 0
        assert all(not s["completed"] for s in checklist["steps"])

    def test_with_server(self, db_session, person):
        """Adding a server completes the first step."""
        server = Server(
            name="test-srv",
            hostname="test.example.com",
            status=ServerStatus.connected,
        )
        db_session.add(server)
        db_session.flush()

        svc = OnboardingService(db_session)
        checklist = svc.get_checklist(person.id)
        assert checklist["steps"][0]["completed"] is True
        assert checklist["completed_count"] == 1

    def test_with_running_instance(self, db_session, person):
        """A running instance completes server, instance, and deploy steps."""
        server = Server(
            name=f"test-srv-{uuid.uuid4().hex[:6]}",
            hostname="test.example.com",
            status=ServerStatus.connected,
        )
        db_session.add(server)
        db_session.flush()

        inst = Instance(
            server_id=server.server_id,
            org_code=f"TST_{uuid.uuid4().hex[:6]}",
            org_name="Test Org",
            app_port=8100,
            db_port=5500,
            redis_port=6400,
            status=InstanceStatus.running,
        )
        db_session.add(inst)
        db_session.flush()

        svc = OnboardingService(db_session)
        checklist = svc.get_checklist(person.id)
        # server + instance + running deploy = 3 completed
        assert checklist["steps"][0]["completed"] is True  # server
        assert checklist["steps"][1]["completed"] is True  # instance
        assert checklist["steps"][4]["completed"] is True  # running
        assert checklist["completed_count"] == 3

    def test_should_show_onboarding_new_user(self, db_session, person):
        """New users should see onboarding."""
        svc = OnboardingService(db_session)
        assert svc.should_show_onboarding(person.id) is True

    def test_mark_completed_hides_onboarding(self, db_session, person):
        """After dismissing, onboarding should not show."""
        svc = OnboardingService(db_session)
        svc.mark_completed(person.id)
        db_session.flush()
        assert svc.should_show_onboarding(person.id) is False

    def test_should_show_returns_false_for_invalid_id(self, db_session):
        """Unknown person_id should return False."""
        svc = OnboardingService(db_session)
        assert svc.should_show_onboarding(uuid.uuid4()) is False

    def test_percent_calculation(self, db_session, person):
        """Progress percent should reflect completed steps."""
        server = Server(
            name=f"test-srv-{uuid.uuid4().hex[:6]}",
            hostname="test.example.com",
            status=ServerStatus.connected,
        )
        db_session.add(server)
        db_session.flush()

        svc = OnboardingService(db_session)
        checklist = svc.get_checklist(person.id)
        assert checklist["percent"] == 20  # 1/5 = 20%
