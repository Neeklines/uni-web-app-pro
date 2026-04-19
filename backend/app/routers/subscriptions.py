from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session

from app.database import get_db
from app.schemas.subscription import SubscriptionCreate, SubscriptionOut, SubscriptionUpdate
from app.services.subscription_service import (
    create_subscription,
    get_user_subscriptions,
    update_subscription,
    cancel_subscription,
    delete_one_inactive,  
    delete_all_inactive,
    reactivate_subscription,
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

@router.patch("/{subscription_id}", response_model=SubscriptionOut)
def update_sub(
    subscription_id: int,
    data: SubscriptionUpdate,
    db: Session = Depends(get_db),
    current_user=Depends(get_current_user),
):
    sub = update_subscription(db, subscription_id, current_user.id, data)
    if not sub:
        raise HTTPException(status_code=404, detail="Subscription not found")
    return sub


@router.patch("/{subscription_id}/cancel", response_model=SubscriptionOut)
def cancel_sub(
    subscription_id: int,
    db: Session = Depends(get_db),
    current_user=Depends(get_current_user),
):
    sub = cancel_subscription(db, subscription_id, current_user.id)
    if not sub:
        raise HTTPException(status_code=404, detail="Subscription not found")
    return sub

@router.patch("/{subscription_id}/reactivate", response_model=SubscriptionOut)
def reactivate_sub(
    subscription_id: int,
    db: Session = Depends(get_db),
    current_user=Depends(get_current_user),
):
    sub = reactivate_subscription(db, subscription_id, current_user.id)
    if not sub:
        raise HTTPException(status_code=404, detail="Subscription not found")
    return sub

@router.delete("/inactive/all", status_code=200)
def delete_all_inactive_subs(
    db: Session = Depends(get_db),
    current_user=Depends(get_current_user),
):
    delete_all_inactive(db, current_user.id)
    return {"deleted": "all inactive"}

@router.delete("/{subscription_id}", status_code=200)
def delete_one_sub(
    subscription_id: int,
    db: Session = Depends(get_db),
    current_user=Depends(get_current_user),
):
    result = delete_one_inactive(db, subscription_id, current_user.id)
    if not result:
        raise HTTPException(status_code=404, detail="Inactive subscription not found")
    return {"deleted": 1}


