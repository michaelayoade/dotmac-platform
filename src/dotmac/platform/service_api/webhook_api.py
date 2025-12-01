"""
Webhook API for ISP event notifications.

ISP instances send events to Platform for:
- Analytics and reporting
- Billing updates
- Partner notifications
- Audit trails
"""

from datetime import UTC, datetime
from enum import Enum
from typing import Any
from uuid import uuid4

import structlog
from fastapi import APIRouter, BackgroundTasks, Depends, HTTPException, status
from pydantic import BaseModel, ConfigDict, Field
from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession

from dotmac.platform.database import get_async_session
from dotmac.platform.tenant.models import Tenant
from dotmac.shared.service_auth import (
    ServiceCredentials,
    require_isp_service,
)

logger = structlog.get_logger(__name__)

router = APIRouter(prefix="/events", tags=["Webhook API"])


class EventType(str, Enum):
    """Types of events that ISP can send to Platform."""

    # Subscriber lifecycle
    SUBSCRIBER_CREATED = "subscriber.created"
    SUBSCRIBER_UPDATED = "subscriber.updated"
    SUBSCRIBER_SUSPENDED = "subscriber.suspended"
    SUBSCRIBER_ACTIVATED = "subscriber.activated"
    SUBSCRIBER_TERMINATED = "subscriber.terminated"
    SUBSCRIBER_UPGRADED = "subscriber.upgraded"
    SUBSCRIBER_DOWNGRADED = "subscriber.downgraded"

    # Payment events
    PAYMENT_RECEIVED = "payment.received"
    PAYMENT_FAILED = "payment.failed"
    INVOICE_CREATED = "invoice.created"
    INVOICE_PAID = "invoice.paid"
    INVOICE_OVERDUE = "invoice.overdue"

    # Support events
    TICKET_CREATED = "ticket.created"
    TICKET_RESOLVED = "ticket.resolved"
    TICKET_ESCALATED = "ticket.escalated"

    # Network events
    NAS_ONLINE = "nas.online"
    NAS_OFFLINE = "nas.offline"
    OLT_ALARM = "olt.alarm"
    ONT_ALARM = "ont.alarm"
    ONT_PROVISIONED = "ont.provisioned"
    ONT_DEPROVISIONED = "ont.deprovisioned"

    # Session events
    SESSION_STARTED = "session.started"
    SESSION_ENDED = "session.ended"
    SESSION_TERMINATED = "session.terminated"
    SESSION_COA_SENT = "session.coa_sent"


class WebhookEvent(BaseModel):
    """Event sent from ISP to Platform."""

    model_config = ConfigDict()

    event_id: str = Field(default_factory=lambda: str(uuid4()))
    event_type: EventType
    tenant_id: str
    occurred_at: datetime = Field(default_factory=lambda: datetime.now(UTC))
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


async def process_event(event: WebhookEvent, db: AsyncSession) -> tuple[bool, str | None]:
    """Process a single webhook event.

    Returns (success, error_message).
    """
    logger.info(
        "Processing event: event_id=%s type=%s tenant_id=%s",
        event.event_id, event.event_type.value, event.tenant_id
    )

    try:
        # Route event to appropriate handler based on type
        if event.event_type.value.startswith("subscriber."):
            await _handle_subscriber_event(event, db)
        elif event.event_type.value.startswith("payment.") or event.event_type.value.startswith("invoice."):
            await _handle_payment_event(event, db)
        elif event.event_type.value.startswith("ticket."):
            await _handle_ticket_event(event, db)
        elif event.event_type.value.startswith("nas.") or event.event_type.value.startswith("olt.") or event.event_type.value.startswith("ont."):
            await _handle_network_event(event, db)
        elif event.event_type.value.startswith("session."):
            await _handle_session_event(event, db)

        return True, None

    except Exception as e:
        logger.error(
            "Event processing failed: event_id=%s error=%s",
            event.event_id, str(e)
        )
        return False, str(e)


async def _handle_subscriber_event(event: WebhookEvent, db: AsyncSession) -> None:
    """Handle subscriber lifecycle events."""
    logger.info(
        "Subscriber event: type=%s tenant_id=%s subscriber_id=%s",
        event.event_type.value, event.tenant_id, event.payload.get("subscriber_id")
    )

    # Analytics: Track subscriber metrics
    if event.event_type == EventType.SUBSCRIBER_CREATED:
        # Could trigger partner notifications, billing setup, etc.
        logger.info(
            "New subscriber: tenant_id=%s subscriber_id=%s plan=%s",
            event.tenant_id, event.payload.get("subscriber_id"), event.payload.get("plan")
        )
    elif event.event_type == EventType.SUBSCRIBER_TERMINATED:
        # Could trigger churn analysis, exit surveys, etc.
        logger.info(
            "Subscriber churn: tenant_id=%s subscriber_id=%s reason=%s",
            event.tenant_id, event.payload.get("subscriber_id"), event.payload.get("termination_reason")
        )


async def _handle_payment_event(event: WebhookEvent, db: AsyncSession) -> None:
    """Handle payment and invoice events."""
    logger.info(
        "Payment event: type=%s tenant_id=%s amount=%s currency=%s",
        event.event_type.value, event.tenant_id,
        event.payload.get("amount"), event.payload.get("currency")
    )

    if event.event_type == EventType.PAYMENT_RECEIVED:
        # Update revenue analytics, partner commissions, etc.
        logger.info(
            "Payment success: tenant_id=%s amount=%s method=%s",
            event.tenant_id, event.payload.get("amount"), event.payload.get("payment_method")
        )
    elif event.event_type == EventType.PAYMENT_FAILED:
        # Alert on payment failures, trigger dunning, etc.
        logger.warning(
            "Payment failed: tenant_id=%s amount=%s reason=%s",
            event.tenant_id, event.payload.get("amount"), event.payload.get("failure_reason")
        )
    elif event.event_type == EventType.INVOICE_OVERDUE:
        # Alert on overdue invoices
        logger.warning(
            "Invoice overdue: tenant_id=%s invoice_id=%s days_overdue=%s",
            event.tenant_id, event.payload.get("invoice_id"), event.payload.get("days_overdue")
        )


