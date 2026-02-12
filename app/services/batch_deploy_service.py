"""
Batch Deploy Service — Schedule and execute deployments across multiple instances.

Supports rolling (one-at-a-time), parallel, and canary strategies.
"""

from __future__ import annotations

import logging
from datetime import UTC, datetime
from uuid import UUID

from sqlalchemy import select
from sqlalchemy.orm import Session

from app.models.deployment_batch import BatchStatus, BatchStrategy, DeploymentBatch

logger = logging.getLogger(__name__)


class BatchDeployService:
    def __init__(self, db: Session):
        self.db = db

    def create_batch(
        self,
        instance_ids: list[str],
        strategy: str = "rolling",
        scheduled_at: datetime | None = None,
        created_by: str | None = None,
        notes: str | None = None,
    ) -> DeploymentBatch:
        """Create a new deployment batch."""
        batch = DeploymentBatch(
            instance_ids=instance_ids,
            strategy=BatchStrategy(strategy),
            status=BatchStatus.scheduled,
            scheduled_at=scheduled_at,
            total_instances=len(instance_ids),
            created_by=created_by,
            notes=notes,
        )
        self.db.add(batch)
        self.db.flush()
        logger.info(
            "Created batch %s: %d instances, strategy=%s",
            batch.batch_id,
            len(instance_ids),
            strategy,
        )
        return batch

    def list_batches(self, limit: int = 20, offset: int = 0) -> list[DeploymentBatch]:
        stmt = select(DeploymentBatch).order_by(DeploymentBatch.created_at.desc()).limit(limit).offset(offset)
        return list(self.db.scalars(stmt).all())

    @staticmethod
    def serialize_batch(batch: DeploymentBatch) -> dict:
        return {
            "batch_id": str(batch.batch_id),
            "strategy": batch.strategy.value,
            "status": batch.status.value,
            "total_instances": batch.total_instances,
            "completed_count": batch.completed_count,
            "failed_count": batch.failed_count,
            "created_at": batch.created_at.isoformat() if batch.created_at else None,
            "started_at": batch.started_at.isoformat() if batch.started_at else None,
            "completed_at": batch.completed_at.isoformat() if batch.completed_at else None,
        }

    def get_by_id(self, batch_id: UUID) -> DeploymentBatch | None:
        return self.db.get(DeploymentBatch, batch_id)

    def update_progress(
        self,
        batch_id: UUID,
        instance_id: str,
        success: bool,
    ) -> None:
        """Update batch progress after an individual instance deploy completes."""
        batch = self.get_by_id(batch_id)
        if not batch:
            return

        results = batch.results or {}
        results[instance_id] = "success" if success else "failed"
        batch.results = results

        if success:
            batch.completed_count += 1
        else:
            batch.failed_count += 1

        # Check if batch is complete
        total_done = batch.completed_count + batch.failed_count
        if total_done >= batch.total_instances:
            batch.status = BatchStatus.completed if batch.failed_count == 0 else BatchStatus.failed
            batch.completed_at = datetime.now(UTC)

        self.db.flush()

    def start_batch(self, batch_id: UUID) -> None:
        """Mark a batch as running."""
        batch = self.get_by_id(batch_id)
        if not batch:
            return
        batch.status = BatchStatus.running
        batch.started_at = datetime.now(UTC)
        self.db.flush()

    def cancel_batch(self, batch_id: UUID) -> None:
        """Cancel a scheduled or running batch."""
        batch = self.get_by_id(batch_id)
        if not batch:
            return
        if batch.status in (BatchStatus.scheduled, BatchStatus.running):
            batch.status = BatchStatus.cancelled
            batch.completed_at = datetime.now(UTC)
            self.db.flush()

    def get_pending_batches(self) -> list[DeploymentBatch]:
        """Get batches that are scheduled and past their scheduled time."""
        now = datetime.now(UTC)
        stmt = select(DeploymentBatch).where(
            DeploymentBatch.status == BatchStatus.scheduled,
            DeploymentBatch.scheduled_at <= now,
        )
        return list(self.db.scalars(stmt).all())
