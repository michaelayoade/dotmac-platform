from __future__ import annotations

import logging
from datetime import UTC, datetime

from sqlalchemy import select
from sqlalchemy.orm import Session

from app.models.instance import Instance, InstanceStatus
from app.services.health_service import HealthService

logger = logging.getLogger(__name__)


class FleetService:
    def __init__(self, db: Session) -> None:
        self.db = db

    def get_fleet_overview(self) -> dict:
        """Orchestrate all dashboard data for the fleet overview."""
        health_svc = HealthService(self.db)
        stats = health_svc.get_dashboard_stats()
        top_consumers = health_svc.get_top_resource_consumers(limit=10)

        # Build health heatmap for all running instances

        stmt = select(Instance).where(Instance.status == InstanceStatus.running)
        running_instances = list(self.db.scalars(stmt).all())
        running_ids = [i.instance_id for i in running_instances]
        checks_map = health_svc.get_latest_checks_batch(running_ids)
        now = datetime.now(UTC)

        heatmap: list[dict] = []
        for inst in running_instances:
            check = checks_map.get(inst.instance_id)
            health_state = health_svc.classify_health(check, now)
            heatmap.append(
                {
                    "instance_id": str(inst.instance_id),
                    "org_code": inst.org_code,
                    "org_name": inst.org_name,
                    "health_state": health_state,
                    "cpu_percent": check.cpu_percent if check else None,
                    "memory_mb": check.memory_mb if check else None,
                    "response_ms": check.response_ms if check else None,
                }
            )

        return {
            "stats": stats,
            "top_consumers": [health_svc.serialize_consumer(c) for c in top_consumers],
            "heatmap": heatmap,
            "version_matrix": stats.get("version_matrix", {}),
            "server_breakdown": stats.get("server_breakdown", []),
        }
