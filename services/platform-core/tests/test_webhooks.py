"""
Tests for the webhooks module.
"""

from datetime import datetime, timedelta
from unittest.mock import MagicMock, patch

import pytest
from httpx import AsyncClient
from sqlalchemy.ext.asyncio import AsyncSession

from app.modules.webhooks.models import (
    WebhookDelivery,
    WebhookEndpoint,
    WebhookSubscription,
)
from app.modules.webhooks.service import WebhooksService


@pytest.mark.asyncio
async def test_create_endpoint(async_client: AsyncClient, db_session: AsyncSession):
    """Test creating a webhook endpoint."""
    # Create endpoint data
    endpoint_data = {
        "name": "Test Endpoint",
        "url": "https://example.com/webhook",
        "description": "Test webhook endpoint",
        "secret": "test_secret",
    }

    # Send request
    response = await async_client.post("/api/v1/webhooks/endpoints", json=endpoint_data)

    # Check response
    assert response.status_code == 201
    data = response.json()
    assert data["name"] == endpoint_data["name"]
    assert data["url"] == endpoint_data["url"]
    assert data["description"] == endpoint_data["description"]
    assert data["status"] == "active"

    # Check database
    from sqlalchemy import select

    query = select(WebhookEndpoint).where(WebhookEndpoint.id == data["id"])
    result = await db_session.execute(query)
    db_endpoint = result.scalar_one()

    assert db_endpoint is not None
    assert db_endpoint.name == endpoint_data["name"]
    assert db_endpoint.url == endpoint_data["url"]
    assert db_endpoint.secret == endpoint_data["secret"]
    assert db_endpoint.status == "active"


@pytest.mark.asyncio
async def test_get_endpoints(async_client: AsyncClient, db_session: AsyncSession):
    """Test getting webhook endpoints."""
    # Create test endpoints
    for i in range(3):
        endpoint = WebhookEndpoint(
            name=f"Test Endpoint {i}",
            url=f"https://example.com/webhook{i}",
            description=f"Test endpoint {i}",
            secret=f"secret{i}",
            status="active",
        )
        db_session.add(endpoint)
    await db_session.commit()

    # Send request
    response = await async_client.get("/api/v1/webhooks/endpoints")

    # Check response
    assert response.status_code == 200
    data = response.json()
    assert len(data) == 3
    # Ensure secret is not returned in the list view
    assert all(endpoint.get("secret") is None for endpoint in data)


@pytest.mark.asyncio
async def test_create_subscription(async_client: AsyncClient, db_session: AsyncSession):
    """Test creating a webhook subscription."""
    # Create test endpoint
    endpoint = WebhookEndpoint(
        name="Subscription Test Endpoint",
        url="https://example.com/webhook",
        description="Test endpoint",
        secret="secret",
        status="active",
    )
    db_session.add(endpoint)
    await db_session.commit()

    # Create subscription data conforming to WebhookSubscriptionCreate model
    subscription_data = {
        "event_type": "config.created",
        "filter_conditions": {"resource_type": "configuration"},
    }

    # Send request
    response = await async_client.post(
        f"/api/v1/webhooks/endpoints/{endpoint.id}/subscriptions",
        json=subscription_data,
    )

    # Check response
    assert response.status_code == 201
    data = response.json()
    assert data["endpoint_id"] == endpoint.id
    assert data["event_type"] == subscription_data["event_type"]
    assert data["filter_conditions"] == subscription_data["filter_conditions"]

    # Check database
    from sqlalchemy import select

    query = select(WebhookSubscription).where(WebhookSubscription.id == data["id"])
    result = await db_session.execute(query)
    db_subscription = result.scalar_one()

    assert db_subscription is not None
    assert db_subscription.endpoint_id == endpoint.id
    assert db_subscription.event_type == subscription_data["event_type"]
    assert db_subscription.filter_conditions == subscription_data["filter_conditions"]


