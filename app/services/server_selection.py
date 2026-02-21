"""Server Selection Service — choose a server based on strategy."""

from __future__ import annotations

import logging
import random
from typing import cast
from uuid import UUID

from sqlalchemy import func, select
from sqlalchemy.orm import Session

from app.models.domain_settings import DomainSetting, SettingDomain, SettingValueType
from app.models.instance import Instance
from app.models.server import Server
from app.services.platform_settings import PlatformSettingsService

logger = logging.getLogger(__name__)

_CURSOR_KEY = "server_selection_cursor"
_WEIGHTS_KEY = "server_selection_weights"


class ServerSelectionService:
    def __init__(self, db: Session):
        self.db = db

    def _ensure_server(self, server_id: UUID) -> Server:
        server = self.db.get(Server, server_id)
        if not server:
            raise ValueError("Server not found")
        return server

    def _list_servers(self) -> list[Server]:
        servers = list(self.db.scalars(select(Server).order_by(Server.created_at.asc())).all())
        if not servers:
            raise ValueError("No servers configured")
        return servers

    def _select_round_robin(self, servers: list[Server]) -> Server:
        stmt = (
            select(DomainSetting)
            .where(DomainSetting.domain == SettingDomain.platform)
            .where(DomainSetting.key == _CURSOR_KEY)
            .with_for_update()
        )
        cursor = self.db.scalar(stmt)
        current_id = None
        if cursor and cursor.value_text:
            try:
                current_id = UUID(cursor.value_text)
            except ValueError:
                current_id = None

        idx = 0
        if current_id:
            for i, server in enumerate(servers):
                if server.server_id == current_id:
                    idx = (i + 1) % len(servers)
                    break
        selected = servers[idx]

        if cursor:
            cursor.value_text = str(selected.server_id)
            cursor.value_type = SettingValueType.string
            cursor.is_active = True
        else:
            cursor = DomainSetting(
                domain=SettingDomain.platform,
                key=_CURSOR_KEY,
                value_type=SettingValueType.string,
                value_text=str(selected.server_id),
                is_active=True,
            )
            self.db.add(cursor)
        self.db.flush()
        return selected

    def _select_least_instances(self, servers: list[Server]) -> Server:
        rows = self.db.execute(
            select(Instance.server_id, func.count(Instance.instance_id))
            .where(Instance.server_id.in_([s.server_id for s in servers]))
            .group_by(Instance.server_id)
        ).all()
        counts: dict[UUID, int] = {row[0]: row[1] for row in rows}

        def _count(server: Server) -> int:
            return counts.get(server.server_id, 0)

        servers_sorted = sorted(servers, key=lambda s: (_count(s), s.created_at))
        return servers_sorted[0]

    def _select_weighted(self, servers: list[Server]) -> Server:
        ps = PlatformSettingsService(self.db)
        weights = cast(dict[str, object], ps.get_json(_WEIGHTS_KEY) or {})
        weighted: list[tuple[Server, int]] = []
        for server in servers:
            weight = weights.get(str(server.server_id))
            weight_int = 0
            if isinstance(weight, (int, str)):
                try:
                    weight_int = int(weight)
                except ValueError:
                    weight_int = 0
            if weight_int > 0:
                weighted.append((server, weight_int))

        if not weighted:
            logger.warning("Weighted strategy has no valid weights; falling back to least_instances")
            return self._select_least_instances(servers)

        total = sum(w for _, w in weighted)
        r = random.SystemRandom().randrange(total)
        upto = 0
        for server, weight in weighted:
            upto += weight
            if r < upto:
                return server
        return weighted[-1][0]

    def select_server(self, *, strategy: str | None, requested_server_id: UUID | None = None) -> Server:
        strategy_value = (strategy or "least_instances").strip().lower()

        if strategy_value == "explicit":
            if not requested_server_id:
                raise ValueError("server_id is required for explicit server selection")
            return self._ensure_server(requested_server_id)

        if requested_server_id:
            return self._ensure_server(requested_server_id)

        servers = self._list_servers()
        if strategy_value in {"round_robin", "round-robin", "rr"}:
            return self._select_round_robin(servers)
        if strategy_value in {"least_instances", "least-instances", "least"}:
            return self._select_least_instances(servers)
        if strategy_value in {"weighted", "weight"}:
            return self._select_weighted(servers)
        if strategy_value in {"default", "fallback"}:
            ps = PlatformSettingsService(self.db)
            default_id = (ps.get("default_server_id") or "").strip()
            if default_id:
                try:
                    return self._ensure_server(UUID(default_id))
                except ValueError:
                    logger.warning("Invalid default_server_id setting; falling back to most recent server")
            return servers[-1]

        logger.warning("Unknown server selection strategy '%s'; falling back to least_instances", strategy_value)
        return self._select_least_instances(servers)
