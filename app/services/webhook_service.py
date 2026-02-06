"""Webhook Service — dispatch events to registered endpoints."""
from __future__ import annotations

import hashlib
import hmac
import json
import logging
from datetime import datetime, timezone
from uuid import UUID

import httpx
from sqlalchemy import select
from sqlalchemy.orm import Session

from app.models.webhook import (
    DeliveryStatus,
    WebhookDelivery,
    WebhookEndpoint,
)

logger = logging.getLogger(__name__)

MAX_RETRIES = 3
TIMEOUT_SECONDS = 10

_BLOCKED_HOSTNAMES = {"localhost", "0.0.0.0"}


def _validate_webhook_url(url: str) -> None:
    """Block SSRF: only allow http(s) to public IPs."""
    import ipaddress
    import socket
    from urllib.parse import urlparse

    parsed = urlparse(url)
    if parsed.scheme not in ("http", "https"):
        raise ValueError(f"Webhook URL scheme must be http or https, got {parsed.scheme!r}")
    hostname = parsed.hostname or ""
    if hostname.lower() in _BLOCKED_HOSTNAMES:
        raise ValueError(f"Webhook URL hostname {hostname!r} is not allowed")
    try:
        for info in socket.getaddrinfo(hostname, None):
            addr = ipaddress.ip_address(info[4][0])
            if addr.is_private or addr.is_loopback or addr.is_link_local or addr.is_reserved:
                raise ValueError(f"Webhook URL resolves to non-public IP {addr}")
    except socket.gaierror as e:
        raise ValueError(f"Cannot resolve webhook hostname {hostname!r}: {e}") from e


class WebhookService:
    def __init__(self, db: Session):
        self.db = db

    def list_endpoints(self, instance_id: UUID | None = None) -> list[WebhookEndpoint]:
        stmt = select(WebhookEndpoint).where(WebhookEndpoint.is_active.is_(True))
        if instance_id:
            stmt = stmt.where(
                (WebhookEndpoint.instance_id == instance_id)
                | (WebhookEndpoint.instance_id.is_(None))
            )
        return list(self.db.scalars(stmt).all())

    def create_endpoint(
        self,
        url: str,
        events: list[str],
        secret: str | None = None,
        description: str | None = None,
        instance_id: UUID | None = None,
    ) -> WebhookEndpoint:
        _validate_webhook_url(url)
        ep = WebhookEndpoint(
            url=url,
            events=events,
            secret=secret,
            description=description,
            instance_id=instance_id,
        )
        self.db.add(ep)
        self.db.flush()
        return ep

    def delete_endpoint(self, endpoint_id: UUID) -> None:
        ep = self.db.get(WebhookEndpoint, endpoint_id)
        if ep:
            ep.is_active = False
            self.db.flush()

    def dispatch(
        self,
        event: str,
        payload: dict,
        instance_id: UUID | None = None,
    ) -> int:
        """Send event to all matching endpoints. Returns delivery count."""
        endpoints = self._match_endpoints(event, instance_id)
        count = 0
        for ep in endpoints:
            delivery = self._deliver(ep, event, payload)
            if delivery:
                count += 1
        self.db.flush()
        return count

    def _match_endpoints(self, event: str, instance_id: UUID | None) -> list[WebhookEndpoint]:
        stmt = select(WebhookEndpoint).where(WebhookEndpoint.is_active.is_(True))
        endpoints = list(self.db.scalars(stmt).all())
        matched = []
        for ep in endpoints:
            if event not in (ep.events or []):
                continue
            if ep.instance_id and instance_id and ep.instance_id != instance_id:
                continue
            matched.append(ep)
        return matched

    def _deliver(self, ep: WebhookEndpoint, event: str, payload: dict) -> WebhookDelivery | None:
        body = json.dumps(payload, default=str)
        headers = {"Content-Type": "application/json", "X-Webhook-Event": event}
        if ep.secret:
            sig = hmac.new(ep.secret.encode(), body.encode(), hashlib.sha256).hexdigest()
            headers["X-Webhook-Signature"] = f"sha256={sig}"

        delivery = WebhookDelivery(
            endpoint_id=ep.endpoint_id,
            event=event,
            payload=payload,
        )
        self.db.add(delivery)

        for attempt in range(1, MAX_RETRIES + 1):
            delivery.attempts = attempt
            try:
                resp = httpx.post(ep.url, content=body, headers=headers, timeout=TIMEOUT_SECONDS)
                delivery.response_code = resp.status_code
                delivery.response_body = resp.text[:2000] if resp.text else None
                if 200 <= resp.status_code < 300:
                    delivery.status = DeliveryStatus.success
                    delivery.delivered_at = datetime.now(timezone.utc)
                    return delivery
            except Exception as e:
                delivery.response_body = str(e)[:2000]
                logger.warning("Webhook delivery attempt %d failed for %s: %s", attempt, ep.url, e)

        delivery.status = DeliveryStatus.failed
        return delivery

    def get_deliveries(self, endpoint_id: UUID, limit: int = 50) -> list[WebhookDelivery]:
        stmt = (
            select(WebhookDelivery)
            .where(WebhookDelivery.endpoint_id == endpoint_id)
            .order_by(WebhookDelivery.created_at.desc())
            .limit(limit)
        )
        return list(self.db.scalars(stmt).all())
