"""Stub routes: list in-app alerts and mark one read.

See `app/routers/auth.py` for why every handler here returns a placeholder.
"""

from fastapi import APIRouter, Depends

from app.dependencies import get_current_user
from app.models import User
from app.schemas import StubResponse

router = APIRouter(tags=["alerts"])


@router.get("/alerts", response_model=StubResponse)
async def list_alerts(
    unread: bool | None = None, user: User = Depends(get_current_user)
) -> StubResponse:
    return StubResponse(endpoint="GET /alerts")


@router.post("/alerts/{id}/read", response_model=StubResponse)
async def mark_alert_read(id: str, user: User = Depends(get_current_user)) -> StubResponse:
    return StubResponse(endpoint="POST /alerts/{id}/read")
