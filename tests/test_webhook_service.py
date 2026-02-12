"""Tests for webhook service validation and delivery headers."""

from __future__ import annotations

from types import SimpleNamespace

import pytest

from app.models.webhook import WebhookDelivery, WebhookEndpoint
from app.services.webhook_service import WebhookService


def test_http_scheme_rejected(monkeypatch, db_session):
    def fake_getaddrinfo(*args, **kwargs):
        return [(None, None, None, None, ("93.184.216.34", 0))]

    import socket

    monkeypatch.setattr(socket, "getaddrinfo", fake_getaddrinfo)

    svc = WebhookService(db_session)
    with pytest.raises(ValueError, match="https"):
        svc.create_endpoint(
            url="http://webhook.example.com",
            events=["deploy_started"],
        )


def test_attempt_delivery_sets_idempotency_key(monkeypatch, db_session):
    svc = WebhookService(db_session)

    ep = WebhookEndpoint(
        url="https://webhook.example.com",
        events=["deploy_started"],
        is_active=True,
    )
    db_session.add(ep)
    db_session.flush()

    delivery = WebhookDelivery(
        endpoint_id=ep.endpoint_id,
        event="deploy_started",
        payload={"ok": True},
    )
    db_session.add(delivery)
    db_session.flush()

    monkeypatch.setattr("app.services.webhook_service._validate_webhook_url", lambda url: None)

    captured = {}

    def fake_post(url, content, headers, timeout):
        captured["headers"] = headers
        return SimpleNamespace(status_code=200, text="ok")

    monkeypatch.setattr("app.services.webhook_service.httpx.post", fake_post)

    ok = svc._attempt_delivery(ep, delivery)

    assert ok is True
    assert captured["headers"]["Idempotency-Key"] == str(delivery.delivery_id)
