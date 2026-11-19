"""Every endpoint the approved api_spec declares must resolve to a route and
contribute to the OpenAPI document, even while it is still a stub -- this is
what the development sprint starts from, one ticket at a time.
"""

from fastapi.testclient import TestClient

EXPECTED_PATHS = {
    "/auth/signup",
    "/auth/login",
    "/auth/logout",
    "/me",
    "/me/currency",
    "/categories",
    "/categories/{id}",
    "/expenses",
    "/expenses/{id}",
    "/expenses/export",
    "/budgets",
    "/budgets/{category_id}",
    "/dashboard",
    "/summary",
    "/alerts",
    "/alerts/{id}/read",
}


def test_every_api_spec_path_is_registered(client: TestClient) -> None:
    response = client.get("/openapi.json")

    assert response.status_code == 200
    assert EXPECTED_PATHS.issubset(set(response.json()["paths"]))


def test_stub_routes_answer(client: TestClient) -> None:
    # /auth/signup and /auth/login are implemented (US-001-1), not stubs: they need
    # a real body and reject one that fails validation rather than always answering.
    assert (
        client.post(
            "/auth/signup", json={"email": "stub@example.com", "password": "longpass1"}
        ).status_code
        == 201
    )
    assert (
        client.post(
            "/auth/login", json={"email": "stub@example.com", "password": "longpass1"}
        ).status_code
        == 200
    )


def test_ac009_data_endpoints_require_authentication(client: TestClient) -> None:
    # AC-009 / NFR-004: every data endpoint must reject an unauthenticated caller
    # with 401 rather than ever answering with data, so these are no longer stubs.
    assert client.get("/categories").status_code == 401
    assert client.post("/categories", json={}).status_code == 401
    assert client.get("/expenses", params={"category_id": "x"}).status_code == 401
    assert client.get("/expenses/export").status_code == 401
    assert client.get("/budgets").status_code == 401
    assert client.put("/budgets/cat-1", json={}).status_code == 401
    assert client.get("/dashboard", params={"month": "2026-01"}).status_code == 401
    assert client.get("/summary").status_code == 401
    assert client.get("/alerts", params={"unread": "true"}).status_code == 401
    assert client.post("/alerts/alert-1/read").status_code == 401


def test_ac009_data_endpoints_answer_with_a_valid_token(client: TestClient) -> None:
    # AC-009 / NFR-004: once signed in, a user can reach these endpoints; they are
    # no longer unreachable stubs now that auth guards are in place.
    signup = client.post(
        "/auth/signup",
        json={"email": "stub-authed@example.com", "password": "longpass1"},
    )
    assert signup.status_code == 201
    token = signup.json()["token"]
    headers = {"Authorization": f"Bearer {token}"}

    assert client.get("/categories", headers=headers).status_code == 200
    assert client.post("/categories", json={"name": "Food"}, headers=headers).status_code == 201
    assert client.get("/expenses", params={"category_id": "x"}, headers=headers).status_code == 200
    assert client.get("/expenses/export", headers=headers).status_code == 200
    assert client.get("/budgets", headers=headers).status_code == 200
    assert client.get("/dashboard", params={"month": "2026-01"}, headers=headers).status_code == 200
    assert client.get("/summary", headers=headers).status_code == 200
    assert client.get("/alerts", params={"unread": "true"}, headers=headers).status_code == 200
