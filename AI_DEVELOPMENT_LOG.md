# AI Development Log

## Tools Used

- **Claude Code** (claude-sonnet-4-6) — primary AI assistant throughout the project
- **Playwright MCP** — browser automation server, used for UI validation and testing
- **Context7 MCP** — fetches up-to-date library documentation (FastAPI, SQLAlchemy, React, etc.)
- **Claude Code Agents** — specialized sub-agents from [msitarzewski/agency-agents](https://github.com/msitarzewski/agency-agents), filtered to keep only engineering and testing agents relevant to this project

---

## How We Managed This Log

We updated this log at each major milestone, not at the end. After each step we paused and noted:
- What the AI generated
- What worked well
- What we changed or rejected and why
- How we validated the output

---

## Milestones

### 1. Init Project
- Install `uv`, latest Python, `.venv`
- Add `ruff` (linter), `alembic` (migrations), `pytest` (backend tests), `playwright` (UI tests)

### 2. Backend
- FastAPI app structure
- Pydantic models (request/response schemas)
- SQLAlchemy models (`Sample`)
- Database connection (PostgreSQL)
- Endpoints: `POST /samples`, `GET /samples`, `GET /samples/{id}`
- Verification logic (simulated)

### 3. Frontend
- React 18 + TypeScript (Vite)
- ESLint (linter) + Prettier (formatter)
- Submit form view
- Results table view
- Detail view

### 4. Tests
- Backend: `pytest` — endpoints + verification logic
- Frontend: `playwright` — submit form, results table, detail view

### 5. Docker
- `Dockerfile` for backend
- `Dockerfile` for frontend
- `docker-compose.yml` — API + frontend + PostgreSQL

### 6. Docs
- `README.md`
- Finalize `AI_DEVELOPMENT_LOG.md`

---

## Effective Prompting — Examples

| Prompt | Result | Notes |
|--------|--------|-------|
| | | |

---

## Where We Overrode AI Suggestions

| Step | AI suggested | We chose | Reason |
|------|-------------|----------|--------|
| | | | |

---

## Reflections

_Written at the end of development._

**What the AI did well:**

**Where human judgment was essential:**

**What we would do differently:**
