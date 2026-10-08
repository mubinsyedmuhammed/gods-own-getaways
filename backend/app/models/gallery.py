from sqlalchemy import Boolean, Column, DateTime, Integer, String, Text, func

from app.core.database import Base


class GalleryImage(Base):
    __tablename__ = "gallery_images"

    id = Column(Integer, primary_key=True)
    image_url = Column(Text, nullable=False)
    title = Column(String(200), nullable=False, default="")
    alt_text = Column(Text, nullable=False, default="")
    caption = Column(Text, nullable=False, default="")
    category = Column(String(160), nullable=False, default="")
    sort_order = Column(Integer, nullable=False, default=0)
    active = Column(Boolean, nullable=False, default=True, index=True)
    created_at = Column(DateTime(timezone=True), nullable=False, server_default=func.now())
    updated_at = Column(DateTime(timezone=True), nullable=False, server_default=func.now(), onupdate=func.now())
