"""
Webhook API for ISP event notifications.

ISP instances send event notifications to Platform for:
- Subscriber lifecycle events
- Payment events
- Support tickets
- Infrastructure alerts
"""

from datetime import UTC, datetime
from enum import Enum
from typing import Any

from fastapi import APIRouter, Depends, BackgroundTasks
from pydantic import BaseModel, ConfigDict

from dotmac.shared.service_auth import (
    ServiceCredentials,
    require_isp_service,
)

router = APIRouter(prefix="/events", tags=["Webhook API"])


class EventType(str, Enum):
    """Types of events ISP can send to Platform."""

    # Subscriber events
    SUBSCRIBER_CREATED = "subscriber.created"
    SUBSCRIBER_ACTIVATED = "subscriber.activated"
    SUBSCRIBER_SUSPENDED = "subscriber.suspended"
    SUBSCRIBER_TERMINATED = "subscriber.terminated"
    SUBSCRIBER_UPGRADED = "subscriber.upgraded"
    SUBSCRIBER_DOWNGRADED = "subscriber.downgraded"

    # Payment events
    PAYMENT_RECEIVED = "payment.received"
    PAYMENT_FAILED = "payment.failed"
    INVOICE_CREATED = "invoice.created"
    INVOICE_OVERDUE = "invoice.overdue"

    # Support events
    TICKET_CREATED = "ticket.created"
    TICKET_ESCALATED = "ticket.escalated"
    TICKET_RESOLVED = "ticket.resolved"

    # Infrastructure events
    NAS_ONLINE = "nas.online"
    NAS_OFFLINE = "nas.offline"
    OLT_ALARM = "olt.alarm"
    ONT_ALARM = "ont.alarm"

    # Session events
    SESSION_STARTED = "session.started"
    SESSION_ENDED = "session.ended"
    SESSION_TERMINATED = "session.terminated"  # Admin action


class WebhookEvent(BaseModel):
    """Event sent from ISP to Platform."""

    model_config = ConfigDict()

    event_id: str  # Unique event ID for idempotency
    event_type: EventType
    tenant_id: str
    occurred_at: datetime
    payload: dict[str, Any]
    metadata: dict[str, Any] | None = None


class WebhookBatch(BaseModel):
    """Batch of events for efficient transmission."""

    model_config = ConfigDict()

    events: list[WebhookEvent]


class WebhookResponse(BaseModel):
    """Response for webhook submission."""

    model_config = ConfigDict()

    received: int
    processed: int
    failed: int
    errors: list[dict[str, str]] | None = None


async def process_event(event: WebhookEvent) -> bool:
    """Process a single event asynchronously.

    This is where Platform takes action based on ISP events:
    - Update analytics
    - Trigger partner notifications
    - Update billing records
    - Generate reports
    """
    # TODO: Implement event processing logic
    # For now, just log it
    print(f"Processing event: {event.event_type} for tenant {event.tenant_id}")
    return True


@router.post("/webhook")
async def receive_webhook(
    event: WebhookEvent,
    background_tasks: BackgroundTasks,
    service: ServiceCredentials = Depends(require_isp_service),
) -> dict[str, str]:
    """Receive a single event from ISP.

    Events are processed asynchronously to avoid blocking the ISP.
    """
    # Verify tenant
    if service.tenant_id != event.tenant_id:
        return {"status": "rejected", "message": "Tenant ID mismatch"}

    # Process asynchronously
    background_tasks.add_task(process_event, event)

    return {
        "status": "accepted",
        "event_id": event.event_id,
        "message": "Event queued for processing",
    }


@router.post("/webhook/batch")
async def receive_webhook_batch(
    batch: WebhookBatch,
    background_tasks: BackgroundTasks,
    service: ServiceCredentials = Depends(require_isp_service),
) -> WebhookResponse:
    """Receive a batch of events from ISP.

    More efficient for high-volume event streams.
    """
    received = len(batch.events)
    processed = 0
    failed = 0
    errors = []

    for event in batch.events:
        # Verify tenant
        if service.tenant_id != event.tenant_id:
            failed += 1
            errors.append({
                "event_id": event.event_id,
                "error": "Tenant ID mismatch",
            })
            continue

        # Queue for processing
        background_tasks.add_task(process_event, event)
        processed += 1

    return WebhookResponse(
        received=received,
        processed=processed,
        failed=failed,
        errors=errors if errors else None,
    )
