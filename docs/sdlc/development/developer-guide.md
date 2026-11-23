# Developer Guide

> Maintained by QuorQ AI SDLC. Text between `sdlc:auto` markers is regenerated; anything outside them is yours and is kept.

<!-- sdlc:auto:start status -->
_Up to date._
<!-- sdlc:auto:end status -->

<!-- sdlc:auto:start source -->
Generated from commit `43eb205` · model `claude-sonnet-5`
<!-- sdlc:auto:end source -->

<!-- sdlc:auto:start overview -->
Expense Tracker is a Quorq-generated project containing two independently run applications in one repo: a React 19 + Vite single-page frontend (src/screens one module per approved design screen) that currently renders against seeded sample data, and a FastAPI 0.115 backend with SQLAlchemy models for users, sessions, categories, expenses, budgets and alerts. Only the auth and categories routers have real behavior (signup/login/logout/me, category CRUD with per-user scoping and case-insensitive duplicate checks); the expenses, budgets, dashboard and alerts routers are stubs that return a typed placeholder (StubResponse) so the API and its OpenAPI spec are complete while those tickets are implemented. The backend defaults to a local SQLite file so it runs with no database server, but the approved stack targets PostgreSQL 16 (docker-compose.yml provisions one) and AWS for deployment.
<!-- sdlc:auto:end overview -->

<!-- sdlc:auto:start prerequisites -->
- Node.js (for Vite 6 / React 19 / npm scripts)
- npm
- Python 3.12
- pip
- Docker (only needed to run the PostgreSQL 16 service in docker-compose.yml)
<!-- sdlc:auto:end prerequisites -->

<!-- sdlc:auto:start setup -->
1. Clone the repository
2. cd backend && pip install -r requirements.txt
3. (optional) docker compose up -d db  -- to run a local PostgreSQL 16 instead of the default SQLite file
4. (optional) set DATABASE_URL to point at that PostgreSQL instance instead of the default sqlite:///./app.db
5. cd frontend && npm install
6. (optional) set VITE_API_BASE_URL if the backend is not on http://localhost:8000
<!-- sdlc:auto:end setup -->

<!-- sdlc:auto:start run -->
| Name | Command | Description |
|---|---|---|
| backend dev | `cd backend && uvicorn app.main:app --reload` | Runs the FastAPI service locally with auto-reload; creates tables on startup and seeds bootstrap users if their env vars are set |
| frontend dev | `cd frontend && npm run dev` | Starts the Vite dev server for the SPA |
| frontend build | `cd frontend && npm run build` | Bundles the app for deployment (does not typecheck) |
| frontend preview | `cd frontend && npm run preview` | Serves the production build locally |
| typecheck | `cd frontend && npm run typecheck` | Runs tsc --noEmit over the frontend |
| lint | `cd frontend && npm run lint` | Runs ESLint over the frontend; this is the gate the platform runs during development |
| format | `cd frontend && npm run format` | Applies Prettier formatting to the frontend |
| db up | `docker compose up -d db` | Starts the PostgreSQL 16 container defined in docker-compose.yml |
<!-- sdlc:auto:end run -->

<!-- sdlc:auto:start structure -->
| Path | Purpose |
|---|---|
| `backend` | FastAPI service: models, schemas, routers, security, database wiring and tests |
| `backend/app` | Application code -- main.py entrypoint, database.py (engine/session), models.py, schemas.py, security.py, seed.py, and routers/ |
| `backend/scripts` | Operational scripts, e.g. check_connections.py |
| `backend/tests` | Pytest suite split into unit/, integration/ and acceptance/ |
| `frontend` | React 19 + Vite single-page app approved from design review |
| `frontend/src` | App shell (App.tsx), screens/, lib/ (api client, UI kit, icons, brand tokens) |
| `frontend/e2e` | Playwright acceptance specs and support helpers |
| `.github/workflows` | CI workflow running the SonarQube scan |
| `.devcontainer` | Dev container configuration for a consistent local environment |
| `.quorq` | Quorq platform metadata (handoff.json, prepared.json), not application code |
<!-- sdlc:auto:end structure -->

<!-- sdlc:auto:start conventions -->
- One FastAPI router per architecture component under backend/app/routers, all mounted through a single api_router
- Unimplemented endpoints return a typed StubResponse (endpoint, status, detail) rather than an error, keeping the OpenAPI spec and service startable before behavior is written
- Every protected route depends on get_current_user and filters queries by that user's id, never by an id supplied in the request
- Validation errors are returned as {detail: [{field, message}]} via a custom RequestValidationError handler, not FastAPI's default {loc, msg, type} shape
- Primary keys are 36-char UUID4 strings (not a Postgres-only UUID type) so the same schema works on SQLite and PostgreSQL
- Case-insensitive uniqueness (emails, category names per user) is enforced with functional indexes on lower(column), compared via func.lower(...) in queries rather than relying on column collation
- Frontend screens live one-per-file under src/screens/, built against the shared component/icon vocabulary in src/lib/ui.tsx and src/lib/icons.tsx and the brand tokens in src/lib/brand.ts / index.css
- Frontend API calls go through the single apiFetch helper in src/lib/api.ts, which attaches the bearer session token, normalizes errors into ApiError, and triggers a central unauthorized handler on a 401 from any non-auth endpoint
<!-- sdlc:auto:end conventions -->

<!-- sdlc:auto:start testing -->
| Name | Command | Description |
|---|---|---|
| backend tests | `cd backend && pytest` | Runs unit, integration and acceptance tests (pytest.ini sets pythonpath=. and testpaths=tests) |
| backend lint | `cd backend && ruff check .` | Lints the backend with ruff |
| backend format | `cd backend && ruff format .` | Formats the backend with ruff |
| frontend unit tests | `cd frontend && npm test` | Runs Vitest component tests located beside the components they cover |
| frontend e2e install | `cd frontend && npm run test:e2e:install` | Installs the Chromium browser Playwright needs |
| frontend e2e tests | `cd frontend && npm run test:e2e` | Runs Playwright acceptance specs in e2e/; without E2E_BASE_URL it boots the backend (via its .venv) and the built frontend preview itself |
<!-- sdlc:auto:end testing -->

<!-- sdlc:auto:start troubleshooting -->
| Problem | Solution |
|---|---|
| `pytest` fails with `ModuleNotFoundError: No module named 'app'` | Run pytest from the backend/ directory so pytest.ini's pythonpath = . applies, or run `cd backend && pytest` |
| `npm run build` succeeds but the app fails type checks later | Run `npm run typecheck` (tsc --noEmit) explicitly; `npm run build` does not type-check |
| Frontend requests are blocked by CORS in the browser console | Confirm the backend's ALLOWED_ORIGINS env var includes the frontend's origin, or run the frontend on the default dev origins (http://localhost:5173 / 127.0.0.1:5173) that app/main.py allows when ALLOWED_ORIGINS is unset |
| Frontend can't reach the API (network errors) | Check VITE_API_BASE_URL matches where the backend is actually running; it defaults to http://localhost:8000 |
| Playwright e2e run can't start the backend | Its webServer command expects a virtualenv at backend/.venv with dependencies installed (`cd backend && python -m venv .venv && .venv/bin/pip install -r requirements.txt`) before running `npm run test:e2e` |
| Calling an expenses/budgets/dashboard/alerts endpoint just returns a stub body | Those routers are scaffolded placeholders (StubResponse); only auth and categories endpoints have real behavior in this repository |
<!-- sdlc:auto:end troubleshooting -->
