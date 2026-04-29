from pydantic import BaseModel, EmailStr


class UserCreate(BaseModel):
    email: EmailStr
    password: str
    captcha_token: str


class UserLogin(BaseModel):
    email: EmailStr
    password: str
    captcha_token: str
