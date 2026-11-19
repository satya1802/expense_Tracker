"""Seeds the platform's bootstrap admin and smoke-test accounts on startup.

The deployed platform always sets `BOOTSTRAP_ADMIN_EMAIL` / `BOOTSTRAP_ADMIN_PASSWORD`
on the live API, and `SMOKE_TEST_EMAIL` / `SMOKE_TEST_PASSWORD` for the account the
end-to-end suite signs in as (see `frontend/e2e/support/admin.ts`). Locally and under
pytest neither pair is set, so `seed_bootstrap_users` seeds nothing and no test depends
on a particular account existing.

Idempotent: called again (every process start, including every redeploy) it finds the
email already present and does nothing, so it never creates a duplicate account.

This application's data model has no role column (docs/sdlc/architecture/data-model.md
lists only `users`, with no `role` field) -- every account is a plain user. The
bootstrap admin therefore gets no special role; there is none to grant.
"""

import os

from sqlalchemy.orm import Session

from app.models import User
from app.security import hash_password

# The account currency an endpoint has not been asked to set yet. Expense Tracker's
# data model requires `users.currency_code`, so a seeded account needs some value;
# `PATCH /me/currency` is how a real sign-up later chooses its own.
_DEFAULT_CURRENCY = "USD"


def _ensure_user(db: Session, email: str | None, password: str | None) -> None:
    if not email or not password:
        return
    already_exists = db.query(User).filter(User.email == email).first()
    if already_exists is not None:
        return
    db.add(
        User(
            email=email,
            password_hash=hash_password(password),
            currency_code=_DEFAULT_CURRENCY,
            email_verified=True,
        )
    )
    db.commit()


def seed_bootstrap_users(db: Session) -> None:
    """Create the admin and smoke-test accounts the platform names, if it named them."""
    _ensure_user(db, os.getenv("BOOTSTRAP_ADMIN_EMAIL"), os.getenv("BOOTSTRAP_ADMIN_PASSWORD"))
    _ensure_user(db, os.getenv("SMOKE_TEST_EMAIL"), os.getenv("SMOKE_TEST_PASSWORD"))
