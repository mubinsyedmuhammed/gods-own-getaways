from sqlalchemy import Boolean, Column, DateTime, Integer, String, Text, UniqueConstraint, func

from app.core.database import Base


class Service(Base):
    __tablename__ = "services"
    __table_args__ = (UniqueConstraint("slug", name="uq_services_slug"),)

    id = Column(Integer, primary_key=True)
    title = Column(String(200), nullable=False)
    slug = Column(String(200), nullable=False)
    short_description = Column(Text, nullable=False, default="")
    description = Column(Text, nullable=False, default="")
    icon = Column(String(255), nullable=False, default="")
    image = Column(Text, nullable=False, default="")
    featured = Column(Boolean, nullable=False, default=False)
    active = Column(Boolean, nullable=False, default=True, index=True)
    sort_order = Column(Integer, nullable=False, default=0)
    created_at = Column(DateTime(timezone=True), nullable=False, server_default=func.now())
    updated_at = Column(DateTime(timezone=True), nullable=False, server_default=func.now(), onupdate=func.now())
