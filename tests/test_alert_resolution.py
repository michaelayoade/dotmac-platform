"""Tests for alert resolution tracking."""

from __future__ import annotations

import uuid
from datetime import UTC, datetime, timedelta

from app.models.alert_rule import AlertEvent, AlertMetric, AlertOperator
from app.models.health_check import HealthCheck, HealthStatus
from app.models.instance import Instance, InstanceStatus
from app.models.server import Server, ServerStatus
from app.services.alert_service import AlertService


def test_alert_event_resolves_when_condition_clears(db_session):
    server = Server(
        name=f"srv-{uuid.uuid4().hex[:6]}",
        hostname=f"srv-{uuid.uuid4().hex[:6]}.example.com",
        status=ServerStatus.connected,
    )
    db_session.add(server)
    db_session.flush()

    inst = Instance(
        org_code=f"org-{uuid.uuid4().hex[:6]}",
        org_name="Org",
        status=InstanceStatus.running,
        server_id=server.server_id,
        app_port=8080,
        db_port=5432,
        redis_port=6379,
    )
    db_session.add(inst)
    db_session.flush()

    svc = AlertService(db_session)
    rule = svc.create_rule(
        name="CPU High",
        metric=AlertMetric.cpu_percent,
        operator=AlertOperator.gt,
        threshold=80.0,
        instance_id=inst.instance_id,
    )
    db_session.flush()

    event = AlertEvent(
        rule_id=rule.rule_id,
        instance_id=inst.instance_id,
        metric_value=95.0,
        threshold=rule.threshold,
    )
    db_session.add(event)

    check = HealthCheck(
        instance_id=inst.instance_id,
        status=HealthStatus.healthy,
        cpu_percent=10.0,
        checked_at=datetime.now(UTC) + timedelta(seconds=1),
    )
    db_session.add(check)
    db_session.commit()

    svc.evaluate_all()
    db_session.refresh(event)

    assert event.resolved_at is not None
