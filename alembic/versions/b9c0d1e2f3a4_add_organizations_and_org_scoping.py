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
    op.create_table(
        "organization_members",
        sa.Column("id", postgresql.UUID(as_uuid=True), primary_key=True, nullable=False),
        sa.Column("org_id", postgresql.UUID(as_uuid=True), sa.ForeignKey("organizations.org_id"), nullable=False),
        sa.Column("person_id", postgresql.UUID(as_uuid=True), sa.ForeignKey("people.id"), nullable=False),
        sa.Column("is_active", sa.Boolean(), nullable=False, server_default=sa.true()),
        sa.Column("created_at", sa.DateTime(timezone=True), nullable=False),
        sa.UniqueConstraint("org_id", "person_id", name="uq_organization_members_org_person"),
    )
    op.create_index("ix_organization_members_org_id", "organization_members", ["org_id"])
    op.create_index("ix_organization_members_person_id", "organization_members", ["person_id"])

    op.add_column("instances", sa.Column("org_id", postgresql.UUID(as_uuid=True), nullable=True))
    op.create_index("ix_instances_org_id", "instances", ["org_id"])

    op.add_column("sessions", sa.Column("org_id", postgresql.UUID(as_uuid=True), nullable=True))
    op.create_index("ix_sessions_org_id", "sessions", ["org_id"])

    op.add_column("api_keys", sa.Column("org_id", postgresql.UUID(as_uuid=True), nullable=True))
    op.create_index("ix_api_keys_org_id", "api_keys", ["org_id"])

    conn = op.get_bind()
    rows = conn.execute(sa.text("SELECT DISTINCT org_code, org_name FROM instances")).fetchall()
    for row in rows:
        org_id = uuid.uuid4()
        conn.execute(
            sa.text(
                "INSERT INTO organizations (org_id, org_code, org_name, is_active, created_at, updated_at) "
                "VALUES (:org_id, :org_code, :org_name, true, now(), now())"
            ),
            {"org_id": org_id, "org_code": row[0], "org_name": row[1]},
        )
        conn.execute(
            sa.text("UPDATE instances SET org_id = :org_id WHERE org_code = :org_code"),
            {"org_id": org_id, "org_code": row[0]},
        )

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
