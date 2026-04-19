import smtplib
from email.message import EmailMessage

from app.config import (
    SMTP_HOST,
    SMTP_PORT,
    SMTP_USER,
    SMTP_PASSWORD,
    SMTP_FROM,
    FRONTEND_URL,
)


async def send_password_reset_email(to_email: str, token: str):
    reset_link = f"{FRONTEND_URL}/reset-password?token={token}"

    subject = "SmartSub – Resetowanie hasła"
    body = f"""Witaj!

Otrzymaliśmy prośbę o zresetowanie hasła do Twojego konta w serwisie SmartSub.

Kliknij w poniższy link, aby ustawić nowe hasło:
{reset_link}

Link wygaśnie za 30 minut.

Jeśli to nie Ty wysłałeś prośbę o zmianę hasła, po prostu zignoruj tę wiadomość.
Twoje hasło pozostanie bez zmian.

Pozdrawiamy,
Zespół SmartSub
"""

    msg = EmailMessage()
    msg["Subject"] = subject
    msg["From"] = SMTP_FROM
    msg["To"] = to_email
    msg.set_content(body)

    with smtplib.SMTP_SSL(SMTP_HOST, SMTP_PORT, timeout=20) as server:
        server.login(SMTP_USER, SMTP_PASSWORD)
        server.send_message(msg)

    print("MAIL SENT")
