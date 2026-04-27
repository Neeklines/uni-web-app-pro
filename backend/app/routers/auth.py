from fastapi import APIRouter, Depends, HTTPException, Request
from sqlalchemy.orm import Session
from app.database import get_db

from app.schemas.user import UserCreate, UserLogin
from app.schemas.password_reset import ForgotPasswordRequest, ResetPasswordRequest
from app.services.auth_service import (
    create_user,
    authenticate_user,
    create_password_reset_token,
    reset_user_password,
)
from app.core.security import create_access_token
from app.dependencies.auth import get_current_user
from app.models.user import User
from app.services.email_service import send_password_reset_email
from app.services.login_protection_service import (
    register_failed_login,
    clear_login_attempts,
    cleanup_expired_login_attempts,
    ensure_login_not_blocked,
)

router = APIRouter(prefix="/auth", tags=["auth"])


@router.get("/me")
def get_me(current_user: User = Depends(get_current_user)):
    return {
        "id": current_user.id,
        "email": current_user.email,
    }


@router.post("/register")
def register(user: UserCreate, db: Session = Depends(get_db)):
    return create_user(db, user.email, user.password)


@router.post("/login")
async def login(user: UserLogin, request: Request, db: Session = Depends(get_db)):
    client_ip = request.client.host if request.client else None

    cleanup_expired_login_attempts(db)
    ensure_login_not_blocked(db, user.email, client_ip)

    # await verify_captcha(user.captcha_token, client_ip)

    db_user = authenticate_user(db, user.email, user.password)

    if not db_user:
        register_failed_login(db, user.email, client_ip)
        raise HTTPException(status_code=401, detail="Invalid credentials")

    clear_login_attempts(db, user.email, client_ip)

    token = create_access_token({"user_id": db_user.id})
    return {"access_token": token, "token_type": "bearer"}


@router.post("/forgot-password")
async def forgot_password(
    payload: ForgotPasswordRequest, db: Session = Depends(get_db)
):
    result = create_password_reset_token(db, payload.email)

    if result:
        await send_password_reset_email(result["user"].email, result["raw_token"])

    return {"message": "Jeśli konto istnieje, wysłano link do zresetowania hasła."}


@router.post("/reset-password")
def reset_password(payload: ResetPasswordRequest, db: Session = Depends(get_db)):
    user, error = reset_user_password(db, payload.token, payload.new_password)

    if error:
        raise HTTPException(status_code=400, detail=error)

    return {"message": "Hasło zostało zresetowane."}
