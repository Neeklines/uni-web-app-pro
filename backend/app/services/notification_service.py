from datetime import date, timedelta
from sqlalchemy.orm import Session
from app.models.subscription import Subscription
from app.models.user import User
from collections import defaultdict
from app.services.email_service import send_email


def get_due_subscriptions_for_today(db: Session):
    tomorrow = date.today() + timedelta(days=1)

    return (
        db.query(Subscription).filter(Subscription.next_payment_date == tomorrow).all()
    )


def group_by_user(subscriptions):
    grouped = defaultdict(list)

    for sub in subscriptions:
        grouped[sub.user_id].append(sub)

    return grouped


def build_email_content(subscriptions):
    lines = [
        "Przypomnienie o nadchodzącej płatności:\n",
        "Jutro zostanie pobrana opłata za:\n",
    ]

    for sub in subscriptions:
        lines.append(f"- {sub.name}: {sub.price} PLN")

    lines.append("\nUpewnij się, że masz wystarczające środki.")

    return "\n".join(lines)


def send_daily_subscription_notifications(db: Session):
    subs = get_due_subscriptions_for_today(db)

    if not subs:
        print("Brak subskrypcji na dziś")
        return

    grouped = group_by_user(subs)

    for user_id, user_subs in grouped.items():
        user = db.query(User).filter(User.id == user_id).first()

        if not user:
            continue

        content = build_email_content(user_subs)

        send_email(
            to_email=user.email,
            subject="Dzisiejsze płatności subskrypcji",
            body=content,
        )
