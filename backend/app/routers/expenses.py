"""Stub routes: list/filter, create, update, delete and export expenses.

See `app/routers/auth.py` for why every handler here returns a placeholder.
"""

from fastapi import APIRouter, Query

from app.schemas import StubResponse

router = APIRouter(tags=["expenses"])


@router.get("/expenses", response_model=StubResponse)
async def list_expenses(
    category_id: str | None = None,
    from_: str | None = Query(default=None, alias="from"),
    to: str | None = None,
) -> StubResponse:
    return StubResponse(endpoint="GET /expenses")


@router.post("/expenses", response_model=StubResponse, status_code=201)
async def create_expense() -> StubResponse:
    return StubResponse(endpoint="POST /expenses")


@router.get("/expenses/export", response_model=StubResponse)
async def export_expenses(
    from_: str | None = Query(default=None, alias="from"),
    to: str | None = None,
) -> StubResponse:
    # Implementing this ticket replaces StubResponse with a `text/csv` response
    # (e.g. StreamingResponse / PlainTextResponse), not a JSON body.
    return StubResponse(endpoint="GET /expenses/export")


@router.patch("/expenses/{id}", response_model=StubResponse)
async def update_expense(id: str) -> StubResponse:
    return StubResponse(endpoint="PATCH /expenses/{id}")


@router.delete("/expenses/{id}", response_model=StubResponse)
async def delete_expense(id: str) -> StubResponse:
    return StubResponse(endpoint="DELETE /expenses/{id}")
