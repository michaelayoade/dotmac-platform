"""Tests for monitoring tasks."""

import uuid
from datetime import UTC, datetime

from sqlalchemy import select

from app.models.instance import Instance, InstanceStatus
from app.models.notification import Notification, NotificationCategory
from app.models.plan import Plan
from app.models.server import Server
from app.models.usage_record import UsageMetric
from app.services.usage_service import UsageService
from app.tasks.monitoring import check_plan_limits
from tests.conftest import TestBase, _test_engine

TestBase.metadata.create_all(_test_engine)


def _make_server(db_session):
    server = Server(
        name=f"test-server-{uuid.uuid4().hex[:6]}",
        hostname="localhost",
        ssh_port=22,
        ssh_user="root",
        ssh_key_path="/root/.ssh/id_rsa",
        is_local=True,
    )
    db_session.add(server)
    db_session.commit()
    db_session.refresh(server)
    return server


def _make_plan(db_session) -> Plan:
    plan = Plan(
        name=f"plan-{uuid.uuid4().hex[:6]}",
        description="test",
        max_users=10,
        max_storage_gb=10,
        allowed_modules=[],
        allowed_flags=[],
    )
    db_session.add(plan)
    db_session.commit()
    db_session.refresh(plan)
    return plan


def _make_instance(db_session, server, plan: Plan) -> Instance:
    code = f"org{uuid.uuid4().hex[:6]}"
    instance = Instance(
        server_id=server.server_id,
        org_code=code,
        org_name=f"Org {code}",
        app_port=8080,
        db_port=5432,
        redis_port=6379,
        status=InstanceStatus.running,
        plan_id=plan.plan_id,
    )
    db_session.add(instance)
    db_session.commit()
    db_session.refresh(instance)
    return instance


def test_check_plan_limits_creates_notification(db_session):
    server = _make_server(db_session)
    plan = _make_plan(db_session)
    instance = _make_instance(db_session, server, plan)

    now = datetime.now(UTC)
    period_start = now.replace(hour=0, minute=0, second=0, microsecond=0)
    UsageService(db_session).record(
        instance.instance_id,
        UsageMetric.storage_gb,
        9.5,
        period_start,
        now,
    )

    count = check_plan_limits()
    assert count >= 1  # shared in-memory DB may have instances from other tests

    notif = db_session.scalar(
        select(Notification)
        .where(Notification.category == NotificationCategory.system)
        .where(Notification.title.contains(instance.org_code))
    )
    assert notif is not None
