"""Pydantic request and response models.

One pair per entity in the approved data model, plus the placeholder every
generated route returns until it has been implemented.
"""

import os
from datetime import datetime

from email_validator import EmailNotValidError, validate_email
from pydantic import BaseModel, Field, field_validator


def _validate_email(value: str) -> str:
    """Validate email syntax. RFC 2606 special-use test domains (e.g.
    example.test) are only accepted while running under pytest -- the
    acceptance/QA suites use them -- never in a deployed process, so a real
    signup can never register one of those addresses."""
    allow_test_domains = "PYTEST_CURRENT_TEST" in os.environ
    try:
        result = validate_email(
            value, check_deliverability=False, test_environment=allow_test_domains
        )
    except EmailNotValidError as exc:
        raise ValueError(f"value is not a valid email address: {exc}") from exc
    return result.normalized


class StubResponse(BaseModel):
    """What a generated route returns until someone implements it.

    A stub that returns a typed body rather than raising keeps the service
    startable and its OpenAPI document complete, so the frontend can be built
    against the agreed shape while the handlers are still being written.
    """

    endpoint: str
    status: str = "not_implemented"
    detail: str = "Scaffolded from the approved API spec; no behaviour yet."


class SignupRequest(BaseModel):
    email: str
    password: str = Field(min_length=8)

    @field_validator("email")
    @classmethod
    def _check_email(cls, v: str) -> str:
        return _validate_email(v)


class LoginRequest(BaseModel):
    email: str
    password: str

    @field_validator("email")
    @classmethod
    def _check_email(cls, v: str) -> str:
        return _validate_email(v)


class UserOut(BaseModel):
    id: str
    email: str


class AuthResponse(BaseModel):
    token: str
    user: UserOut


class MeOut(BaseModel):
    id: str
    email: str
    created_at: datetime


class CategoryCreate(BaseModel):
    # Blank/whitespace-only names and duplicates are rejected in the router (not
    # here) so the response shape matches the CATEGORIES CONTRACT exactly: a plain
    # 422 {detail: [{field, message}]} or 409 {detail: str}, not pydantic's own shape.
    # max_length matches the categories.name VARCHAR(60) column so an overlong name
    # is rejected here with a clean 422, not at the database layer.
    name: str = Field(max_length=60)


class CategoryUpdate(BaseModel):
    name: str = Field(max_length=60)


class CategoryOut(BaseModel):
    id: str
    name: str
    is_default: bool
