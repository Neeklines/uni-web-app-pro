from fastapi import Header, HTTPException, Depends
from sqlalchemy.orm import Session
from app.models.user import User
from app.database import get_db


def get_current_user(x_user_id: int = Header(...)):
    db: Session = Depends(get_db)

    user = db.query(User).filter(User.id == x_user_id).first()
    db.close()

    if not user:
        raise HTTPException(status_code=401, detail="Invalid user")

    return user
