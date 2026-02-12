import os
import sys
import uuid
from datetime import UTC, datetime, timedelta
from types import ModuleType

import pytest
from fastapi.testclient import TestClient
from jose import jwt
from sqlalchemy import create_engine
from sqlalchemy.orm import DeclarativeBase, sessionmaker
from sqlalchemy.pool import StaticPool

# Create a test engine BEFORE any app imports
_test_engine = create_engine(
    "sqlite+pysqlite:///:memory:",
    connect_args={"check_same_thread": False},
    poolclass=StaticPool,
)


# Create a mock for the app.db module that uses our test engine
class TestBase(DeclarativeBase):
    __test__ = False


_TestSessionLocal = sessionmaker(bind=_test_engine, autoflush=False, autocommit=False)


# Create a mock db module
mock_db_module = ModuleType("app.db")
mock_db_module.Base = TestBase  # type: ignore[attr-defined]
mock_db_module.SessionLocal = _TestSessionLocal  # type: ignore[attr-defined]
mock_db_module.get_engine = lambda: _test_engine  # type: ignore[attr-defined]

# Also mock app.config to prevent .env loading
mock_config_module = ModuleType("app.config")


class MockSettings:
    database_url = "sqlite+pysqlite:///:memory:"
    db_pool_size = 5
    db_max_overflow = 10
    db_pool_timeout = 30
    db_pool_recycle = 1800
    avatar_upload_dir = "static/avatars"
    avatar_max_size_bytes = 2 * 1024 * 1024
    avatar_allowed_types = "image/jpeg,image/png,image/gif,image/webp"
    avatar_url_prefix = "/static/avatars"
    brand_name = "Starter Template"
    brand_tagline = "FastAPI starter"
    brand_logo_url = None
    testing = True
    use_cdn_assets = False
    health_stale_seconds = 180


mock_config_module.settings = MockSettings()  # type: ignore[attr-defined]
mock_config_module.Settings = MockSettings  # type: ignore[attr-defined]

# Insert mocks before any app imports
sys.modules["app.config"] = mock_config_module
sys.modules["app.db"] = mock_db_module

# Set environment variables
os.environ["JWT_SECRET"] = "test-secret"
os.environ["JWT_ALGORITHM"] = "HS256"
os.environ["TOTP_ENCRYPTION_KEY"] = "QLUJktsTSfZEbST4R-37XmQ0tCkiVCBXZN2Zt053w8g="
os.environ["TOTP_ISSUER"] = "StarterTemplate"

# Now import the models - they'll use our mocked db module
from app.models.audit import AuditActorType, AuditEvent
from app.models.auth import (
    Session as AuthSession,
)
from app.models.auth import (
    SessionStatus,
    UserCredential,
)
from app.models.catalog import AppBundle, AppCatalogItem, AppRelease  # noqa: F401
from app.models.deployment_log import DeploymentLog  # noqa: F401
from app.models.domain_settings import DomainSetting, SettingDomain
from app.models.git_repository import GitRepository  # noqa: F401
from app.models.health_check import HealthCheck, HealthStatus  # noqa: F401
from app.models.instance import Instance  # noqa: F401
from app.models.notification import Notification  # noqa: F401
from app.models.organization import Organization  # noqa: F401
from app.models.organization_member import OrganizationMember  # noqa: F401
from app.models.otel_config import OtelExportConfig  # noqa: F401
from app.models.person import Person
from app.models.rbac import Permission, PersonRole, Role
from app.models.scheduler import ScheduledTask, ScheduleType
from app.models.server import Server  # noqa: F401
from app.models.signup_request import SignupRequest  # noqa: F401

# Create all tables
TestBase.metadata.create_all(_test_engine)

# Re-export Base for compatibility
Base = TestBase


@pytest.fixture(scope="session")
def engine():
    return _test_engine


@pytest.fixture()
def db_session(engine):
    """Create a database session for testing.

    Uses the same connection as the StaticPool engine to ensure
    all operations see the same data.
    """
    Session = sessionmaker(bind=engine, autoflush=False, autocommit=False)
    session = Session()
    try:
        yield session
    finally:
        session.close()


def _unique_email() -> str:
    return f"test-{uuid.uuid4().hex}@example.com"


@pytest.fixture()
def person(db_session):
    person = Person(
        first_name="Test",
        last_name="User",
        email=_unique_email(),
    )
    db_session.add(person)
    db_session.commit()
    db_session.refresh(person)
    org = Organization(
        org_code=f"ORG_{uuid.uuid4().hex[:6]}",
        org_name="Test Org",
        is_active=True,
    )
    db_session.add(org)
    db_session.commit()
    db_session.refresh(org)
    db_session.add(OrganizationMember(org_id=org.org_id, person_id=person.id, is_active=True))
    db_session.commit()
    return person


@pytest.fixture(autouse=True)
def auth_env():
    # Environment variables are set at module level above
    # This fixture ensures they're available for each test
    pass


