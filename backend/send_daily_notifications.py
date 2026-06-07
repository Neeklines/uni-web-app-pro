from app.database import SessionLocal
from app.services.notification_service import send_daily_subscription_notifications


def run():
    print("=== START DAILY NOTIFICATIONS ===")

    db = SessionLocal()
    try:
        send_daily_subscription_notifications(db)
    finally:
        db.close()

    print("=== END DAILY NOTIFICATIONS ===")


if __name__ == "__main__":
    run()
