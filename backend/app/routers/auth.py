from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from app.database import get_db

from app.schemas.user import UserCreate, UserLogin
from app.services.auth_service import create_user, authenticate_user
from app.core.security import create_access_token
from app.dependencies.auth import get_current_user
from app.models.user import User

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
def login(user: UserLogin, db: Session = Depends(get_db)):
    db_user = authenticate_user(db, user.email, user.password)

    if not db_user:
        raise HTTPException(status_code=401, detail="Invalid credentials")

    token = create_access_token({"user_id": db_user.id})

    return {"access_token": token, "token_type": "bearer"}