@pytest.fixture(autouse=True)
def _reset_rate_limiters():
    """Reset in-memory rate limiter state between tests."""
    from app.rate_limit import (
        login_limiter,
        mfa_verify_limiter,
        password_change_limiter,
        password_reset_limiter,
        refresh_limiter,
        signup_limiter,
        signup_resend_limiter,
        signup_verify_limiter,
    )

    login_limiter._requests.clear()
    password_reset_limiter._requests.clear()
    mfa_verify_limiter._requests.clear()
    refresh_limiter._requests.clear()
    password_change_limiter._requests.clear()
    signup_limiter._requests.clear()
    signup_resend_limiter._requests.clear()
    signup_verify_limiter._requests.clear()


# ============ FastAPI Test Client Fixtures ============


@pytest.fixture()
def client(db_session):
    """Create a test client with database dependency override."""
    from app.api.audit import get_db as audit_get_db
    from app.api.auth_flow import get_db as auth_flow_get_db
    from app.api.persons import get_db as persons_get_db
    from app.api.rbac import get_db as rbac_get_db
    from app.api.scheduler import get_db as scheduler_get_db
    from app.api.settings import get_db as settings_get_db
    from app.main import app
    from app.services.auth_dependencies import _get_db as auth_deps_get_db

    Session = sessionmaker(bind=db_session.bind, autoflush=False, autocommit=False)

    def override_get_db():
        session = Session()
        try:
            yield session
        finally:
            session.close()

    # Override all get_db dependencies
    from app.api.deps import get_db as deps_get_db

    app.dependency_overrides[persons_get_db] = override_get_db
    app.dependency_overrides[auth_flow_get_db] = override_get_db
    app.dependency_overrides[rbac_get_db] = override_get_db
    app.dependency_overrides[audit_get_db] = override_get_db
    app.dependency_overrides[settings_get_db] = override_get_db
    app.dependency_overrides[scheduler_get_db] = override_get_db
    app.dependency_overrides[auth_deps_get_db] = override_get_db
    app.dependency_overrides[deps_get_db] = override_get_db

    with TestClient(app, raise_server_exceptions=False) as test_client:
        yield test_client

    app.dependency_overrides.clear()


def _create_access_token(
    person_id: str,
    session_id: str,
    roles: list[str] | None = None,
    scopes: list[str] | None = None,
    org_id: str | None = None,
) -> str:
    """Create a JWT access token for testing."""
    secret = os.getenv("JWT_SECRET", "test-secret")
    algorithm = os.getenv("JWT_ALGORITHM", "HS256")
    now = datetime.now(UTC)
    expire = now + timedelta(minutes=15)
    payload = {
        "sub": person_id,
        "session_id": session_id,
        "roles": roles or [],
        "scopes": scopes or [],
        "typ": "access",
        "exp": int(expire.timestamp()),
        "iat": int(now.timestamp()),
    }
    if org_id:
        payload["org_id"] = org_id
    return str(jwt.encode(payload, secret, algorithm=algorithm))


@pytest.fixture()
def organization(db_session):
    org = Organization(
        org_code=f"ORG_{uuid.uuid4().hex[:6]}",
        org_name="Test Org",
        is_active=True,
    )
    db_session.add(org)
    db_session.commit()
    db_session.refresh(org)
    return org


@pytest.fixture()
def person_org_id(db_session, person):
    member = db_session.query(OrganizationMember).filter(OrganizationMember.person_id == person.id).first()
    if not member:
        org = Organization(
            org_code=f"ORG_{uuid.uuid4().hex[:6]}",
            org_name="Test Org",
            is_active=True,
        )
        db_session.add(org)
        db_session.commit()
        db_session.refresh(org)
        member = OrganizationMember(org_id=org.org_id, person_id=person.id, is_active=True)
        db_session.add(member)
        db_session.commit()
    return member.org_id


@pytest.fixture()
def person_org_code(db_session, person, person_org_id):
    org = db_session.get(Organization, person_org_id)
    return org.org_code if org else None


@pytest.fixture()
def auth_session(db_session, person, person_org_id):
    """Create an authenticated session for a person."""
    session = AuthSession(
        person_id=person.id,
        org_id=person_org_id,
        token_hash="test-token-hash",
        status=SessionStatus.active,
        ip_address="127.0.0.1",
        user_agent="pytest",
        expires_at=datetime.now(UTC) + timedelta(days=30),
    )
    db_session.add(session)
    db_session.commit()
    db_session.refresh(session)
    return session


@pytest.fixture()
def auth_token(person, auth_session, person_org_id):
    """Create a valid JWT token for authenticated requests."""
    return _create_access_token(str(person.id), str(auth_session.id), org_id=str(person_org_id))


@pytest.fixture()
def auth_headers(auth_token):
    """Return authorization headers for authenticated requests."""
    return {"Authorization": f"Bearer {auth_token}"}


