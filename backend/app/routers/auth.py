"""Stub routes: sign-up, sign-in, sign-out and the signed-in profile.

Every handler returns `app.schemas.StubResponse` rather than real behaviour --
hashing a password, issuing a session, validating a currency code -- so the
service starts, serves a complete OpenAPI document, and the development
sprint implements each one, one ticket at a time.
"""

from fastapi import APIRouter

from app.schemas import StubResponse

router = APIRouter(tags=["auth"])


@router.post("/auth/signup", response_model=StubResponse, status_code=201)
async def signup() -> StubResponse:
    return StubResponse(endpoint="POST /auth/signup")


@router.post("/auth/login", response_model=StubResponse)
async def login() -> StubResponse:
    return StubResponse(endpoint="POST /auth/login")


@router.post("/auth/logout", response_model=StubResponse)
async def logout() -> StubResponse:
    return StubResponse(endpoint="POST /auth/logout")


@router.get("/me", response_model=StubResponse)
async def get_me() -> StubResponse:
    return StubResponse(endpoint="GET /me")


@router.patch("/me/currency", response_model=StubResponse)
async def patch_me_currency() -> StubResponse:
    return StubResponse(endpoint="PATCH /me/currency")
