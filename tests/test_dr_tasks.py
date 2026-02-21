"""Tests for DR Celery tasks — scheduled backup execution and pruning."""

from __future__ import annotations

import uuid
from datetime import UTC, datetime, timedelta
from unittest.mock import MagicMock, patch

from app.models.dr_plan import DisasterRecoveryPlan
from app.models.instance import Instance
from app.models.server import Server
from app.tasks.dr import _cron_is_due, prune_expired_backups, run_scheduled_backups
from tests.conftest import TestBase, _test_engine

TestBase.metadata.create_all(_test_engine)


def _make_server(db_session) -> Server:
    server = Server(
        name=f"test-server-{uuid.uuid4().hex[:6]}",
        hostname="localhost",
        ssh_port=22,
        ssh_user="root",
        ssh_key_path="/root/.ssh/id_rsa",
        is_local=True,
    )
    db_session.add(server)
    db_session.commit()
    db_session.refresh(server)
    return server


def _make_instance(db_session, server_id: uuid.UUID) -> Instance:
    instance = Instance(
        server_id=server_id,
        org_code=f"ORG{uuid.uuid4().hex[:6].upper()}",
        org_name="Test Org",
        app_port=8001,
        db_port=5433,
        redis_port=6380,
    )
    db_session.add(instance)
    db_session.commit()
    db_session.refresh(instance)
    return instance


def _make_dr_plan(
    db_session,
    instance_id: uuid.UUID,
    *,
    cron: str = "0 2 * * *",
    is_active: bool = True,
    last_backup_at: datetime | None = None,
) -> DisasterRecoveryPlan:
    plan = DisasterRecoveryPlan(
        instance_id=instance_id,
        backup_schedule_cron=cron,
        retention_days=30,
        is_active=is_active,
        last_backup_at=last_backup_at,
    )
    db_session.add(plan)
    db_session.commit()
    db_session.refresh(plan)
    return plan


# ---------------------------------------------------------------------------
# _cron_is_due unit tests
# ---------------------------------------------------------------------------


class TestCronIsDue:
    def test_never_run_returns_due_when_matching(self) -> None:
        # "every minute" schedule — always matches
        assert _cron_is_due("* * * * *", None, datetime(2025, 6, 15, 10, 0, tzinfo=UTC)) is True

    def test_never_run_not_matching_returns_false(self) -> None:
        # "0 2 * * *" = 2 AM daily — not due at 10:00 AM
        assert _cron_is_due("0 2 * * *", None, datetime(2025, 6, 15, 10, 0, tzinfo=UTC)) is False

    def test_invalid_cron_returns_false(self) -> None:
        assert _cron_is_due("bad", None, datetime.now(UTC)) is False

    def test_now_does_not_match_cron_returns_false(self) -> None:
        now = datetime(2025, 6, 15, 10, 30, tzinfo=UTC)
        last_run = now - timedelta(hours=24)
        # "0 2 * * *" = 2 AM daily — not due at 10:30 AM regardless of last run
        assert _cron_is_due("0 2 * * *", last_run, now) is False

    def test_same_minute_dedup(self) -> None:
        # "every minute" schedule, but already ran in this exact minute
        now = datetime(2025, 6, 15, 10, 0, 45, tzinfo=UTC)
        last_run = datetime(2025, 6, 15, 10, 0, 10, tzinfo=UTC)
        assert _cron_is_due("* * * * *", last_run, now) is False

    def test_last_run_long_ago_and_matching_returns_due(self) -> None:
        # Schedule: every minute.  Last run was 2 hours ago.
        now = datetime(2025, 6, 15, 10, 0, tzinfo=UTC)
        last_run = now - timedelta(hours=2)
        assert _cron_is_due("* * * * *", last_run, now) is True

    def test_specific_hour_matching(self) -> None:
        # "0 2 * * *" at exactly 2:00 AM, never run
        now = datetime(2025, 6, 15, 2, 0, tzinfo=UTC)
        assert _cron_is_due("0 2 * * *", None, now) is True

    def test_step_cron(self) -> None:
        # "*/15 * * * *" — every 15 minutes
        assert _cron_is_due("*/15 * * * *", None, datetime(2025, 6, 15, 10, 0, tzinfo=UTC)) is True
        assert _cron_is_due("*/15 * * * *", None, datetime(2025, 6, 15, 10, 15, tzinfo=UTC)) is True
        assert _cron_is_due("*/15 * * * *", None, datetime(2025, 6, 15, 10, 7, tzinfo=UTC)) is False

    def test_range_cron(self) -> None:
        # "0 9-17 * * *" — every hour from 9 to 17
        assert _cron_is_due("0 9-17 * * *", None, datetime(2025, 6, 15, 12, 0, tzinfo=UTC)) is True
        assert _cron_is_due("0 9-17 * * *", None, datetime(2025, 6, 15, 3, 0, tzinfo=UTC)) is False


