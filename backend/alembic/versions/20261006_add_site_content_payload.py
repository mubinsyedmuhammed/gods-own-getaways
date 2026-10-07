"""Add the complete site content payload

Revision ID: 20261006_content_payload
Revises: 20261006_initial
Create Date: 2026-10-06 00:00:00.000000
"""

from alembic import op
import sqlalchemy as sa


revision = "20261006_content_payload"
down_revision = "20261006_initial"
branch_labels = None
depends_on = None


def upgrade() -> None:
    op.add_column("site_content", sa.Column("content", sa.JSON(), nullable=True))


def downgrade() -> None:
    op.drop_column("site_content", "content")