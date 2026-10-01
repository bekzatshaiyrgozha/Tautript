"""Password hashing (scrypt, stdlib) and login tokens (JWT)."""

import hashlib
import hmac
import secrets
from datetime import UTC, datetime, timedelta

import jwt

from app.config import settings

_SCRYPT_N, _SCRYPT_R, _SCRYPT_P = 2**14, 8, 1
_JWT_ALGORITHM = "HS256"


def hash_password(password: str) -> str:
    salt = secrets.token_bytes(16)
    digest = hashlib.scrypt(password.encode(), salt=salt, n=_SCRYPT_N, r=_SCRYPT_R, p=_SCRYPT_P)
    return f"scrypt${_SCRYPT_N}${_SCRYPT_R}${_SCRYPT_P}${salt.hex()}${digest.hex()}"


def verify_password(password: str, stored_hash: str) -> bool:
    try:
        algorithm, n, r, p, salt_hex, digest_hex = stored_hash.split("$")
        if algorithm != "scrypt":
            return False
        digest = hashlib.scrypt(password.encode(), salt=bytes.fromhex(salt_hex), n=int(n), r=int(r), p=int(p))
    except ValueError:
        return False
    return hmac.compare_digest(digest.hex(), digest_hex)


# Used when the email is unknown, so a login takes the same time either way
DUMMY_PASSWORD_HASH = hash_password(secrets.token_urlsafe(16))


def create_signup_token(email: str) -> str:
    """Proves the email was verified; needed to finish registration."""
    now = datetime.now(UTC)
    payload = {"sub": email, "purpose": "signup", "iat": now, "exp": now + timedelta(minutes=30)}
    return jwt.encode(payload, settings.secret_key, algorithm=_JWT_ALGORITHM)


def decode_signup_token(token: str) -> str | None:
    """Returns the verified email, or None."""
    try:
        payload = jwt.decode(token, settings.secret_key, algorithms=[_JWT_ALGORITHM])
    except jwt.PyJWTError:
        return None
    return payload.get("sub") if payload.get("purpose") == "signup" else None


def create_access_token(user_id: int) -> str:
    now = datetime.now(UTC)
    payload = {"sub": str(user_id), "iat": now, "exp": now + timedelta(days=settings.access_token_expire_days)}
    return jwt.encode(payload, settings.secret_key, algorithm=_JWT_ALGORITHM)


def decode_access_token(token: str) -> int | None:
    """Returns the user id, or None if the token is invalid or expired."""
    try:
        payload = jwt.decode(token, settings.secret_key, algorithms=[_JWT_ALGORITHM])
        if payload.get("purpose") is not None:
            return None  # a signup token is not a login token
        return int(payload["sub"])
    except (jwt.PyJWTError, KeyError, ValueError):
        return None
