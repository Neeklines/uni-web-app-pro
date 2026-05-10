from datetime import datetime, timedelta
from fastapi import HTTPException
from sqlalchemy.orm import Session

from app.models.login_attempt import LoginAttempt

MAX_FAILED_ATTEMPTS = 5
BLOCK_TIME_MINUTES = 10
RECORD_TTL_HOURS = 24


def cleanup_expired_login_attempts(db: Session):
    db.query(LoginAttempt).filter(LoginAttempt.expires_at < datetime.utcnow()).delete()
    db.commit()


def ensure_login_not_blocked(db: Session, email: str, ip: str | None):
    attempt = (
        db.query(LoginAttempt)
        .filter(LoginAttempt.email == email, LoginAttempt.ip_address == ip)
        .first()
    )

    if not attempt:
        return

    if attempt.blocked_until and attempt.blocked_until > datetime.utcnow():
        raise HTTPException(
            status_code=429, detail="Too many failed login attempts. Try again later."
        )


def register_failed_login(db: Session, email: str, ip: str | None):
    now = datetime.utcnow()

    attempt = (
        db.query(LoginAttempt)
        .filter(LoginAttempt.email == email, LoginAttempt.ip_address == ip)
        .first()
    )

    if attempt:
        attempt.failure_count += 1
        attempt.last_failed_at = now

        if attempt.failure_count >= MAX_FAILED_ATTEMPTS:
            attempt.blocked_until = now + timedelta(minutes=BLOCK_TIME_MINUTES)

        attempt.expires_at = now + timedelta(hours=RECORD_TTL_HOURS)

    else:
        attempt = LoginAttempt(
            email=email,
            ip_address=ip,
            failure_count=1,
            first_failed_at=now,
            last_failed_at=now,
            blocked_until=None,
            expires_at=now + timedelta(hours=RECORD_TTL_HOURS),
        )
        db.add(attempt)

    db.commit()


def clear_login_attempts(db: Session, email: str, ip: str | None):
    db.query(LoginAttempt).filter(
        LoginAttempt.email == email, LoginAttempt.ip_address == ip
    ).delete()
    db.commit()
