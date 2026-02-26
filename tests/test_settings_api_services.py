import pytest
from fastapi import HTTPException

from app.schemas.settings import DomainSettingUpdate
from app.services import settings_api
from app.services.response import ListResponseMixin


class _ListResponseStub(ListResponseMixin):
    @staticmethod
    def list(_db, *args, **kwargs):
        return [{"id": "one"}, {"id": "two"}]


def test_list_response_mixin_requires_limit_offset(db_session):
    with pytest.raises(ValueError, match="limit and offset are required"):
        _ListResponseStub.list_response(db_session)


def test_list_response_mixin_with_args(db_session):
    response = _ListResponseStub.list_response(db_session, None, None, 2, 0)
    assert response["count"] == 2
    assert response["limit"] == 2
    assert response["offset"] == 0


def test_upsert_auth_setting_variants(db_session):
    ttl = settings_api.upsert_auth_setting(
        db_session,
        "jwt_access_ttl_minutes",
        DomainSettingUpdate(value_text="30"),
    )
    assert ttl.value_type.value == "integer"
    assert ttl.value_text == "30"

    secure = settings_api.upsert_auth_setting(
        db_session,
        "refresh_cookie_secure",
        DomainSettingUpdate(value_json=True),
    )
    assert secure.value_type.value == "boolean"
    assert secure.value_text == "true"
    assert secure.value_json is True

    secret = settings_api.upsert_auth_setting(
        db_session,
        "jwt_secret",
        DomainSettingUpdate(value_text="super-secret"),
    )
    assert secret.is_secret is True

    samesite = settings_api.upsert_auth_setting(
        db_session,
        "refresh_cookie_samesite",
        DomainSettingUpdate(value_text="Lax"),
    )
    assert samesite.value_text == "lax"


def test_upsert_auth_setting_invalid_key(db_session):
    with pytest.raises(HTTPException) as excinfo:
        settings_api.upsert_auth_setting(
            db_session,
            "bad_key",
            DomainSettingUpdate(value_text="value"),
        )
    assert excinfo.value.status_code == 400


def test_upsert_audit_setting_list_and_bool(db_session):
    methods = settings_api.upsert_audit_setting(
        db_session,
        "methods",
        DomainSettingUpdate(value_json=["POST", "GET"]),
    )
    assert methods.value_json == ["POST", "GET"]

    enabled = settings_api.upsert_audit_setting(
        db_session,
        "enabled",
        DomainSettingUpdate(value_json=False),
    )
    assert enabled.value_text == "false"


def test_upsert_scheduler_setting(db_session):
    beat = settings_api.upsert_scheduler_setting(
        db_session,
        "beat_refresh_seconds",
        DomainSettingUpdate(value_text="60"),
    )
    assert beat.value_type.value == "integer"
    assert beat.value_text == "60"

    tz = settings_api.upsert_scheduler_setting(
        db_session,
        "timezone",
        DomainSettingUpdate(value_text="UTC"),
    )
    assert tz.value_text == "UTC"


def test_list_settings_response(db_session):
    settings_api.upsert_auth_setting(
        db_session,
        "jwt_access_ttl_minutes",
        DomainSettingUpdate(value_text="30"),
    )
    settings_api.upsert_auth_setting(
        db_session,
        "refresh_cookie_secure",
        DomainSettingUpdate(value_json=True),
    )
    response = settings_api.list_auth_settings_response(db_session, None, "key", "asc", 10, 0)
    assert response["count"] == len(response["items"])
    assert response["count"] >= 2


# ---------------------------------------------------------------------------
# jwt_algorithm SettingSpec allowlist tests
# ---------------------------------------------------------------------------


def test_jwt_algorithm_spec_has_allowlist():
    from app.models.domain_settings import SettingDomain
    from app.services.settings_spec import get_spec

    spec = get_spec(SettingDomain.auth, "jwt_algorithm")
    assert spec is not None
    assert spec.allowed == {"HS256", "HS384", "HS512"}


def test_jwt_algorithm_spec_default_is_in_allowlist():
    from app.models.domain_settings import SettingDomain
    from app.services.settings_spec import get_spec

    spec = get_spec(SettingDomain.auth, "jwt_algorithm")
    assert spec is not None
    assert spec.default in spec.allowed


def test_jwt_algorithm_upsert_rejects_unsafe_algorithm(db_session):
    """The settings API rejects algorithms not in the allowed set."""
    with pytest.raises(HTTPException) as exc:
        settings_api.upsert_auth_setting(
            db_session,
            "jwt_algorithm",
            DomainSettingUpdate(value_text="RS256"),
        )
    assert exc.value.status_code == 400


def test_jwt_algorithm_resolve_value_falls_back_for_disallowed(db_session, monkeypatch):
    """resolve_value returns the default when a disallowed algorithm is stored in the DB."""
    from unittest.mock import MagicMock

    import app.services.settings_spec as spec_module
    from app.models.domain_settings import SettingDomain
    from app.services.settings_spec import resolve_value

    mock_setting = MagicMock()
    mock_setting.value_text = "RS256"
    mock_setting.value_json = None
    mock_setting.is_secret = False

    original_get_by_key = spec_module.DOMAIN_SETTINGS_SERVICE[SettingDomain.auth].get_by_key

    def patched_get_by_key(db, key):
        if key == "jwt_algorithm":
            return mock_setting
        return original_get_by_key(db, key)

    monkeypatch.setattr(spec_module.DOMAIN_SETTINGS_SERVICE[SettingDomain.auth], "get_by_key", patched_get_by_key)

    value = resolve_value(db_session, SettingDomain.auth, "jwt_algorithm")
    assert value == "HS256"  # falls back to default


def test_jwt_algorithm_resolve_value_returns_allowed_value(db_session, monkeypatch):
    """resolve_value returns an algorithm that is in the allowed set."""
    from unittest.mock import MagicMock

    import app.services.settings_spec as spec_module
    from app.models.domain_settings import SettingDomain
    from app.services.settings_spec import resolve_value

    mock_setting = MagicMock()
    mock_setting.value_text = "HS384"
    mock_setting.value_json = None
    mock_setting.is_secret = False

    original_get_by_key = spec_module.DOMAIN_SETTINGS_SERVICE[SettingDomain.auth].get_by_key

    def patched_get_by_key(db, key):
        if key == "jwt_algorithm":
            return mock_setting
        return original_get_by_key(db, key)

    monkeypatch.setattr(spec_module.DOMAIN_SETTINGS_SERVICE[SettingDomain.auth], "get_by_key", patched_get_by_key)

    value = resolve_value(db_session, SettingDomain.auth, "jwt_algorithm")
    assert value == "HS384"
