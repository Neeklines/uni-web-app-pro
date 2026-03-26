from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session

from app.database import get_db
from app.schemas.subscription import SubscriptionCreate, SubscriptionOut
from app.services.subscription_service import (
    create_subscription,
    get_user_subscriptions,
)
from app.dependencies.auth import get_current_user

router = APIRouter(prefix="/subscriptions", tags=["subscriptions"])


@router.post("", response_model=SubscriptionOut)
def create_sub(
    data: SubscriptionCreate,
    db: Session = Depends(get_db),
    current_user=Depends(get_current_user),
):
    return create_subscription(db, current_user.id, data)


@router.get("", response_model=list[SubscriptionOut])
def get_subs(
    db: Session = Depends(get_db),
    current_user=Depends(get_current_user),
):
    return get_user_subscriptions(db, current_user.id)
