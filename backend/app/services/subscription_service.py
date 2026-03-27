from sqlalchemy.orm import Session
from app.models.subscription import Subscription


def create_subscription(db: Session, user_id: int, data):
    subscription = Subscription(
        name=data.name,
        price=data.price,
        billing_cycle=data.billing_cycle,
        next_payment_date=data.next_payment_date,
        category=data.category,
        user_id=user_id,
    )

    db.add(subscription)
    db.commit()
    db.refresh(subscription)

    return subscription


def get_user_subscriptions(db: Session, user_id: int):
    return db.query(Subscription).filter(Subscription.user_id == user_id).all()
