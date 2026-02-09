"""Tests for MetricsExportService."""

import uuid
from datetime import UTC, datetime
from unittest.mock import MagicMock, patch

from app.metrics import (
    BACKUP_LAST_SUCCESS,
    DEPLOYMENTS_TOTAL,
    INSTANCE_CONNECTIONS,
    INSTANCE_CPU,
    INSTANCE_DB_SIZE,
    INSTANCE_MEMORY,
    INSTANCE_RESPONSE_MS,
)
from app.models.health_check import HealthCheck, HealthStatus
from app.models.instance import Instance, InstanceStatus
from app.models.server import Server
from app.services.metrics_export import MetricsExportService
from app.services.ssh_service import SSHResult
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


def _make_instance(db_session, server):
    code = f"org{uuid.uuid4().hex[:6]}"
    instance = Instance(
        server_id=server.server_id,
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


def _get_sample_value(metric, labels: dict) -> float | None:
    target_names = {metric._name, f"{metric._name}_total"}  # type: ignore[attr-defined]
    for sample in metric.collect()[0].samples:
        if sample.name in target_names and sample.labels == labels:
            return sample.value
    return None


def _clear_metrics():
    INSTANCE_CPU.clear()
    INSTANCE_MEMORY.clear()
    INSTANCE_DB_SIZE.clear()
    INSTANCE_CONNECTIONS.clear()
    INSTANCE_RESPONSE_MS.clear()
    DEPLOYMENTS_TOTAL.clear()
    BACKUP_LAST_SUCCESS.clear()


def test_update_instance_metrics_sets_gauges(db_session):
    _clear_metrics()
    server = _make_server(db_session)
    instance = _make_instance(db_session, server)
    check = HealthCheck(
        instance_id=instance.instance_id,
        status=HealthStatus.healthy,
        response_ms=120,
        cpu_percent=12.5,
        memory_mb=256,
        db_size_mb=1024,
        active_connections=7,
        checked_at=datetime.now(UTC),
    )
    db_session.add(check)
    db_session.commit()

    svc = MetricsExportService(db_session)
    svc.update_instance_metrics(instance, check)

    labels = {"instance_id": str(instance.instance_id), "org_code": instance.org_code}
    assert _get_sample_value(INSTANCE_CPU, labels) == 12.5
    assert _get_sample_value(INSTANCE_MEMORY, labels) == 256
    assert _get_sample_value(INSTANCE_DB_SIZE, labels) == 1024
    assert _get_sample_value(INSTANCE_CONNECTIONS, labels) == 7
    assert _get_sample_value(INSTANCE_RESPONSE_MS, labels) == 120


def test_record_deployment_increments_counter(db_session):
    _clear_metrics()
    server = _make_server(db_session)
    instance = _make_instance(db_session, server)

    svc = MetricsExportService(db_session)
    svc.record_deployment(instance.instance_id, True)
    svc.record_deployment(instance.instance_id, False)

    success_labels = {"instance_id": str(instance.instance_id), "status": "success"}
    failed_labels = {"instance_id": str(instance.instance_id), "status": "failed"}

    assert _get_sample_value(DEPLOYMENTS_TOTAL, success_labels) == 1.0
    assert _get_sample_value(DEPLOYMENTS_TOTAL, failed_labels) == 1.0


def test_export_instance_logs_reads_output(db_session):
    server = _make_server(db_session)
    instance = _make_instance(db_session, server)

    fake_ssh = MagicMock()
    fake_ssh.exec_command.return_value = SSHResult(0, "line1\nline2\n", "")

    with patch("app.services.metrics_export.get_ssh_for_server", return_value=fake_ssh):
        svc = MetricsExportService(db_session)
        logs = svc.export_instance_logs(instance.instance_id, stream="app", lines=2, since="1h")

    assert logs == ["line1", "line2"]


def test_export_instance_logs_rejects_invalid_stream(db_session):
    server = _make_server(db_session)
    instance = _make_instance(db_session, server)
    svc = MetricsExportService(db_session)

    try:
        svc.export_instance_logs(instance.instance_id, stream="bad", lines=10)
    except ValueError as e:
        assert "Invalid log stream" in str(e)
    else:
        assert False, "expected ValueError"


def test_get_log_streams_marks_running(db_session):
    server = _make_server(db_session)
    instance = _make_instance(db_session, server)

    fake_ssh = MagicMock()
    fake_ssh.exec_command.return_value = SSHResult(0, "dotmac_%s_app\n" % instance.org_code.lower(), "")

    with patch("app.services.metrics_export.get_ssh_for_server", return_value=fake_ssh):
        svc = MetricsExportService(db_session)
        streams = svc.get_log_streams(instance.instance_id)

    app_stream = next(s for s in streams if s["stream"] == "app")
    assert app_stream["running"] is True
