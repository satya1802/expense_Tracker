# API Reference

> Maintained by QuorQ AI SDLC. Text between `sdlc:auto` markers is regenerated; anything outside them is yours and is kept.

<!-- sdlc:auto:start endpoints -->
| Method | Path | Handler | Source | Summary |
|---|---|---|---|---|
| GET | /health | health | `backend/app/main.py:57` | Liveness probe, and the only route here that is not a stub. |
<!-- sdlc:auto:end endpoints -->

<!-- sdlc:auto:start drift -->
**Designed but missing:**

- DELETE /budgets/{category_id}
- DELETE /categories/{id}
- DELETE /expenses/{id}
- GET /alerts
- GET /budgets
- GET /categories
- GET /dashboard
- GET /expenses
- GET /expenses/export
- GET /me
- GET /summary
- PATCH /categories/{id}
- PATCH /expenses/{id}
- PATCH /me/currency
- POST /alerts/{id}/read
- POST /auth/login
- POST /auth/logout
- POST /auth/signup
- POST /categories
- POST /expenses
- PUT /budgets/{category_id}
<!-- sdlc:auto:end drift -->

<!-- sdlc:auto:start source -->
Generated from commit `62613a2`
<!-- sdlc:auto:end source -->
