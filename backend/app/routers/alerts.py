"""Stub routes: list in-app alerts and mark one read.

See `app/routers/auth.py` for why every handler here returns a placeholder.
"""

from fastapi import APIRouter

from app.schemas import StubResponse

router = APIRouter(tags=["alerts"])


@router.get("/alerts", response_model=StubResponse)
async def list_alerts(unread: bool | None = None) -> StubResponse:
    return StubResponse(endpoint="GET /alerts")


@router.post("/alerts/{id}/read", response_model=StubResponse)
async def mark_alert_read(id: str) -> StubResponse:
    return StubResponse(endpoint="POST /alerts/{id}/read")
