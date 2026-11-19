"""Unit tests for the signup/login request validation (US-001-1, AC-003)."""

import pytest
from pydantic import ValidationError

from app.schemas import SignupRequest


def test_ac003_rejects_invalid_email_format() -> None:
    with pytest.raises(ValidationError) as exc_info:
        SignupRequest(email="not-an-email", password="longpass1")

    fields = {str(err["loc"][-1]) for err in exc_info.value.errors()}
    assert "email" in fields


def test_ac003_rejects_password_shorter_than_eight_characters() -> None:
    with pytest.raises(ValidationError) as exc_info:
        SignupRequest(email="jane@example.com", password="short")

    fields = {str(err["loc"][-1]) for err in exc_info.value.errors()}
    assert "password" in fields


def test_accepts_a_valid_email_and_password() -> None:
    request = SignupRequest(email="jane@example.com", password="longpass1")

    assert request.email == "jane@example.com"
    assert request.password == "longpass1"