@pytest.mark.asyncio
async def test_get_subscriptions(async_client: AsyncClient, db_session: AsyncSession):
    """Test getting webhook subscriptions."""
    # Create test endpoint
    endpoint = WebhookEndpoint(
        name="Get Subscriptions Test",
        url="https://example.com/webhook",
        description="Test endpoint",
        secret="secret",
        status="active",
    )
    db_session.add(endpoint)
    await db_session.commit()

    # Create multiple subscriptions for the endpoint
    event_types = ["config.created", "feature_flag.updated"]
    for et in event_types:
        subscription = WebhookSubscription(
            endpoint_id=endpoint.id,
            event_type=et,  # Use the single event_type field
        )
        db_session.add(subscription)
    await db_session.commit()

    # Send request to get subscriptions for the endpoint
    response = await async_client.get(f"/api/v1/webhooks/endpoints/{endpoint.id}/subscriptions")

    # Check response
    assert response.status_code == 200
    data = response.json()
    assert len(data) == len(event_types)  # Check if we got all created subscriptions
    assert {sub["event_type"] for sub in data} == {et for et in event_types}


@pytest.mark.asyncio
async def test_trigger_webhook(async_client: AsyncClient, db_session: AsyncSession):
    """Test triggering a webhook."""
    # Create test endpoint
    endpoint = WebhookEndpoint(
        name="Trigger Test Endpoint",
        url="https://example.com/webhook",
        description="Test endpoint",
        secret="test_secret",
        status="active",
    )
    db_session.add(endpoint)
    await db_session.commit()

    # Create subscription for the relevant event type
    subscription = WebhookSubscription(
        endpoint_id=endpoint.id,
        event_type="config.created",  # Subscribe to the specific VALID event
    )
    db_session.add(subscription)
    await db_session.commit()

    # Create webhook trigger data (payload only)
    event_type = "config.created"  # Use VALID event type
    payload = {"config_key": "new_setting", "value": "enabled"}

    # Mock the WebhooksService.trigger_webhook method
    with patch("app.modules.webhooks.service.WebhooksService.trigger_webhook") as mock_trigger:
        # Configure the mock to return a list of delivery IDs
        mock_delivery_ids = [1, 2, 3]  # Example delivery IDs
        mock_trigger.return_value = mock_delivery_ids

        # Send request to the correct path with event_type in URL
        response = await async_client.post(f"/api/v1/webhooks/trigger/{event_type}", json=payload)

        # Check response status code
        assert response.status_code == 202  # Expecting 202 Accepted status code

        # Parse the response data
        response_data = response.json()

        # Verify the response contains the expected fields
        assert "event_type" in response_data
        assert "delivery_count" in response_data
        assert "delivery_ids" in response_data

        # Verify the response data values
        assert response_data["event_type"] == event_type
        assert response_data["delivery_count"] == len(mock_delivery_ids)
        assert response_data["delivery_ids"] == mock_delivery_ids

        # Verify the service method was called with the correct parameters
        mock_trigger.assert_called_once()
        # Check that the first argument is a db session
        assert mock_trigger.call_args[0][0].__class__.__name__ == "AsyncSession"
        # Check that the third argument is the event type
        assert mock_trigger.call_args[0][2] == event_type
        # Check that the fourth argument is the payload
        assert mock_trigger.call_args[0][3] == payload


@pytest.mark.asyncio
@patch("httpx.AsyncClient.post")
async def test_retry_failed_deliveries(mock_post, async_client: AsyncClient, db_session: AsyncSession):
    """Test retrying failed webhook deliveries."""
    # Mock the HTTP response
    mock_response = MagicMock()
    mock_response.status_code = 200
    mock_response.text = "OK"
    mock_post.return_value = mock_response

    # Create test endpoint
    endpoint = WebhookEndpoint(
        name="Retry Test Endpoint",
        url="https://example.com/webhook",
        description="Test endpoint",
        secret="test_secret",
        status="active",
    )
    db_session.add(endpoint)
    await db_session.commit()

    # Create a failed delivery
    failed_delivery = WebhookDelivery(
        endpoint_id=endpoint.id,
        event_type="config.created",
        payload={"key": "value"},
        success=False,
        response_status=500,
        attempt_count=1,
        next_retry_at=datetime.utcnow() - timedelta(minutes=1),
    )
    db_session.add(failed_delivery)
    await db_session.commit()

    # Mock the delivery function to avoid actual HTTP calls
    with patch(
        "app.modules.webhooks.service.WebhooksService._deliver_webhook",
        return_value=(True, 200, "OK"),
    ) as mock_delivery:
        # Call the retry function - need to run it in an event loop since it's async
        await WebhooksService.retry_failed_deliveries(db=db_session, test_mode=True)

        # Assertions
        mock_delivery.assert_called_once()

    # OR call an API endpoint if one exists
    # async_client.post("/api/v1/webhooks/deliveries/retry")
