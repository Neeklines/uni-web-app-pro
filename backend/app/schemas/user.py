from typing import Literal
from pydantic import BaseModel, EmailStr, ConfigDict, Field

ThemeType = Literal["dark", "light", "system"]

CurrencyType = Literal[
    "PLN",
    "USD",
    "EUR",
]

DateFormatType = Literal[
    "dd.MM.yyyy",
    "MM/dd/yyyy",
    "yyyy-MM-dd",
]


class UserCreate(BaseModel):
    email: EmailStr
    password: str


class UserLogin(BaseModel):
    email: EmailStr
    password: str


class UserOut(BaseModel):
    id: int
    email: EmailStr

    display_name: str

    theme: ThemeType
    currency: CurrencyType
    date_format: DateFormatType

    in_app_notifications: bool
    email_notifications: bool

    model_config = ConfigDict(from_attributes=True)


class UserSettingsUpdate(BaseModel):
    display_name: str | None = Field(
        default=None,
        min_length=1,
        max_length=50,
    )

    theme: ThemeType | None = None
    currency: CurrencyType | None = None
    date_format: DateFormatType | None = None

    in_app_notifications: bool | None = None
    email_notifications: bool | None = None
