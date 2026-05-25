from app.models.user import User


def update_user_settings(user: User, updates: dict):
    for field, value in updates.items():
        setattr(user, field, value)

    return user
