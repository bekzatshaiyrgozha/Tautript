import logging
import smtplib
from email.message import EmailMessage

from app.config import settings

logger = logging.getLogger("tautrip.email")

_SUBJECTS = {"signup": "TauTrip: тіркелу коды / код регистрации / sign-up code", "reset": "TauTrip: құпиясөзді қалпына келтіру / сброс пароля / password reset"}


def send_code(email: str, code: str, purpose: str) -> None:
    """Send a verification code. In dev mode (no SMTP) it is only logged."""
    if settings.email_dev_mode:
        logger.warning("DEV verification code for %s (%s): %s", email, purpose, code)
        return

    minutes = settings.verification_code_ttl_minutes
    message = EmailMessage()
    message["From"] = settings.smtp_from
    message["To"] = email
    message["Subject"] = _SUBJECTS[purpose]
    message.set_content(
        f"Кодыңыз: {code}  ({minutes} минут жарамды)\n"
        f"Ваш код: {code}  (действует {minutes} минут)\n"
        f"Your code: {code}  (valid for {minutes} minutes)\n"
    )
    with smtplib.SMTP(settings.smtp_host, settings.smtp_port, timeout=10) as smtp:
        smtp.starttls()
        if settings.smtp_user:
            smtp.login(settings.smtp_user, settings.smtp_password)
        smtp.send_message(message)
