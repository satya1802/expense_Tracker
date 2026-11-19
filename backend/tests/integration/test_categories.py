"""Integration tests for the categories module (US-009-1).

Each test is named after the acceptance criterion it covers.
"""

from fastapi.testclient import TestClient
from sqlalchemy.orm import Session

from app.models import Category

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


def _signup(client: TestClient, email: str = "owner@example.com", password: str = "longpass1"):
    return client.post("/auth/signup", json={"email": email, "password": password})


def _auth_headers(client: TestClient, **kwargs) -> dict:
    token = _signup(client, **kwargs).json()["token"]
    return {"Authorization": f"Bearer {token}"}


def test_ac016_signup_provisions_default_categories(
    client: TestClient, db_session: Session
) -> None:
    response = _signup(client)
    token = response.json()["token"]

    list_response = client.get("/categories", headers={"Authorization": f"Bearer {token}"})

    assert list_response.status_code == 200
    body = list_response.json()
    names = {c["name"] for c in body}
    assert _DEFAULTS.issubset(names)
    assert all(c["is_default"] for c in body if c["name"] in _DEFAULTS)


def test_ac016_ac008_get_categories_returns_only_callers_rows_ordered_by_name(
    client: TestClient,
) -> None:
    headers_a = _auth_headers(client, email="alice@example.com")
    headers_b = _auth_headers(client, email="bob@example.com")
    client.post("/categories", json={"name": "Zeta"}, headers=headers_a)

    response = client.get("/categories", headers=headers_b)

    assert response.status_code == 200
    body = response.json()
    assert "Zeta" not in [c["name"] for c in body]
    names = [c["name"] for c in body]
    assert names == sorted(names)


def test_ac017_create_category_returns_201_and_is_usable(client: TestClient) -> None:
    headers = _auth_headers(client)

    response = client.post("/categories", json={"name": "Side gigs"}, headers=headers)

    assert response.status_code == 201
    body = response.json()
    assert body["name"] == "Side gigs"
    assert body["is_default"] is False
    assert "id" in body

    list_response = client.get("/categories", headers=headers)
    assert any(c["id"] == body["id"] for c in list_response.json())


def test_ac018_create_category_with_blank_name_returns_422_and_creates_nothing(
    client: TestClient, db_session: Session
) -> None:
    headers = _auth_headers(client)
    before = db_session.query(Category).count()

    response = client.post("/categories", json={"name": "   "}, headers=headers)

    assert response.status_code == 422
    assert response.json()["detail"] == [{"field": "name", "message": "Name is required"}]
    assert db_session.query(Category).count() == before


def test_ac018_create_category_duplicate_name_case_insensitive_returns_409_and_creates_nothing(
    client: TestClient, db_session: Session
) -> None:
    headers = _auth_headers(client)
    before = db_session.query(Category).count()

    response = client.post("/categories", json={"name": "groceries"}, headers=headers)

    assert response.status_code == 409
    assert response.json()["detail"] == "You already have a category with that name"
    assert db_session.query(Category).count() == before


def test_ac008_patch_category_renames_the_callers_own_row(client: TestClient) -> None:
    headers = _auth_headers(client)
    created = client.post("/categories", json={"name": "Old name"}, headers=headers).json()

    response = client.patch(
        f"/categories/{created['id']}", json={"name": "New name"}, headers=headers
    )

    assert response.status_code == 200
    assert response.json()["name"] == "New name"


def test_ac008_patch_and_delete_another_users_category_returns_404(
    client: TestClient,
) -> None:
    headers_a = _auth_headers(client, email="carol@example.com")
    headers_b = _auth_headers(client, email="dave@example.com")
    created = client.post("/categories", json={"name": "Dave only"}, headers=headers_b).json()

    patch_response = client.patch(
        f"/categories/{created['id']}", json={"name": "Hacked"}, headers=headers_a
    )
    delete_response = client.delete(f"/categories/{created['id']}", headers=headers_a)

    assert patch_response.status_code == 404
    assert patch_response.json()["detail"] == "Category not found"
    assert delete_response.status_code == 404

    still_there = client.get("/categories", headers=headers_b)
    assert any(c["id"] == created["id"] for c in still_there.json())


def test_ac008_delete_category_removes_the_callers_own_row(client: TestClient) -> None:
    headers = _auth_headers(client)
    created = client.post("/categories", json={"name": "Temp"}, headers=headers).json()

    response = client.delete(f"/categories/{created['id']}", headers=headers)

    assert response.status_code == 204
    remaining = client.get("/categories", headers=headers).json()
    assert all(c["id"] != created["id"] for c in remaining)


def test_ac009_categories_endpoints_require_a_valid_bearer_token(client: TestClient) -> None:
    assert client.get("/categories").status_code == 401
    assert client.post("/categories", json={"name": "x"}).status_code == 401
    assert client.patch("/categories/some-id", json={"name": "x"}).status_code == 401
    assert client.delete("/categories/some-id").status_code == 401
