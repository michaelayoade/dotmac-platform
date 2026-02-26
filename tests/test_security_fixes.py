"""
Tests for security and code quality fixes (H1–H4, M1–M4).
"""

from __future__ import annotations

import uuid

from app.models.alert_rule import AlertChannel, AlertEvent, AlertMetric, AlertOperator
from app.models.backup import Backup, BackupStatus, BackupType
from app.models.instance import Instance, InstanceStatus
from app.models.instance_domain import DomainStatus, InstanceDomain
from app.models.organization import Organization
from app.models.plan import Plan
from app.models.server import Server

# ──────────────── helpers ────────────────


def _make_server(db_session) -> Server:
    server = Server(
        name=f"srv-{uuid.uuid4().hex[:6]}",
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


def _make_instance(db_session, server: Server, org_id) -> Instance:
    code = f"ORG{uuid.uuid4().hex[:6].upper()}"
    instance = Instance(
        server_id=server.server_id,
        org_id=org_id,
        org_code=code,
        org_name=f"Org {code}",
        app_port=8080,
        db_port=5432,
        redis_port=6379,
        status=InstanceStatus.running,
    )
    db_session.add(instance)
    db_session.commit()
    db_session.refresh(instance)
    return instance


def _make_org(db_session) -> Organization:
    code = f"ORG{uuid.uuid4().hex[:6].upper()}"
    org = Organization(
        org_code=code,
        org_name=f"Org {code}",
        is_active=True,
    )
    db_session.add(org)
    db_session.commit()
    db_session.refresh(org)
    return org


def _make_backup(db_session, instance: Instance) -> Backup:
    backup = Backup(
        instance_id=instance.instance_id,
        backup_type=BackupType.full,
        status=BackupStatus.completed,
        file_path="/var/backups/secret/path.tar.gz",
        size_bytes=1024,
    )
    db_session.add(backup)
    db_session.commit()
    db_session.refresh(backup)
    return backup


def _make_domain(db_session, instance: Instance) -> InstanceDomain:
    domain = InstanceDomain(
        instance_id=instance.instance_id,
        domain=f"{uuid.uuid4().hex[:8]}.example.com",
        is_primary=False,
        status=DomainStatus.pending_verification,
        verification_token="secret-verification-token-12345",
    )
    db_session.add(domain)
    db_session.commit()
    db_session.refresh(domain)
    return domain


def _make_plan(db_session) -> Plan:
    plan = Plan(
        name=f"plan-{uuid.uuid4().hex[:6]}",
        description="Test plan",
        max_users=10,
        max_storage_gb=5,
    )
    db_session.add(plan)
    db_session.commit()
    db_session.refresh(plan)
    return plan


# ──────────────── H1: file_path removed from backup list ────────────────


class TestH1BackupFilePath:
    def test_file_path_not_in_backup_list(self, client, db_session, admin_headers, admin_org_id):
        server = _make_server(db_session)
        instance = _make_instance(db_session, server, admin_org_id)
        _make_backup(db_session, instance)

        resp = client.get(f"/instances/{instance.instance_id}/backups", headers=admin_headers)
        assert resp.status_code == 200
        data = resp.json()
        assert len(data) >= 1
        for item in data:
            assert "file_path" not in item
            assert "backup_id" in item
            assert "status" in item


# ──────────────── H2: verification_token removed from domain list ────────────────


class TestH2DomainVerificationToken:
    def test_verification_token_not_in_domain_list(self, client, db_session, admin_headers, admin_org_id):
        server = _make_server(db_session)
        instance = _make_instance(db_session, server, admin_org_id)
        _make_domain(db_session, instance)

        resp = client.get(f"/instances/{instance.instance_id}/domains", headers=admin_headers)
        assert resp.status_code == 200
        data = resp.json()
        assert len(data) >= 1
        for item in data:
            assert "verification_token" not in item
            assert "domain_id" in item
            assert "domain" in item


# ──────────────── H5: Alerts tenant isolation ────────────────


class TestH5AlertsTenantIsolation:
    def test_alert_rules_list_scoped_to_callers_org(self, client, db_session, admin_headers, admin_org_id):
        from app.services.alert_service import AlertService

        server = _make_server(db_session)
        caller_instance = _make_instance(db_session, server, admin_org_id)
        other_org = _make_org(db_session)
        other_instance = _make_instance(db_session, server, other_org.org_id)

        svc = AlertService(db_session)
        own_rule = svc.create_rule(
            name="caller-rule",
            metric=AlertMetric.cpu_percent,
            operator=AlertOperator.gt,
            threshold=80.0,
            channel=AlertChannel.webhook,
            instance_id=caller_instance.instance_id,
        )
        other_rule = svc.create_rule(
            name="other-rule",
            metric=AlertMetric.cpu_percent,
            operator=AlertOperator.gt,
            threshold=80.0,
            channel=AlertChannel.webhook,
            instance_id=other_instance.instance_id,
        )
        db_session.commit()

        resp = client.get("/instances/alerts/rules", params={"limit": 200}, headers=admin_headers)
        assert resp.status_code == 200
        rule_ids = {item["rule_id"] for item in resp.json()}
        assert str(own_rule.rule_id) in rule_ids
        assert str(other_rule.rule_id) not in rule_ids

    def test_alert_events_rejects_cross_tenant_instance_id(self, client, db_session, admin_headers, admin_org_id):
        from app.services.alert_service import AlertService

        server = _make_server(db_session)
        caller_instance = _make_instance(db_session, server, admin_org_id)
        other_org = _make_org(db_session)
        other_instance = _make_instance(db_session, server, other_org.org_id)

        svc = AlertService(db_session)
        own_rule = svc.create_rule(
            name="caller-events-rule",
            metric=AlertMetric.cpu_percent,
            operator=AlertOperator.gt,
            threshold=80.0,
            channel=AlertChannel.webhook,
            instance_id=caller_instance.instance_id,
        )
        other_rule = svc.create_rule(
            name="other-events-rule",
            metric=AlertMetric.cpu_percent,
            operator=AlertOperator.gt,
            threshold=80.0,
            channel=AlertChannel.webhook,
            instance_id=other_instance.instance_id,
        )
        db_session.add(
            AlertEvent(
                rule_id=own_rule.rule_id,
                instance_id=caller_instance.instance_id,
                metric_value=95.0,
                threshold=80.0,
            )
        )
        db_session.add(
            AlertEvent(
                rule_id=other_rule.rule_id,
                instance_id=other_instance.instance_id,
                metric_value=95.0,
                threshold=80.0,
            )
        )
        db_session.commit()

        resp = client.get(
            "/instances/alerts/events",
            params={"instance_id": str(other_instance.instance_id)},
            headers=admin_headers,
        )
        assert resp.status_code == 403
        body = resp.json()
        assert body.get("message", body.get("detail")) == "Access denied"


# ──────────────── H3: Rate limits on MFA verify, refresh, password change ────────────────


class TestH3RateLimits:
    def test_mfa_verify_rate_limited(self, client):
        """MFA verify should return 429 after 5 requests in 300s window."""
        for _ in range(5):
            client.post("/auth/mfa/verify", json={"mfa_token": "fake", "code": "123456"})
        resp = client.post("/auth/mfa/verify", json={"mfa_token": "fake", "code": "123456"})
        assert resp.status_code == 429

    def test_refresh_rate_limited(self, client):
        """Refresh should return 429 after 10 requests in 60s window."""
        for _ in range(10):
            client.post("/auth/refresh", json={"refresh_token": "fake"})
        resp = client.post("/auth/refresh", json={"refresh_token": "fake"})
        assert resp.status_code == 429

    def test_password_change_rate_limited(self, client, admin_headers):
        """Password change should return 429 after 10 requests in 60s window."""
        payload = {"current_password": "wrong", "new_password": "newpass123"}
        for _ in range(10):
            client.post("/auth/me/password", json=payload, headers=admin_headers)
        resp = client.post("/auth/me/password", json=payload, headers=admin_headers)
        assert resp.status_code == 429


# ──────────────── M1: Batch deploy input validation ────────────────


class TestM1BatchDeployValidation:
    def test_empty_instance_ids_rejected(self, client, admin_headers):
        resp = client.post(
            "/instances/batch-deploy",
            params={"strategy": "rolling"},
            json={"instance_ids": []},
            headers=admin_headers,
        )
        # FastAPI may deliver this as query param or body; try the endpoint
        assert resp.status_code == 400 or resp.status_code == 422

    def test_invalid_strategy_rejected(self, client, admin_headers):
        resp = client.post(
            "/instances/batch-deploy",
            params={"instance_ids": ["abc"], "strategy": "invalid_strategy"},
            headers=admin_headers,
        )
        assert resp.status_code == 400 or resp.status_code == 422


# ──────────────── M2: Maintenance window bounds validation ────────────────


class TestM2MaintenanceWindowBounds:
    def test_day_of_week_out_of_range(self, client, db_session, admin_headers, admin_org_id):
        server = _make_server(db_session)
        instance = _make_instance(db_session, server, admin_org_id)
        resp = client.post(
            f"/instances/{instance.instance_id}/maintenance-windows",
            params={"day_of_week": 7, "start_hour": 2},
            headers=admin_headers,
        )
        assert resp.status_code == 422

    def test_start_hour_out_of_range(self, client, db_session, admin_headers, admin_org_id):
        server = _make_server(db_session)
        instance = _make_instance(db_session, server, admin_org_id)
        resp = client.post(
            f"/instances/{instance.instance_id}/maintenance-windows",
            params={"day_of_week": 1, "start_hour": 25},
            headers=admin_headers,
        )
        assert resp.status_code == 422

    def test_minute_out_of_range(self, client, db_session, admin_headers, admin_org_id):
        server = _make_server(db_session)
        instance = _make_instance(db_session, server, admin_org_id)
        resp = client.post(
            f"/instances/{instance.instance_id}/maintenance-windows",
            params={"day_of_week": 1, "start_hour": 2, "start_minute": 60},
            headers=admin_headers,
        )
        assert resp.status_code == 422


# ──────────────── M3: Usage metric enum validation ────────────────


class TestM3UsageMetricValidation:
    def test_invalid_metric_returns_400(self, client, db_session, admin_headers, admin_org_id):
        server = _make_server(db_session)
        instance = _make_instance(db_session, server, admin_org_id)
        resp = client.get(
            f"/instances/{instance.instance_id}/usage",
            params={"metric": "not_a_real_metric"},
            headers=admin_headers,
        )
        assert resp.status_code == 400
        assert "Invalid usage metric" in resp.json()["message"]


# ──────────────── M4: Plan ID validation ────────────────


class TestM4PlanIdValidation:
    def test_nonexistent_plan_returns_404(self, client, db_session, admin_headers, admin_org_id):
        server = _make_server(db_session)
        instance = _make_instance(db_session, server, admin_org_id)
        fake_plan_id = str(uuid.uuid4())
        resp = client.put(
            f"/instances/{instance.instance_id}/plan",
            params={"plan_id": fake_plan_id},
            headers=admin_headers,
        )
        assert resp.status_code == 404
        assert "Plan not found" in resp.json()["message"]

    def test_valid_plan_id_succeeds(self, client, db_session, admin_headers, admin_org_id):
        server = _make_server(db_session)
        instance = _make_instance(db_session, server, admin_org_id)
        plan = _make_plan(db_session)
        resp = client.put(
            f"/instances/{instance.instance_id}/plan",
            params={"plan_id": str(plan.plan_id)},
            headers=admin_headers,
        )
        assert resp.status_code == 200
        assert resp.json()["plan_id"] == str(plan.plan_id)
