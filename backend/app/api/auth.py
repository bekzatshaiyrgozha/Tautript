"""Sign-up (email code in 3 steps), login and password reset.

Error `detail` values are short codes that the app translates.
"""

from datetime import date
from typing import Annotated, Literal

from fastapi import APIRouter, HTTPException, status
from pydantic import AfterValidator, BaseModel, ConfigDict, EmailStr, Field, StringConstraints
from sqlalchemy import select
from sqlalchemy.exc import IntegrityError

from app.api.deps import CurrentUser, DbSession
from app.config import settings
from app.models import User
from app.services.security import (
    DUMMY_PASSWORD_HASH,
    create_access_token,
    create_signup_token,
    decode_signup_token,
    hash_password,
    verify_password,
)
from app.services.verification import CodeError, check_code, issue_code

router = APIRouter(prefix="/auth", tags=["auth"])

Name = Annotated[str, StringConstraints(strip_whitespace=True, min_length=1, max_length=50)]
# @nickname: 3–30 letters, digits, "_" or "."; stored lowercase
Tag = Annotated[str, StringConstraints(strip_whitespace=True, pattern=r"^[A-Za-z0-9_.]{3,30}$"), AfterValidator(str.lower)]
Code = Annotated[str, StringConstraints(pattern=r"^\d{6}$")]
Password = Annotated[str, Field(min_length=8, max_length=128)]
Preference = Literal["peaks", "lakes", "waterfalls", "camping", "climbing", "easy_walks", "winter", "glaciers"]


# ---------- schemas ----------


class UserOut(BaseModel):
    model_config = ConfigDict(from_attributes=True)

    id: int
    name: str
    email: str
    tag: str
    birthday: date | None
    gender: Literal["male", "female"] | None
    preferences: list[str]


class AuthResponse(BaseModel):
    access_token: str
    token_type: Literal["bearer"] = "bearer"
    user: UserOut


class CodeSent(BaseModel):
    email: str
    expires_in_minutes: int
    dev_code: str | None = Field(None, description="Only when the server has no SMTP (development)")


class SignupStart(BaseModel):
    email: EmailStr
    tag: Tag


class SignupVerify(BaseModel):
    email: EmailStr
    code: Code


class SignupToken(BaseModel):
    signup_token: str


class RegisterRequest(BaseModel):
    signup_token: str
    tag: Tag
    password: Password
    name: Name
    birthday: date | None = None
    gender: Literal["male", "female"] | None = None
    preferences: list[Preference] = Field(default_factory=list, max_length=8)


class LoginRequest(BaseModel):
    email: EmailStr
    password: str = Field(min_length=1, max_length=128)


class ForgotRequest(BaseModel):
    email: EmailStr


class ResetRequest(BaseModel):
    email: EmailStr
    code: Code
    new_password: Password


# ---------- helpers ----------


def _auth_response(user: User) -> AuthResponse:
    return AuthResponse(access_token=create_access_token(user.id), user=UserOut.model_validate(user))


def _code_sent(email: str, code: str | None) -> CodeSent:
    return CodeSent(
        email=email,
        expires_in_minutes=settings.verification_code_ttl_minutes,
        dev_code=code if settings.email_dev_mode else None,
    )


def _ensure_free(db: DbSession, email: str, tag: str) -> None:
    if db.scalar(select(User.id).where(User.email == email)) is not None:
        raise HTTPException(status.HTTP_409_CONFLICT, detail="email_taken")
    if db.scalar(select(User.id).where(User.tag == tag)) is not None:
        raise HTTPException(status.HTTP_409_CONFLICT, detail="tag_taken")


def _code_error(error: CodeError) -> HTTPException:
    code_status = status.HTTP_429_TOO_MANY_REQUESTS if error.code == "too_soon" else status.HTTP_400_BAD_REQUEST
    return HTTPException(code_status, detail=error.code)


# ---------- sign-up: step 1 → 2 → 3 ----------


@router.post("/signup/start", response_model=CodeSent, summary="Step 1: check email/tag, send a 6-digit code")
def signup_start(body: SignupStart, db: DbSession) -> CodeSent:
    email = body.email.lower()
    _ensure_free(db, email, body.tag)
    try:
        code = issue_code(db, email, "signup")
    except CodeError as error:
        raise _code_error(error) from None
    return _code_sent(email, code)


@router.post("/signup/verify", response_model=SignupToken, summary="Step 2: check the code")
def signup_verify(body: SignupVerify, db: DbSession) -> SignupToken:
    email = body.email.lower()
    try:
        check_code(db, email, "signup", body.code)
    except CodeError as error:
        raise _code_error(error) from None
    return SignupToken(signup_token=create_signup_token(email))


@router.post(
    "/register",
    status_code=status.HTTP_201_CREATED,
    response_model=AuthResponse,
    summary="Step 3: profile details, creates the account",
)
def register(body: RegisterRequest, db: DbSession) -> AuthResponse:
    email = decode_signup_token(body.signup_token)
    if email is None:
        raise HTTPException(status.HTTP_400_BAD_REQUEST, detail="invalid_signup_token")
    _ensure_free(db, email, body.tag)

    user = User(
        email=email,
        tag=body.tag,
        name=body.name,
        password_hash=hash_password(body.password),
        birthday=body.birthday,
        gender=body.gender,
        preferences=list(dict.fromkeys(body.preferences)),
    )
    db.add(user)
    try:
        db.commit()
    except IntegrityError:  # same email/tag registered at the same moment
        db.rollback()
        raise HTTPException(status.HTTP_409_CONFLICT, detail="email_taken") from None
    return _auth_response(user)


# ---------- login ----------


@router.post("/login", response_model=AuthResponse, responses={401: {"description": "`invalid_credentials`"}})
def login(body: LoginRequest, db: DbSession) -> AuthResponse:
    user = db.scalar(select(User).where(User.email == body.email.lower()))
    password_ok = verify_password(body.password, user.password_hash if user else DUMMY_PASSWORD_HASH)
    if user is None or not password_ok:
        raise HTTPException(status.HTTP_401_UNAUTHORIZED, detail="invalid_credentials")
    return _auth_response(user)


@router.get("/me", response_model=UserOut, responses={401: {"description": "`not_authenticated`"}})
def me(user: CurrentUser) -> User:
    return user


# ---------- forgot password ----------


@router.post("/password/forgot", response_model=CodeSent, summary="Send a reset code (if the email is registered)")
def password_forgot(body: ForgotRequest, db: DbSession) -> CodeSent:
    email = body.email.lower()
    code = None
    # Same answer whether or not the email exists, so it can't be used to find accounts
    if db.scalar(select(User.id).where(User.email == email)) is not None:
        try:
            code = issue_code(db, email, "reset")
        except CodeError as error:
            raise _code_error(error) from None
    return _code_sent(email, code)


@router.post("/password/reset", response_model=AuthResponse, summary="Set a new password with the code, logs in")
def password_reset(body: ResetRequest, db: DbSession) -> AuthResponse:
    email = body.email.lower()
    try:
        check_code(db, email, "reset", body.code)
    except CodeError as error:
        raise _code_error(error) from None
    user = db.scalar(select(User).where(User.email == email))
    if user is None:
        raise HTTPException(status.HTTP_400_BAD_REQUEST, detail="invalid_code")
    user.password_hash = hash_password(body.new_password)
    db.commit()
    return _auth_response(user)
