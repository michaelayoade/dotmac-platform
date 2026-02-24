import uuid
from datetime import UTC, datetime, timedelta

from app.models.catalog import AppBundle, AppCatalogItem, AppRelease
from app.models.deployment_log import DeploymentLog
from app.models.git_repository import GitRepository
from app.models.instance import Instance, InstanceStatus
from app.models.server import Server
from app.models.signup_request import SignupRequest, SignupStatus
from app.services.settings_crypto import encrypt_value


def _seed_catalog(db_session):
    repo = GitRepository(label=f"repo-{uuid.uuid4().hex[:6]}", url="https://example.com/repo.git")
    db_session.add(repo)
    db_session.flush()

    release = AppRelease(
        name="Starter",
        version="1.0.0",
        git_ref="main",
        git_repo_id=repo.repo_id,
        is_active=True,
    )
    bundle = AppBundle(name="Starter", is_active=True)
    db_session.add_all([release, bundle])
    db_session.flush()

    item = AppCatalogItem(label="Starter", release_id=release.release_id, bundle_id=bundle.bundle_id, is_active=True)
    db_session.add(item)
    db_session.commit()
    db_session.refresh(item)
    return item


def _seed_server(db_session):
    server = Server(name="server-1", hostname="server.local", base_domain="example.test")
    db_session.add(server)
    db_session.commit()
    db_session.refresh(server)
    return server


def test_signup_start_creates_pending_request(monkeypatch, client, db_session):
    server = _seed_server(db_session)
    catalog_item = _seed_catalog(db_session)
    unique = uuid.uuid4().hex[:8]

    def _fake_send(*_args, **_kwargs):
        return True

    monkeypatch.setattr("app.services.signup_service.send_signup_verification_email", _fake_send)

    payload = {
        "org_name": f"Acme Inc {unique}",
        "catalog_item_id": str(catalog_item.catalog_id),
        "admin_email": f"owner-{unique}@example.com",
        "admin_password": "Secret123!",
        "server_id": str(server.server_id),
    }

    resp = client.post("/auth/signup", json=payload)
    assert resp.status_code == 201
    data = resp.json()

    assert data["status"] == SignupStatus.pending.value
    assert data["email_sent"] is True

    signup = db_session.get(SignupRequest, uuid.UUID(data["signup_id"]))
    assert signup is not None
    assert signup.status == SignupStatus.pending


def test_signup_verify_marks_verified(client, db_session):
    _seed_server(db_session)
    catalog_item = _seed_catalog(db_session)

    token = "test-token-123456"
    signup = SignupRequest(
        email="owner@example.com",
        org_name="Acme Inc",
        org_code="ACME_INC",
        catalog_item_id=catalog_item.catalog_id,
        admin_username="admin",
        admin_password_enc=encrypt_value("Secret123!"),
        status=SignupStatus.pending,
        verification_token_hash=__import__("hashlib").sha256(token.encode("utf-8")).hexdigest(),
        expires_at=datetime.now(UTC) + timedelta(hours=12),
    )
    db_session.add(signup)
    db_session.commit()

    resp = client.post(
        "/auth/signup/verify",
        json={"signup_id": str(signup.signup_id), "token": token},
    )
    assert resp.status_code == 200
    data = resp.json()
    assert data["status"] == SignupStatus.verified.value

    db_session.refresh(signup)
    assert signup.status == SignupStatus.verified
    assert signup.email_verified_at is not None


