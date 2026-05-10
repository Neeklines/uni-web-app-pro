import secrets
import hashlib
from datetime import datetime, timedelta

from app.models.password_reset_token import PasswordResetToken
from app.config import PASSWORD_RESET_TOKEN_EXPIRE_MINUTES


from sqlalchemy.orm import Session
from app.models.user import User
from passlib.context import CryptContext

pwd_context = CryptContext(schemes=["argon2"])


def hash_password(password: str):
    return pwd_context.hash(password)


def verify_password(password: str, hashed: str):
    return pwd_context.verify(password, hashed)


def create_user(db: Session, email: str, password: str):
    user = User(email=email, password=hash_password(password))

    db.add(user)
    db.commit()
    db.refresh(user)

    return user


def authenticate_user(db: Session, email: str, password: str):
    user = db.query(User).filter(User.email == email).first()

    if not user:
        return None

    if not verify_password(password, user.password):
        return None

    return user


def generate_reset_token() -> str:
    return secrets.token_urlsafe(48)


def hash_reset_token(token: str) -> str:
    return hashlib.sha256(token.encode("utf-8")).hexdigest()


def create_password_reset_token(db: Session, email: str):
    user = db.query(User).filter(User.email == email).first()
    if not user:
        return None

    # Remove all expired tokens from the entire database
    db.query(PasswordResetToken).filter(
        PasswordResetToken.expires_at < datetime.utcnow()
    ).delete()

    # Delete all previous tokens for this user
    db.query(PasswordResetToken).filter(PasswordResetToken.user_id == user.id).delete(
        synchronize_session=False
    )

    db.commit()

    raw_token = generate_reset_token()
    token_hash = hash_reset_token(raw_token)

    reset_token = PasswordResetToken(
        user_id=user.id,
        token_hash=token_hash,
        expires_at=datetime.utcnow()
        + timedelta(minutes=PASSWORD_RESET_TOKEN_EXPIRE_MINUTES),
    )

    db.add(reset_token)
    db.commit()

    return {"user": user, "raw_token": raw_token}


def reset_user_password(db: Session, token: str, new_password: str):
    token_hash = hash_reset_token(token)

    reset_record = (
        db.query(PasswordResetToken)
        .filter(PasswordResetToken.token_hash == token_hash)
        .first()
    )

    if not reset_record:
        return None, "Invalid or expired token"

    if reset_record.used_at is not None:
        return None, "Token already used"

    if reset_record.expires_at < datetime.utcnow():
        return None, "Token expired"

    user = db.query(User).filter(User.id == reset_record.user_id).first()
    if not user:
        return None, "User not found"

    user.password = hash_password(new_password)

    # removing tokens that have been used
    db.query(PasswordResetToken).filter(PasswordResetToken.user_id == user.id).delete(
        synchronize_session=False
    )

    db.commit()

    return user, None