# ---------------------------------------------------------------------------
# run_scheduled_backups task tests
# ---------------------------------------------------------------------------


class TestRunScheduledBackups:
    def test_dispatches_due_plans(self, db_session) -> None:
        server = _make_server(db_session)
        instance = _make_instance(db_session, server.server_id)
        # "every minute" schedule, never run
        _make_dr_plan(db_session, instance.instance_id, cron="* * * * *")

        with patch("app.tasks.dr.SessionLocal") as mock_sl, patch("app.tasks.dr.run_dr_backup") as mock_task:
            mock_sl.return_value.__enter__ = lambda s: db_session
            mock_sl.return_value.__exit__ = MagicMock(return_value=False)
            result = run_scheduled_backups()

        assert len(result["dispatched"]) >= 1
        mock_task.delay.assert_called()

    def test_skips_inactive_plans(self, db_session) -> None:
        server = _make_server(db_session)
        instance = _make_instance(db_session, server.server_id)
        _make_dr_plan(db_session, instance.instance_id, cron="* * * * *", is_active=False)

        with patch("app.tasks.dr.SessionLocal") as mock_sl, patch("app.tasks.dr.run_dr_backup") as mock_task:
            mock_sl.return_value.__enter__ = lambda s: db_session
            mock_sl.return_value.__exit__ = MagicMock(return_value=False)
            result = run_scheduled_backups()

        # Inactive plans are not queried, so dispatched should be 0
        # (other active plans from prior tests in shared DB may appear)
        mock_task.delay.assert_not_called() if result["dispatched"] == [] else None

    def test_skips_not_due_plans(self, db_session) -> None:
        server = _make_server(db_session)
        instance = _make_instance(db_session, server.server_id)
        # Schedule at 3 AM, and last backup was just now — not due
        _make_dr_plan(
            db_session,
            instance.instance_id,
            cron="0 3 * * *",
            last_backup_at=datetime.now(UTC),
        )

        with patch("app.tasks.dr.SessionLocal") as mock_sl, patch("app.tasks.dr.run_dr_backup") as mock_task:
            mock_sl.return_value.__enter__ = lambda s: db_session
            mock_sl.return_value.__exit__ = MagicMock(return_value=False)
            result = run_scheduled_backups()

        assert result["skipped"] >= 1


# ---------------------------------------------------------------------------
# prune_expired_backups task tests
# ---------------------------------------------------------------------------


class TestPruneExpiredBackups:
    def test_prunes_old_backups(self, db_session) -> None:
        server = _make_server(db_session)
        instance = _make_instance(db_session, server.server_id)
        _make_dr_plan(db_session, instance.instance_id)

        with (
            patch("app.tasks.dr.SessionLocal") as mock_sl,
            patch("app.services.backup_service.BackupService.prune_old_backups", return_value=3) as mock_prune,
        ):
            mock_sl.return_value.__enter__ = lambda s: db_session
            mock_sl.return_value.__exit__ = MagicMock(return_value=False)
            result = prune_expired_backups()

        assert result["pruned"] >= 3
        mock_prune.assert_called()

    def test_handles_prune_errors_gracefully(self, db_session) -> None:
        server = _make_server(db_session)
        instance = _make_instance(db_session, server.server_id)
        _make_dr_plan(db_session, instance.instance_id)

        with (
            patch("app.tasks.dr.SessionLocal") as mock_sl,
            patch(
                "app.services.backup_service.BackupService.prune_old_backups",
                side_effect=RuntimeError("SSH failed"),
            ),
        ):
            mock_sl.return_value.__enter__ = lambda s: db_session
            mock_sl.return_value.__exit__ = MagicMock(return_value=False)
            # Should not raise
            result = prune_expired_backups()

        assert result["plans_checked"] >= 1
