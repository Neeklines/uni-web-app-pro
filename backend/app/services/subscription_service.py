from sqlalchemy.orm import Session
from app.models.subscription import Subscription
from datetime import date, timedelta

def create_subscription(db: Session, user_id: int, data):
    subscription = Subscription(
        name=data.name,
        price=data.price,
        billing_cycle=data.billing_cycle,
        next_payment_date=data.next_payment_date,
        category=data.category,
        user_id=user_id,
        is_pinned=data.is_pinned,
        is_favourite=data.is_favourite,
        is_active=data.is_active,
        notes=data.notes,
    )

    db.add(subscription)
    db.commit()
    db.refresh(subscription)

    return subscription


def get_user_subscriptions(db: Session, user_id: int):
    auto_clear_old_inactive(db, user_id)
    return db.query(Subscription).filter(Subscription.user_id == user_id).order_by(Subscription.is_pinned.desc(),Subscription.is_active.desc(),Subscription.next_payment_date.asc()).all()

def update_subscription(db: Session, subscription_id: int, user_id: int, data):
    sub = db.query(Subscription).filter(Subscription.id == subscription_id, Subscription.user_id == user_id).first()
    if not sub:
        return None
    
    for field, value in data.model_dump(exclude_unset=True).items(): #only updates fields that were provided
        setattr(sub, field, value)
    db.commit()
    db.refresh(sub)
    return sub

def cancel_subscription(db: Session, subscription_id: int, user_id: int):  # keep in DB, just mark inactive
    sub = db.query(Subscription).filter(Subscription.id == subscription_id, Subscription.user_id == user_id).first()
    if not sub:
        return None
    sub.is_active = False
    sub.cancelled_at = date.today()
    db.commit()
    db.refresh(sub)
    return sub

def auto_clear_old_inactive(db: Session, user_id: int):
    cutoff = date.today() - timedelta(days=30)
    old_inactive = db.query(Subscription).filter(Subscription.user_id == user_id, Subscription.is_active == False, Subscription.cancelled_at <= cutoff).all()
    for sub in old_inactive:
        db.delete(sub)
    db.commit()


def delete_one_inactive(db: Session, subscription_id: int, user_id: int):
    sub = db.query(Subscription).filter(Subscription.id == subscription_id, Subscription.user_id == user_id, Subscription.is_active == False).first()
    if not sub:
        return None
    db.delete(sub)
    db.commit()
    return True


def delete_all_inactive(db: Session, user_id: int):
    inactive = db.query(Subscription).filter(Subscription.user_id == user_id, Subscription.is_active == False).all()
    for sub in inactive:
        db.delete(sub)
    db.commit()


def reactivate_subscription(db: Session, subscription_id: int, user_id: int):
    sub = db.query(Subscription).filter(Subscription.id == subscription_id, Subscription.user_id == user_id).first()
    if not sub:
        return None
    sub.is_active = True
    sub.cancelled_at = None  # clear cancel date
    db.commit()
    db.refresh(sub)
    return sub
