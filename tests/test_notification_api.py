"""Tests for notification API endpoints."""

from __future__ import annotations

import uuid

import pytest

from app.models.notification import (
    Notification,
    NotificationCategory,
    NotificationSeverity,
)


@pytest.fixture(autouse=True)
def _clean_notifications(db_session):
    """Remove all notifications before each test to avoid shared-DB pollution."""
    db_session.query(Notification).delete()
    db_session.commit()
    yield


@pytest.fixture()
def _notifications(db_session, person):
    """Create sample notifications for the test person."""
    notifs = []
    for i in range(3):
        n = Notification(
            person_id=person.id,
            category=NotificationCategory.deploy,
            severity=NotificationSeverity.info,
            title=f"Test Notification {i}",
            message=f"Message {i}",
        )
        db_session.add(n)
        notifs.append(n)
    # Add one broadcast
    broadcast = Notification(
        person_id=None,
        category=NotificationCategory.system,
        severity=NotificationSeverity.warning,
        title="Broadcast",
        message="System broadcast",
    )
    db_session.add(broadcast)
    notifs.append(broadcast)
    db_session.commit()
    for n in notifs:
        db_session.refresh(n)
    return notifs


class TestListNotifications:
    def test_empty(self, client, auth_headers):
        resp = client.get("/notifications", headers=auth_headers)
        assert resp.status_code == 200
        data = resp.json()
        assert data["unread_count"] == 0
        assert data["notifications"] == []

    def test_with_data(self, client, auth_headers, _notifications):
        resp = client.get("/notifications", headers=auth_headers)
        assert resp.status_code == 200
        data = resp.json()
        # 3 personal + 1 broadcast
        assert data["unread_count"] == 4
        assert len(data["notifications"]) == 4

    def test_unauthenticated(self, client):
        resp = client.get("/notifications")
        assert resp.status_code == 401


class TestUnreadCount:
    def test_returns_count(self, client, auth_headers, _notifications):
        resp = client.get("/notifications/unread-count", headers=auth_headers)
        assert resp.status_code == 200
        assert resp.json()["unread_count"] == 4

    def test_unauthenticated(self, client):
        resp = client.get("/notifications/unread-count")
        assert resp.status_code == 401


class TestMarkRead:
    def test_mark_personal(self, client, auth_headers, _notifications):
        nid = str(_notifications[0].notification_id)
        resp = client.post(f"/notifications/{nid}/read", headers=auth_headers)
        assert resp.status_code == 200
        assert resp.json()["ok"] is True

        # Verify count decreased
        count_resp = client.get("/notifications/unread-count", headers=auth_headers)
        assert count_resp.json()["unread_count"] == 3

    def test_mark_broadcast(self, client, auth_headers, _notifications):
        broadcast = _notifications[-1]
        nid = str(broadcast.notification_id)
        resp = client.post(f"/notifications/{nid}/read", headers=auth_headers)
        assert resp.status_code == 200

    def test_not_found(self, client, auth_headers):
        fake_id = str(uuid.uuid4())
        resp = client.post(f"/notifications/{fake_id}/read", headers=auth_headers)
        assert resp.status_code == 404


class TestMarkAllRead:
    def test_marks_all(self, client, auth_headers, _notifications):
        resp = client.post("/notifications/read-all", headers=auth_headers)
        assert resp.status_code == 200
        assert resp.json()["marked"] == 4

        count_resp = client.get("/notifications/unread-count", headers=auth_headers)
        assert count_resp.json()["unread_count"] == 0

    def test_unauthenticated(self, client):
        resp = client.post("/notifications/read-all")
        assert resp.status_code == 401
