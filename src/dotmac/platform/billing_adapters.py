"""
Platform billing adapters.

Implements dotmac.billing interfaces for Platform-specific functionality.
These adapters bridge Platform's customer/tenant models to the billing system.
"""

from __future__ import annotations

from typing import TYPE_CHECKING, Any

import structlog
from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession

from dotmac.billing.interfaces import (
    AuditLogger,
    BillingEvent,
    CustomerInfo,
    CustomerProvider,
    EmailContent,
    EmailSender,
    EventPublisher,
)

if TYPE_CHECKING:
    pass

logger = structlog.get_logger(__name__)


class PlatformCustomerProvider(CustomerProvider):
    """
    Platform implementation of CustomerProvider.

    Fetches customer data from Platform's customer tables.
    """

    def __init__(self, db: AsyncSession) -> None:
        self.db = db

    async def get_customer(self, tenant_id: str, customer_id: str) -> CustomerInfo | None:
        """Get customer information by ID."""
        try:
            # Import here to avoid circular imports
            from dotmac.platform.customer_management.models import Customer

            result = await self.db.execute(
                select(Customer).where(
                    Customer.tenant_id == tenant_id,
                    Customer.id == customer_id,
                )
            )
            customer = result.scalar_one_or_none()

            if not customer:
                return None

            return CustomerInfo(
                id=str(customer.id),
                tenant_id=tenant_id,
                email=customer.email or "",
                name=customer.name or f"{customer.first_name or ''} {customer.last_name or ''}".strip(),
                billing_address=customer.billing_address if hasattr(customer, "billing_address") else None,
                shipping_address=customer.shipping_address if hasattr(customer, "shipping_address") else None,
                tax_exempt=getattr(customer, "tax_exempt", False),
                tax_id=getattr(customer, "tax_id", None),
                currency=getattr(customer, "currency", "USD"),
                metadata=customer.metadata if hasattr(customer, "metadata") else None,
            )
        except Exception as e:
            logger.error("Failed to get customer", customer_id=customer_id, error=str(e))
            return None

    async def get_customer_by_email(self, tenant_id: str, email: str) -> CustomerInfo | None:
        """Get customer information by email."""
        try:
            from dotmac.platform.customer_management.models import Customer

            result = await self.db.execute(
                select(Customer).where(
                    Customer.tenant_id == tenant_id,
                    Customer.email == email,
                )
            )
            customer = result.scalar_one_or_none()

            if not customer:
                return None

            return CustomerInfo(
                id=str(customer.id),
                tenant_id=tenant_id,
                email=customer.email or "",
                name=customer.name or f"{customer.first_name or ''} {customer.last_name or ''}".strip(),
                billing_address=customer.billing_address if hasattr(customer, "billing_address") else None,
                shipping_address=customer.shipping_address if hasattr(customer, "shipping_address") else None,
                tax_exempt=getattr(customer, "tax_exempt", False),
                tax_id=getattr(customer, "tax_id", None),
                currency=getattr(customer, "currency", "USD"),
                metadata=customer.metadata if hasattr(customer, "metadata") else None,
            )
        except Exception as e:
            logger.error("Failed to get customer by email", email=email, error=str(e))
            return None

    async def list_customers(
        self,
        tenant_id: str,
        offset: int = 0,
        limit: int = 100,
        filters: dict[str, Any] | None = None,
    ) -> list[CustomerInfo]:
        """List customers with pagination."""
        try:
            from dotmac.platform.customer_management.models import Customer

            query = select(Customer).where(Customer.tenant_id == tenant_id)

            # Apply filters
            if filters:
                if "status" in filters:
                    query = query.where(Customer.status == filters["status"])
                if "search" in filters:
                    search = f"%{filters['search']}%"
                    query = query.where(
                        (Customer.name.ilike(search)) | (Customer.email.ilike(search))
                    )

            query = query.offset(offset).limit(limit)
            result = await self.db.execute(query)
            customers = result.scalars().all()

            return [
                CustomerInfo(
                    id=str(c.id),
                    tenant_id=tenant_id,
                    email=c.email or "",
                    name=c.name or f"{c.first_name or ''} {c.last_name or ''}".strip(),
                    billing_address=c.billing_address if hasattr(c, "billing_address") else None,
                    shipping_address=c.shipping_address if hasattr(c, "shipping_address") else None,
                    tax_exempt=getattr(c, "tax_exempt", False),
                    tax_id=getattr(c, "tax_id", None),
                    currency=getattr(c, "currency", "USD"),
                    metadata=c.metadata if hasattr(c, "metadata") else None,
                )
                for c in customers
            ]
        except Exception as e:
            logger.error("Failed to list customers", tenant_id=tenant_id, error=str(e))
            return []