def test_signup_confirm_billing_marks_confirmed(client, db_session, admin_headers):
    _seed_server(db_session)
    catalog_item = _seed_catalog(db_session)

    signup = SignupRequest(
        email="owner@example.com",
        org_name="Acme Inc",
        org_code="ACME_INC",
        catalog_item_id=catalog_item.catalog_id,
        admin_username="admin",
        admin_password_enc=encrypt_value("Secret123!"),
        status=SignupStatus.verified,
        email_verified_at=datetime.now(UTC),
        expires_at=datetime.now(UTC) + timedelta(hours=12),
    )
    db_session.add(signup)
    db_session.commit()

    resp = client.post(
        f"/auth/signup/{signup.signup_id}/confirm-billing",
        json={"billing_reference": "INV-123"},
        headers=admin_headers,
    )
    assert resp.status_code == 200
    data = resp.json()
    assert data["status"] == SignupStatus.verified.value

    db_session.refresh(signup)
    assert signup.billing_confirmed_at is not None
    assert signup.billing_reference == "INV-123"


def test_signup_resend_updates_token(monkeypatch, client, db_session):
    _seed_server(db_session)
    catalog_item = _seed_catalog(db_session)

    from app.services.signup_service import _token_hash

    signup = SignupRequest(
        email="owner@example.com",
        org_name="Acme Inc",
        org_code="ACME_INC",
        catalog_item_id=catalog_item.catalog_id,
        admin_username="admin",
        admin_password_enc=encrypt_value("Secret123!"),
        status=SignupStatus.pending,
        verification_token_hash=_token_hash("old-token"),
        expires_at=datetime.now(UTC) + timedelta(hours=12),
    )
    db_session.add(signup)
    db_session.commit()

    def _fake_send(*_args, **_kwargs):
        return True

    monkeypatch.setattr("app.services.signup_service.send_signup_verification_email", _fake_send)

    resp = client.post("/auth/signup/resend", json={"signup_id": str(signup.signup_id)})
    assert resp.status_code == 200
    db_session.refresh(signup)
    assert signup.verification_token_hash != _token_hash("old-token")


def test_signup_provision_requires_billing(client, db_session, admin_headers):
    server = _seed_server(db_session)
    catalog_item = _seed_catalog(db_session)

    signup = SignupRequest(
        email="owner@example.com",
        org_name="Acme Inc",
        org_code="ACME_INC",
        catalog_item_id=catalog_item.catalog_id,
        admin_username="admin",
        admin_password_enc=encrypt_value("Secret123!"),
        status=SignupStatus.verified,
        email_verified_at=datetime.now(UTC),
        expires_at=datetime.now(UTC) + timedelta(hours=12),
        server_id=server.server_id,
    )
    db_session.add(signup)
    db_session.commit()

    resp = client.post(f"/auth/signup/{signup.signup_id}/provision", headers=admin_headers)
    assert resp.status_code == 400
    body = resp.json()
    assert body.get("detail", body)["code"] == "SIGNUP_PROVISION_FAILED"


def test_signup_provision_creates_instance_and_deployment(client, db_session, admin_headers):
    server = _seed_server(db_session)
    catalog_item = _seed_catalog(db_session)

    signup = SignupRequest(
        email="owner@example.com",
        org_name="Acme Inc",
        org_code="ACME_INC",
        catalog_item_id=catalog_item.catalog_id,
        admin_username="admin",
        admin_password_enc=encrypt_value("Secret123!"),
        status=SignupStatus.verified,
        email_verified_at=datetime.now(UTC),
        billing_confirmed_at=datetime.now(UTC),
        expires_at=datetime.now(UTC) + timedelta(hours=12),
        server_id=server.server_id,
    )
    db_session.add(signup)
    db_session.commit()

    resp = client.post(f"/auth/signup/{signup.signup_id}/provision", headers=admin_headers)
    assert resp.status_code == 202
    data = resp.json()

    assert data["status"] == SignupStatus.provisioned.value
    assert data["instance_id"]
    assert data["deployment_id"]

    instance = db_session.get(Instance, uuid.UUID(data["instance_id"]))
    assert instance is not None
    assert instance.status == InstanceStatus.trial
    assert instance.server_id == server.server_id

    logs = db_session.query(DeploymentLog).filter(DeploymentLog.instance_id == instance.instance_id).all()
    assert len(logs) > 0
    assert logs[0].deploy_secret is not None
