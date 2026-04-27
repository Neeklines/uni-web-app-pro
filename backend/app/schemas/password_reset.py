from pydantic import BaseModel, Field, field_validator, EmailStr
import re


class ForgotPasswordRequest(BaseModel):
    email: EmailStr


def validate_password_strength(value: str) -> str:
    if len(value) < 8:
        raise ValueError("Hasło musi mieć co najmniej 8 znaków")
    if not re.search(r"[A-Z]", value):
        raise ValueError("Hasło musi zawierać co najmniej jedną wielką literę")
    if not re.search(r"[a-z]", value):
        raise ValueError("Hasło musi zawierać co najmniej jedną małą literę")
    if not re.search(r"\d", value):
        raise ValueError("Hasło musi zawierać co najmniej jedną cyfrę")
    if not re.search(r"[^\w\s]", value):
        raise ValueError("Hasło musi zawierać co najmniej jeden znak specjalny")
    return value


class ResetPasswordRequest(BaseModel):
    token: str
    new_password: str = Field(..., min_length=8, max_length=128)

    @field_validator("new_password")
    @classmethod
    def validate_password(cls, value: str) -> str:
        return validate_password_strength(value)
