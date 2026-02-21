"""add organizations and org scoping

Revision ID: b9c0d1e2f3a4
Revises: f9a1b2c3d4e5
Create Date: 2026-02-10
"""

from __future__ import annotations

import uuid

import sqlalchemy as sa
from sqlalchemy.dialects import postgresql

from alembic import op

# revision identifiers, used by Alembic.
revision = "b9c0d1e2f3a4"
down_revision = "f9a1b2c3d4e5"
branch_labels = None
depends_on = None


def upgrade() -> None:
    conn = op.get_bind()
    inspector = sa.inspect(conn)
    tables = set(inspector.get_table_names())

    if "organizations" not in tables:
        op.create_table(
            "organizations",
            sa.Column("org_id", postgresql.UUID(as_uuid=True), primary_key=True, nullable=False),
            sa.Column("org_code", sa.String(length=40), nullable=False),
            sa.Column("org_name", sa.String(length=200), nullable=False),
            sa.Column("is_active", sa.Boolean(), nullable=False, server_default=sa.true()),
            sa.Column("created_at", sa.DateTime(timezone=True), nullable=False),
            sa.Column("updated_at", sa.DateTime(timezone=True), nullable=False),
            sa.UniqueConstraint("org_code", name="uq_organizations_org_code"),
        )
    if "organization_members" not in tables:
        op.create_table(
            "organization_members",
            sa.Column("id", postgresql.UUID(as_uuid=True), primary_key=True, nullable=False),
            sa.Column("org_id", postgresql.UUID(as_uuid=True), sa.ForeignKey("organizations.org_id"), nullable=False),
            sa.Column("person_id", postgresql.UUID(as_uuid=True), sa.ForeignKey("people.id"), nullable=False),
            sa.Column("is_active", sa.Boolean(), nullable=False, server_default=sa.true()),
            sa.Column("created_at", sa.DateTime(timezone=True), nullable=False),
            sa.UniqueConstraint("org_id", "person_id", name="uq_organization_members_org_person"),
        )
    om_indexes = (
        {idx["name"] for idx in inspector.get_indexes("organization_members")}
        if "organization_members" in tables
        else set()
    )
    if "ix_organization_members_org_id" not in om_indexes:
        op.create_index("ix_organization_members_org_id", "organization_members", ["org_id"])
    if "ix_organization_members_person_id" not in om_indexes:
        op.create_index("ix_organization_members_person_id", "organization_members", ["person_id"])

    inst_cols = {c["name"] for c in inspector.get_columns("instances")} if "instances" in tables else set()
    if "org_id" not in inst_cols:
        op.add_column("instances", sa.Column("org_id", postgresql.UUID(as_uuid=True), nullable=True))
    inst_indexes = {idx["name"] for idx in inspector.get_indexes("instances")} if "instances" in tables else set()
    if "ix_instances_org_id" not in inst_indexes:
        op.create_index("ix_instances_org_id", "instances", ["org_id"])

    sess_cols = {c["name"] for c in inspector.get_columns("sessions")} if "sessions" in tables else set()
    if "org_id" not in sess_cols:
        op.add_column("sessions", sa.Column("org_id", postgresql.UUID(as_uuid=True), nullable=True))
    sess_indexes = {idx["name"] for idx in inspector.get_indexes("sessions")} if "sessions" in tables else set()
    if "ix_sessions_org_id" not in sess_indexes:
        op.create_index("ix_sessions_org_id", "sessions", ["org_id"])

    ak_cols = {c["name"] for c in inspector.get_columns("api_keys")} if "api_keys" in tables else set()
    if "org_id" not in ak_cols:
        op.add_column("api_keys", sa.Column("org_id", postgresql.UUID(as_uuid=True), nullable=True))
    ak_indexes = {idx["name"] for idx in inspector.get_indexes("api_keys")} if "api_keys" in tables else set()
    if "ix_api_keys_org_id" not in ak_indexes:
        op.create_index("ix_api_keys_org_id", "api_keys", ["org_id"])

    # Data migration: only populate organizations from instances where org_id is still null
    rows = conn.execute(sa.text("SELECT DISTINCT org_code, org_name FROM instances WHERE org_id IS NULL")).fetchall()
    for row in rows:
        org_id = uuid.uuid4()
        # Only insert if this org_code doesn't already exist in organizations
        existing = conn.execute(
            sa.text("SELECT org_id FROM organizations WHERE org_code = :org_code"),
            {"org_code": row[0]},
        ).fetchone()
        if existing:
            org_id = existing[0]
        else:
            conn.execute(
                sa.text(
                    "INSERT INTO organizations (org_id, org_code, org_name, is_active, created_at, updated_at) "
                    "VALUES (:org_id, :org_code, :org_name, true, now(), now())"
                ),
                {"org_id": org_id, "org_code": row[0], "org_name": row[1]},
            )
        conn.execute(
            sa.text("UPDATE instances SET org_id = :org_id WHERE org_code = :org_code AND org_id IS NULL"),
            {"org_id": org_id, "org_code": row[0]},
        )

    # Only set NOT NULL if there are no null org_ids remaining (safe for re-runs)
    null_count = conn.execute(sa.text("SELECT COUNT(*) FROM instances WHERE org_id IS NULL")).scalar()
    if null_count == 0:
        op.alter_column("instances", "org_id", nullable=False)


def downgrade() -> None:
    op.alter_column("instances", "org_id", nullable=True)
    op.drop_index("ix_api_keys_org_id", table_name="api_keys")
    op.drop_column("api_keys", "org_id")
    op.drop_index("ix_sessions_org_id", table_name="sessions")
    op.drop_column("sessions", "org_id")
    op.drop_index("ix_instances_org_id", table_name="instances")
    op.drop_column("instances", "org_id")
    op.drop_index("ix_organization_members_person_id", table_name="organization_members")
    op.drop_index("ix_organization_members_org_id", table_name="organization_members")
    op.drop_table("organization_members")
    op.drop_table("organizations")
