from pydantic import BaseModel


class SettingsUpdate(BaseModel):
    display_name: str
    show_notifications: bool