"""Sign-up, sign-in, sign-out and the signed-in profile.

`PATCH /me/currency` stays a stub here -- it belongs to a later ticket; this
one only builds the account and session module (US-001-1).
"""

from datetime import UTC, datetime, timedelta

from fastapi import APIRouter, Depends, HTTPException, Request, Response
from sqlalchemy import func
from sqlalchemy.orm import Session

from app.database import get_db
from app.dependencies import get_current_user
from app.models import Category, User, UserSession
from app.schemas import AuthResponse, LoginRequest, MeOut, SignupRequest, StubResponse, UserOut
from app.security import generate_session_token, hash_password, verify_password

router = APIRouter(tags=["auth"])

# The account currency a brand-new account has not been asked to choose yet;
# `PATCH /me/currency` (a later ticket) is how a real sign-up changes it.
_DEFAULT_CURRENCY = "USD"

# Provisioned for every new account (US-009-1, AC-016) so they are selectable
# immediately after sign-up, before the user creates a single category of their own.
_DEFAULT_CATEGORIES = [
    "Groceries",
    "Transport",
    "Eating out",
    "Housing",
    "Utilities",
    "Entertainment",
    "Health",
    "Other",
]

# A session's absolute lifetime cap. SESSION_IDLE_MINUTES (app/dependencies.py)
# is what actually ends a session early when it sits idle.
_SESSION_ABSOLUTE_LIFETIME = timedelta(days=30)


def _create_session(db: Session, user_id: str) -> str:
    token = generate_session_token()
    now = datetime.now(UTC)
    db.add(
        UserSession(
            token=token,
            user_id=user_id,
            created_at=now,
            last_activity_at=now,
            expires_at=now + _SESSION_ABSOLUTE_LIFETIME,
        )
    )
    db.commit()
    return token


@router.post("/auth/signup", response_model=AuthResponse, status_code=201)
async def signup(payload: SignupRequest, db: Session = Depends(get_db)) -> AuthResponse:
    existing = db.query(User).filter(func.lower(User.email) == payload.email.lower()).first()
    if existing is not None:
        raise HTTPException(status_code=409, detail="Email already in use")

    user = User(
        email=payload.email,
        password_hash=hash_password(payload.password),
        currency_code=_DEFAULT_CURRENCY,
        email_verified=False,
    )
    db.add(user)
    db.commit()
    db.refresh(user)

    for name in _DEFAULT_CATEGORIES:
        db.add(Category(user_id=user.id, name=name, is_default=True))
    db.commit()

    token = _create_session(db, user.id)
    return AuthResponse(token=token, user=UserOut(id=user.id, email=user.email))


@router.post("/auth/login", response_model=AuthResponse)
async def login(payload: LoginRequest, db: Session = Depends(get_db)) -> AuthResponse:
    user = db.query(User).filter(func.lower(User.email) == payload.email.lower()).first()
    if user is None or not verify_password(payload.password, user.password_hash):
        raise HTTPException(status_code=401, detail="Invalid email or password")

    token = _create_session(db, user.id)
    return AuthResponse(token=token, user=UserOut(id=user.id, email=user.email))


@router.post("/auth/logout", status_code=204)
async def logout(
    request: Request,
    db: Session = Depends(get_db),
    user: User = Depends(get_current_user),
) -> Response:
    # get_current_user (app/dependencies.py) has already parsed and verified this
    # exact bearer token as belonging to `user`; re-deriving it here from the
    # header is the one place this duplicates that dependency's parsing. It
    # revokes only the session for this token, never another of the user's
    # active sessions.
    _, _, token = request.headers.get("Authorization", "").partition(" ")
    session = db.query(UserSession).filter(UserSession.token == token).first()
    if session is not None:
        session.revoked_at = datetime.now(UTC)
        db.commit()
    return Response(status_code=204)


@router.get("/me", response_model=MeOut)
async def get_me(user: User = Depends(get_current_user)) -> MeOut:
    return MeOut(id=user.id, email=user.email, created_at=user.created_at)


@router.patch("/me/currency", response_model=StubResponse)
async def patch_me_currency() -> StubResponse:
    return StubResponse(endpoint="PATCH /me/currency")
