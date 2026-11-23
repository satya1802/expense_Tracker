# Traceability Matrix

> Maintained by QuorQ AI SDLC. Text between `sdlc:auto` markers is regenerated; anything outside them is yours and is kept.

<!-- sdlc:auto:start legend -->
Built from recorded links, not written by a model: requirement key → plan item (`source_stable_key`) → development ticket (`stable_key`) → the ticket's test steps → the last live deployment that started after the work finished. **AC tests** counts the story's acceptance criteria that have a test case, and those whose test cases all passed in the latest finished E2E run.
<!-- sdlc:auto:end legend -->

<!-- sdlc:auto:start matrix -->
| Requirement | Epic | Title | Plan items | Sprint | Design | Code | Commits | Ticket | Tests | AC tests | Deployed |
|---|---|---|---|---|---|---|---|---|---|---|---|
| US-001 | EPIC-001 | Sign up with email and password | US-001 | 1 | POST /auth/signup, api, db, users, web | backend/app/dependencies.py, backend/app/main.py, backend/app/models.py, backend/app/routers/alerts.py, backend/app/routers/auth.py +20 more | 7937121 | delivered | succeeded | 3/3 tested · 2/3 passing | — |
| US-002 | EPIC-001 | Sign in to my account | US-002 | 1 | POST /auth/login, api, db, sessions, users, web | — | 7937121 | delivered | not run | 2/2 tested · 1/2 passing | — |
| US-003 | EPIC-001 | Sign out and session expiry | US-003 | 1 | POST /auth/logout, api, db, sessions | — | 7937121 | delivered | not run | 2/2 tested · 0/2 passing | — |
| US-004 | EPIC-001 | Private per-account data isolation | US-004 | 1 | GET /me, api, db, sessions, users | — | 7937121 | delivered | not run | 2/2 tested · 2/2 passing | — |
| US-005 | EPIC-002 | Log a new expense manually | US-005 | 2 | POST /expenses, api, categories, db, expenses, web | — | — | not started | not run | 0/3 tested · 0/3 passing | — |
| US-006 | EPIC-002 | Edit an existing expense | US-006 | 2 | PATCH /expenses/{id}, api, db, expenses | — | — | not started | not run | 0/2 tested · 0/2 passing | — |
| US-007 | EPIC-002 | Delete an expense | US-007 | 2 | DELETE /expenses/{id}, api, db, expenses | — | — | not started | not run | 0/1 tested · 0/1 passing | — |
| US-008 | EPIC-003 | Use default categories | US-008 | 1 | GET /categories, api, categories, db | — | 7937121 | delivered | not run | 1/1 tested · 0/1 passing | — |
| US-009 | EPIC-003 | Create a custom category | US-009 | 1 | POST /categories, api, categories, db, web | backend/app/models.py, backend/app/routers/auth.py, backend/app/routers/categories.py, backend/app/schemas.py, backend/tests/acceptance/test_categories_isolation.py +5 more | 7937121 | delivered | succeeded | 2/2 tested · 0/2 passing | — |
| US-010 | EPIC-003 | Manage custom categories | US-010 | 2 | DELETE /categories/{id}, PATCH /categories/{id}, api, categories, db, expenses, web | — | — | not started | not run | 0/2 tested · 0/2 passing | — |
| US-011 | EPIC-004 | Set a monthly budget for a category | US-011 | 2 | PUT /budgets/{category_id}, api, budgets, db, web | — | — | not started | not run | 0/3 tested · 0/3 passing | — |
| US-012 | EPIC-004 | Update or remove a category budget | US-012 | 2 | DELETE /budgets/{category_id}, PUT /budgets/{category_id}, api, budgets, db | — | — | not started | not run | 0/2 tested · 0/2 passing | — |
| US-013 | EPIC-005 | See budget-versus-spending status | US-013 | 3 | GET /dashboard, api, budgets, db, expenses, web | — | — | not started | not run | 0/2 tested · 0/2 passing | — |
| US-014 | EPIC-005 | View a simple spending summary | US-014 | 3 | GET /summary, api, expenses, web | — | — | not started | not run | 0/2 tested · 0/2 passing | — |
| US-015 | EPIC-005 | Mobile-friendly responsive layout | US-015 | 4 | web | — | — | not started | not run | 0/1 tested · 0/1 passing | — |
| US-016 | EPIC-006 | Receive in-app budget alerts | US-016 | 3 | GET /alerts, POST /alerts/{id}/read, alerts, api, db, web | — | — | not started | not run | 0/2 tested · 0/2 passing | — |
| US-017 | EPIC-006 | Receive budget alerts by email | US-017 | 3 | alerts, api, email | — | — | not started | not run | 0/2 tested · 0/2 passing | — |
| US-018 | EPIC-007 | Select a single account currency | US-018 | 3 | PATCH /me/currency, api, db, users, web | — | — | not started | not run | 0/2 tested · 0/2 passing | — |
| US-019 | EPIC-007 | Export expenses as CSV | US-019 | 4 | GET /expenses/export, api, db, expenses | — | — | not started | not run | 0/2 tested · 0/2 passing | — |
| US-020 | EPIC-008 | Browse my expenses | US-020 | 2 | GET /expenses, api, expenses, web | — | — | not started | not run | 0/2 tested · 0/2 passing | — |
| US-021 | EPIC-008 | Search and filter expenses | US-021 | 2 | GET /expenses, api, expenses, web | — | — | not started | not run | 0/2 tested · 0/2 passing | — |
<!-- sdlc:auto:end matrix -->
