from sqlalchemy import Column, Integer, String, Float, Date, ForeignKey
from sqlalchemy.orm import relationship

from app.database import Base


class Subscription(Base):
    __tablename__ = "subscriptions"

    id = Column(Integer, primary_key=True, index=True)

    name = Column(String, nullable=False)
    price = Column(Float, nullable=False)
    billing_cycle = Column(String, nullable=False)  # "monthly" or "yearly"
    next_payment_date = Column(Date, nullable=False)
    category = Column(String, nullable=True)

    user_id = Column(Integer, ForeignKey("users.id"), nullable=False)

    user = relationship("User", back_populates="subscriptions")
