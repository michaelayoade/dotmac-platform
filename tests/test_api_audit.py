import csv
import io
import uuid
from datetime import UTC, datetime, timedelta

from app.models.audit import AuditActorType, AuditEvent


def _seed_export_events(
    db_session,
    *,
    actor_id: str,
    base_time: datetime,
    count: int,
    action_prefix: str,
) -> None:
    events: list[AuditEvent] = []
    for i in range(count):
        events.append(
            AuditEvent(
                actor_id=actor_id,
                actor_type=AuditActorType.user,
                action=f"{action_prefix}_{i}",
                entity_type="test_entity",
                entity_id=str(uuid.uuid4()),
                is_success=True,
                status_code=200,
                occurred_at=base_time + timedelta(minutes=i),
            )
        )
    db_session.add_all(events)
    db_session.commit()


def _unique_base_time(year: int) -> datetime:
    # Keep test windows isolated from prior seeded data in the shared sqlite DB.
    return datetime(year, 1, 1, tzinfo=UTC) + timedelta(minutes=uuid.uuid4().int % 100000)


class TestAuditEventsAPI:
    """Tests for the /audit-events endpoints."""

    def test_get_audit_event(self, client, admin_headers, audit_event):
        """Test getting an audit event by ID."""
        response = client.get(f"/audit-events/{audit_event.id}", headers=admin_headers)
        assert response.status_code == 200
        data = response.json()
        assert data["id"] == str(audit_event.id)
        assert data["action"] == audit_event.action

    def test_get_audit_event_not_found(self, client, admin_headers):
        """Test getting a non-existent audit event."""
        fake_id = str(uuid.uuid4())
        response = client.get(f"/audit-events/{fake_id}", headers=admin_headers)
        assert response.status_code == 404

    def test_get_audit_event_unauthorized(self, client, audit_event):
        """Test getting an audit event without auth."""
        response = client.get(f"/audit-events/{audit_event.id}")
        assert response.status_code == 401

    def test_get_audit_event_insufficient_scope(self, client, auth_headers, audit_event):
        """Test getting an audit event without audit scope."""
        response = client.get(f"/audit-events/{audit_event.id}", headers=auth_headers)
        assert response.status_code == 403

    def test_list_audit_events(self, client, admin_headers, audit_event):
        """Test listing audit events."""
        response = client.get("/audit-events", headers=admin_headers)
        assert response.status_code == 200
        data = response.json()
        assert "items" in data
        assert "count" in data
        assert isinstance(data["items"], list)

    def test_list_audit_events_with_pagination(self, client, admin_headers, db_session, person):
        """Test listing audit events with pagination."""
        # Create multiple audit events
        for i in range(5):
            event = AuditEvent(
                actor_id=str(person.id),
                actor_type=AuditActorType.user,
                action=f"test_action_{i}",
                entity_type="test_entity",
                entity_id=str(uuid.uuid4()),
                is_success=True,
                status_code=200,
            )
            db_session.add(event)
        db_session.commit()

        response = client.get("/audit-events?limit=2&offset=0", headers=admin_headers)
        assert response.status_code == 200
        data = response.json()
        assert len(data["items"]) <= 2

    def test_list_audit_events_filter_by_actor(self, client, admin_headers, audit_event):
        """Test listing audit events filtered by actor_id."""
        response = client.get(f"/audit-events?actor_id={audit_event.actor_id}", headers=admin_headers)
        assert response.status_code == 200
        data = response.json()
        assert len(data["items"]) >= 1

    def test_list_audit_events_filter_by_action(self, client, admin_headers, audit_event):
        """Test listing audit events filtered by action."""
        response = client.get(f"/audit-events?action={audit_event.action}", headers=admin_headers)
        assert response.status_code == 200
        data = response.json()
        assert len(data["items"]) >= 1

    def test_list_audit_events_filter_by_entity_type(self, client, admin_headers, audit_event):
        """Test listing audit events filtered by entity_type."""
        response = client.get(f"/audit-events?entity_type={audit_event.entity_type}", headers=admin_headers)
        assert response.status_code == 200
        data = response.json()
        assert len(data["items"]) >= 1

    def test_list_audit_events_filter_by_success(self, client, admin_headers, audit_event):
        """Test listing audit events filtered by is_success."""
        response = client.get("/audit-events?is_success=true", headers=admin_headers)
        assert response.status_code == 200
        data = response.json()
        for item in data["items"]:
            assert item["is_success"] is True

    def test_list_audit_events_filter_by_status_code(self, client, admin_headers, audit_event):
        """Test listing audit events filtered by status_code."""
        response = client.get(f"/audit-events?status_code={audit_event.status_code}", headers=admin_headers)
        assert response.status_code == 200

    def test_list_audit_events_with_ordering(self, client, admin_headers):
        """Test listing audit events with custom ordering."""
        response = client.get("/audit-events?order_by=occurred_at&order_dir=asc", headers=admin_headers)
        assert response.status_code == 200

    def test_list_audit_events_unauthorized(self, client):
        """Test listing audit events without auth."""
        response = client.get("/audit-events")
        assert response.status_code == 401

    def test_delete_audit_event_not_allowed(self, client, admin_headers, audit_event):
        """Audit logs are append-only — DELETE should return 405."""
        response = client.delete(f"/audit-events/{audit_event.id}", headers=admin_headers)
        assert response.status_code == 405


