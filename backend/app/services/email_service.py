import smtplib
from email.message import EmailMessage

from app.config import SMTP_HOST, SMTP_PORT, SMTP_USER, SMTP_PASSWORD, SMTP_FROM, FRONTEND_URL


async def send_password_reset_email(to_email: str, token: str):
    reset_link = f"{FRONTEND_URL}/reset-password?token={token}"

    subject = "SmartSub - Password reset"
    body = f"""Hello,

We received a request to reset your SmartSub account password.

Click the link below to set a new password:
{reset_link}

This link will expire in 30 minutes.

If you did not request this, you can ignore this email.

Best regards,
SmartSub Team
"""

    msg = EmailMessage()
    msg["Subject"] = subject
    msg["From"] = SMTP_FROM
    msg["To"] = to_email
    msg.set_content(body)

    with smtplib.SMTP(SMTP_HOST, SMTP_PORT) as server:
        server.starttls()
        server.login(SMTP_USER, SMTP_PASSWORD)
        server.send_message(msg)