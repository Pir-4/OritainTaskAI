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

#### Effective Prompting

| Prompt | Result | Notes |
|--------|--------|-------|
| Pasted own ruff config directly instead of describing preferences | AI adopted it exactly without rewriting | Providing a concrete example worked better than describing preferences in words |
| "I added agents to the .claude/agents folder. Could you analyse them and identify which ones are not needed for this project?" | AI analysed 100+ agents across all folders and returned a structured, grouped list with one-line descriptions | Saved significant time — manually reading 100+ agent files would have taken much longer. A short, clear prompt with context was enough |

#### Where We Overrode AI Suggestions

| Step | AI suggested | We chose | Reason |
|------|-------------|----------|--------|
| Ruff config | `line-length = 88`, rules `E,F,I,UP` | `line-length = 80`, rules `E,F,I,B,UP,W` + `ignore`, `fixable`, `indent-style` | Personal standard based on work experience |
| Database | SQLite (acceptable per task) | PostgreSQL + asyncpg | Better tool, matches real-world requirements |
| Agent filtering execution | AI started deleting engineering agents we agreed to keep | User stopped the command immediately | AI made an execution error — the suggested list was correct but it was applied incorrectly. Human review caught it before any damage |
| Test dependencies | AI added `httpx` without asking, alongside `pytest-asyncio` | Accepted silently at the time | Not noticed during review — a reminder to check AI-generated dependency lists carefully |

---

### 2. Backend
- FastAPI app structure
- Pydantic models (request/response schemas)
- SQLAlchemy models (`Sample`)
- Database connection (PostgreSQL)
- Endpoints: `POST /samples`, `GET /samples`, `GET /samples/{id}`
- Verification logic (simulated)

---

### 3. Frontend
- React 18 + TypeScript (Vite)
- ESLint (linter) + Prettier (formatter)
- Submit form view
- Results table view
- Detail view

---

### 4. Tests
- Backend: `pytest` — endpoints + verification logic
- Frontend: `playwright` — submit form, results table, detail view

---

### 5. Docker
- `Dockerfile` for backend
- `Dockerfile` for frontend
- `docker-compose.yml` — API + frontend + PostgreSQL

---

### 6. Docs
- `README.md`
- Finalize `AI_DEVELOPMENT_LOG.md`

---

## Reflections

_Written at the end of development._

**What the AI did well:**

**Where human judgment was essential:**

**What we would do differently:**
