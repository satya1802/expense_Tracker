"""Pydantic request and response models.

One pair per entity in the approved data model, plus the placeholder every
generated route returns until it has been implemented.
"""

from datetime import datetime

from email_validator import EmailNotValidError, validate_email
from pydantic import BaseModel, Field, field_validator


def _validate_email(value: str) -> str:
    """Validate email syntax, allowing RFC 2606 special-use test domains
    (e.g. example.test) used by the acceptance/QA suites."""
    try:
        result = validate_email(value, check_deliverability=False, test_environment=True)
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

    _validate_email = field_validator("email")(classmethod(lambda cls, v: _validate_email(v)))


class LoginRequest(BaseModel):
    email: str
    password: str

    _validate_email = field_validator("email")(classmethod(lambda cls, v: _validate_email(v)))


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
    name: str


class CategoryUpdate(BaseModel):
    name: str


class CategoryOut(BaseModel):
    id: str
    name: str
    is_default: bool
