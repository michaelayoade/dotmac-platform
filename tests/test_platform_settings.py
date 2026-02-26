"""Tests for platform settings whitelist enforcement."""

from __future__ import annotations

import pytest

from app.models.domain_settings import DomainSetting, SettingDomain
from app.services.platform_settings import PlatformSettingsService


def test_platform_settings_rejects_unknown_key(db_session):
    svc = PlatformSettingsService(db_session)

    with pytest.raises(ValueError, match="Unknown platform setting key"):
        svc.set("unexpected_key", "value")

    rows = db_session.query(DomainSetting).filter(
        DomainSetting.domain == SettingDomain.platform,
        DomainSetting.key == "unexpected_key",
    ).all()
    assert rows == []


def test_platform_settings_rejects_unknown_key_in_bulk(db_session):
    svc = PlatformSettingsService(db_session)

    with pytest.raises(ValueError, match="Unknown platform setting keys"):
        svc.set_many({"dotmac_git_branch": "main", "bad_key": "x"})
