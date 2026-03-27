from pydantic import BaseModel
from datetime import date


class SubscriptionCreate(BaseModel):
    name: str
    price: float
    billing_cycle: str
    next_payment_date: date
    category: str | None = None


class SubscriptionOut(BaseModel):
    id: int
    name: str
    price: float
    billing_cycle: str
    next_payment_date: date
    category: str

    class Config:
        from_attributes = True
