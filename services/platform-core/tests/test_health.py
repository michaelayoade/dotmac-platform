"""
Tests for the health module.
"""

from typing import Dict

import pytest
from httpx import AsyncClient

from app.modules.health.models import ServiceStatus


@pytest.mark.asyncio
async def test_health_check(async_client: AsyncClient):
    """
    Test the health check endpoint.
    """
    response = await async_client.get("/api/health/healthz")
    assert response.status_code == 200
    data: Dict = response.json()
    assert data["status"] == ServiceStatus.ok
    assert "version" in data
    assert "timestamp" in data


@pytest.mark.asyncio
async def test_readiness_check(async_client: AsyncClient):
    """
    Test the readiness check endpoint.

    Note: This test will pass because we're using mock dependencies.
    In a real environment, this would check actual database and Redis connectivity.
    """
    response = await async_client.get("/api/health/readyz")
    assert response.status_code == 200
    data: Dict = response.json()
    assert data["status"] in [
        ServiceStatus.ok,
        ServiceStatus.warning,
        ServiceStatus.error,
    ]
    assert "version" in data
    assert "timestamp" in data
    assert "components" in data
    assert len(data["components"]) > 0


@pytest.mark.asyncio
async def test_metrics(async_client: AsyncClient):
    """
    Test the metrics endpoint.
    """
    response = await async_client.get("/api/health/metrics")
    assert response.status_code == 200
    # Check if the response content looks like Prometheus metrics
    assert "# HELP" in response.text
    assert "# TYPE" in response.text
