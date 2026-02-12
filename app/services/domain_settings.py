from __future__ import annotations

import logging
from collections.abc import Sequence
from typing import cast

from fastapi import HTTPException
from sqlalchemy import select
from sqlalchemy.orm import Session

logger = logging.getLogger(__name__)

from app.models.domain_settings import DomainSetting, SettingDomain, SettingValueType
from app.schemas.settings import DomainSettingCreate, DomainSettingUpdate
from app.services.common import apply_ordering, apply_pagination, coerce_uuid
from app.services.response import ListResponseMixin
from app.services.settings_crypto import encrypt_payload


class DomainSettings(ListResponseMixin):
    def __init__(self, domain: SettingDomain | None = None) -> None:
        self.domain = domain

    def _resolve_domain(self, payload_domain: SettingDomain | None) -> SettingDomain:
        if self.domain and payload_domain and payload_domain != self.domain:
            raise HTTPException(status_code=400, detail="Setting domain mismatch")
        if self.domain:
            return self.domain
        if payload_domain:
            return payload_domain
        raise HTTPException(status_code=400, detail="Setting domain is required")

    def create(self, db: Session, payload: DomainSettingCreate) -> DomainSetting:
        data = payload.model_dump()
        data["domain"] = self._resolve_domain(payload.domain)
        if data.get("is_secret"):
            value_text, value_json = encrypt_payload(data.get("value_text"), data.get("value_json"))
            data["value_text"] = value_text
            data["value_json"] = value_json
            data["value_type"] = SettingValueType.string
        setting = DomainSetting(**data)
        db.add(setting)
        db.flush()
        db.refresh(setting)
        return setting

    def get(self, db: Session, setting_id: str) -> DomainSetting:
        setting = db.get(DomainSetting, coerce_uuid(setting_id))
        if not setting or (self.domain and setting.domain != self.domain):
            raise HTTPException(status_code=404, detail="Setting not found")
        return setting

    def list(
        self,
        db: Session,
        domain: SettingDomain | None,
        is_active: bool | None,
        order_by: str,
        order_dir: str,
        limit: int,
        offset: int,
    ) -> list[DomainSetting]:
        stmt = select(DomainSetting)
        effective_domain = self.domain or domain
        if effective_domain:
            stmt = stmt.where(DomainSetting.domain == effective_domain)
        if is_active is None:
            stmt = stmt.where(DomainSetting.is_active.is_(True))
        else:
            stmt = stmt.where(DomainSetting.is_active == is_active)
        stmt = apply_ordering(
            stmt,
            order_by,
            order_dir,
            {"created_at": DomainSetting.created_at, "key": DomainSetting.key},
        )
        stmt = apply_pagination(stmt, limit, offset)
        return list(db.scalars(stmt).all())

    def update(self, db: Session, setting_id: str, payload: DomainSettingUpdate):
        setting = db.get(DomainSetting, coerce_uuid(setting_id))
        if not setting or (self.domain and setting.domain != self.domain):
            raise HTTPException(status_code=404, detail="Setting not found")
        data = payload.model_dump(exclude_unset=True)
        if "domain" in data and data["domain"] != setting.domain:
            raise HTTPException(status_code=400, detail="Setting domain mismatch")
        if data.get("is_secret") or setting.is_secret:
            value_text, value_json = encrypt_payload(data.get("value_text"), data.get("value_json"))
            if value_text is not None:
                data["value_text"] = value_text
                data["value_json"] = value_json
                data["value_type"] = SettingValueType.string
        for key, value in data.items():
            setattr(setting, key, value)
        db.flush()
        db.refresh(setting)
        return setting

    def get_by_key(self, db: Session, key: str) -> DomainSetting:
        if not self.domain:
            raise HTTPException(status_code=400, detail="Setting domain is required")
        stmt = select(DomainSetting).where(DomainSetting.domain == self.domain).where(DomainSetting.key == key)
        setting = db.scalar(stmt)
        if not setting:
            raise HTTPException(status_code=404, detail="Setting not found")
        return cast(DomainSetting, setting)

    def upsert_by_key(self, db: Session, key: str, payload: DomainSettingUpdate) -> DomainSetting:
        if not self.domain:
            raise HTTPException(status_code=400, detail="Setting domain is required")
        stmt = select(DomainSetting).where(DomainSetting.domain == self.domain).where(DomainSetting.key == key)
        setting = db.scalar(stmt)
        if setting:
            data = payload.model_dump(exclude_unset=True)
            data.pop("domain", None)
            data.pop("key", None)
            if data.get("is_secret") or setting.is_secret:
                value_text, value_json = encrypt_payload(data.get("value_text"), data.get("value_json"))
                if value_text is not None:
                    data["value_text"] = value_text
                    data["value_json"] = value_json
                    data["value_type"] = SettingValueType.string
            for field, value in data.items():
                setattr(setting, field, value)
            db.flush()
            db.refresh(setting)
            return cast(DomainSetting, setting)
        create_payload = DomainSettingCreate(
            domain=self.domain,
            key=key,
            value_type=payload.value_type or SettingValueType.string,
            value_text=payload.value_text,
            value_json=payload.value_json,
            is_secret=payload.is_secret or False,
            is_active=True if payload.is_active is None else payload.is_active,
        )
        return self.create(db, create_payload)

    def ensure_by_key(
        self,
        db: Session,
        key: str,
        value_type: SettingValueType,
        value_text: str | None = None,
        value_json: dict | Sequence[object] | bool | int | str | None = None,
        is_secret: bool = False,
    ) -> DomainSetting:
        if not self.domain:
            raise HTTPException(status_code=400, detail="Setting domain is required")
        stmt = select(DomainSetting).where(DomainSetting.domain == self.domain).where(DomainSetting.key == key)
        existing = db.scalar(stmt)
        if existing:
            return cast(DomainSetting, existing)
        normalized_value_json = value_json
        if isinstance(normalized_value_json, bytes):
            normalized_value_json = normalized_value_json.decode("utf-8", errors="replace")
        if isinstance(normalized_value_json, Sequence) and not isinstance(normalized_value_json, (str, dict, list)):
            normalized_value_json = list(normalized_value_json)

        payload = DomainSettingCreate(
            domain=self.domain,
            key=key,
            value_type=value_type,
            value_text=value_text,
            value_json=normalized_value_json,
            is_secret=is_secret,
            is_active=True,
        )
        return self.create(db, payload)

    def delete(self, db: Session, setting_id: str):
        setting = db.get(DomainSetting, setting_id)
        if not setting or (self.domain and setting.domain != self.domain):
            raise HTTPException(status_code=404, detail="Setting not found")
        setting.is_active = False
        db.flush()


settings = DomainSettings()
auth_settings = DomainSettings(SettingDomain.auth)
audit_settings = DomainSettings(SettingDomain.audit)
scheduler_settings = DomainSettings(SettingDomain.scheduler)
