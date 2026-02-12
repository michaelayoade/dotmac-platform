from __future__ import annotations

import json
import logging
from datetime import UTC, datetime
from uuid import UUID

import httpx
from sqlalchemy import select
from sqlalchemy.orm import Session

from app.models.health_check import HealthCheck
from app.models.instance import Instance
from app.models.otel_config import OtelExportConfig
from app.services.settings_crypto import decrypt_value, encrypt_value

logger = logging.getLogger(__name__)


class OtelExportService:
    def __init__(self, db: Session) -> None:
        self.db = db

    def configure(
        self,
        instance_id: UUID,
        endpoint_url: str,
        protocol: str = "http/protobuf",
        headers: dict[str, str] | None = None,
        export_interval_seconds: int = 60,
    ) -> OtelExportConfig:
        """Create or update OTel export configuration for an instance."""
        instance = self.db.get(Instance, instance_id)
        if not instance:
            raise ValueError(f"Instance {instance_id} not found")

        endpoint_url = endpoint_url.strip()
        if not endpoint_url.startswith(("http://", "https://")):
            raise ValueError("Endpoint URL must start with http:// or https://")

        headers_enc: str | None = None
        if headers:
            headers_enc = encrypt_value(json.dumps(headers))

        existing = self.get_config(instance_id)
        if existing:
            existing.endpoint_url = endpoint_url
            existing.protocol = protocol
            existing.headers_enc = headers_enc
            existing.export_interval_seconds = export_interval_seconds
            existing.is_active = True
            existing.last_error = None
            self.db.flush()
            return existing

        config = OtelExportConfig(
            instance_id=instance_id,
            endpoint_url=endpoint_url,
            protocol=protocol,
            headers_enc=headers_enc,
            export_interval_seconds=export_interval_seconds,
        )
        self.db.add(config)
        self.db.flush()
        return config

    def get_config(self, instance_id: UUID) -> OtelExportConfig | None:
        """Get OTel export config for an instance."""
        stmt = select(OtelExportConfig).where(OtelExportConfig.instance_id == instance_id)
        return self.db.scalar(stmt)

    def delete_config(self, instance_id: UUID) -> None:
        """Delete OTel export config for an instance."""
        config = self.get_config(instance_id)
        if config:
            self.db.delete(config)
            self.db.flush()

    def _get_decrypted_headers(self, config: OtelExportConfig) -> dict[str, str]:
        """Decrypt stored headers."""
        if not config.headers_enc:
            return {}
        try:
            raw = decrypt_value(config.headers_enc)
            result: dict[str, str] = json.loads(raw)
            return result
        except (json.JSONDecodeError, RuntimeError):
            logger.warning("Failed to decrypt headers for config %s", config.id)
            return {}

    def _build_otlp_payload(self, instance: Instance, check: HealthCheck) -> dict:
        """Build an OTLP JSON metrics payload from a health check."""
        now_ns = int(datetime.now(UTC).timestamp() * 1_000_000_000)
        check_ns = int(check.checked_at.timestamp() * 1_000_000_000) if check.checked_at else now_ns

        def _gauge(name: str, description: str, value: float | int | None, unit: str = "") -> dict | None:
            if value is None:
                return None
            return {
                "name": name,
                "description": description,
                "unit": unit,
                "gauge": {
                    "dataPoints": [
                        {
                            "timeUnixNano": str(check_ns),
                            "asDouble": float(value),
                            "attributes": [],
                        }
                    ]
                },
            }

        metrics: list[dict | None] = [
            _gauge("instance.cpu.percent", "CPU utilization percentage", check.cpu_percent, "%"),
            _gauge("instance.memory.usage", "Memory usage in MB", check.memory_mb, "MB"),
            _gauge("instance.db.size", "Database size in MB", check.db_size_mb, "MB"),
            _gauge("instance.db.connections", "Active database connections", check.active_connections),
            _gauge("instance.response.time", "Health check response time", check.response_ms, "ms"),
            _gauge("instance.disk.usage", "Disk usage in MB", check.disk_usage_mb, "MB"),
        ]
        filtered_metrics: list[dict] = [m for m in metrics if m is not None]

        return {
            "resourceMetrics": [
                {
                    "resource": {
                        "attributes": [
                            {"key": "service.name", "value": {"stringValue": instance.org_code}},
                            {"key": "instance.id", "value": {"stringValue": str(instance.instance_id)}},
                        ]
                    },
                    "scopeMetrics": [
                        {
                            "scope": {"name": "dotmac-platform", "version": "1.0.0"},
                            "metrics": filtered_metrics,
                        }
                    ],
                }
            ]
        }

    def export_metrics(self, instance_id: UUID) -> dict:
        """Export metrics for a single instance to its configured OTLP endpoint."""
        config = self.get_config(instance_id)
        if not config:
            raise ValueError(f"No OTel config for instance {instance_id}")
        if not config.is_active:
            raise ValueError("OTel export is not active for this instance")

        instance = self.db.get(Instance, instance_id)
        if not instance:
            raise ValueError(f"Instance {instance_id} not found")

        # Get latest health check
        from app.services.health_service import HealthService

        health_svc = HealthService(self.db)
        check = health_svc.get_latest_check(instance_id)
        if not check:
            raise ValueError(f"No health check data for instance {instance_id}")

        payload = self._build_otlp_payload(instance, check)
        headers: dict[str, str] = {"Content-Type": "application/json"}
        headers.update(self._get_decrypted_headers(config))

        # Determine endpoint path
        url = config.endpoint_url.rstrip("/")
        if not url.endswith("/v1/metrics"):
            url = f"{url}/v1/metrics"

        try:
            with httpx.Client(timeout=30) as http_client:
                resp = http_client.post(url, json=payload, headers=headers)
                resp.raise_for_status()
            config.last_export_at = datetime.now(UTC)
            config.last_error = None
            self.db.flush()
            return {"status": "ok", "metrics_count": len(payload["resourceMetrics"][0]["scopeMetrics"][0]["metrics"])}
        except httpx.HTTPError as exc:
            error_msg = str(exc)[:500]
            config.last_error = error_msg
            config.last_export_at = datetime.now(UTC)
            self.db.flush()
            logger.warning("OTel export failed for instance %s: %s", instance_id, error_msg)
            return {"status": "error", "error": error_msg}

    def export_all_active(self) -> dict:
        """Export metrics for all active configurations."""
        stmt = select(OtelExportConfig).where(OtelExportConfig.is_active.is_(True))
        configs = list(self.db.scalars(stmt).all())

        results: dict[str, str] = {}
        for config in configs:
            try:
                result = self.export_metrics(config.instance_id)
                results[str(config.instance_id)] = result.get("status", "unknown")
            except (ValueError, RuntimeError) as exc:
                results[str(config.instance_id)] = f"error: {exc}"
                logger.warning("OTel export skipped for %s: %s", config.instance_id, exc)

        return {"total": len(configs), "results": results}
