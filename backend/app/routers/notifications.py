from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from app.database import get_db
from app.services.notification_service import send_daily_subscription_notifications

router = APIRouter(prefix="/notifications", tags=["notifications"])


@router.post("/test")
def test_notifications(db: Session = Depends(get_db)):
    send_daily_subscription_notifications(db)
    return {"message": "Notifications sent"}
