"""Fixtures for the acceptance suite (US-001-3).

These tests exercise the real application against the real PostgreSQL named
by `DATABASE_URL` -- no SQLite stand-in, no mocked database (see
`backend/tests/conftest.py` for the unit/integration suite, which uses an
in-memory database of its own instead; this suite deliberately does not use
it). `TestClient(app)` as a context manager runs the application's lifespan,
which creates any missing tables against the real database and seeds the
bootstrap users, exactly as a real deployment would.

Every user this suite creates uses an email under `qa-<random>@example.test`
so the autouse cleanup fixture below can find and remove exactly the rows
this suite is responsible for, and nothing else, after every test -- this
suite runs against a shared, real database, not a throwaway one.
"""

import uuid
from collections.abc import Iterator

import pytest
from fastapi.testclient import TestClient
from sqlalchemy.orm import Session

from app.database import SessionLocal
from app.main import app
from app.models import User

QA_EMAIL_DOMAIN = "@example.test"


def qa_email(label: str) -> str:
    """A unique email for this suite's own test users, never a literal."""
    return f"qa-{label}-{uuid.uuid4().hex[:12]}{QA_EMAIL_DOMAIN}"


@pytest.fixture
def client() -> Iterator[TestClient]:
    with TestClient(app) as test_client:
        yield test_client


@pytest.fixture(autouse=True)
def _cleanup_qa_users() -> Iterator[None]:
    yield
    db: Session = SessionLocal()
    try:
        users = db.query(User).filter(User.email.like(f"qa-%{QA_EMAIL_DOMAIN}")).all()
        for user in users:
            db.delete(user)  # cascades to sessions/categories/expenses/budgets/alerts
        db.commit()
    finally:
        db.close()
