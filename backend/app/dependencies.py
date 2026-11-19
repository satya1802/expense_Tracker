"""The single place a session token is validated.

Every data router (categories, expenses, budgets, dashboard, alerts) depends on
`get_current_user` instead of reading the bearer token itself, so sessions are
checked -- signature of nothing here, but revocation and idle-expiry -- in one
place, and every endpoint filters by the authenticated user's id rather than
anything the request body claims.
"""

import os
from datetime import UTC, datetime, timedelta

from fastapi import Depends, HTTPException, Request, status
from sqlalchemy.orm import Session

from app.database import get_db
from app.models import User, UserSession

_NOT_AUTHENTICATED = HTTPException(
    status_code=status.HTTP_401_UNAUTHORIZED, detail="Not authenticated"
)


def _session_idle_minutes() -> int:
    raw = os.getenv("SESSION_IDLE_MINUTES", "30")
    try:
        return int(raw)
    except ValueError:
        return 30


def get_current_user(request: Request, db: Session = Depends(get_db)) -> User:
    """Validate the bearer token on the request and return its user, or raise 401.

    Missing header, malformed header, unknown token, revoked token and a token
    idle past SESSION_IDLE_MINUTES all raise the same 401 -- a request that gets
    this far never learns which. An accepted request refreshes the session's
    idle timer.
    """
    auth_header = request.headers.get("Authorization", "")
    scheme, _, token = auth_header.partition(" ")
    if scheme.lower() != "bearer" or not token:
        raise _NOT_AUTHENTICATED

    session = db.query(UserSession).filter(UserSession.token == token).first()
    if session is None or session.revoked_at is not None:
        raise _NOT_AUTHENTICATED

    # Postgres hands back timezone-aware datetimes for the DateTime(timezone=True)
    # columns; SQLite (the test/local default) hands back naive ones. Normalize
    # both to aware UTC before comparing so this works against either.
    def _aware(dt: datetime) -> datetime:
        return dt if dt.tzinfo is not None else dt.replace(tzinfo=UTC)

    now = datetime.now(UTC)
    idle_cutoff = _aware(session.last_activity_at) + timedelta(minutes=_session_idle_minutes())
    if now > idle_cutoff or now > _aware(session.expires_at):
        raise _NOT_AUTHENTICATED

    session.last_activity_at = now
    db.commit()

    user = db.query(User).filter(User.id == session.user_id).first()
    if user is None:
        raise _NOT_AUTHENTICATED
    return user
