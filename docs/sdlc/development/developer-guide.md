# Developer Guide

> Maintained by QuorQ AI SDLC. Text between `sdlc:auto` markers is regenerated; anything outside them is yours and is kept.

<!-- sdlc:auto:start status -->
_Up to date._
<!-- sdlc:auto:end status -->

<!-- sdlc:auto:start source -->
Generated from commit `62613a2` · model `claude-sonnet-5`
<!-- sdlc:auto:end source -->

<!-- sdlc:auto:start overview -->
Expense Tracker is a generated two-part project from the Quorq AI SDLC platform: a React 19 + Vite single-page frontend that renders approved screens against seeded sample data, and a FastAPI 0.115 backend scaffold that currently exposes only a health-check endpoint. The backend uses SQLAlchemy over a local SQLite file by default (swappable for Postgres via DATABASE_URL) and ships with typed stub responses so its OpenAPI contract is stable while real handlers are written. The frontend has a prepared API client (src/lib/api.ts) for wiring screens to the backend, but no screen uses it yet.
<!-- sdlc:auto:end overview -->

<!-- sdlc:auto:start prerequisites -->
- Node.js (for the frontend, per package.json engines and Vite 6 tooling)
- npm
- Python 3.12 (matches backend/Dockerfile)
- pip
- Docker and Docker Compose (optional, for the Postgres service in docker-compose.yml)
<!-- sdlc:auto:end prerequisites -->

<!-- sdlc:auto:start setup -->
1. Clone the repository
2. Copy .env.example to .env and fill in values as needed
3. cd frontend && npm install
4. cd backend && pip install -r requirements.txt
5. (optional) docker compose up -d to start the Postgres 16 database defined in docker-compose.yml, then set DATABASE_URL to point at it instead of the default SQLite file
6. (optional) cd frontend && npm run test:e2e:install to fetch the Playwright Chromium browser before running e2e tests
<!-- sdlc:auto:end setup -->

<!-- sdlc:auto:start run -->
| Name | Command | Description |
|---|---|---|
| frontend dev | `cd frontend && npm run dev` | Starts the Vite dev server for the React SPA |
| frontend build | `cd frontend && npm run build` | Bundles the frontend app (does not typecheck) |
| frontend preview | `cd frontend && npm run preview` | Serves the production build locally |
| frontend typecheck | `cd frontend && npm run typecheck` | Runs tsc --noEmit to check types |
| backend dev | `cd backend && uvicorn app.main:app --reload` | Starts the FastAPI backend with auto-reload, creating SQLite tables on startup |
| db up | `docker compose up -d` | Starts the Postgres 16 database container defined in docker-compose.yml |
<!-- sdlc:auto:end run -->

<!-- sdlc:auto:start structure -->
| Path | Purpose |
|---|---|
| `frontend` | Vite + React 19 SPA; approved screens running on seeded sample data |
| `frontend/src` | Application source: main entry, API client, UI/icon libraries, styles |
| `frontend/e2e` | Playwright acceptance tests and support fixtures |
| `backend` | FastAPI service scaffold with health check and no implemented features yet |
| `backend/app` | App package: entrypoint (main.py), database setup, SQLAlchemy models, Pydantic schemas, routers package |
| `backend/tests` | Unit and integration tests (e.g. health check integration test) |
| `.github/workflows` | CI workflow: SonarQube scan job |
| `.devcontainer` | Devcontainer configuration for a consistent dev environment |
| `.quorq` | Platform handoff metadata (not application code) |
<!-- sdlc:auto:end structure -->

<!-- sdlc:auto:start conventions -->
- Backend organized as one router per architecture component owning endpoints; routers live under backend/app/routers
- Unimplemented routes return a typed StubResponse (schemas.py) with status 'not_implemented' so the API stays startable and documented
- SQLAlchemy models all inherit from the shared Base in app/database.py; tables are created from models at app startup via lifespan, with no migrations yet
- Backend configuration is environment-variable driven (DATABASE_URL, ALLOWED_ORIGINS) with safe local defaults (SQLite, localhost CORS origins)
- Frontend path alias '@' maps to src/ (configured in both vite.config.ts and tsconfig.json)
- Frontend component tests live beside the components they cover and are matched by src/**/*.{test,spec}.{ts,tsx}; Playwright specs live separately under e2e/ to avoid collection conflicts
- Frontend API client (src/lib/api.ts) centralizes base URL resolution, bearer-token auth (session token in localStorage, falling back to a shared secret), and fetch error handling
- Code style enforced via ESLint/Prettier (frontend) and ruff (backend)
<!-- sdlc:auto:end conventions -->

<!-- sdlc:auto:start testing -->
| Name | Command | Description |
|---|---|---|
| frontend unit tests | `cd frontend && npm test` | Runs Vitest component tests |
| frontend lint | `cd frontend && npm run lint` | Runs ESLint over the frontend codebase |
| frontend e2e | `cd frontend && npm run test:e2e` | Runs Playwright acceptance tests from e2e/, booting backend and frontend locally unless E2E_BASE_URL is set |
| backend tests | `cd backend && pytest` | Runs backend unit and integration tests (e.g. health check) |
| backend lint | `cd backend && ruff check .` | Lints the backend code with ruff |
<!-- sdlc:auto:end testing -->

<!-- sdlc:auto:start troubleshooting -->
| Problem | Solution |
|---|---|
| Frontend cannot reach the backend / CORS errors in the browser console | Ensure the backend is running and set ALLOWED_ORIGINS on the backend to include the frontend's origin (defaults to http://localhost:5173 and http://127.0.0.1:5173 in development) |
| `pytest` fails with ModuleNotFoundError: No module named 'app' | Run pytest from the backend/ directory; pytest.ini sets pythonpath = . so 'app' resolves only from there |
| Playwright e2e tests fail to launch a browser | Run npm run test:e2e:install first to fetch the Chromium browser |
| Backend fails to connect to a database | By default DATABASE_URL is unset and the app uses a local SQLite file (sqlite:///./app.db); if you set DATABASE_URL to Postgres, ensure the docker compose db service is up (docker compose up -d) before starting uvicorn |
| `npm run build` succeeds but the app has type errors | Run npm run typecheck (tsc --noEmit) separately, since build does not typecheck |
<!-- sdlc:auto:end troubleshooting -->
