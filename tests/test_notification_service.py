"""Tests for NotificationService."""

from __future__ import annotations

import uuid

import pytest

from app.models.notification import (
    Notification,
    NotificationCategory,
    NotificationSeverity,
)
from app.services.notification_service import NotificationService


@pytest.fixture(autouse=True)
def _clean_notifications(db_session):
    """Remove all notifications before each test to avoid shared-DB pollution."""
    db_session.query(Notification).delete()
    db_session.commit()
    yield


@pytest.fixture()
def svc(db_session):
    return NotificationService(db_session)


@pytest.fixture()
def person_id(person):
    return person.id


class TestCreate:
    def test_create_personal(self, svc, person_id, db_session):
        n = svc.create(
            person_id=person_id,
            category=NotificationCategory.deploy,
            severity=NotificationSeverity.info,
            title="Deploy done",
            message="Deployment completed successfully.",
        )
        db_session.commit()
        assert n.notification_id is not None
        assert n.person_id == person_id
        assert n.category == NotificationCategory.deploy
        assert n.severity == NotificationSeverity.info
        assert n.title == "Deploy done"
        assert n.is_read is False

    def test_create_with_link(self, svc, person_id, db_session):
        n = svc.create(
            person_id=person_id,
            category=NotificationCategory.alert,
            severity=NotificationSeverity.critical,
            title="Alert fired",
            message="CPU exceeded threshold",
            link="/alerts",
        )
        db_session.commit()
        assert n.link == "/alerts"

    def test_create_truncates_long_title(self, svc, person_id, db_session):
        long_title = "A" * 300
        n = svc.create(
            person_id=person_id,
            category=NotificationCategory.system,
            severity=NotificationSeverity.info,
            title=long_title,
            message="test",
        )
        db_session.commit()
        assert len(n.title) == 200


class TestCreateForAdmins:
    def test_broadcast_notification(self, svc, db_session):
        n = svc.create_for_admins(
            category=NotificationCategory.system,
            severity=NotificationSeverity.warning,
            title="System update",
            message="Scheduled maintenance tonight.",
        )
        db_session.commit()
        assert n.person_id is None
        assert n.category == NotificationCategory.system


class TestGetUnreadCount:
    def test_empty(self, svc, person_id):
        assert svc.get_unread_count(person_id) == 0

    def test_counts_personal_and_broadcast(self, svc, person_id, db_session):
        svc.create(person_id, NotificationCategory.deploy, NotificationSeverity.info, "A", "msg")
        svc.create_for_admins(NotificationCategory.system, NotificationSeverity.info, "B", "msg")
        db_session.commit()
        assert svc.get_unread_count(person_id) == 2

    def test_excludes_read(self, svc, person_id, db_session):
        n = svc.create(person_id, NotificationCategory.deploy, NotificationSeverity.info, "A", "msg")
        db_session.commit()
        svc.mark_read(n.notification_id, person_id)
        db_session.commit()
        assert svc.get_unread_count(person_id) == 0

    def test_excludes_other_person(self, svc, person_id, db_session):
        other_id = uuid.uuid4()
        svc.create(other_id, NotificationCategory.deploy, NotificationSeverity.info, "Other", "msg")
        db_session.commit()
        assert svc.get_unread_count(person_id) == 0


class TestGetRecent:
    def test_ordered_by_created_at_desc(self, svc, person_id, db_session):
        svc.create(person_id, NotificationCategory.deploy, NotificationSeverity.info, "First", "msg")
        svc.create(person_id, NotificationCategory.deploy, NotificationSeverity.info, "Second", "msg")
        db_session.commit()
        recent = svc.get_recent(person_id)
        assert len(recent) >= 2
        assert recent[0].title == "Second"

    def test_includes_broadcasts(self, svc, person_id, db_session):
        svc.create_for_admins(NotificationCategory.system, NotificationSeverity.info, "Broadcast", "msg")
        db_session.commit()
        recent = svc.get_recent(person_id)
        titles = [n.title for n in recent]
        assert "Broadcast" in titles

    def test_pagination(self, svc, person_id, db_session):
        for i in range(5):
            svc.create(person_id, NotificationCategory.deploy, NotificationSeverity.info, f"N{i}", "msg")
        db_session.commit()
        page = svc.get_recent(person_id, limit=2, offset=0)
        assert len(page) == 2


class TestMarkRead:
    def test_mark_own_notification(self, svc, person_id, db_session):
        n = svc.create(person_id, NotificationCategory.deploy, NotificationSeverity.info, "A", "msg")
        db_session.commit()
        svc.mark_read(n.notification_id, person_id)
        db_session.commit()
        db_session.refresh(n)
        assert n.is_read is True

    def test_mark_broadcast(self, svc, person_id, db_session):
        n = svc.create_for_admins(NotificationCategory.system, NotificationSeverity.info, "B", "msg")
        db_session.commit()
        svc.mark_read(n.notification_id, person_id)
        db_session.commit()
        db_session.refresh(n)
        assert n.is_read is True

    def test_not_found(self, svc, person_id):
        with pytest.raises(ValueError, match="not found"):
            svc.mark_read(uuid.uuid4(), person_id)

    def test_unauthorized(self, svc, person_id, db_session):
        other_id = uuid.uuid4()
        n = svc.create(other_id, NotificationCategory.deploy, NotificationSeverity.info, "X", "msg")
        db_session.commit()
        with pytest.raises(ValueError, match="Not authorized"):
            svc.mark_read(n.notification_id, person_id)


class TestMarkAllRead:
    def test_marks_personal_and_broadcast(self, svc, person_id, db_session):
        svc.create(person_id, NotificationCategory.deploy, NotificationSeverity.info, "A", "msg")
        svc.create_for_admins(NotificationCategory.system, NotificationSeverity.info, "B", "msg")
        db_session.commit()
        count = svc.mark_all_read(person_id)
        db_session.commit()
        assert count == 2
        assert svc.get_unread_count(person_id) == 0
