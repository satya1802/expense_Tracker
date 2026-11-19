"""Acceptance suite for category isolation and default provisioning
(US-009-3), run against the real PostgreSQL via `DATABASE_URL` (no mocks).

See `backend/tests/acceptance/conftest.py` for the `client`/`qa_email`
fixtures and the autouse cleanup that removes every row this suite creates.
"""

from fastapi.testclient import TestClient

from app.database import SessionLocal
from app.main import app
from app.models import Category
from tests.acceptance.conftest import qa_email

_DEFAULTS = {
    "Groceries",
    "Transport",
    "Eating out",
    "Housing",
    "Utilities",
    "Entertainment",
    "Health",
    "Other",
}


def _signup(client: TestClient, email: str) -> dict:
    password = "qa-password-" + email.split("-")[1]
    response = client.post("/auth/signup", json={"email": email, "password": password})
    assert response.status_code == 201
    return response.json()


def test_ac008_two_accounts_with_a_same_named_custom_category_never_see_each_others_rows(
    client: TestClient,
) -> None:
    email_a = qa_email("isoa")
    email_b = qa_email("isob")
    body_a = _signup(client, email_a)
    body_b = _signup(client, email_b)
    headers_a = {"Authorization": f"Bearer {body_a['token']}"}
    headers_b = {"Authorization": f"Bearer {body_b['token']}"}

    created_a = client.post("/categories", json={"name": "Side gigs"}, headers=headers_a)
    created_b = client.post("/categories", json={"name": "Side gigs"}, headers=headers_b)
    assert created_a.status_code == 201
    assert created_b.status_code == 201
    id_a, id_b = created_a.json()["id"], created_b.json()["id"]
    assert id_a != id_b

    list_a = client.get("/categories", headers=headers_a).json()
    list_b = client.get("/categories", headers=headers_b).json()

    ids_a = {c["id"] for c in list_a}
    ids_b = {c["id"] for c in list_b}
    assert id_a in ids_a and id_a not in ids_b
    assert id_b in ids_b and id_b not in ids_a
    assert sum(1 for c in list_a if c["name"] == "Side gigs") == 1
    assert sum(1 for c in list_b if c["name"] == "Side gigs") == 1


def test_ac009_get_categories_with_no_authorization_header_returns_401(client: TestClient) -> None:
    response = client.get("/categories")

    assert response.status_code == 401


def test_ac016_new_user_has_the_full_default_set_exactly_once_no_duplicates_on_repeated_startup(
    client: TestClient,
) -> None:
    email = qa_email("defaults")
    body = _signup(client, email)
    headers = {"Authorization": f"Bearer {body['token']}"}

    list_response = client.get("/categories", headers=headers)
    assert list_response.status_code == 200
    names = [c["name"] for c in list_response.json()]
    assert _DEFAULTS.issubset(set(names))
    for default_name in _DEFAULTS:
        assert names.count(default_name) == 1, f"{default_name!r} appeared more than once"

    # Simulate the application restarting (a fresh process re-running the
    # lifespan's create_all + seed_bootstrap_users) against the same database,
    # without the user signing up again. Default categories must not be
    # re-provisioned or duplicated by a second startup.
    with TestClient(app):
        pass

    db = SessionLocal()
    try:
        rows = db.query(Category).filter(Category.user_id == body["user"]["id"]).all()
    finally:
        db.close()
    row_names = [r.name for r in rows]
    for default_name in _DEFAULTS:
        assert row_names.count(default_name) == 1, (
            f"{default_name!r} was duplicated after a repeated application startup"
        )
