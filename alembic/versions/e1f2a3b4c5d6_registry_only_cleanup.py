"""Registry-only cleanup: NULL out git repo URLs where registry URL is set.

Revision ID: e1f2a3b4c5d6
Revises: d6e7f8a9b0c1
Create Date: 2026-02-24 00:00:00.000000

"""

from __future__ import annotations

from alembic import op

revision = "e1f2a3b4c5d6"
down_revision = "d6e7f8a9b0c1"
branch_labels = None
depends_on = None


def upgrade() -> None:
    # Idempotent: only clears url where registry_url is already set
    op.execute("UPDATE git_repositories SET url = NULL WHERE registry_url IS NOT NULL AND url IS NOT NULL")


def downgrade() -> None:
    # Data-only migration — cannot restore original URLs
    pass
