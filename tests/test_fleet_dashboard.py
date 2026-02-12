from __future__ import annotations

import uuid

from app.models.health_check import HealthCheck, HealthStatus
from app.models.instance import Instance, InstanceStatus
from app.models.server import Server, ServerStatus
from app.services.fleet_service import FleetService
from app.services.health_service import HealthService


def _make_server(db_session, name: str = "srv") -> Server:
    server = Server(
        name=f"{name}-{uuid.uuid4().hex[:6]}",
        hostname=f"{name}.example.com",
        status=ServerStatus.connected,
    )
    db_session.add(server)
    db_session.flush()
    return server


def _make_instance(db_session, server: Server, org_code: str | None = None, **kwargs) -> Instance:
    code = org_code or f"TST_{uuid.uuid4().hex[:6]}"
    inst = Instance(
        server_id=server.server_id,
        org_code=code,
        org_name=f"Org {code}",
        app_port=8100 + hash(code) % 100,
        db_port=5500 + hash(code) % 100,
        redis_port=6400 + hash(code) % 100,
        status=kwargs.get("status", InstanceStatus.running),
        deployed_git_ref=kwargs.get("deployed_git_ref"),
        domain=kwargs.get("domain"),
    )
    db_session.add(inst)
    db_session.flush()
    return inst


class TestFleetService:
    def test_empty_fleet(self, db_session):
        """Fleet overview with no instances returns zeroed stats."""
        svc = FleetService(db_session)
        result = svc.get_fleet_overview()
        assert result["stats"]["total_instances"] == 0
        assert result["heatmap"] == []
        assert result["top_consumers"] == []

    def test_heatmap_includes_running_instances(self, db_session):
        """Running instances appear in the heatmap."""
        server = _make_server(db_session)
        inst = _make_instance(db_session, server, status=InstanceStatus.running)
        # Add a health check
        check = HealthCheck(
            instance_id=inst.instance_id,
            status=HealthStatus.healthy,
            response_ms=42,
            cpu_percent=15.0,
            memory_mb=256,
        )
        db_session.add(check)
        db_session.flush()

        svc = FleetService(db_session)
        result = svc.get_fleet_overview()
        assert len(result["heatmap"]) >= 1
        tile = next(t for t in result["heatmap"] if t["org_code"] == inst.org_code)
        assert tile["health_state"] == "healthy"
        assert tile["response_ms"] == 42

    def test_version_matrix(self, db_session):
        """Version matrix groups instances by deployed_git_ref."""
        server = _make_server(db_session)
        _make_instance(db_session, server, deployed_git_ref="v1.0.0")
        _make_instance(db_session, server, deployed_git_ref="v1.0.0")
        _make_instance(db_session, server, deployed_git_ref="v2.0.0")

        svc = FleetService(db_session)
        result = svc.get_fleet_overview()
        vm = result["version_matrix"]
        assert vm.get("v1.0.0", 0) >= 2
        assert vm.get("v2.0.0", 0) >= 1

    def test_server_breakdown(self, db_session):
        """Server breakdown shows instance count per server."""
        srv1 = _make_server(db_session, "alpha")
        srv2 = _make_server(db_session, "beta")
        _make_instance(db_session, srv1)
        _make_instance(db_session, srv1)
        _make_instance(db_session, srv2)

        svc = FleetService(db_session)
        result = svc.get_fleet_overview()
        breakdown = result["server_breakdown"]
        assert len(breakdown) >= 2
        counts = {b["server_id"]: b["instance_count"] for b in breakdown}
        assert counts.get(str(srv1.server_id), 0) >= 2
        assert counts.get(str(srv2.server_id), 0) >= 1


class TestHealthServiceDashboardStats:
    def test_version_matrix_in_stats(self, db_session):
        """get_dashboard_stats includes version_matrix."""
        server = _make_server(db_session)
        _make_instance(db_session, server, deployed_git_ref="v1.2.3")

        svc = HealthService(db_session)
        stats = svc.get_dashboard_stats()
        assert "version_matrix" in stats
        assert stats["version_matrix"].get("v1.2.3", 0) >= 1

    def test_status_timeline_in_stats(self, db_session):
        """get_dashboard_stats includes status_timeline."""
        svc = HealthService(db_session)
        stats = svc.get_dashboard_stats()
        assert "status_timeline" in stats

    def test_server_breakdown_in_stats(self, db_session):
        """get_dashboard_stats includes server_breakdown."""
        server = _make_server(db_session)
        _make_instance(db_session, server)

        svc = HealthService(db_session)
        stats = svc.get_dashboard_stats()
        assert "server_breakdown" in stats
        assert len(stats["server_breakdown"]) >= 1
