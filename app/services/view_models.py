from __future__ import annotations

from dataclasses import dataclass
from datetime import datetime
from typing import Generic, TypeVar

from app.models.health_check import HealthCheck
from app.models.instance import Instance

T = TypeVar("T")


@dataclass(frozen=True)
class PagedResult(Generic[T]):
    items: list[T]
    total: int
    page: int
    page_size: int


@dataclass(frozen=True)
class InstanceListItem:
    instance: Instance
    health: HealthCheck | None
    health_state: str
    health_checked_at: datetime | None
    catalog_label: str | None
    release_version: str | None