@pytest.fixture()
def admin_role(db_session):
    """Create an admin role."""
    role = db_session.query(Role).filter(Role.name == "admin").first()
    if role:
        return role
    role = Role(name="admin", description="Administrator role")
    db_session.add(role)
    db_session.commit()
    db_session.refresh(role)
    return role


@pytest.fixture()
def admin_person(db_session, admin_role):
    """Create a person with admin role."""
    person = Person(
        first_name="Admin",
        last_name="User",
        email=_unique_email(),
    )
    db_session.add(person)
    db_session.commit()
    db_session.refresh(person)

    org = Organization(
        org_code=f"ORG_{uuid.uuid4().hex[:6]}",
        org_name="Admin Org",
        is_active=True,
    )
    db_session.add(org)
    db_session.commit()
    db_session.refresh(org)
    db_session.add(OrganizationMember(org_id=org.org_id, person_id=person.id, is_active=True))
    db_session.commit()

    # Assign admin role
    person_role = PersonRole(person_id=person.id, role_id=admin_role.id)
    db_session.add(person_role)
    db_session.commit()

    return person


@pytest.fixture()
def admin_org_id(db_session, admin_person):
    member = db_session.query(OrganizationMember).filter(OrganizationMember.person_id == admin_person.id).first()
    if not member:
        org = Organization(
            org_code=f"ORG_{uuid.uuid4().hex[:6]}",
            org_name="Admin Org",
            is_active=True,
        )
        db_session.add(org)
        db_session.commit()
        db_session.refresh(org)
        member = OrganizationMember(org_id=org.org_id, person_id=admin_person.id, is_active=True)
        db_session.add(member)
        db_session.commit()
    return member.org_id


@pytest.fixture()
def admin_org_code(db_session, admin_org_id):
    org = db_session.get(Organization, admin_org_id)
    return org.org_code if org else None


@pytest.fixture()
def admin_session(db_session, admin_person, admin_org_id):
    """Create an authenticated session for admin."""
    session = AuthSession(
        person_id=admin_person.id,
        org_id=admin_org_id,
        token_hash="admin-token-hash",
        status=SessionStatus.active,
        ip_address="127.0.0.1",
        user_agent="pytest",
        expires_at=datetime.now(UTC) + timedelta(days=30),
    )
    db_session.add(session)
    db_session.commit()
    db_session.refresh(session)
    return session


@pytest.fixture()
def admin_token(admin_person, admin_session, admin_org_id):
    """Create a valid JWT token for admin requests."""
    return _create_access_token(
        str(admin_person.id),
        str(admin_session.id),
        roles=["admin"],
        scopes=["audit:read", "audit:*"],
        org_id=str(admin_org_id),
    )


@pytest.fixture()
def admin_headers(admin_token):
    """Return authorization headers for admin requests."""
    return {"Authorization": f"Bearer {admin_token}"}


@pytest.fixture()
def user_credential(db_session, person):
    """Create a user credential for testing."""
    from app.services.auth_flow import hash_password

    credential = UserCredential(
        person_id=person.id,
        username=f"testuser_{uuid.uuid4().hex[:8]}",
        password_hash=hash_password("testpassword123"),
        is_active=True,
    )
    db_session.add(credential)
    db_session.commit()
    db_session.refresh(credential)
    return credential


@pytest.fixture()
def role(db_session):
    """Create a test role."""
    role = Role(name=f"test_role_{uuid.uuid4().hex[:8]}", description="Test role")
    db_session.add(role)
    db_session.commit()
    db_session.refresh(role)
    return role


@pytest.fixture()
def permission(db_session):
    """Create a test permission."""
    perm = Permission(
        key=f"test:permission:{uuid.uuid4().hex[:8]}",
        description="Test permission",
    )
    db_session.add(perm)
    db_session.commit()
    db_session.refresh(perm)
    return perm


@pytest.fixture()
def audit_event(db_session, person):
    """Create a test audit event."""
    event = AuditEvent(
        actor_id=str(person.id),
        actor_type=AuditActorType.user,
        action="test_action",
        entity_type="test_entity",
        entity_id=str(uuid.uuid4()),
        is_success=True,
        status_code=200,
    )
    db_session.add(event)
    db_session.commit()
    db_session.refresh(event)
    return event


@pytest.fixture()
def domain_setting(db_session):
    """Create a test domain setting."""
    setting = DomainSetting(
        domain=SettingDomain.auth,
        key=f"test_setting_{uuid.uuid4().hex[:8]}",
        value_text="test_value",
    )
    db_session.add(setting)
    db_session.commit()
    db_session.refresh(setting)
    return setting


@pytest.fixture()
def scheduled_task(db_session):
    """Create a test scheduled task."""
    task = ScheduledTask(
        name=f"test_task_{uuid.uuid4().hex[:8]}",
        task_name="app.tasks.test_task",
        schedule_type=ScheduleType.interval,
        interval_seconds=300,
        enabled=True,
    )
    db_session.add(task)
    db_session.commit()
    db_session.refresh(task)
    return task
