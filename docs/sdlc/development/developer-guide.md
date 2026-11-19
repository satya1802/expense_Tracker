# Developer Guide

> Maintained by QuorQ AI SDLC. Text between `sdlc:auto` markers is regenerated; anything outside them is yours and is kept.

<!-- sdlc:auto:start status -->
_Up to date._
<!-- sdlc:auto:end status -->

<!-- sdlc:auto:start source -->
Generated from commit `9da7177` · model `claude-sonnet-5`
<!-- sdlc:auto:end source -->

<!-- sdlc:auto:start overview -->
Expense Tracker is a generated two-part application: a Vite + React 19 single-page app (the approved, reviewed UI, currently running on seeded sample data) and a FastAPI 0.115 backend scaffold. The backend has a SQLAlchemy data model (users, sessions, categories, expenses, budgets, alerts) and fully implements authentication and category management; every other route (expenses, budgets, dashboard, alerts) is a typed stub returning a 'not_implemented' placeholder until a development sprint fills it in. The backend defaults to a local SQLite file so it runs with no external database, but can point at Postgres (matching the docker-compose service) via an environment variable.
<!-- sdlc:auto:end overview -->

<!-- sdlc:auto:start prerequisites -->
- Node.js (for the frontend's Vite 6 / React 19 / TypeScript 5 toolchain)
- Python 3.12 (matches backend/Dockerfile)
- pip
- Docker and Docker Compose (optional, only needed to run the Postgres service in docker-compose.yml)
<!-- sdlc:auto:end prerequisites -->

<!-- sdlc:auto:start setup -->
1. Clone the repository.
2. Backend: cd backend && pip install -r requirements.txt
3. (Optional) To use Postgres instead of the default SQLite file, run `docker-compose up -d db` from the repo root, then set the DATABASE_URL environment variable to point the backend at that database before starting it.
4. Start the backend: uvicorn app.main:app --reload (serves http://localhost:8000; /health is the liveness check).
5. Frontend: cd frontend && npm install
6. (Optional) Set VITE_API_BASE_URL if the backend is not running at the default http://localhost:8000.
7. Start the frontend: npm run dev (serves the SPA, default Vite port 5173, which the backend's CORS config allows by default).
<!-- sdlc:auto:end setup -->

<!-- sdlc:auto:start run -->
| Name | Command | Description |
|---|---|---|
| backend dev | `uvicorn app.main:app --reload` | Runs the FastAPI backend with autoreload; creates tables on startup if they don't exist. |
| frontend dev | `npm run dev` | Starts the Vite dev server for the React SPA. |
| frontend build | `npm run build` | Bundles the frontend for deployment (does not typecheck). |
| frontend preview | `npm run preview` | Serves the production build locally. |
| db up | `docker-compose up -d db` | Starts a local Postgres 16 container for development, per docker-compose.yml. |
<!-- sdlc:auto:end run -->

<!-- sdlc:auto:start structure -->
| Path | Purpose |
|---|---|
| `.devcontainer` | VS Code/Codespaces devcontainer configuration. |
| `.github/workflows` | CI workflow that runs a SonarQube scan and quality gate. |
| `.quorq` | Metadata written by the Quorq AI SDLC platform (handoff/prepared state); not application code. |
| `backend` | FastAPI service: models, schemas, routers, security and tests. |
| `backend/app` | Application package: entrypoint (main.py), database/session setup, SQLAlchemy models, Pydantic schemas, security helpers, seeding. |
| `backend/app/routers` | One router per architecture component (auth, categories, expenses, budgets, dashboard, alerts), mounted via a shared api_router. |
| `backend/tests` | pytest suite split into unit, integration and acceptance tests. |
| `backend/scripts` | Operational scripts, e.g. checking external connections. |
| `frontend` | Vite + React SPA implementing the approved screens. |
| `frontend/src` | Application source: entrypoint (main.tsx), navigation shell (App.tsx), screens, and shared lib code. |
| `frontend/src/screens` | One module per approved screen (Dashboard, Expenses, CategoriesBudgets, Settings, SignIn, SignUp). |
| `frontend/src/lib` | Shared API client (api.ts), UI component/icon vocabulary (ui.tsx, icons.tsx), brand tokens and navigation helpers. |
| `frontend/e2e` | Playwright end-to-end specs run against a locally built app or a deployed URL. |
<!-- sdlc:auto:end structure -->

<!-- sdlc:auto:start conventions -->
- One FastAPI router per architecture component, all collected into a single api_router (backend/app/routers/__init__.py) and mounted once in main.py.
- Unimplemented endpoints return a typed StubResponse ({endpoint, status: 'not_implemented', detail}) rather than failing, so the API and its OpenAPI docs stay complete while handlers are built incrementally.
- Every protected route depends on get_current_user and scopes all queries by that user's id, never by an id supplied in the request.
- Primary keys are UUID4 strings stored as String(36), kept portable between SQLite (dev/test default) and Postgres (deployment target).
- Case-insensitive uniqueness (emails, category names per user) is enforced with functional indexes on lower(column), not database collation.
- Validation errors are returned as a custom {detail: [{field, message}]} shape via a FastAPI exception handler, not Pydantic's default error shape.
- Frontend screens live one-per-file under src/screens/ and are written against the shared component/icon vocabulary in src/lib/ui.tsx and src/lib/icons.tsx.
- All backend API calls from the frontend go through the single apiFetch helper in src/lib/api.ts, which attaches the bearer token and centrally handles 401s by clearing the session and invoking a registered handler.
- Frontend component tests sit beside the component they cover (e.g. CategoriesBudgets.test.tsx); Playwright e2e specs live separately under e2e/.
<!-- sdlc:auto:end conventions -->

<!-- sdlc:auto:start testing -->
| Name | Command | Description |
|---|---|---|
| backend unit/integration/acceptance tests | `cd backend && pytest` | Runs the full pytest suite (unit, integration, acceptance) against the SQLite-backed app. |
| backend lint | `cd backend && ruff check .` | Lints the backend Python code. |
| backend format check | `cd backend && ruff format .` | Formats backend Python code with ruff. |
| frontend unit tests | `cd frontend && npm test` | Runs Vitest component tests with coverage reporting. |
| frontend lint | `cd frontend && npm run lint` | Runs ESLint over the frontend; used as a development gate. |
| frontend typecheck | `cd frontend && npm run typecheck` | Runs tsc --noEmit (not run automatically by build). |
| frontend e2e install | `cd frontend && npm run test:e2e:install` | Installs the Chromium browser Playwright needs. |
| frontend e2e tests | `cd frontend && npm run test:e2e` | Runs Playwright specs from e2e/; without E2E_BASE_URL it boots a local backend (expects a Python venv at backend/.venv) and a built frontend preview. |
<!-- sdlc:auto:end testing -->

<!-- sdlc:auto:start troubleshooting -->
| Problem | Solution |
|---|---|
| Frontend requests to the backend are blocked by CORS. | Set the backend's ALLOWED_ORIGINS environment variable to a comma-separated list including the frontend's origin; it defaults to the Vite dev server origins (http://localhost:5173, http://127.0.0.1:5173). |
| `pytest` fails with an ImportError for `app` when run from the repo root. | Run pytest from inside backend/ (pytest.ini sets pythonpath = . relative to that directory). |
| Protected endpoints return 401 even after signing in. | Confirm the SPA stored the token from /auth/signup or /auth/login (src/lib/api.ts setSessionToken) and that it is sent as a Bearer token; a 401 from any non-/auth/ endpoint clears the stored token and redirects to sign-in. |
| `npm run test:e2e` cannot start the backend. | Playwright's webServer config expects a virtualenv at backend/.venv with the backend's dependencies installed; create it and run `pip install -r requirements.txt` there before running the e2e suite. |
| Need Postgres instead of the default SQLite file. | Run `docker-compose up -d db` to start Postgres 16 locally, then set DATABASE_URL to a connection string for that service (user/db name 'app', password as configured in docker-compose.yml) before starting uvicorn. |
<!-- sdlc:auto:end troubleshooting -->
