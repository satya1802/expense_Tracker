"""Unit tests for the categories module's name-validation helpers (US-009-1)."""

import pytest
from fastapi import HTTPException

from app.models import Category
from app.routers.categories import _reject_duplicate, _require_name


def test_ac018_require_name_rejects_blank_and_whitespace_only() -> None:
    with pytest.raises(HTTPException) as exc_info:
        _require_name("   ")

    assert exc_info.value.status_code == 422
    assert exc_info.value.detail == [{"field": "name", "message": "Name is required"}]


def test_ac017_require_name_strips_and_returns_a_usable_name() -> None:
    assert _require_name("  Side gigs  ") == "Side gigs"


def test_ac018_reject_duplicate_is_case_insensitive(db_session) -> None:
    db_session.add(Category(user_id="user-1", name="Groceries", is_default=True))
    db_session.commit()

    with pytest.raises(HTTPException) as exc_info:
        _reject_duplicate(db_session, "user-1", "groceries")

    assert exc_info.value.status_code == 409
    assert exc_info.value.detail == "You already have a category with that name"


def test_reject_duplicate_allows_a_different_users_same_name(db_session) -> None:
    db_session.add(Category(user_id="user-1", name="Groceries", is_default=True))
    db_session.commit()

    _reject_duplicate(db_session, "user-2", "Groceries")  # no exception


def test_reject_duplicate_excludes_the_row_being_renamed(db_session) -> None:
    category = Category(user_id="user-1", name="Groceries", is_default=True)
    db_session.add(category)
    db_session.commit()
    db_session.refresh(category)

    _reject_duplicate(db_session, "user-1", "Groceries", exclude_id=category.id)
