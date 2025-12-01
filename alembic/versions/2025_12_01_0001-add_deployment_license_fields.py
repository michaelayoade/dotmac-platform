"""add deployment license fields

Revision ID: add_deployment_license_fields
Revises: 4f9f8c53f4ce
Create Date: 2025-12-01 00:01:00.000000

Add license_id and activation_id fields to deployment_instances table
to track the license and activation associated with each deployment.
"""
from alembic import op
import sqlalchemy as sa


# revision identifiers, used by Alembic.
revision = 'add_deployment_license_fields'
down_revision = '4f9f8c53f4ce'
branch_labels = None
depends_on = None


def upgrade() -> None:
    """Add license tracking fields to deployment_instances."""
    # Add license_id column with foreign key to licenses table
    op.add_column(
        'deployment_instances',
        sa.Column('license_id', sa.String(length=255), nullable=True)
    )
    op.create_index(
        'ix_deployment_instances_license_id',
        'deployment_instances',
        ['license_id'],
        unique=False
    )
    op.create_foreign_key(
        'fk_deployment_instances_license_id',
        'deployment_instances',
        'licenses',
        ['license_id'],
        ['id'],
        ondelete='SET NULL'
    )

    # Add activation_id column with foreign key to activations table
    op.add_column(
        'deployment_instances',
        sa.Column('activation_id', sa.String(length=255), nullable=True)
    )
    op.create_foreign_key(
        'fk_deployment_instances_activation_id',
        'deployment_instances',
        'activations',
        ['activation_id'],
        ['id'],
        ondelete='SET NULL'
    )


def downgrade() -> None:
    """Remove license tracking fields from deployment_instances."""
    # Drop foreign keys first
    op.drop_constraint(
        'fk_deployment_instances_activation_id',
        'deployment_instances',
        type_='foreignkey'
    )
    op.drop_constraint(
        'fk_deployment_instances_license_id',
        'deployment_instances',
        type_='foreignkey'
    )

    # Drop index
    op.drop_index('ix_deployment_instances_license_id', table_name='deployment_instances')

    # Drop columns
    op.drop_column('deployment_instances', 'activation_id')
    op.drop_column('deployment_instances', 'license_id')
