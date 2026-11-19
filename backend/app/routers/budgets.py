"""Stub routes: list, set/update and remove a category's monthly budget.

See `app/routers/auth.py` for why every handler here returns a placeholder.
"""

from fastapi import APIRouter, Depends

from app.dependencies import get_current_user
from app.models import User
from app.schemas import StubResponse

router = APIRouter(tags=["budgets"])


@router.get("/budgets", response_model=StubResponse)
async def list_budgets(user: User = Depends(get_current_user)) -> StubResponse:
    return StubResponse(endpoint="GET /budgets")


@router.put("/budgets/{category_id}", response_model=StubResponse)
async def set_budget(category_id: str, user: User = Depends(get_current_user)) -> StubResponse:
    return StubResponse(endpoint="PUT /budgets/{category_id}")


@router.delete("/budgets/{category_id}", response_model=StubResponse)
async def delete_budget(category_id: str, user: User = Depends(get_current_user)) -> StubResponse:
    return StubResponse(endpoint="DELETE /budgets/{category_id}")
