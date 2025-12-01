import types
from datetime import UTC, datetime

import pytest
from fastapi import FastAPI
from httpx import ASGITransport, AsyncClient

from dotmac.platform.service_api import license_api
from dotmac.shared.service_auth import ServiceCredentials

pytestmark = pytest.mark.asyncio


class _MockResult:
    """Minimal mock for SQLAlchemy result objects."""

    def __init__(self, obj):
        self.obj = obj

    def scalar_one_or_none(self):
        return self.obj

    def scalars(self):
        return self

    def first(self):
        return self.obj


class _MockSession:
    """Queue-based mock session for sequential execute responses."""

    def __init__(self, results):
        self._iter = iter(results)
        self.committed = False

    async def execute(self, _query):
        return next(self._iter)

    async def commit(self):
        self.committed = True


def _build_app(session: _MockSession, tenant_id: str = "tenant-1") -> FastAPI:
    """Create a FastAPI app with dependency overrides for service API tests."""
    app = FastAPI()
    app.include_router(license_api.router)

    # Override service auth to bypass JWTs
    app.dependency_overrides[license_api.require_isp_service] = lambda: ServiceCredentials(
        service_id="isp-test",
        service_type="isp",
        tenant_id=tenant_id,
        permissions=[],
    )

    # Override DB session dependency
    app.dependency_overrides[license_api.get_async_session] = lambda: session
    return app


async def _request(app: FastAPI, method: str, url: str, json: dict | None = None):
    """Helper to make async requests against the ASGI app."""
    async with AsyncClient(transport=ASGITransport(app=app), base_url="http://test") as client:
        return await client.request(method, url, json=json)


async def test_validate_blocks_when_activation_limit_reached_without_fingerprint():
    """License validation should fail when activations are at limit even without fingerprint."""
    now = datetime.now(UTC)
    license_obj = types.SimpleNamespace(
        id="lic-1",
        tenant_id="tenant-1",
        license_key="LIC-123",
        status=license_api.LicenseStatus.ACTIVE,
        expiry_date=None,
        grace_period_days=0,
        max_activations=1,
        current_activations=1,
        features={},
        restrictions={},
        updated_at=now,
    )
    tenant = types.SimpleNamespace(
        id="tenant-1",
        name="Test Tenant",
        features={},
        settings={},
        updated_at=now,
        plan_type=None,
    )

    session = _MockSession([_MockResult(license_obj), _MockResult(tenant)])
    app = _build_app(session)

    resp = await _request(
        app,
        "POST",
        "/license/validate",
        json={
            "license_key": "LIC-123",
            "isp_instance_id": "isp-1",
            "version": "1.0.0",
        },
    )
    body = resp.json()

    assert resp.status_code == 200
    assert body["valid"] is False
    assert "Activation limit" in body["message"]


async def test_heartbeat_accepts_body_and_updates_activation():
    """Heartbeat endpoint should accept JSON body and update activation timestamp."""
    activation = types.SimpleNamespace(
        id="act-1",
        activation_token="tok-123",
        status=license_api.ActivationStatus.ACTIVE,
        tenant_id="tenant-1",
        last_heartbeat=None,
    )

    session = _MockSession([_MockResult(activation)])
    app = _build_app(session)

    resp = await _request(
        app,
        "POST",
        "/license/heartbeat",
        json={"activation_token": "tok-123"},
    )
    body = resp.json()

    assert resp.status_code == 200
    assert body["status"] == "acknowledged"
    assert activation.last_heartbeat is not None
