# Project: Origin Trace API

Take-home assignment for Oritain — a full-stack app for submitting product samples and running simulated geographic origin verification.

## Stack

- **Backend:** Python 3.13, FastAPI, SQLAlchemy, Alembic, PostgreSQL (`asyncpg`)
- **Frontend:** React 18, TypeScript, Vite, ESLint, Prettier
- **Tests:** pytest + pytest-asyncio + httpx (backend), Playwright (frontend)
- **Package manager:** uv (backend), npm (frontend)
- **Linter:** ruff (backend), ESLint + Prettier (frontend)

## Project Structure

```
OritainTaskAI/
├── backend/          # FastAPI app
│   ├── app/          # Application code
│   ├── migrations/   # Alembic migrations
│   ├── pyproject.toml
│   └── .pre-commit-config.yaml
├── tests/            # All tests (shared root)
│   ├── backend/      # Backend pytest tests
│   └── frontend/     # Frontend Playwright tests (future)
├── frontend/         # React + TypeScript app
├── docker-compose.yml
├── README.md
└── AI_DEVELOPMENT_LOG.md
```

## Common Commands

### Backend
```bash
cd backend
uv run uvicorn app.main:app --reload   # run dev server
uv run alembic upgrade head            # run migrations
uv run pytest ./tests/                 # run tests
uv run ruff check .                    # lint
uv run ruff format .                   # format
```

### Frontend
```bash
cd frontend
npm install
npm run dev       # run dev server
npm run lint      # lint
npm run format    # format
npm run test      # playwright tests
```

## Conventions

- All backend code lives under `backend/app/`
- Pydantic models for request/response schemas, SQLAlchemy models for DB
- Keep ruff rules: line length 80, rules E, F, I, B, UP, W, ignore B008
- No auth, no caching — keep it simple
- Commit after each meaningful milestone
- Update `AI_DEVELOPMENT_LOG.md` at each milestone
