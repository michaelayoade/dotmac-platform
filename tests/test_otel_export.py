from __future__ import annotations

import uuid
from unittest.mock import MagicMock, patch

import pytest

from app.models.health_check import HealthCheck, HealthStatus
from app.models.instance import Instance, InstanceStatus
from app.models.otel_config import OtelExportConfig  # noqa: F401
from app.models.server import Server, ServerStatus
from app.services.otel_export_service import OtelExportService


def _make_server(db_session) -> Server:
    server = Server(
        name=f"srv-{uuid.uuid4().hex[:6]}",
        hostname="test.example.com",
        status=ServerStatus.connected,
    )
    db_session.add(server)
    db_session.flush()
    return server


def _make_instance(db_session, server: Server) -> Instance:
    inst = Instance(
        server_id=server.server_id,
        org_code=f"OTEL_{uuid.uuid4().hex[:6]}",
        org_name="OTel Test Org",
        app_port=8200 + hash(uuid.uuid4().hex) % 100,
        db_port=5600,
        redis_port=6500,
        status=InstanceStatus.running,
    )
    db_session.add(inst)
    db_session.flush()
    return inst


class TestOtelExportService:
    def test_configure_creates_new(self, db_session):
        """Configure creates a new OTel export config."""
        server = _make_server(db_session)
        inst = _make_instance(db_session, server)

        svc = OtelExportService(db_session)
        config = svc.configure(
            instance_id=inst.instance_id,
            endpoint_url="https://otel.example.com:4318",
            protocol="http/protobuf",
            headers={"Authorization": "Bearer test-token"},
            export_interval_seconds=30,
        )

        assert config.endpoint_url == "https://otel.example.com:4318"
        assert config.protocol == "http/protobuf"
        assert config.headers_enc is not None  # encrypted
        assert config.export_interval_seconds == 30
        assert config.is_active is True

    def test_configure_updates_existing(self, db_session):
        """Configure updates an existing config instead of creating duplicate."""
        server = _make_server(db_session)
        inst = _make_instance(db_session, server)

        svc = OtelExportService(db_session)
        config1 = svc.configure(
            instance_id=inst.instance_id,
            endpoint_url="https://old.example.com:4318",
        )
        config_id = config1.id

        config2 = svc.configure(
            instance_id=inst.instance_id,
            endpoint_url="https://new.example.com:4318",
        )

        assert config2.id == config_id
        assert config2.endpoint_url == "https://new.example.com:4318"

    def test_configure_invalid_url(self, db_session):
        """Configure rejects invalid endpoint URLs."""
        server = _make_server(db_session)
        inst = _make_instance(db_session, server)

        svc = OtelExportService(db_session)
        with pytest.raises(ValueError, match="(?i)http"):
            svc.configure(instance_id=inst.instance_id, endpoint_url="not-a-url")

    def test_configure_nonexistent_instance(self, db_session):
        """Configure raises ValueError for unknown instance."""
        svc = OtelExportService(db_session)
        with pytest.raises(ValueError):
            svc.configure(instance_id=uuid.uuid4(), endpoint_url="https://otel.example.com:4318")

    def test_get_config(self, db_session):
        """Get config returns the stored configuration."""
        server = _make_server(db_session)
        inst = _make_instance(db_session, server)

        svc = OtelExportService(db_session)
        svc.configure(instance_id=inst.instance_id, endpoint_url="https://otel.example.com:4318")

        config = svc.get_config(inst.instance_id)
        assert config is not None
        assert config.endpoint_url == "https://otel.example.com:4318"

    def test_get_config_nonexistent(self, db_session):
        """Get config returns None for unconfigured instance."""
        svc = OtelExportService(db_session)
        assert svc.get_config(uuid.uuid4()) is None

    def test_delete_config(self, db_session):
        """Delete removes the config."""
        server = _make_server(db_session)
        inst = _make_instance(db_session, server)

        svc = OtelExportService(db_session)
        svc.configure(instance_id=inst.instance_id, endpoint_url="https://otel.example.com:4318")
        assert svc.get_config(inst.instance_id) is not None

        svc.delete_config(inst.instance_id)
        assert svc.get_config(inst.instance_id) is None

    def test_build_otlp_payload(self, db_session):
        """OTLP payload has correct structure."""
        server = _make_server(db_session)
        inst = _make_instance(db_session, server)
        check = HealthCheck(
            instance_id=inst.instance_id,
            status=HealthStatus.healthy,
            response_ms=42,
            cpu_percent=25.0,
            memory_mb=512,
            db_size_mb=100,
            active_connections=5,
        )
        db_session.add(check)
        db_session.flush()

        svc = OtelExportService(db_session)
        payload = svc._build_otlp_payload(inst, check)

        assert "resourceMetrics" in payload
        rm = payload["resourceMetrics"][0]
        assert rm["resource"]["attributes"][0]["value"]["stringValue"] == inst.org_code
        metrics = rm["scopeMetrics"][0]["metrics"]
        metric_names = [m["name"] for m in metrics]
        assert "instance.cpu.percent" in metric_names
        assert "instance.memory.usage" in metric_names

    def test_export_metrics_no_config(self, db_session):
        """Export raises ValueError when no config exists."""
        svc = OtelExportService(db_session)
        with pytest.raises(ValueError):
            svc.export_metrics(uuid.uuid4())

    @patch("app.services.otel_export_service.httpx.Client")
    def test_export_metrics_success(self, mock_client_cls, db_session):
        """Export metrics sends OTLP payload to configured endpoint."""
        server = _make_server(db_session)
        inst = _make_instance(db_session, server)

        # Add health check
        check = HealthCheck(
            instance_id=inst.instance_id,
            status=HealthStatus.healthy,
            response_ms=42,
            cpu_percent=10.0,
        )
        db_session.add(check)
        db_session.flush()

        # Configure OTel
        svc = OtelExportService(db_session)
        svc.configure(instance_id=inst.instance_id, endpoint_url="https://otel.example.com:4318")

        # Mock httpx
        mock_response = MagicMock()
        mock_response.raise_for_status = MagicMock()
        mock_client = MagicMock()
        mock_client.__enter__ = MagicMock(return_value=mock_client)
        mock_client.__exit__ = MagicMock(return_value=False)
        mock_client.post.return_value = mock_response
        mock_client_cls.return_value = mock_client

        result = svc.export_metrics(inst.instance_id)
        assert result["status"] == "ok"
        mock_client.post.assert_called_once()

    def test_decrypted_headers(self, db_session):
        """Encrypted headers can be decrypted."""
        server = _make_server(db_session)
        inst = _make_instance(db_session, server)

        svc = OtelExportService(db_session)
        config = svc.configure(
            instance_id=inst.instance_id,
            endpoint_url="https://otel.example.com:4318",
            headers={"Authorization": "Bearer secret123"},
        )

        decrypted = svc._get_decrypted_headers(config)
        assert decrypted == {"Authorization": "Bearer secret123"}

    def test_export_all_active_empty(self, db_session):
        """export_all_active with no configs returns empty results."""
        svc = OtelExportService(db_session)
        result = svc.export_all_active()
        assert result["total"] == 0


class TestOtelSchemas:
    def test_valid_create(self):
        from app.schemas.otel import OtelConfigCreate

        schema = OtelConfigCreate(endpoint_url="https://otel.example.com:4318")
        assert schema.protocol == "http/protobuf"
        assert schema.export_interval_seconds == 60

    def test_invalid_url(self):
        from app.schemas.otel import OtelConfigCreate

        with pytest.raises(Exception):
            OtelConfigCreate(endpoint_url="not-a-url")

    def test_invalid_protocol(self):
        from app.schemas.otel import OtelConfigCreate

        with pytest.raises(Exception):
            OtelConfigCreate(endpoint_url="https://otel.example.com", protocol="invalid")
