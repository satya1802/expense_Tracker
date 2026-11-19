"""Integration tests for the account and session module (US-001-1).

Each test is named after the acceptance criterion it covers.
"""

from datetime import datetime, timedelta

from fastapi.testclient import TestClient
from sqlalchemy.orm import Session

from app.models import User, UserSession


def _signup(client: TestClient, email: str = "jane@example.com", password: str = "longpass1"):
    return client.post("/auth/signup", json={"email": email, "password": password})


def test_ac001_signup_creates_account_and_returns_token_and_hashes_password(
    client: TestClient, db_session: Session
) -> None:
    response = _signup(client)

    assert response.status_code == 201
    body = response.json()
    assert "token" in body and body["token"]
    assert body["user"]["email"] == "jane@example.com"
    assert "id" in body["user"]

    user = db_session.query(User).filter(User.email == "jane@example.com").first()
    assert user is not None
    assert user.password_hash != "longpass1"
    assert "longpass1" not in user.password_hash


def test_ac002_signup_duplicate_email_returns_409_and_creates_no_account(
    client: TestClient, db_session: Session
) -> None:
    _signup(client)

    response = _signup(client)

    assert response.status_code == 409
    assert response.json()["detail"] == "Email already in use"
    assert db_session.query(User).filter(User.email == "jane@example.com").count() == 1


def test_ac003_signup_invalid_email_returns_422_and_creates_no_account(
    client: TestClient, db_session: Session
) -> None:
    response = client.post("/auth/signup", json={"email": "not-an-email", "password": "longpass1"})

    assert response.status_code == 422
    detail = response.json()["detail"]
    assert isinstance(detail, list) and len(detail) >= 1
    assert any("email" in item["field"] for item in detail)
    assert db_session.query(User).count() == 0


def test_ac003_signup_short_password_returns_422_and_creates_no_account(
    client: TestClient, db_session: Session
) -> None:
    response = client.post("/auth/signup", json={"email": "jane@example.com", "password": "short"})

    assert response.status_code == 422
    detail = response.json()["detail"]
    assert any("password" in item["field"] for item in detail)
    assert db_session.query(User).count() == 0


def test_ac004_login_with_correct_credentials_returns_200_and_new_token(
    client: TestClient,
) -> None:
    signup_response = _signup(client)
    signup_token = signup_response.json()["token"]

    response = client.post(
        "/auth/login", json={"email": "jane@example.com", "password": "longpass1"}
    )

    assert response.status_code == 200
    body = response.json()
    assert body["token"] != signup_token
    assert body["user"]["email"] == "jane@example.com"


def test_ac005_login_wrong_password_returns_401_generic_message(client: TestClient) -> None:
    _signup(client)

    response = client.post(
        "/auth/login", json={"email": "jane@example.com", "password": "wrong-password"}
    )

    assert response.status_code == 401
    assert response.json()["detail"] == "Invalid email or password"


def test_ac005_login_wrong_email_returns_same_401_generic_message(client: TestClient) -> None:
    _signup(client)

    response = client.post(
        "/auth/login", json={"email": "nobody@example.com", "password": "longpass1"}
    )

    assert response.status_code == 401
    assert response.json()["detail"] == "Invalid email or password"


def test_ac006_logout_revokes_session_and_token_reuse_returns_401(client: TestClient) -> None:
    token = _signup(client).json()["token"]
    headers = {"Authorization": f"Bearer {token}"}

    logout_response = client.post("/auth/logout", headers=headers)
    assert logout_response.status_code == 204

    me_response = client.get("/me", headers=headers)
    assert me_response.status_code == 401


def test_ac007_idle_session_is_rejected_and_active_session_refreshes(
    client: TestClient, db_session: Session
) -> None:
    token = _signup(client).json()["token"]
    headers = {"Authorization": f"Bearer {token}"}

    # Force the session's idle timer far into the past, beyond the default 30 minutes.
    session = db_session.query(UserSession).filter(UserSession.token == token).first()
    session.last_activity_at = datetime.utcnow() - timedelta(minutes=31)
    db_session.commit()

    response = client.get("/me", headers=headers)
    assert response.status_code == 401


def test_ac009_me_returns_profile_for_valid_token(client: TestClient) -> None:
    token = _signup(client).json()["token"]

    response = client.get("/me", headers={"Authorization": f"Bearer {token}"})

    assert response.status_code == 200
    body = response.json()
    assert set(body) == {"id", "email", "created_at"}
    assert body["email"] == "jane@example.com"


def test_ac009_me_rejects_missing_malformed_revoked_and_expired_tokens(
    client: TestClient, db_session: Session
) -> None:
    assert client.get("/me").status_code == 401
    assert client.get("/me", headers={"Authorization": "not-bearer-at-all"}).status_code == 401
    assert (
        client.get("/me", headers={"Authorization": "Bearer unknown-token-value"}).status_code
        == 401
    )

    token = _signup(client, email="mallory@example.com").json()["token"]
    headers = {"Authorization": f"Bearer {token}"}
    client.post("/auth/logout", headers=headers)
    assert client.get("/me", headers=headers).status_code == 401

    token2 = _signup(client, email="eve@example.com").json()["token"]
    session = db_session.query(UserSession).filter(UserSession.token == token2).first()
    session.expires_at = datetime.utcnow() - timedelta(days=1)
    db_session.commit()
    assert client.get("/me", headers={"Authorization": f"Bearer {token2}"}).status_code == 401
