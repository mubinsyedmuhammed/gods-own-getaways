from sqlalchemy import Boolean, Column, DateTime, Integer, String, Text, UniqueConstraint, func
from sqlalchemy.sql.sqltypes import JSON

from app.core.database import Base


class Destination(Base):
    __tablename__ = "destinations"
    __table_args__ = (UniqueConstraint("slug", name="uq_destinations_slug"),)

    id = Column(Integer, primary_key=True)
    name = Column(String(200), nullable=False)
    slug = Column(String(200), nullable=False)
    short_description = Column(Text, nullable=False, default="")
    description = Column(Text, nullable=False, default="")
    region = Column(String(160), nullable=False, default="")
    tag = Column(String(160), nullable=False, default="")
    price = Column(String(120), nullable=False, default="")
    cover_image = Column(Text, nullable=False, default="")
    image_alt = Column(Text, nullable=False, default="")
    highlights = Column(JSON, nullable=False, default=list)
    featured = Column(Boolean, nullable=False, default=False)
    active = Column(Boolean, nullable=False, default=True, index=True)
    sort_order = Column(Integer, nullable=False, default=0)
    created_at = Column(DateTime(timezone=True), nullable=False, server_default=func.now())
    updated_at = Column(DateTime(timezone=True), nullable=False, server_default=func.now(), onupdate=func.now())
