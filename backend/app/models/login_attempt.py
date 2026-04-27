from sqlalchemy import Column, Integer, String, DateTime
from app.database import Base


class LoginAttempt(Base):
    __tablename__ = "login_attempts"

    id = Column(Integer, primary_key=True, index=True)
    email = Column(String, nullable=True, index=True)
    ip_address = Column(String, nullable=True, index=True)
    failure_count = Column(Integer, nullable=False, default=0)
    first_failed_at = Column(DateTime, nullable=False)
    last_failed_at = Column(DateTime, nullable=False)
    blocked_until = Column(DateTime, nullable=True)
    expires_at = Column(DateTime, nullable=False, index=True)
