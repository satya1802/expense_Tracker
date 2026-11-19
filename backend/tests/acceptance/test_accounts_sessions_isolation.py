"""Acceptance suite for accounts, sessions and per-account data isolation
(US-001-3), run against the real PostgreSQL via `DATABASE_URL` (no mocks).

Data-endpoint criteria (AC-008, AC-009) are written against the AUTH
CONTRACT exactly as specified. `categories`/`expenses`/`budgets`/`dashboard`/
`alerts` are still unauthenticated stubs in this snapshot of the repository
(no `Depends(get_current_user)`, no persistence by owner) -- that is a
concurrent-build gap, not something this suite patches. Those assertions are
left in place so they start passing the moment those routers are built, and
the gap is called out as PENDING in the QA report rather than filed as a
defect against this ticket.
"""

import secrets
from datetime import datetime, timedelta

from fastapi.testclient import TestClient
from sqlalchemy.orm import Session

from app.database import SessionLocal
from app.models import User, UserSession
from tests.acceptance.conftest import qa_email

DATA_ENDPOINTS = (
    ("get", "/categories"),
    ("get", "/expenses"),
    ("get", "/expenses/export"),
    ("get", "/budgets"),
    ("get", "/dashboard"),
    ("get", "/summary"),
    ("get", "/alerts"),
)


def _password() -> str:
    return secrets.token_urlsafe(12)


def _signup(client: TestClient, email: str | None = None) -> tuple[str, str, dict]:
    """Sign up a fresh QA user; returns (email, password, response_json)."""
    email = email or qa_email("user")
    password = _password()
    response = client.post("/auth/signup", json={"email": email, "password": password})
    assert response.status_code == 201
    return email, password, response.json()


def test_ac001_signup_returns_201_and_password_hash_is_never_the_plaintext(
    client: TestClient,
) -> None:
    email, password, body = _signup(client)

    assert "token" in body and body["token"]
    assert body["user"]["email"] == email

    db: Session = SessionLocal()
    try:
        user = db.query(User).filter(User.email == email).first()
        assert user is not None
        assert user.password_hash != password
        assert password not in user.password_hash
        assert user.password_hash.startswith("$2")  # a bcrypt hash, never plain text
    finally:
        db.close()


def test_ac002_duplicate_email_signup_returns_409_and_creates_no_second_row(
    client: TestClient,
) -> None:
    email, password, _ = _signup(client)

    response = client.post("/auth/signup", json={"email": email, "password": password})

    assert response.status_code == 409
    db: Session = SessionLocal()
    try:
        assert db.query(User).filter(User.email == email).count() == 1
    finally:
        db.close()


def test_ac003_invalid_email_returns_422_with_an_explanatory_field_message(
    client: TestClient,
) -> None:
    response = client.post("/auth/signup", json={"email": "not-an-email", "password": _password()})

    assert response.status_code == 422
    detail = response.json()["detail"]
    assert any(item["field"] == "email" and item["message"] for item in detail)


def test_ac003_too_short_password_returns_422_with_an_explanatory_field_message(
    client: TestClient,
) -> None:
    response = client.post("/auth/signup", json={"email": qa_email("short"), "password": "short1"})

    assert response.status_code == 422
    detail = response.json()["detail"]
    assert any(item["field"] == "password" and item["message"] for item in detail)


def test_ac004_login_with_correct_credentials_returns_a_usable_token(
    client: TestClient,
) -> None:
    email, password, _ = _signup(client)

    login_response = client.post("/auth/login", json={"email": email, "password": password})
    assert login_response.status_code == 200
    token = login_response.json()["token"]

    me_response = client.get("/me", headers={"Authorization": f"Bearer {token}"})
    assert me_response.status_code == 200
    assert me_response.json()["email"] == email


