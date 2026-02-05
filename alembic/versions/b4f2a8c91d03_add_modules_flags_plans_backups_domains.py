"""add modules, flags, plans, backups, domains

Revision ID: b4f2a8c91d03
Revises: a3f1c7d89e02
Create Date: 2026-02-05 12:00:00.000000

"""

from alembic import op
import sqlalchemy as sa
from sqlalchemy.dialects.postgresql import JSON, UUID


revision = 'b4f2a8c91d03'
down_revision = 'a3f1c7d89e02'
branch_labels = None
depends_on = None


# Enum definitions used by new tables
backup_type_enum = sa.Enum('full', 'db_only', 'pre_deploy', name='backuptype', create_type=True)
backup_status_enum = sa.Enum('pending', 'running', 'completed', 'failed', name='backupstatus', create_type=True)
batch_strategy_enum = sa.Enum('parallel', 'rolling', 'canary', name='batchstrategy', create_type=True)
batch_status_enum = sa.Enum('scheduled', 'running', 'completed', 'failed', 'cancelled', name='batchstatus', create_type=True)
domain_status_enum = sa.Enum(
    'pending_verification', 'verified', 'ssl_provisioned', 'active', 'failed',
    name='domainstatus', create_type=True,
)


def upgrade() -> None:
    # ── 1. Extend the existing instancestatus enum with new values ──────
    op.execute("ALTER TYPE instancestatus ADD VALUE IF NOT EXISTS 'trial'")
    op.execute("ALTER TYPE instancestatus ADD VALUE IF NOT EXISTS 'suspended'")
    op.execute("ALTER TYPE instancestatus ADD VALUE IF NOT EXISTS 'archived'")

    # ── 2. Create new tables (plans first, because instances will FK to it) ─

    # plans
    op.create_table(
        'plans',
        sa.Column('plan_id', UUID(as_uuid=True), nullable=False),
        sa.Column('name', sa.String(length=80), nullable=False),
        sa.Column('description', sa.Text(), nullable=True),
        sa.Column('max_users', sa.Integer(), nullable=False, server_default='0'),
        sa.Column('max_storage_gb', sa.Integer(), nullable=False, server_default='0'),
        sa.Column('allowed_modules', JSON(), nullable=False, server_default='[]'),
        sa.Column('allowed_flags', JSON(), nullable=False, server_default='[]'),
        sa.Column('is_active', sa.Boolean(), nullable=False, server_default='true'),
        sa.Column('created_at', sa.DateTime(timezone=True), nullable=False),
        sa.Column('updated_at', sa.DateTime(timezone=True), nullable=False),
        sa.PrimaryKeyConstraint('plan_id'),
        sa.UniqueConstraint('name', name='uq_plans_name'),
    )

    # modules
    op.create_table(
        'modules',
        sa.Column('module_id', UUID(as_uuid=True), nullable=False),
        sa.Column('name', sa.String(length=120), nullable=False),
        sa.Column('slug', sa.String(length=60), nullable=False),
        sa.Column('description', sa.Text(), nullable=True),
        sa.Column('schemas', JSON(), nullable=False, server_default='[]'),
        sa.Column('dependencies', JSON(), nullable=False, server_default='[]'),
        sa.Column('is_core', sa.Boolean(), nullable=False, server_default='false'),
        sa.Column('is_active', sa.Boolean(), nullable=False, server_default='true'),
        sa.Column('created_at', sa.DateTime(timezone=True), nullable=False),
        sa.Column('updated_at', sa.DateTime(timezone=True), nullable=False),
        sa.PrimaryKeyConstraint('module_id'),
        sa.UniqueConstraint('slug', name='uq_modules_slug'),
    )

    # instance_modules
    op.create_table(
        'instance_modules',
        sa.Column('id', sa.Integer(), autoincrement=True, nullable=False),
        sa.Column('instance_id', UUID(as_uuid=True), nullable=False),
        sa.Column('module_id', UUID(as_uuid=True), nullable=False),
        sa.Column('enabled', sa.Boolean(), nullable=False, server_default='true'),
        sa.Column('enabled_at', sa.DateTime(timezone=True), nullable=True),
        sa.ForeignKeyConstraint(['instance_id'], ['instances.instance_id']),
        sa.ForeignKeyConstraint(['module_id'], ['modules.module_id']),
        sa.PrimaryKeyConstraint('id'),
        sa.UniqueConstraint('instance_id', 'module_id', name='uq_instance_module'),
    )
    op.create_index('ix_instance_modules_instance_id', 'instance_modules', ['instance_id'])
    op.create_index('ix_instance_modules_module_id', 'instance_modules', ['module_id'])

    # instance_flags
    op.create_table(
        'instance_flags',
        sa.Column('id', sa.Integer(), autoincrement=True, nullable=False),
        sa.Column('instance_id', UUID(as_uuid=True), nullable=False),
        sa.Column('flag_key', sa.String(length=120), nullable=False),
        sa.Column('flag_value', sa.String(length=255), nullable=False, server_default='true'),
        sa.Column('updated_at', sa.DateTime(timezone=True), nullable=False),
        sa.ForeignKeyConstraint(['instance_id'], ['instances.instance_id']),
        sa.PrimaryKeyConstraint('id'),
        sa.UniqueConstraint('instance_id', 'flag_key', name='uq_instance_flag'),
    )
    op.create_index('ix_instance_flags_instance_id', 'instance_flags', ['instance_id'])

    # backups
    op.create_table(
        'backups',
        sa.Column('backup_id', UUID(as_uuid=True), nullable=False),
        sa.Column('instance_id', UUID(as_uuid=True), nullable=False),
        sa.Column('backup_type', backup_type_enum, nullable=True),
        sa.Column('status', backup_status_enum, nullable=True),
        sa.Column('file_path', sa.String(length=512), nullable=True),
        sa.Column('size_bytes', sa.BigInteger(), nullable=True),
        sa.Column('error_message', sa.Text(), nullable=True),
        sa.Column('created_at', sa.DateTime(timezone=True), nullable=False),
        sa.Column('completed_at', sa.DateTime(timezone=True), nullable=True),
        sa.ForeignKeyConstraint(['instance_id'], ['instances.instance_id']),
        sa.PrimaryKeyConstraint('backup_id'),
    )
    op.create_index('ix_backups_instance_id', 'backups', ['instance_id'])

    # deployment_batches
    op.create_table(
        'deployment_batches',
        sa.Column('batch_id', UUID(as_uuid=True), nullable=False),
        sa.Column('instance_ids', JSON(), nullable=False),
        sa.Column('strategy', batch_strategy_enum, nullable=True),
        sa.Column('status', batch_status_enum, nullable=True),
        sa.Column('scheduled_at', sa.DateTime(timezone=True), nullable=True),
        sa.Column('started_at', sa.DateTime(timezone=True), nullable=True),
        sa.Column('completed_at', sa.DateTime(timezone=True), nullable=True),
        sa.Column('results', JSON(), nullable=True),
        sa.Column('total_instances', sa.Integer(), nullable=False, server_default='0'),
        sa.Column('completed_count', sa.Integer(), nullable=False, server_default='0'),
        sa.Column('failed_count', sa.Integer(), nullable=False, server_default='0'),
        sa.Column('created_by', sa.String(length=120), nullable=True),
        sa.Column('notes', sa.Text(), nullable=True),
        sa.Column('created_at', sa.DateTime(timezone=True), nullable=False),
        sa.PrimaryKeyConstraint('batch_id'),
    )

    # instance_domains
    op.create_table(
        'instance_domains',
        sa.Column('domain_id', UUID(as_uuid=True), nullable=False),
        sa.Column('instance_id', UUID(as_uuid=True), nullable=False),
        sa.Column('domain', sa.String(length=255), nullable=False),
        sa.Column('is_primary', sa.Boolean(), nullable=False, server_default='false'),
        sa.Column('status', domain_status_enum, nullable=True),
        sa.Column('verification_token', sa.String(length=255), nullable=True),
        sa.Column('verified_at', sa.DateTime(timezone=True), nullable=True),
        sa.Column('ssl_expires_at', sa.DateTime(timezone=True), nullable=True),
        sa.Column('ssl_provisioned_at', sa.DateTime(timezone=True), nullable=True),
        sa.Column('error_message', sa.Text(), nullable=True),
        sa.Column('created_at', sa.DateTime(timezone=True), nullable=False),
        sa.Column('updated_at', sa.DateTime(timezone=True), nullable=False),
        sa.ForeignKeyConstraint(['instance_id'], ['instances.instance_id']),
        sa.PrimaryKeyConstraint('domain_id'),
        sa.UniqueConstraint('domain', name='uq_instance_domains_domain'),
    )
    op.create_index('ix_instance_domains_instance_id', 'instance_domains', ['instance_id'])

    # ── 3. Add new columns to existing tables ───────────────────────────

    # instances: plan association, version pinning, lifecycle
    op.add_column('instances', sa.Column('plan_id', UUID(as_uuid=True), nullable=True))
    op.add_column('instances', sa.Column('git_branch', sa.String(length=120), nullable=True))
    op.add_column('instances', sa.Column('git_tag', sa.String(length=120), nullable=True))
    op.add_column('instances', sa.Column('deployed_git_ref', sa.String(length=120), nullable=True))
    op.add_column('instances', sa.Column('trial_expires_at', sa.DateTime(timezone=True), nullable=True))
    op.add_column('instances', sa.Column('suspended_at', sa.DateTime(timezone=True), nullable=True))
    op.add_column('instances', sa.Column('archived_at', sa.DateTime(timezone=True), nullable=True))
    op.create_foreign_key('fk_instances_plan_id', 'instances', 'plans', ['plan_id'], ['plan_id'])

    # deployment_logs: deployment metadata
    op.add_column('deployment_logs', sa.Column('deployment_type', sa.String(length=30), nullable=True))
    op.add_column('deployment_logs', sa.Column('git_ref', sa.String(length=120), nullable=True))

    # health_checks: resource monitoring
    op.add_column('health_checks', sa.Column('cpu_percent', sa.Float(), nullable=True))
    op.add_column('health_checks', sa.Column('memory_mb', sa.Integer(), nullable=True))
    op.add_column('health_checks', sa.Column('memory_limit_mb', sa.Integer(), nullable=True))
    op.add_column('health_checks', sa.Column('disk_usage_mb', sa.BigInteger(), nullable=True))
    op.add_column('health_checks', sa.Column('db_size_mb', sa.Integer(), nullable=True))
    op.add_column('health_checks', sa.Column('active_connections', sa.Integer(), nullable=True))


