"""6-digit email codes for sign-up and password reset."""

import hashlib
import hmac
import secrets
from datetime import UTC, datetime, timedelta
from typing import Literal

from sqlalchemy import delete, select
from sqlalchemy.orm import Session

from app.config import settings
from app.models import VerificationCode
from app.services.email import send_code

Purpose = Literal["signup", "reset"]

MAX_ATTEMPTS = 5
RESEND_AFTER = timedelta(seconds=60)


class CodeError(Exception):
    """`code` is sent to the app: too_soon, invalid_code, code_expired, too_many_attempts."""

    def __init__(self, code: str):
        super().__init__(code)
        self.code = code


def _hash(code: str) -> str:
    return hmac.new(settings.secret_key.encode(), code.encode(), hashlib.sha256).hexdigest()


def _aware(moment: datetime) -> datetime:
    # SQLite returns naive datetimes; we always store UTC
    return moment if moment.tzinfo else moment.replace(tzinfo=UTC)


def issue_code(db: Session, email: str, purpose: Purpose) -> str:
    """Create a new code (replacing the old one), email it and return it."""
    now = datetime.now(UTC)
    previous = db.scalar(
        select(VerificationCode).where(VerificationCode.email == email, VerificationCode.purpose == purpose)
    )
    if previous and now - _aware(previous.created_at) < RESEND_AFTER:
        raise CodeError("too_soon")

    db.execute(delete(VerificationCode).where(VerificationCode.email == email, VerificationCode.purpose == purpose))
    code = f"{secrets.randbelow(10**6):06d}"
    db.add(
        VerificationCode(
            email=email,
            purpose=purpose,
            code_hash=_hash(code),
            expires_at=now + timedelta(minutes=settings.verification_code_ttl_minutes),
            created_at=now,
        )
    )
    db.commit()
    send_code(email, code, purpose)
    return code


def check_code(db: Session, email: str, purpose: Purpose, code: str) -> None:
    """Raises CodeError if the code is wrong; deletes it when it is right."""
    record = db.scalar(
        select(VerificationCode).where(VerificationCode.email == email, VerificationCode.purpose == purpose)
    )
    if record is None:
        raise CodeError("invalid_code")
    if _aware(record.expires_at) < datetime.now(UTC):
        raise CodeError("code_expired")
    if record.attempts >= MAX_ATTEMPTS:
        raise CodeError("too_many_attempts")
    if not hmac.compare_digest(record.code_hash, _hash(code)):
        record.attempts += 1
        db.commit()
        raise CodeError("invalid_code")
    db.delete(record)
    db.commit()
