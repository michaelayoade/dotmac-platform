"""Tests for instance webhook API endpoints."""

from __future__ import annotations

import uuid

from app.models.instance import Instance, InstanceStatus
from app.models.server import Server
from app.models.webhook import WebhookEndpoint


def _make_server(db_session) -> Server:
    server = Server(
        name=f"srv-{uuid.uuid4().hex[:6]}",
        hostname="localhost",
        ssh_port=22,
        ssh_user="root",
        ssh_key_path="/root/.ssh/id_rsa",
        is_local=True,
    )
    db_session.add(server)
    db_session.commit()
    db_session.refresh(server)
    return server


def _make_instance(db_session, server: Server, org_id) -> Instance:
    code = f"ORG{uuid.uuid4().hex[:6].upper()}"
    instance = Instance(
        server_id=server.server_id,
        org_id=org_id,
        org_code=code,
        org_name=f"Org {code}",
        app_port=8080,
        db_port=5432,
        redis_port=6379,
        status=InstanceStatus.running,
    )
    db_session.add(instance)
    db_session.commit()
    db_session.refresh(instance)
    return instance


class TestInstanceWebhookCreate:
    def test_create_webhook_accepts_json_body(self, client, db_session, admin_headers, admin_org_id, monkeypatch):
        monkeypatch.setattr("app.services.webhook_service._validate_webhook_url", lambda _url: None)
        server = _make_server(db_session)
        instance = _make_instance(db_session, server, admin_org_id)
        payload = {
            "url": "https://hooks.example.com/dotmac",
            "events": ["deploy_started", "deploy_failed"],
            "secret": "super-secret-token",
            "description": "Deploy notifications",
            "instance_id": str(instance.instance_id),
        }

        response = client.post("/instances/webhooks", json=payload, headers=admin_headers)

        assert response.status_code == 201
        data = response.json()
        assert data["url"] == payload["url"]
        assert data["events"] == payload["events"]
        assert data["description"] == payload["description"]
        assert data["instance_id"] == payload["instance_id"]
        assert "secret" not in data

        endpoint = db_session.get(WebhookEndpoint, uuid.UUID(data["endpoint_id"]))
        assert endpoint is not None
        assert endpoint.secret == payload["secret"]

    def test_create_webhook_query_params_rejected(self, client, admin_headers):
        response = client.post(
            "/instances/webhooks",
            params={
                "url": "https://hooks.example.com/dotmac",
                "events": ["deploy_started"],
                "secret": "super-secret-token",
                "description": "Deploy notifications",
            },
            headers=admin_headers,
        )

        assert response.status_code == 422
        data = response.json()
        assert data["code"] == "validation_error"
        assert isinstance(data["details"], list)
        assert any(isinstance(detail, dict) and detail.get("loc", [None])[0] == "body" for detail in data["details"])