def test_ac005_wrong_password_and_unknown_email_return_byte_identical_401_bodies(
    client: TestClient,
) -> None:
    email, password, _ = _signup(client)

    wrong_password_response = client.post(
        "/auth/login", json={"email": email, "password": password + "x"}
    )
    unknown_email_response = client.post(
        "/auth/login", json={"email": qa_email("unknown"), "password": password}
    )

    assert wrong_password_response.status_code == 401
    assert unknown_email_response.status_code == 401
    assert wrong_password_response.content == unknown_email_response.content


def test_ac006_logout_revokes_the_session_for_get_me(client: TestClient) -> None:
    _, _, body = _signup(client)
    token = body["token"]
    headers = {"Authorization": f"Bearer {token}"}

    logout_response = client.post("/auth/logout", headers=headers)
    assert logout_response.status_code == 204

    assert client.get("/me", headers=headers).status_code == 401


def test_ac006_logout_revokes_the_session_for_a_data_endpoint(client: TestClient) -> None:
    """[PENDING if it fails] /categories is still an unauthenticated stub in this
    snapshot (no Depends(get_current_user)); see module docstring."""
    _, _, body = _signup(client)
    token = body["token"]
    headers = {"Authorization": f"Bearer {token}"}
    client.post("/auth/logout", headers=headers)

    response = client.get("/categories", headers=headers)
    assert response.status_code == 401


def test_ac007_idle_session_beyond_session_idle_minutes_returns_401_on_next_call(
    client: TestClient,
) -> None:
    _, _, body = _signup(client)
    token = body["token"]
    headers = {"Authorization": f"Bearer {token}"}

    db: Session = SessionLocal()
    try:
        session = db.query(UserSession).filter(UserSession.token == token).first()
        assert session is not None
        session.last_activity_at = datetime.utcnow() - timedelta(minutes=31)
        db.commit()
    finally:
        db.close()

    response = client.get("/me", headers=headers)
    assert response.status_code == 401


def test_ac008_user_a_token_never_returns_user_b_categories(client: TestClient) -> None:
    """[PENDING if it fails] category CRUD and per-owner isolation are not built
    yet in this snapshot (/categories is a stub, not persisted by owner); see
    module docstring."""
    _, _, body_a = _signup(client)
    _, _, body_b = _signup(client)
    headers_a = {"Authorization": f"Bearer {body_a['token']}"}
    headers_b = {"Authorization": f"Bearer {body_b['token']}"}

    created = client.post("/categories", json={"name": "Groceries"}, headers=headers_b)
    assert created.status_code == 201
    category_id = created.json().get("id")
    assert category_id, "a real category endpoint must return the created row's id"

    list_response = client.get("/categories", headers=headers_a)
    assert list_response.status_code == 200
    assert category_id not in [c.get("id") for c in list_response.json()]

    update_response = client.patch(
        f"/categories/{category_id}", json={"name": "Hacked"}, headers=headers_a
    )
    assert update_response.status_code in (404, 401)

    delete_response = client.delete(
        f"/categories/{category_id}", params={"confirm": "true"}, headers=headers_a
    )
    assert delete_response.status_code in (404, 401)

    still_there = client.get("/categories", headers=headers_b)
    assert any(c.get("id") == category_id for c in still_there.json())


def test_ac009_data_endpoints_reject_requests_with_no_authorization_header(
    client: TestClient,
) -> None:
    """[PENDING if it fails] several of these routers are still unauthenticated
    stubs in this snapshot; see module docstring."""
    for method, path in DATA_ENDPOINTS:
        response = getattr(client, method)(path)
        assert response.status_code == 401, f"{method.upper()} {path} did not 401 with no auth"


def test_ac009_data_endpoints_reject_a_garbage_token(client: TestClient) -> None:
    """[PENDING if it fails] several of these routers are still unauthenticated
    stubs in this snapshot; see module docstring."""
    headers = {"Authorization": f"Bearer garbage-{secrets.token_urlsafe(8)}"}
    for method, path in DATA_ENDPOINTS:
        response = getattr(client, method)(path, headers=headers)
        assert response.status_code == 401, (
            f"{method.upper()} {path} did not 401 with a garbage token"
        )
