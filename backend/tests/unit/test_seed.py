"""`app.seed.seed_bootstrap_users` is called from `app.main`'s startup, not
from these tests' `client` fixture (which never runs the app's lifespan --
see `backend/conftest.py`), so it is exercised directly here against a
database of its own.
"""

from sqlalchemy.orm import Session

from app.models import User
from app.security import verify_password
from app.seed import seed_bootstrap_users


def test_seeds_nothing_when_no_env_vars_are_set(db_session: Session, monkeypatch) -> None:
    for name in (
        "BOOTSTRAP_ADMIN_EMAIL",
        "BOOTSTRAP_ADMIN_PASSWORD",
        "SMOKE_TEST_EMAIL",
        "SMOKE_TEST_PASSWORD",
    ):
        monkeypatch.delenv(name, raising=False)

    seed_bootstrap_users(db_session)

    assert db_session.query(User).count() == 0


def test_seeds_admin_and_smoke_user_idempotently(db_session: Session, monkeypatch) -> None:
    monkeypatch.setenv("BOOTSTRAP_ADMIN_EMAIL", "admin@example.test")
    monkeypatch.setenv("BOOTSTRAP_ADMIN_PASSWORD", "admin-password-1")
    monkeypatch.setenv("SMOKE_TEST_EMAIL", "smoke@example.test")
    monkeypatch.setenv("SMOKE_TEST_PASSWORD", "smoke-password-1")

    seed_bootstrap_users(db_session)
    seed_bootstrap_users(db_session)  # idempotent: a second run creates nothing new

    users = {u.email: u for u in db_session.query(User).all()}
    assert set(users) == {"admin@example.test", "smoke@example.test"}

    admin = users["admin@example.test"]
    assert admin.email_verified is True
    assert verify_password("admin-password-1", admin.password_hash) is True