async def _handle_ticket_event(event: WebhookEvent, db: AsyncSession) -> None:
    """Handle support ticket events."""
    logger.info(
        "Ticket event: type=%s tenant_id=%s ticket_id=%s",
        event.event_type.value, event.tenant_id, event.payload.get("ticket_id")
    )

    if event.event_type == EventType.TICKET_ESCALATED:
        # Alert on escalations
        logger.warning(
            "Ticket escalated: tenant_id=%s ticket_id=%s reason=%s priority=%s",
            event.tenant_id, event.payload.get("ticket_id"),
            event.payload.get("escalation_reason"), event.payload.get("priority")
        )


async def _handle_network_event(event: WebhookEvent, db: AsyncSession) -> None:
    """Handle network infrastructure events."""
    logger.info(
        "Network event: type=%s tenant_id=%s device_id=%s",
        event.event_type.value, event.tenant_id, event.payload.get("device_id")
    )

    if event.event_type == EventType.OLT_ALARM or event.event_type == EventType.ONT_ALARM:
        # Critical network alerts
        logger.error(
            "Network alarm: tenant_id=%s type=%s device_id=%s alarm_type=%s severity=%s",
            event.tenant_id, event.event_type.value, event.payload.get("device_id"),
            event.payload.get("alarm_type"), event.payload.get("severity")
        )
    elif event.event_type == EventType.NAS_OFFLINE:
        # NAS connectivity issues
        logger.warning(
            "NAS offline: tenant_id=%s nas_id=%s nas_ip=%s",
            event.tenant_id, event.payload.get("nas_id"), event.payload.get("nas_ip")
        )


async def _handle_session_event(event: WebhookEvent, db: AsyncSession) -> None:
    """Handle RADIUS session events."""
    logger.debug(
        "Session event: type=%s tenant_id=%s session_id=%s",
        event.event_type.value, event.tenant_id, event.payload.get("session_id")
    )
    # Session events are typically high-volume - mostly for analytics


@router.post("/webhook")
async def receive_webhook(
    event: WebhookEvent,
    background_tasks: BackgroundTasks,
    service: ServiceCredentials = Depends(require_isp_service),
    db: AsyncSession = Depends(get_async_session),
) -> dict[str, str]:
    """Receive a single webhook event from ISP.

    Events are processed synchronously for single events.
    """
    logger.info(
        "Webhook received: event_id=%s type=%s tenant_id=%s caller_tenant=%s",
        event.event_id, event.event_type.value, event.tenant_id, service.tenant_id
    )

    # Verify tenant
    if service.tenant_id != event.tenant_id:
        logger.warning(
            "Webhook tenant mismatch: event_tenant=%s caller_tenant=%s",
            event.tenant_id, service.tenant_id
        )
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Cannot submit events for other tenants",
        )

    # Verify tenant exists
    tenant_result = await db.execute(
        select(Tenant).where(Tenant.id == event.tenant_id)
    )
    tenant = tenant_result.scalar_one_or_none()

    if not tenant:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Tenant not found",
        )

    # Process event synchronously for single events
    success, error = await process_event(event, db)
    await db.commit()

    if success:
        return {
            "status": "accepted",
            "event_id": event.event_id,
            "message": "Event processed successfully",
        }
    else:
        return {
            "status": "failed",
            "event_id": event.event_id,
            "message": error or "Processing failed",
        }


@router.post("/webhook/batch")
async def receive_webhook_batch(
    batch: WebhookBatch,
    background_tasks: BackgroundTasks,
    service: ServiceCredentials = Depends(require_isp_service),
    db: AsyncSession = Depends(get_async_session),
) -> WebhookResponse:
    """Receive a batch of webhook events from ISP.

    More efficient for high-volume event transmission.
    """
    logger.info(
        "Webhook batch received: event_count=%d caller_tenant=%s",
        len(batch.events), service.tenant_id
    )

    if not batch.events:
        return WebhookResponse(received=0, processed=0, failed=0)

    # Verify tenant exists
    tenant_result = await db.execute(
        select(Tenant).where(Tenant.id == service.tenant_id)
    )
    tenant = tenant_result.scalar_one_or_none()

    if not tenant:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Tenant not found",
        )

    # Validate and process events
    errors: list[dict[str, str]] = []
    processed = 0
    failed = 0

    for event in batch.events:
        if service.tenant_id != event.tenant_id:
            failed += 1
            errors.append({
                "event_id": event.event_id,
                "error": "Tenant ID mismatch",
            })
            logger.warning(
                "Batch event tenant mismatch: event_id=%s event_tenant=%s caller_tenant=%s",
                event.event_id, event.tenant_id, service.tenant_id
            )
            continue

        success, error = await process_event(event, db)
        if success:
            processed += 1
        else:
            failed += 1
            errors.append({
                "event_id": event.event_id,
                "error": error or "Processing failed",
            })

    await db.commit()

    logger.info(
        "Webhook batch processed: received=%d processed=%d failed=%d",
        len(batch.events), processed, failed
    )

    return WebhookResponse(
        received=len(batch.events),
        processed=processed,
        failed=failed,
        errors=errors if errors else None,
    )
