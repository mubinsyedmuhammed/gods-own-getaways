"""Initial site content table

Revision ID: 20261006_initial
Revises: 
Create Date: 2026-10-06 00:00:00.000000
"""

from alembic import op
import sqlalchemy as sa

# revision identifiers, used by Alembic.
revision = "20261006_initial"
down_revision = None
branch_labels = None
depends_on = None


def upgrade() -> None:
    op.create_table(
        "site_content",
        sa.Column("id", sa.Integer(), nullable=False),
        sa.Column("name", sa.String(length=200), nullable=False),
        sa.Column("tagline", sa.String(length=255), nullable=False),
        sa.Column("hero_title", sa.String(length=255), nullable=False),
        sa.Column("hero_subtitle", sa.Text(), nullable=False),
        sa.Column("primary_cta", sa.String(length=120), nullable=False),
        sa.Column("secondary_cta", sa.String(length=120), nullable=False),
        sa.Column("is_published", sa.Boolean(), nullable=True),
        sa.PrimaryKeyConstraint("id"),
    )
    op.create_index(op.f("ix_site_content_id"), "site_content", ["id"], unique=False)


def downgrade() -> None:
    op.drop_index(op.f("ix_site_content_id"), table_name="site_content")
    op.drop_table("site_content")
