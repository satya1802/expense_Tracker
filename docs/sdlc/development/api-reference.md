# API Reference

> Maintained by QuorQ AI SDLC. Text between `sdlc:auto` markers is regenerated; anything outside them is yours and is kept.

<!-- sdlc:auto:start endpoints -->
| Method | Path | Handler | Source | Summary |
|---|---|---|---|---|
| GET | /alerts | list_alerts | `backend/app/routers/alerts.py:15` | — |
| POST | /alerts/{id}/read | mark_alert_read | `backend/app/routers/alerts.py:22` | — |
| POST | /auth/login | login | `backend/app/routers/auth.py:83` | — |
| POST | /auth/logout | logout | `backend/app/routers/auth.py:93` | — |
| POST | /auth/signup | signup | `backend/app/routers/auth.py:59` | — |
| GET | /budgets | list_budgets | `backend/app/routers/budgets.py:15` | — |
| DELETE | /budgets/{category_id} | delete_budget | `backend/app/routers/budgets.py:25` | — |
| PUT | /budgets/{category_id} | set_budget | `backend/app/routers/budgets.py:20` | — |
| GET | /categories | list_categories | `backend/app/routers/categories.py:44` | — |
| POST | /categories | create_category | `backend/app/routers/categories.py:51` | — |
| DELETE | /categories/{id} | delete_category | `backend/app/routers/categories.py:96` | — |
| PATCH | /categories/{id} | update_category | `backend/app/routers/categories.py:74` | — |
| GET | /dashboard | get_dashboard | `backend/app/routers/dashboard.py:15` | — |
| GET | /expenses | list_expenses | `backend/app/routers/expenses.py:15` | — |
| POST | /expenses | create_expense | `backend/app/routers/expenses.py:25` | — |
| GET | /expenses/export | export_expenses | `backend/app/routers/expenses.py:30` | — |
| DELETE | /expenses/{id} | delete_expense | `backend/app/routers/expenses.py:46` | — |
| PATCH | /expenses/{id} | update_expense | `backend/app/routers/expenses.py:41` | — |
| GET | /health | health | `backend/app/main.py:82` | Liveness probe, and the only route here that is not a stub. |
| GET | /me | get_me | `backend/app/routers/auth.py:112` | — |
| PATCH | /me/currency | patch_me_currency | `backend/app/routers/auth.py:117` | — |
| GET | /summary | get_summary | `backend/app/routers/dashboard.py:22` | — |
<!-- sdlc:auto:end endpoints -->

<!-- sdlc:auto:start drift -->
_Code matches the designed API._
<!-- sdlc:auto:end drift -->

<!-- sdlc:auto:start source -->
Generated from commit `43eb205`
<!-- sdlc:auto:end source -->
