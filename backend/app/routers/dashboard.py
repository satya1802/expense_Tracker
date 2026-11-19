"""Stub routes: the per-category budget dashboard and the spending summary.

See `app/routers/auth.py` for why every handler here returns a placeholder.
"""

from fastapi import APIRouter

from app.schemas import StubResponse

router = APIRouter(tags=["dashboard"])


@router.get("/dashboard", response_model=StubResponse)
async def get_dashboard(month: str | None = None) -> StubResponse:
    return StubResponse(endpoint="GET /dashboard")


@router.get("/summary", response_model=StubResponse)
async def get_summary(month: str | None = None) -> StubResponse:
    return StubResponse(endpoint="GET /summary")
