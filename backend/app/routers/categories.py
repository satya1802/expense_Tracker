"""Stub routes: list, create, rename and delete categories.

See `app/routers/auth.py` for why every handler here returns a placeholder.
"""

from fastapi import APIRouter

from app.schemas import StubResponse

router = APIRouter(tags=["categories"])


@router.get("/categories", response_model=StubResponse)
async def list_categories() -> StubResponse:
    return StubResponse(endpoint="GET /categories")


@router.post("/categories", response_model=StubResponse, status_code=201)
async def create_category() -> StubResponse:
    return StubResponse(endpoint="POST /categories")


@router.patch("/categories/{id}", response_model=StubResponse)
async def update_category(id: str) -> StubResponse:
    return StubResponse(endpoint="PATCH /categories/{id}")


@router.delete("/categories/{id}", response_model=StubResponse)
async def delete_category(id: str, confirm: bool = False) -> StubResponse:
    return StubResponse(endpoint="DELETE /categories/{id}")
