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
    assert client.post("/auth/signup", json={}).status_code == 201
    assert client.post("/auth/login", json={}).status_code == 200
    assert client.get("/categories").status_code == 200
    assert client.post("/categories", json={}).status_code == 201
    assert client.get("/expenses", params={"category_id": "x"}).status_code == 200
    assert client.get("/expenses/export").status_code == 200
    assert client.get("/budgets").status_code == 200
    assert client.put("/budgets/cat-1", json={}).status_code == 200
    assert client.get("/dashboard", params={"month": "2026-01"}).status_code == 200
    assert client.get("/summary").status_code == 200
    assert client.get("/alerts", params={"unread": "true"}).status_code == 200
    assert client.post("/alerts/alert-1/read").status_code == 200
