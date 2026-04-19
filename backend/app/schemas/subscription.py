from pydantic import BaseModel
from datetime import date


class SubscriptionCreate(BaseModel):
    name: str
    price: float
    billing_cycle: str
    next_payment_date: date
    category: str | None = None
    is_pinned: bool = False
    is_favourite: bool = False
    is_active: bool = True
    notes: str | None = None


class SubscriptionUpdate(
    BaseModel
):  # allows partial update (pin, favourite, cancel, notes)
    name: str | None = None
    price: float | None = None
    billing_cycle: str | None = None
    next_payment_date: date | None = None
    category: str | None = None
    is_pinned: bool | None = None
    is_favourite: bool | None = None
    is_active: bool | None = None
    notes: str | None = None


class SubscriptionOut(BaseModel):
    id: int
    name: str
    price: float
    billing_cycle: str
    next_payment_date: date
    category: str | None
    is_pinned: bool
    is_favourite: bool
    is_active: bool
    cancelled_at: date | None
    notes: str | None

    class Config:
        from_attributes = True
