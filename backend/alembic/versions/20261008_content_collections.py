"""Add normalized content collections.

Revision ID: 20261008_content_collections
Revises: 20261006_content_payload
Create Date: 2026-10-08 00:00:00.000000
"""

from alembic import op
import sqlalchemy as sa


revision = "20261008_content_collections"
down_revision = "20261006_content_payload"
branch_labels = None
depends_on = None


def upgrade() -> None:
    timestamp = sa.text("CURRENT_TIMESTAMP")
    op.create_table(
        "destinations",
        sa.Column("id", sa.Integer(), nullable=False),
        sa.Column("name", sa.String(length=200), nullable=False),
        sa.Column("slug", sa.String(length=200), nullable=False),
        sa.Column("short_description", sa.Text(), nullable=False),
        sa.Column("description", sa.Text(), nullable=False),
        sa.Column("region", sa.String(length=160), nullable=False),
        sa.Column("tag", sa.String(length=160), nullable=False),
        sa.Column("price", sa.String(length=120), nullable=False),
        sa.Column("cover_image", sa.Text(), nullable=False),
        sa.Column("image_alt", sa.Text(), nullable=False),
        sa.Column("highlights", sa.JSON(), nullable=False),
        sa.Column("featured", sa.Boolean(), server_default=sa.false(), nullable=False),
        sa.Column("active", sa.Boolean(), server_default=sa.true(), nullable=False),
        sa.Column("sort_order", sa.Integer(), server_default="0", nullable=False),
        sa.Column("created_at", sa.DateTime(timezone=True), server_default=timestamp, nullable=False),
        sa.Column("updated_at", sa.DateTime(timezone=True), server_default=timestamp, nullable=False),
        sa.PrimaryKeyConstraint("id"),
        sa.UniqueConstraint("slug", name="uq_destinations_slug"),
    )
    op.create_index("ix_destinations_active", "destinations", ["active"])

    op.create_table(
        "travel_packages",
        sa.Column("id", sa.Integer(), nullable=False),
        sa.Column("destination_id", sa.Integer(), nullable=True),
        sa.Column("title", sa.String(length=200), nullable=False),
        sa.Column("slug", sa.String(length=200), nullable=False),
        sa.Column("short_description", sa.Text(), nullable=False),
        sa.Column("description", sa.Text(), nullable=False),
        sa.Column("duration", sa.String(length=120), nullable=False),
        sa.Column("summary", sa.Text(), nullable=False),
        sa.Column("price", sa.String(length=120), nullable=False),
        sa.Column("currency", sa.String(length=3), nullable=False),
        sa.Column("cover_image", sa.Text(), nullable=False),
        sa.Column("image_alt", sa.Text(), nullable=False),
        sa.Column("gallery_images", sa.JSON(), nullable=False),
        sa.Column("itinerary", sa.JSON(), nullable=False),
        sa.Column("included_items", sa.JSON(), nullable=False),
        sa.Column("excluded_items", sa.JSON(), nullable=False),
        sa.Column("highlights", sa.JSON(), nullable=False),
        sa.Column("featured", sa.Boolean(), server_default=sa.false(), nullable=False),
        sa.Column("active", sa.Boolean(), server_default=sa.true(), nullable=False),
        sa.Column("sort_order", sa.Integer(), server_default="0", nullable=False),
        sa.Column("created_at", sa.DateTime(timezone=True), server_default=timestamp, nullable=False),
        sa.Column("updated_at", sa.DateTime(timezone=True), server_default=timestamp, nullable=False),
        sa.ForeignKeyConstraint(["destination_id"], ["destinations.id"], ondelete="SET NULL"),
        sa.PrimaryKeyConstraint("id"),
        sa.UniqueConstraint("slug", name="uq_travel_packages_slug"),
    )
    op.create_index("ix_travel_packages_destination_id", "travel_packages", ["destination_id"])
    op.create_index("ix_travel_packages_active", "travel_packages", ["active"])

    op.create_table(
        "services",
        sa.Column("id", sa.Integer(), nullable=False),
        sa.Column("title", sa.String(length=200), nullable=False),
        sa.Column("slug", sa.String(length=200), nullable=False),
        sa.Column("short_description", sa.Text(), nullable=False),
        sa.Column("description", sa.Text(), nullable=False),
        sa.Column("icon", sa.String(length=255), nullable=False),
        sa.Column("image", sa.Text(), nullable=False),
        sa.Column("featured", sa.Boolean(), server_default=sa.false(), nullable=False),
        sa.Column("active", sa.Boolean(), server_default=sa.true(), nullable=False),
        sa.Column("sort_order", sa.Integer(), server_default="0", nullable=False),
        sa.Column("created_at", sa.DateTime(timezone=True), server_default=timestamp, nullable=False),
        sa.Column("updated_at", sa.DateTime(timezone=True), server_default=timestamp, nullable=False),
        sa.PrimaryKeyConstraint("id"),
        sa.UniqueConstraint("slug", name="uq_services_slug"),
    )
    op.create_index("ix_services_active", "services", ["active"])

    op.create_table(
        "gallery_images",
        sa.Column("id", sa.Integer(), nullable=False),
        sa.Column("image_url", sa.Text(), nullable=False),
        sa.Column("title", sa.String(length=200), nullable=False),
        sa.Column("alt_text", sa.Text(), nullable=False),
        sa.Column("caption", sa.Text(), nullable=False),
        sa.Column("category", sa.String(length=160), nullable=False),
        sa.Column("sort_order", sa.Integer(), server_default="0", nullable=False),
        sa.Column("active", sa.Boolean(), server_default=sa.true(), nullable=False),
        sa.Column("created_at", sa.DateTime(timezone=True), server_default=timestamp, nullable=False),
        sa.Column("updated_at", sa.DateTime(timezone=True), server_default=timestamp, nullable=False),
        sa.PrimaryKeyConstraint("id"),
    )
    op.create_index("ix_gallery_images_active", "gallery_images", ["active"])

    op.create_table(
        "testimonials",
        sa.Column("id", sa.Integer(), nullable=False),
        sa.Column("customer_name", sa.String(length=200), nullable=False),
        sa.Column("customer_location", sa.String(length=200), nullable=False),
        sa.Column("content", sa.Text(), nullable=False),
        sa.Column("rating", sa.Integer(), nullable=False),
        sa.Column("image", sa.Text(), nullable=False),
        sa.Column("trip", sa.String(length=200), nullable=False),
        sa.Column("featured", sa.Boolean(), server_default=sa.false(), nullable=False),
        sa.Column("active", sa.Boolean(), server_default=sa.true(), nullable=False),
        sa.Column("sort_order", sa.Integer(), server_default="0", nullable=False),
        sa.Column("created_at", sa.DateTime(timezone=True), server_default=timestamp, nullable=False),
        sa.Column("updated_at", sa.DateTime(timezone=True), server_default=timestamp, nullable=False),
        sa.PrimaryKeyConstraint("id"),
        sa.CheckConstraint("rating >= 1 AND rating <= 5", name="ck_testimonials_rating"),
    )
    op.create_index("ix_testimonials_active", "testimonials", ["active"])


def downgrade() -> None:
    op.drop_index("ix_testimonials_active", table_name="testimonials")
    op.drop_table("testimonials")
    op.drop_index("ix_gallery_images_active", table_name="gallery_images")
    op.drop_table("gallery_images")
    op.drop_index("ix_services_active", table_name="services")
    op.drop_table("services")
    op.drop_index("ix_travel_packages_active", table_name="travel_packages")
    op.drop_index("ix_travel_packages_destination_id", table_name="travel_packages")
    op.drop_table("travel_packages")
    op.drop_index("ix_destinations_active", table_name="destinations")
    op.drop_table("destinations")
