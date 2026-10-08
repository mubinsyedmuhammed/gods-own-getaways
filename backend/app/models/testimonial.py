from sqlalchemy import Boolean, CheckConstraint, Column, DateTime, Integer, String, Text, func

from app.core.database import Base


class Testimonial(Base):
    __tablename__ = "testimonials"
    __table_args__ = (CheckConstraint("rating >= 1 AND rating <= 5", name="ck_testimonials_rating"),)

    id = Column(Integer, primary_key=True)
    customer_name = Column(String(200), nullable=False, default="")
    customer_location = Column(String(200), nullable=False, default="")
    content = Column(Text, nullable=False, default="")
    rating = Column(Integer, nullable=False, default=5)
    image = Column(Text, nullable=False, default="")
    trip = Column(String(200), nullable=False, default="")
    featured = Column(Boolean, nullable=False, default=False)
    active = Column(Boolean, nullable=False, default=True, index=True)
    sort_order = Column(Integer, nullable=False, default=0)
    created_at = Column(DateTime(timezone=True), nullable=False, server_default=func.now())
    updated_at = Column(DateTime(timezone=True), nullable=False, server_default=func.now(), onupdate=func.now())
