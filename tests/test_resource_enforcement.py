"""Tests for ResourceEnforcementService."""

import uuid
from datetime import UTC, datetime, timedelta

from app.models.feature_flag import InstanceFlag
from app.models.instance import Instance, InstanceStatus
from app.models.module import InstanceModule, Module
from app.models.plan import Plan
from app.models.server import Server
from app.models.usage_record import UsageMetric
from app.services.resource_enforcement import ResourceEnforcementService
from app.services.usage_service import UsageService
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


def _make_instance(db_session, server, plan: Plan | None = None):
    code = f"org{uuid.uuid4().hex[:6]}"
    instance = Instance(
        server_id=server.server_id,
        org_code=code,
        org_name=f"Org {code}",
        app_port=8080,
        db_port=5432,
        redis_port=6379,
        status=InstanceStatus.running,
        plan_id=plan.plan_id if plan else None,
    )
    db_session.add(instance)
    db_session.commit()
    db_session.refresh(instance)
    return instance


def _make_plan(db_session, **kwargs) -> Plan:
    plan = Plan(
        name=f"plan-{uuid.uuid4().hex[:6]}",
        description="test",
        max_users=kwargs.get("max_users", 10),
        max_storage_gb=kwargs.get("max_storage_gb", 5),
        allowed_modules=kwargs.get("allowed_modules", ["core"]),
        allowed_flags=kwargs.get("allowed_flags", ["FEATURE_API_ACCESS"]),
    )
    db_session.add(plan)
    db_session.commit()
    db_session.refresh(plan)
    return plan


def _make_module(db_session, slug: str, *, is_core: bool = False) -> Module:
    mod = Module(
        name=slug.title(),
        slug=slug,
        description="test",
        schemas=[slug],
        dependencies=[],
        is_core=is_core,
        is_active=True,
    )
    db_session.add(mod)
    db_session.commit()
    db_session.refresh(mod)
    return mod


def test_enforce_module_access_blocks_disallowed(db_session):
    server = _make_server(db_session)
    plan = _make_plan(db_session, allowed_modules=["core"])  # disallow "payroll"
    instance = _make_instance(db_session, server, plan=plan)

    svc = ResourceEnforcementService(db_session)
    try:
        svc.enforce_module_access(instance.instance_id, "payroll")
    except ValueError as e:
        assert "not allowed" in str(e)
    else:
        assert False, "expected ValueError"


def test_enforce_flag_access_blocks_disallowed(db_session):
    server = _make_server(db_session)
    plan = _make_plan(db_session, allowed_flags=["FEATURE_API_ACCESS"])  # disallow SSO
    instance = _make_instance(db_session, server, plan=plan)

    svc = ResourceEnforcementService(db_session)
    try:
        svc.enforce_flag_access(instance.instance_id, "FEATURE_SSO_ENABLED")
    except ValueError as e:
        assert "not allowed" in str(e)
    else:
        assert False, "expected ValueError"


def test_check_plan_compliance_reports_limits(db_session):
    server = _make_server(db_session)
    plan = _make_plan(db_session, max_storage_gb=1, allowed_modules=["core"], allowed_flags=["FEATURE_API_ACCESS"])
    instance = _make_instance(db_session, server, plan=plan)

    now = datetime.now(UTC)
    period_start = now.replace(hour=0, minute=0, second=0, microsecond=0)
    UsageService(db_session).record(
        instance.instance_id,
        UsageMetric.storage_gb,
        2.5,
        period_start,
        now,
    )

    svc = ResourceEnforcementService(db_session)
    violations = svc.check_plan_compliance(instance.instance_id)
    assert any(v.kind == "storage" for v in violations)


def test_check_plan_compliance_reports_disallowed_flags(db_session):
    server = _make_server(db_session)
    plan = _make_plan(db_session, allowed_flags=["FEATURE_API_ACCESS"], allowed_modules=["core"])
    instance = _make_instance(db_session, server, plan=plan)

    flag = InstanceFlag(
        instance_id=instance.instance_id,
        flag_key="FEATURE_SSO_ENABLED",
        flag_value="true",
    )
    db_session.add(flag)
    db_session.commit()

    svc = ResourceEnforcementService(db_session)
    violations = svc.check_plan_compliance(instance.instance_id)
    assert any(v.kind == "flag" for v in violations)


def test_check_plan_compliance_reports_disallowed_modules(db_session):
    server = _make_server(db_session)
    plan = _make_plan(db_session, allowed_modules=["core"], allowed_flags=["FEATURE_API_ACCESS"])
    instance = _make_instance(db_session, server, plan=plan)

    mod = _make_module(db_session, "inventory")
    im = InstanceModule(instance_id=instance.instance_id, module_id=mod.module_id, enabled=True)
    db_session.add(im)
    db_session.commit()

    svc = ResourceEnforcementService(db_session)
    violations = svc.check_plan_compliance(instance.instance_id)
    assert any(v.kind == "module" for v in violations)


def test_usage_summary_handles_no_plan(db_session):
    server = _make_server(db_session)
    instance = _make_instance(db_session, server, plan=None)

    svc = ResourceEnforcementService(db_session)
    summary = svc.get_usage_summary(instance.instance_id)
    assert summary["plan_name"] is None
