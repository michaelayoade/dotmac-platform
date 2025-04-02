"""
Router for the webhooks module.
"""

from typing import List, Optional

from fastapi import APIRouter, BackgroundTasks, Depends, HTTPException
from fastapi import status as http_status
from sqlalchemy.ext.asyncio import AsyncSession

from app.db.session import get_db
from app.modules.webhooks.models import (
    WebhookDeliveryResponse,
    WebhookEndpointCreate,
    WebhookEndpointListResponse,
    WebhookEndpointResponse,
    WebhookEndpointUpdate,
    WebhookEventType,
    WebhookStatus,
    WebhookSubscriptionCreate,
    WebhookSubscriptionResponse,
    WebhookTestRequest,
)
from app.modules.webhooks.service import WebhooksService

router = APIRouter()


@router.post(
    "/endpoints",
    response_model=WebhookEndpointResponse,
    status_code=http_status.HTTP_201_CREATED,
)
async def create_webhook_endpoint(endpoint: WebhookEndpointCreate, db: AsyncSession = Depends(get_db)):
    """
    Create a new webhook endpoint.
    """
    # TODO: Get user ID from auth context when available
    created_by = None
    return await WebhooksService.create_endpoint(db, endpoint, created_by)


@router.get("/endpoints", response_model=List[WebhookEndpointListResponse])
async def get_webhook_endpoints(
    status: Optional[WebhookStatus] = None,
    skip: int = 0,
    limit: int = 100,
    db: AsyncSession = Depends(get_db),
):
    """
    Get webhook endpoints with optional filtering.
    """
    return await WebhooksService.get_endpoints(db, skip, limit, status)


@router.get("/endpoints/{endpoint_id}", response_model=WebhookEndpointResponse)
async def get_webhook_endpoint(endpoint_id: int, db: AsyncSession = Depends(get_db)):
    """
    Get a webhook endpoint by ID.
    """
    endpoint = await WebhooksService.get_endpoint(db, endpoint_id)
    if not endpoint:
        raise HTTPException(status_code=404, detail="Webhook endpoint not found")
    return endpoint


@router.put("/endpoints/{endpoint_id}", response_model=WebhookEndpointResponse)
async def update_webhook_endpoint(
    endpoint_id: int,
    endpoint_update: WebhookEndpointUpdate,
    db: AsyncSession = Depends(get_db),
):
    """
    Update a webhook endpoint.
    """
    updated_endpoint = await WebhooksService.update_endpoint(db, endpoint_id, endpoint_update)
    if not updated_endpoint:
        raise HTTPException(status_code=404, detail="Webhook endpoint not found")
    return updated_endpoint


@router.delete("/endpoints/{endpoint_id}", status_code=http_status.HTTP_204_NO_CONTENT)
async def delete_webhook_endpoint(endpoint_id: int, db: AsyncSession = Depends(get_db)):
    """
    Delete a webhook endpoint.
    """
    deleted = await WebhooksService.delete_endpoint(db, endpoint_id)
    if not deleted:
        raise HTTPException(status_code=404, detail="Webhook endpoint not found")
    return None


@router.post(
    "/endpoints/{endpoint_id}/subscriptions",
    response_model=WebhookSubscriptionResponse,
    status_code=http_status.HTTP_201_CREATED,
)
async def create_webhook_subscription(
    endpoint_id: int,
    subscription: WebhookSubscriptionCreate,
    db: AsyncSession = Depends(get_db),
):
    """
    Create a new webhook subscription for an endpoint.
    """
    created_subscription = await WebhooksService.create_subscription(db, endpoint_id, subscription)
    if not created_subscription:
        raise HTTPException(status_code=404, detail="Webhook endpoint not found")
    return created_subscription


@router.get(
    "/endpoints/{endpoint_id}/subscriptions",
    response_model=List[WebhookSubscriptionResponse],
)
async def get_webhook_subscriptions(endpoint_id: int, db: AsyncSession = Depends(get_db)):
    """
    Get all subscriptions for a webhook endpoint.
    """
    # Check if endpoint exists
    endpoint = await WebhooksService.get_endpoint(db, endpoint_id)
    if not endpoint:
        raise HTTPException(status_code=404, detail="Webhook endpoint not found")

    return await WebhooksService.get_subscriptions(db, endpoint_id)


@router.delete(
    "/subscriptions/{subscription_id}",
    status_code=http_status.HTTP_204_NO_CONTENT,
)
async def delete_webhook_subscription(subscription_id: int, db: AsyncSession = Depends(get_db)):
    """
    Delete a webhook subscription.
    """
    deleted = await WebhooksService.delete_subscription(db, subscription_id)
    if not deleted:
        raise HTTPException(status_code=404, detail="Webhook subscription not found")
    return None


@router.post("/endpoints/{endpoint_id}/test", response_model=WebhookDeliveryResponse)
async def test_webhook_endpoint(
    endpoint_id: int,
    test_request: WebhookTestRequest,
    db: AsyncSession = Depends(get_db),
):
    """
    Test a webhook endpoint with a sample payload.
    """
    delivery = await WebhooksService.test_webhook(db, endpoint_id, test_request.event_type, test_request.payload)
    if not delivery:
        raise HTTPException(status_code=404, detail="Webhook endpoint not found")
    return delivery


@router.get("/deliveries", response_model=List[WebhookDeliveryResponse])
async def get_webhook_deliveries(
    endpoint_id: Optional[int] = None,
    event_type: Optional[str] = None,
    success: Optional[bool] = None,
    skip: int = 0,
    limit: int = 100,
    db: AsyncSession = Depends(get_db),
):
    """
    Get webhook deliveries with optional filtering.
    """
    return await WebhooksService.get_deliveries(db, endpoint_id, event_type, success, skip, limit)


@router.get("/deliveries/{delivery_id}", response_model=WebhookDeliveryResponse)
async def get_webhook_delivery(delivery_id: int, db: AsyncSession = Depends(get_db)):
    """
    Get a webhook delivery by ID.
    """
    delivery = await WebhooksService.get_delivery(db, delivery_id)
    if not delivery:
        raise HTTPException(status_code=404, detail="Webhook delivery not found")
    return delivery


@router.post("/trigger/{event_type}", status_code=http_status.HTTP_202_ACCEPTED)
async def trigger_webhook(
    event_type: WebhookEventType,
    payload: dict,
    background_tasks: BackgroundTasks,
    db: AsyncSession = Depends(get_db),
):
    """
    Trigger webhooks for an event.
    """
    delivery_ids = await WebhooksService.trigger_webhook(db, background_tasks, event_type, payload)
    return {
        "event_type": event_type,
        "delivery_count": len(delivery_ids),
        "delivery_ids": delivery_ids,
    }


@router.post("/retry-failed")
async def retry_failed_deliveries(db: AsyncSession = Depends(get_db)):
    """
    Retry failed webhook deliveries.
    """
    retry_count = await WebhooksService.retry_failed_deliveries(db)
    return {
        "retry_count": retry_count,
        "message": f"Queued {retry_count} failed deliveries for retry",
    }