def downgrade() -> None:
    # ── Drop new columns from existing tables (reverse order) ───────────

    # health_checks
    op.drop_column('health_checks', 'active_connections')
    op.drop_column('health_checks', 'db_size_mb')
    op.drop_column('health_checks', 'disk_usage_mb')
    op.drop_column('health_checks', 'memory_limit_mb')
    op.drop_column('health_checks', 'memory_mb')
    op.drop_column('health_checks', 'cpu_percent')

    # deployment_logs
    op.drop_column('deployment_logs', 'git_ref')
    op.drop_column('deployment_logs', 'deployment_type')

    # instances
    op.drop_constraint('fk_instances_plan_id', 'instances', type_='foreignkey')
    op.drop_column('instances', 'archived_at')
    op.drop_column('instances', 'suspended_at')
    op.drop_column('instances', 'trial_expires_at')
    op.drop_column('instances', 'deployed_git_ref')
    op.drop_column('instances', 'git_tag')
    op.drop_column('instances', 'git_branch')
    op.drop_column('instances', 'plan_id')

    # ── Drop new tables ─────────────────────────────────────────────────

    op.drop_index('ix_instance_domains_instance_id', table_name='instance_domains')
    op.drop_table('instance_domains')

    op.drop_table('deployment_batches')

    op.drop_index('ix_backups_instance_id', table_name='backups')
    op.drop_table('backups')

    op.drop_index('ix_instance_flags_instance_id', table_name='instance_flags')
    op.drop_table('instance_flags')

    op.drop_index('ix_instance_modules_module_id', table_name='instance_modules')
    op.drop_index('ix_instance_modules_instance_id', table_name='instance_modules')
    op.drop_table('instance_modules')

    op.drop_table('modules')
    op.drop_table('plans')

    # ── Drop new enum types ─────────────────────────────────────────────
    for enum_name in [
        'domainstatus',
        'batchstatus',
        'batchstrategy',
        'backupstatus',
        'backuptype',
    ]:
        sa.Enum(name=enum_name).drop(op.get_bind(), checkfirst=True)

    # NOTE: Removing values from a PostgreSQL enum is not straightforward.
    # The 'trial', 'suspended', 'archived' values added to instancestatus
    # are left in place on downgrade to avoid the complex type-swap dance.
