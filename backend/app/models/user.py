from sqlalchemy import Column, Integer, String, Boolean
from sqlalchemy.orm import relationship

from app.database import Base


class User(Base):
    __tablename__ = "users"

    id = Column(Integer, primary_key=True)

    email = Column(String, unique=True, index=True, nullable=False)
    password = Column(String, nullable=False)

    # profile
    display_name = Column(String, nullable=False, default="")

    # preferences
    theme = Column(String, nullable=False, default="dark")
    currency = Column(String, nullable=False, default="PLN")
    date_format = Column(String, nullable=False, default="dd.MM.yyyy")

    # notifications
    in_app_notifications = Column(Boolean, nullable=False, default=True)
    email_notifications = Column(Boolean, nullable=False, default=True)

    subscriptions = relationship(
        "Subscription",
        back_populates="user",
    )

    password_reset_tokens = relationship(
        "PasswordResetToken",
        back_populates="user",
        cascade="all, delete-orphan",
    )
