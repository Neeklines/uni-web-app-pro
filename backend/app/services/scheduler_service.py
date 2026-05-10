from apscheduler.schedulers.background import BackgroundScheduler
from app.database import SessionLocal
from app.services.notification_service import send_daily_subscription_notifications

scheduler = BackgroundScheduler(timezone="Europe/Warsaw")


def scheduled_daily_notifications():
    db = SessionLocal()
    try:
        send_daily_subscription_notifications(db)
    finally:
        db.close()


def start_scheduler():
    if not scheduler.running:
        scheduler.add_job(
            scheduled_daily_notifications,
            trigger="cron",
            hour=17,
            minute=55,
            id="daily_subscription_notifications",
            replace_existing=True,
        )
        scheduler.start()
        print("Scheduler started")


def stop_scheduler():
    if scheduler.running:
        scheduler.shutdown()
        print("Scheduler stopped")
