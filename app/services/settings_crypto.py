"""Encrypt/decrypt secret domain settings."""

from __future__ import annotations

import json
import logging
import os
from typing import Any

from cryptography.fernet import Fernet

logger = logging.getLogger(__name__)

_PREFIX = "enc:"


def _key() -> bytes:
    key = os.getenv("SETTINGS_ENCRYPTION_KEY") or os.getenv("TOTP_ENCRYPTION_KEY")
    if not key:
        raise RuntimeError("Settings encryption key not configured")
    return key.encode()


def _fernet() -> Fernet:
    try:
        return Fernet(_key())
    except ValueError as exc:
        raise RuntimeError("Invalid settings encryption key") from exc


def encrypt_value(value: str) -> str:
    token = _fernet().encrypt(value.encode("utf-8")).decode("utf-8")
    return f"{_PREFIX}{token}"


def decrypt_value(value: str) -> str:
    if not value.startswith(_PREFIX):
        return value
    token = value[len(_PREFIX) :]
    return _fernet().decrypt(token.encode("utf-8")).decode("utf-8")


def encrypt_payload(value_text: str | None, value_json: Any) -> tuple[str | None, dict | None]:
    if value_text is not None:
        return encrypt_value(value_text), None
    if value_json is not None:
        return encrypt_value(json.dumps(value_json)), None
    return None, None


def resolve_setting_value(value_text: str | None, value_json: Any, is_secret: bool) -> str | None:
    if is_secret:
        if value_text is None:
            return None
        return decrypt_value(value_text)
    if value_text is not None:
        return value_text
    if value_json is not None:
        return str(value_json)
    return None
