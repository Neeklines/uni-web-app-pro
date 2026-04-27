import httpx
from fastapi import HTTPException
from app.config import TURNSTILE_SECRET_KEY

TURNSTILE_VERIFY_URL = "https://challenges.cloudflare.com/turnstile/v0/siteverify"


async def verify_captcha(token: str, remote_ip: str | None = None) -> None:
    if not token:
        raise HTTPException(status_code=400, detail="CAPTCHA token is required")

    if not TURNSTILE_SECRET_KEY:
        raise HTTPException(status_code=500, detail="CAPTCHA is not configured")

    async with httpx.AsyncClient(timeout=10.0) as client:
        response = await client.post(
            TURNSTILE_VERIFY_URL,
            data={
                "secret": TURNSTILE_SECRET_KEY,
                "response": token,
                "remoteip": remote_ip,
            },
        )

    data = response.json()

    if not data.get("success"):
        raise HTTPException(status_code=400, detail="CAPTCHA verification failed")
