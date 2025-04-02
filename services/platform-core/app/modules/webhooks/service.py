"""
Service for the webhooks module.
"""

import asyncio
import hashlib
import hmac
import json
import logging
from datetime import datetime, timedelta
from typing import Any, Dict, List, Optional

import httpx
from fastapi import BackgroundTasks
from sqlalchemy import and_, desc, or_, select
from sqlalchemy.orm import Session

from app.modules.webhooks.models import (
    WebhookDelivery,
    WebhookEndpoint,
    WebhookEndpointCreate,
    WebhookEndpointUpdate,
    WebhookEventType,
    WebhookStatus,
    WebhookSubscription,
    WebhookSubscriptionCreate,
    WebhookSubscriptionResponse,
)
from app.utils.common import json_serializer

logger = logging.getLogger(__name__)


class WebhooksService:
    """
    Service for managing webhook endpoints, subscriptions, and deliveries.
    """

    @staticmethod
    async def create_endpoint(
        db: Session,
        endpoint: WebhookEndpointCreate,
        created_by: Optional[str] = None,
    ) -> WebhookEndpoint:
        """
        Create a new webhook endpoint.

        Args:
            db: Database session
            endpoint: Webhook endpoint data
            created_by: ID of the user creating the endpoint

        Returns:
            Created webhook endpoint
        """
        db_endpoint = WebhookEndpoint(
            name=endpoint.name,
            url=str(endpoint.url),  # Convert Pydantic HttpUrl to string
            description=endpoint.description,
            secret=endpoint.secret,
            headers=endpoint.headers,
            retry_count=endpoint.retry_count,
            timeout_seconds=endpoint.timeout_seconds,
            created_by=created_by,
        )
        db.add(db_endpoint)
        await db.commit()
        await db.refresh(db_endpoint)
        return db_endpoint

    @staticmethod
    async def update_endpoint(
        db: Session, endpoint_id: int, endpoint_update: WebhookEndpointUpdate
    ) -> Optional[WebhookEndpoint]:
        """
        Update a webhook endpoint.

        Args:
            db: Database session
            endpoint_id: ID of the webhook endpoint to update
            endpoint_update: Updated webhook endpoint data

        Returns:
            Updated webhook endpoint if found, None otherwise
        """
        # Build the query using SQLAlchemy select
        query = select(WebhookEndpoint).where(WebhookEndpoint.id == endpoint_id)

        # Execute the query asynchronously
        result = await db.execute(query)
        db_endpoint = result.scalar_one_or_none()

        if not db_endpoint:
            return None

        # Use model_dump for Pydantic V2
        update_data = endpoint_update.model_dump(exclude_unset=True)

        # Convert Pydantic HttpUrl to string if present
        if "url" in update_data and update_data["url"]:
            update_data["url"] = str(update_data["url"])

        for key, value in update_data.items():
            setattr(db_endpoint, key, value)

        await db.commit()
        await db.refresh(db_endpoint)
        return db_endpoint

    @staticmethod
    async def delete_endpoint(db: Session, endpoint_id: int) -> bool:
        """
        Delete a webhook endpoint.

        Args:
            db: Database session
            endpoint_id: ID of the webhook endpoint to delete

        Returns:
            True if deleted, False if not found
        """
        # Build the query using SQLAlchemy select
        query = select(WebhookEndpoint).where(WebhookEndpoint.id == endpoint_id)

        # Execute the query asynchronously
        result = await db.execute(query)
        db_endpoint = result.scalar_one_or_none()

        if not db_endpoint:
            return False

        await db.delete(db_endpoint)
        await db.commit()
        return True

    @staticmethod
    async def get_endpoint(db: Session, endpoint_id: int) -> Optional[WebhookEndpoint]:
        """
        Get a webhook endpoint by ID.

        Args:
            db: Database session
            endpoint_id: ID of the webhook endpoint

        Returns:
            Webhook endpoint if found, None otherwise
        """
        # Build the query using SQLAlchemy select
        query = select(WebhookEndpoint).where(WebhookEndpoint.id == endpoint_id)

        # Execute the query asynchronously
        result = await db.execute(query)
        return result.scalar_one_or_none()

    @staticmethod
    async def get_endpoints(
        db: Session,
        skip: int = 0,
        limit: int = 100,
        status: Optional[WebhookStatus] = None,
    ) -> List[WebhookEndpoint]:
        """
        Get webhook endpoints with optional filtering.

        Args:
            db: Database session
            skip: Number of endpoints to skip
            limit: Maximum number of endpoints to return
            status: Optional status filter

        Returns:
            List of webhook endpoints
        """
        # Build the query using SQLAlchemy select
        query = select(WebhookEndpoint)

        if status:
            query = query.where(WebhookEndpoint.status == status.value)

        # Add ordering, offset and limit
        query = query.order_by(desc(WebhookEndpoint.created_at)).offset(skip).limit(limit)

        # Execute the query asynchronously
        result = await db.execute(query)
        return result.scalars().all()

    @staticmethod
    async def create_subscription(
        db: Session, endpoint_id: int, subscription: WebhookSubscriptionCreate
    ) -> Optional[WebhookSubscription]:
        """
        Create a new webhook subscription.

        Args:
            db: Database session
            endpoint_id: ID of the webhook endpoint
            subscription: Webhook subscription data

        Returns:
            Created webhook subscription if endpoint exists, None otherwise
        """
        # Check if endpoint exists
        db_endpoint = await WebhooksService.get_endpoint(db, endpoint_id)
        if not db_endpoint:
            return None

        # Check if subscription already exists
        query = select(WebhookSubscription).where(
            and_(
                WebhookSubscription.endpoint_id == endpoint_id,
                WebhookSubscription.event_type == subscription.event_type.value,
            )
        )
        result = await db.execute(query)
        existing_subscription = result.scalar_one_or_none()

        if existing_subscription:
            # Update filter conditions if subscription already exists
            existing_subscription.filter_conditions = subscription.filter_conditions
            await db.commit()
            await db.refresh(existing_subscription)
            return existing_subscription

        # Create new subscription
        db_subscription = WebhookSubscription(
            endpoint_id=endpoint_id,
            event_type=subscription.event_type.value,
            filter_conditions=subscription.filter_conditions,
        )
        db.add(db_subscription)
        await db.commit()
        await db.refresh(db_subscription)
        return db_subscription

    @staticmethod
    async def delete_subscription(db: Session, subscription_id: int) -> bool:
        """
        Delete a webhook subscription.

        Args:
            db: Database session
            subscription_id: ID of the webhook subscription to delete

        Returns:
            True if deleted, False if not found
        """
        # Build the query using SQLAlchemy select
        query = select(WebhookSubscription).where(WebhookSubscription.id == subscription_id)

        # Execute the query asynchronously
        result = await db.execute(query)
        db_subscription = result.scalar_one_or_none()

        if not db_subscription:
            return False

        await db.delete(db_subscription)
        await db.commit()
        return True

    @staticmethod
    async def get_subscriptions(
        db: Session,
        endpoint_id: Optional[int] = None,
        event_type: Optional[WebhookEventType] = None,
    ) -> List[WebhookSubscriptionResponse]:
        """
        Get webhook subscriptions with optional filtering.

        Args:
            db: Database session
            endpoint_id: Optional endpoint ID filter
            event_type: Optional event type filter

        Returns:
            List of webhook subscription Pydantic models
        """
        # Build the query using SQLAlchemy select
        query = select(WebhookSubscription)

        if endpoint_id:
            query = query.where(WebhookSubscription.endpoint_id == endpoint_id)

        if event_type:
            query = query.where(WebhookSubscription.event_type == event_type.value)

        # Execute the query asynchronously
        result = await db.execute(query)
        db_subscriptions = result.scalars().all()

        # Explicitly convert SQLAlchemy models to Pydantic models
        response_subscriptions = [WebhookSubscriptionResponse.model_validate(sub) for sub in db_subscriptions]

        return response_subscriptions

    @staticmethod
    async def get_endpoints_for_event(db: Session, event_type: WebhookEventType) -> List[Dict[str, Any]]:
        """
        Get all active webhook endpoints subscribed to a specific event type.

        Args:
            db: Database session
            event_type: Event type to filter by

        Returns:
            List of dictionaries containing endpoint and subscription details
        """
        # Join WebhookEndpoint and WebhookSubscription to get all active endpoints for the event type
        results = (
            db.query(WebhookEndpoint, WebhookSubscription)
            .join(
                WebhookSubscription,
                WebhookEndpoint.id == WebhookSubscription.endpoint_id,
            )
            .filter(
                and_(
                    WebhookSubscription.event_type == event_type.value,
                    WebhookEndpoint.status == WebhookStatus.ACTIVE.value,
                )
            )
            .all()
        )

        # Format results
        formatted_results = []
        for endpoint, subscription in results:
            formatted_results.append(
                {
                    "endpoint": {
                        "id": endpoint.id,
                        "name": endpoint.name,
                        "url": endpoint.url,
                        "secret": endpoint.secret,
                        "headers": endpoint.headers,
                        "retry_count": endpoint.retry_count,
                        "timeout_seconds": endpoint.timeout_seconds,
                    },
                    "subscription": {
                        "id": subscription.id,
                        "filter_conditions": subscription.filter_conditions,
                    },
                }
            )

        return formatted_results

    @staticmethod
    def _generate_signature(payload: Dict[str, Any], secret: str) -> str:
        """
        Generate HMAC signature for webhook payload.

        Args:
            payload: Webhook payload
            secret: Secret key for HMAC

        Returns:
            HMAC signature
        """
        if not secret:
            return ""

        # Convert payload to JSON string
        payload_str = json.dumps(payload, default=json_serializer)

        # Generate HMAC signature
        signature = hmac.new(secret.encode(), payload_str.encode(), hashlib.sha256).hexdigest()

        return signature

    @staticmethod
    async def _deliver_webhook(
        db: Session,
        endpoint_id: int,
        event_type: str,
        payload: Dict[str, Any],
        endpoint_url: str,
        headers: Dict[str, str] = None,
        secret: Optional[str] = None,
        timeout_seconds: int = 5,
        delivery_id: Optional[int] = None,
    ) -> WebhookDelivery:
        """
        Deliver a webhook to an endpoint.

        Args:
            db: Database session
            endpoint_id: ID of the webhook endpoint
            event_type: Event type
            payload: Webhook payload
            endpoint_url: URL of the webhook endpoint
            headers: Custom headers to include in the request
            secret: Secret for HMAC signature verification
            timeout_seconds: Timeout for the webhook request
            delivery_id: ID of an existing delivery record (for retries)

        Returns:
            Webhook delivery record
        """
        # Get or create delivery record
        if delivery_id:
            db_delivery = db.query(WebhookDelivery).filter(WebhookDelivery.id == delivery_id).first()
            if db_delivery:
                db_delivery.attempt_count += 1
                db_delivery.next_retry_at = None
            else:
                # Create new delivery record if ID not found
                db_delivery = WebhookDelivery(
                    endpoint_id=endpoint_id,
                    event_type=event_type,
                    payload=payload,
                )
                db.add(db_delivery)
        else:
            # Create new delivery record
            db_delivery = WebhookDelivery(endpoint_id=endpoint_id, event_type=event_type, payload=payload)
            db.add(db_delivery)

        await db.commit()
        await db.refresh(db_delivery)

        # Prepare headers
        request_headers = {
            "Content-Type": "application/json",
            "User-Agent": "Dotmac-Platform-Core-Webhook",
            "X-Webhook-ID": str(db_delivery.id),
            "X-Webhook-Event": event_type,
        }

        # Add custom headers if provided
        if headers:
            request_headers.update(headers)

        # Add signature if secret is provided
        if secret:
            signature = WebhooksService._generate_signature(payload, secret)
            request_headers["X-Webhook-Signature"] = signature

        # Store request headers
        db_delivery.request_headers = request_headers
        await db.commit()

        try:
            # Send webhook request
            async with httpx.AsyncClient() as client:
                response = await client.post(
                    endpoint_url,
                    json=payload,
                    headers=request_headers,
                    timeout=timeout_seconds,
                )

            # Update delivery record with response
            db_delivery.response_status = response.status_code
            db_delivery.response_body = response.text
            db_delivery.success = 200 <= response.status_code < 300
            db_delivery.completed_at = datetime.utcnow()

            # Log success or failure
            if db_delivery.success:
                logger.info(
                    f"Webhook delivery successful: "
                    f"ID={db_delivery.id}, Event={event_type}, Status={response.status_code}"
                )
            else:
                logger.warning(
                    f"Webhook delivery failed: "
                    f"ID={db_delivery.id}, Event={event_type}, Status={response.status_code}"
                )

        except Exception as e:
            # Update delivery record with error
            db_delivery.response_status = 0
            db_delivery.response_body = str(e)
            db_delivery.success = False
            db_delivery.completed_at = datetime.utcnow()
            logger.error(f"Webhook delivery error: ID={db_delivery.id}, Event={event_type}, Error={str(e)}")

        # Update delivery record
        await db.commit()
        await db.refresh(db_delivery)

        return db_delivery

    @staticmethod
    async def trigger_webhook(
        db: Session,
        background_tasks: BackgroundTasks,
        event_type: WebhookEventType,
        payload: Dict[str, Any],
    ) -> List[int]:
        """
        Trigger webhooks for an event.

        Args:
            db: Database session
            background_tasks: FastAPI background tasks
            event_type: Event type
            payload: Webhook payload

        Returns:
            List of delivery IDs
        """
        # Get all endpoints for the event type
        endpoints = await WebhooksService.get_endpoints_for_event(db, event_type)

        delivery_ids = []
        for endpoint_data in endpoints:
            endpoint = endpoint_data["endpoint"]
            subscription = endpoint_data["subscription"]

            # Check filter conditions if present
            if subscription["filter_conditions"]:
                # Simple filter implementation - can be enhanced for more complex filtering
                match = True
                for key, value in subscription["filter_conditions"].items():
                    if key not in payload or payload[key] != value:
                        match = False
                        break

                if not match:
                    continue

            # Create delivery record
            db_delivery = WebhookDelivery(
                endpoint_id=endpoint["id"],
                event_type=event_type.value,
                payload=payload,
            )
            db.add(db_delivery)
            await db.commit()
            await db.refresh(db_delivery)

            delivery_ids.append(db_delivery.id)

            # Add webhook delivery to background tasks
            background_tasks.add_task(
                WebhooksService._deliver_webhook,
                db,
                endpoint["id"],
                event_type.value,
                payload,
                endpoint["url"],
                endpoint["headers"],
                endpoint["secret"],
                endpoint["timeout_seconds"],
                db_delivery.id,
            )

        return delivery_ids

    @staticmethod
    async def retry_failed_deliveries(db: Session, test_mode: bool = False) -> int:
        """
        Retry failed webhook deliveries.

        Args:
            db: Database session
            test_mode: If True, directly await deliveries instead of creating background tasks (for testing)

        Returns:
            Number of deliveries queued for retry
        """
        # Get failed deliveries that are due for retry
        now = datetime.utcnow()

        # Debug: Log the query parameters
        if test_mode:
            logger.info(f"Retrying failed deliveries at {now}")

        # Build the query using SQLAlchemy select
        query = (
            select(WebhookDelivery)
            .join(
                WebhookEndpoint,
                WebhookDelivery.endpoint_id == WebhookEndpoint.id,
            )
            .where(
                and_(
                    WebhookDelivery.success == False,  # noqa: E712 - Use == for SQLAlchemy boolean comparison
                    WebhookDelivery.attempt_count < WebhookEndpoint.retry_count,
                    or_(
                        WebhookDelivery.next_retry_at.is_(None),
                        WebhookDelivery.next_retry_at <= now,
                    ),
                    WebhookEndpoint.status == WebhookStatus.ACTIVE.value,
                )
            )
        )

        # Debug: Log the query SQL in test mode
        if test_mode:
            logger.info(f"Retry query SQL: {query}")

        # Execute the query asynchronously
        result = await db.execute(query)
        failed_deliveries = result.scalars().all()

        # Debug: Log the number of deliveries found
        if test_mode:
            logger.info(f"Found {len(failed_deliveries)} failed deliveries to retry")

        retry_count = 0
        for delivery in failed_deliveries:
            # Get endpoint details
            endpoint_query = select(WebhookEndpoint).where(WebhookEndpoint.id == delivery.endpoint_id)
            endpoint_result = await db.execute(endpoint_query)
            endpoint = endpoint_result.scalar_one_or_none()

            if not endpoint:
                continue

            # Calculate next retry time with exponential backoff
            backoff_factor = min(delivery.attempt_count, 5)  # Cap at 5 to avoid excessive delays
            retry_delay = 60 * (2**backoff_factor)  # Exponential backoff in seconds
            next_retry = now + timedelta(seconds=retry_delay)

            # Update next retry time
            delivery.next_retry_at = next_retry
            await db.commit()

            # In test mode, directly await the delivery instead of creating a background task
            if test_mode:
                await WebhooksService._deliver_webhook(
                    db,
                    endpoint.id,
                    delivery.event_type,
                    delivery.payload,
                    endpoint.url,
                    endpoint.headers,
                    endpoint.secret,
                    endpoint.timeout_seconds,
                    delivery.id,
                )
            else:
                # Schedule retry in background
                asyncio.create_task(
                    WebhooksService._deliver_webhook(
                        db,
                        endpoint.id,
                        delivery.event_type,
                        delivery.payload,
                        endpoint.url,
                        endpoint.headers,
                        endpoint.secret,
                        endpoint.timeout_seconds,
                        delivery.id,
                    )
                )

            retry_count += 1

        return retry_count

    @staticmethod
    async def test_webhook(
        db: Session,
        endpoint_id: int,
        event_type: WebhookEventType,
        payload: Dict[str, Any],
    ) -> Optional[WebhookDelivery]:
        """
        Test a webhook endpoint with a sample payload.

        Args:
            db: Database session
            endpoint_id: ID of the webhook endpoint
            event_type: Event type
            payload: Test payload

        Returns:
            Webhook delivery record if endpoint exists, None otherwise
        """
        # Get endpoint
        endpoint = await WebhooksService.get_endpoint(db, endpoint_id)
        if not endpoint:
            return None

        # Add test flag to payload
        payload["_test"] = True

        # Deliver webhook
        delivery = await WebhooksService._deliver_webhook(
            db,
            endpoint.id,
            event_type.value,
            payload,
            endpoint.url,
            endpoint.headers,
            endpoint.secret,
            endpoint.timeout_seconds,
        )

        return delivery

    @staticmethod
    async def get_delivery(db: Session, delivery_id: int) -> Optional[WebhookDelivery]:
        """
        Get a webhook delivery by ID.

        Args:
            db: Database session
            delivery_id: ID of the webhook delivery

        Returns:
            Webhook delivery if found, None otherwise
        """
        return db.query(WebhookDelivery).filter(WebhookDelivery.id == delivery_id).first()

    @staticmethod
    async def get_deliveries(
        db: Session,
        endpoint_id: Optional[int] = None,
        event_type: Optional[str] = None,
        success: Optional[bool] = None,
        skip: int = 0,
        limit: int = 100,
    ) -> List[WebhookDelivery]:
        """
        Get webhook deliveries with optional filtering.

        Args:
            db: Database session
            endpoint_id: Optional endpoint ID filter
            event_type: Optional event type filter
            success: Optional success filter
            skip: Number of deliveries to skip
            limit: Maximum number of deliveries to return

        Returns:
            List of webhook deliveries
        """
        query = db.query(WebhookDelivery)

        if endpoint_id:
            query = query.filter(WebhookDelivery.endpoint_id == endpoint_id)

        if event_type:
            query = query.filter(WebhookDelivery.event_type == event_type)

        if success is not None:
            query = query.filter(WebhookDelivery.success == success)

        return query.order_by(desc(WebhookDelivery.created_at)).offset(skip).limit(limit).all()
