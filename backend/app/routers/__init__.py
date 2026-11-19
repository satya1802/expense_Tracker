"""Generated routers: one per architecture component that owns endpoints.

`api_router` collects every sub-router so `app.main` has one thing to mount.
"""

from fastapi import APIRouter

from app.routers import alerts, auth, budgets, categories, dashboard, expenses

api_router = APIRouter()
api_router.include_router(auth.router)
api_router.include_router(categories.router)
api_router.include_router(expenses.router)
api_router.include_router(budgets.router)
api_router.include_router(dashboard.router)
api_router.include_router(alerts.router)

__all__ = ["api_router"]