class TestAuditEventsAPIV1:
    """Tests for the /api/v1/audit-events endpoints."""

    def test_get_audit_event_v1(self, client, admin_headers, audit_event):
        """Test getting an audit event via v1 API."""
        response = client.get(f"/api/v1/audit-events/{audit_event.id}", headers=admin_headers)
        assert response.status_code == 200

    def test_list_audit_events_v1(self, client, admin_headers):
        """Test listing audit events via v1 API."""
        response = client.get("/api/v1/audit-events", headers=admin_headers)
        assert response.status_code == 200

    def test_export_audit_events_csv_v1(self, client, admin_headers, audit_event):
        """Test exporting audit events as CSV via v1 API."""
        response = client.get("/api/v1/audit/export", headers=admin_headers)
        assert response.status_code == 200
        assert response.headers["content-type"].startswith("text/csv")
        assert response.headers["content-disposition"] == 'attachment; filename="audit-log.csv"'
        assert response.headers["x-row-limit"] == "100000"

        reader = csv.DictReader(io.StringIO(response.text))
        assert reader.fieldnames == ["timestamp", "user", "action", "resource", "detail"]

        rows = list(reader)
        assert any(
            row["user"] == str(audit_event.actor_id)
            and row["action"] == audit_event.action
            and row["resource"] == f"{audit_event.entity_type}:{audit_event.entity_id}"
            for row in rows
        )

    def test_export_audit_events_csv_v1_enforces_max_rows(self, client, admin_headers, db_session, person):
        """Test CSV export applies row limit before fetching."""
        base_time = _unique_base_time(2099)
        _seed_export_events(
            db_session,
            actor_id=str(person.id),
            base_time=base_time,
            count=5,
            action_prefix="export_limit",
        )

        response = client.get(
            "/api/v1/audit/export",
            params={
                "max_rows": 3,
                "started_after": (base_time - timedelta(minutes=1)).isoformat(),
                "started_before": (base_time + timedelta(minutes=10)).isoformat(),
            },
            headers=admin_headers,
        )
        assert response.status_code == 200
        assert response.headers["x-row-limit"] == "3"

        rows = list(csv.DictReader(io.StringIO(response.text)))
        assert len(rows) == 3
        assert [row["action"] for row in rows] == ["export_limit_4", "export_limit_3", "export_limit_2"]

    def test_export_audit_events_csv_v1_filters_started_window(self, client, admin_headers, db_session, person):
        """Test CSV export filters by started_after/started_before."""
        base_time = _unique_base_time(2098)
        _seed_export_events(
            db_session,
            actor_id=str(person.id),
            base_time=base_time,
            count=3,
            action_prefix="export_window",
        )

        response = client.get(
            "/api/v1/audit/export",
            params={
                "max_rows": 10,
                "started_after": (base_time + timedelta(seconds=30)).isoformat(),
                "started_before": (base_time + timedelta(seconds=90)).isoformat(),
            },
            headers=admin_headers,
        )
        assert response.status_code == 200

        rows = list(csv.DictReader(io.StringIO(response.text)))
        assert [row["action"] for row in rows] == ["export_window_1"]

    def test_export_audit_events_csv_v1_unauthorized(self, client):
        """Test exporting audit events requires auth."""
        response = client.get("/api/v1/audit/export")
        assert response.status_code == 401


class TestAuditEventActorTypes:
    """Tests for different actor types in audit events."""

    def test_list_audit_events_filter_by_actor_type_user(self, client, admin_headers, db_session, person):
        """Test filtering audit events by user actor type."""
        event = AuditEvent(
            actor_id=str(person.id),
            actor_type=AuditActorType.user,
            action="user_action",
            entity_type="test_entity",
            entity_id=str(uuid.uuid4()),
            is_success=True,
            status_code=200,
        )
        db_session.add(event)
        db_session.commit()

        response = client.get("/audit-events?actor_type=user", headers=admin_headers)
        assert response.status_code == 200
        data = response.json()
        for item in data["items"]:
            assert item["actor_type"] == "user"

    def test_list_audit_events_filter_by_actor_type_system(self, client, admin_headers, db_session):
        """Test filtering audit events by system actor type."""
        event = AuditEvent(
            actor_id="system",
            actor_type=AuditActorType.system,
            action="system_action",
            entity_type="test_entity",
            entity_id=str(uuid.uuid4()),
            is_success=True,
            status_code=200,
        )
        db_session.add(event)
        db_session.commit()

        response = client.get("/audit-events?actor_type=system", headers=admin_headers)
        assert response.status_code == 200
        data = response.json()
        for item in data["items"]:
            assert item["actor_type"] == "system"

    def test_list_audit_events_filter_by_actor_type_api_key(self, client, admin_headers, db_session):
        """Test filtering audit events by api_key actor type."""
        event = AuditEvent(
            actor_id=str(uuid.uuid4()),
            actor_type=AuditActorType.api_key,
            action="api_key_action",
            entity_type="test_entity",
            entity_id=str(uuid.uuid4()),
            is_success=True,
            status_code=200,
        )
        db_session.add(event)
        db_session.commit()

        response = client.get("/audit-events?actor_type=api_key", headers=admin_headers)
        assert response.status_code == 200
        data = response.json()
        for item in data["items"]:
            assert item["actor_type"] == "api_key"