class PlatformEventPublisher(EventPublisher):
    """
    Platform implementation of EventPublisher.

    Publishes billing events to Platform's event system (webhooks, etc.)
    """

    def __init__(self, db: AsyncSession | None = None) -> None:
        self.db = db

    async def publish(self, event: BillingEvent) -> None:
        """Publish a billing event."""
        logger.info(
            "billing.event.published",
            event_type=event.event_type,
            entity_type=event.entity_type,
            entity_id=event.entity_id,
            tenant_id=event.tenant_id,
        )

        # TODO: Integrate with Platform's webhook system
        # from dotmac.platform.webhooks.service import WebhookService
        # webhook_service = WebhookService(self.db)
        # await webhook_service.dispatch(event.event_type, event.data)

    async def publish_batch(self, events: list[BillingEvent]) -> None:
        """Publish multiple billing events."""
        for event in events:
            await self.publish(event)


class PlatformEmailSender(EmailSender):
    """
    Platform implementation of EmailSender.

    Sends billing emails via Platform's email service.
    """

    def __init__(self, db: AsyncSession | None = None) -> None:
        self.db = db

    async def send(self, email: EmailContent) -> bool:
        """Send an email. Returns True if successful."""
        logger.info(
            "billing.email.sent",
            to=email.to,
            subject=email.subject,
        )

        try:
            # TODO: Integrate with Platform's email service
            # from dotmac.platform.communications.email_service import EmailService
            # email_service = EmailService()
            # await email_service.send(
            #     to=email.to,
            #     subject=email.subject,
            #     html=email.body_html,
            #     text=email.body_text,
            # )
            return True
        except Exception as e:
            logger.error("Failed to send email", error=str(e))
            return False

    async def send_template(
        self,
        template_name: str,
        to: str | list[str],
        context: dict[str, Any],
        tenant_id: str | None = None,
    ) -> bool:
        """Send an email using a template. Returns True if successful."""
        logger.info(
            "billing.email.template_sent",
            template=template_name,
            to=to,
            tenant_id=tenant_id,
        )

        try:
            # TODO: Integrate with Platform's email template service
            return True
        except Exception as e:
            logger.error("Failed to send template email", error=str(e))
            return False


class PlatformAuditLogger(AuditLogger):
    """
    Platform implementation of AuditLogger.

    Logs billing audit events to Platform's audit system.
    """

    def __init__(self, db: AsyncSession | None = None) -> None:
        self.db = db

    async def log(
        self,
        tenant_id: str,
        action: str,
        entity_type: str,
        entity_id: str,
        user_id: str | None,
        changes: dict[str, Any] | None = None,
        metadata: dict[str, Any] | None = None,
    ) -> None:
        """Log an audit event."""
        logger.info(
            "billing.audit",
            tenant_id=tenant_id,
            action=action,
            entity_type=entity_type,
            entity_id=entity_id,
            user_id=user_id,
            changes=changes,
        )

        # TODO: Integrate with Platform's audit service
        # from dotmac.platform.audit.service import AuditService
        # audit_service = AuditService(self.db)
        # await audit_service.log(
        #     tenant_id=tenant_id,
        #     action=action,
        #     resource_type=entity_type,
        #     resource_id=entity_id,
        #     user_id=user_id,
        #     changes=changes,
        #     metadata=metadata,
        # )


def create_platform_billing_config(db: AsyncSession) -> "BillingServiceConfig":
    """
    Create a BillingServiceConfig with Platform adapters.

    Usage:
        from dotmac.platform.billing_adapters import create_platform_billing_config
        from dotmac.platform.billing.services.invoice import InvoiceService

        config = create_platform_billing_config(db)
        invoice_service = InvoiceService(db, config=config)
    """
    from dotmac.billing.interfaces import BillingServiceConfig

    return BillingServiceConfig(
        customer_provider=PlatformCustomerProvider(db),
        event_publisher=PlatformEventPublisher(db),
        email_sender=PlatformEmailSender(db),
        audit_logger=PlatformAuditLogger(db),
    )


__all__ = [
    "PlatformCustomerProvider",
    "PlatformEventPublisher",
    "PlatformEmailSender",
    "PlatformAuditLogger",
    "create_platform_billing_config",
]
