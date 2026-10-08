from sqlalchemy import Boolean, Column, DateTime, ForeignKey, Integer, String, Text, UniqueConstraint, func
from sqlalchemy.sql.sqltypes import JSON

from app.core.database import Base


class TravelPackage(Base):
    __tablename__ = "travel_packages"
    __table_args__ = (UniqueConstraint("slug", name="uq_travel_packages_slug"),)

    id = Column(Integer, primary_key=True)
    destination_id = Column(Integer, ForeignKey("destinations.id", ondelete="SET NULL"), nullable=True, index=True)
    title = Column(String(200), nullable=False)
    slug = Column(String(200), nullable=False)
    short_description = Column(Text, nullable=False, default="")
    description = Column(Text, nullable=False, default="")
    duration = Column(String(120), nullable=False, default="")
    summary = Column(Text, nullable=False, default="")
    price = Column(String(120), nullable=False, default="")
    currency = Column(String(3), nullable=False, default="")
    cover_image = Column(Text, nullable=False, default="")
    image_alt = Column(Text, nullable=False, default="")
    gallery_images = Column(JSON, nullable=False, default=list)
    itinerary = Column(JSON, nullable=False, default=list)
    included_items = Column(JSON, nullable=False, default=list)
    excluded_items = Column(JSON, nullable=False, default=list)
    highlights = Column(JSON, nullable=False, default=list)
    featured = Column(Boolean, nullable=False, default=False)
    active = Column(Boolean, nullable=False, default=True, index=True)
    sort_order = Column(Integer, nullable=False, default=0)
    created_at = Column(DateTime(timezone=True), nullable=False, server_default=func.now())
    updated_at = Column(DateTime(timezone=True), nullable=False, server_default=func.now(), onupdate=func.now())
