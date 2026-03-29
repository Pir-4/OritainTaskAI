# AI Development Log

## Reflections

### Which AI tools you used and for what purpose

The primary model throughout the project was **claude-sonnet-4-6**, used for all code generation, planning, and implementation tasks. For complex planning and reasoning steps, **claude-opus-4-6** was used occasionally — though it exhausted the usage limit mid-session during the backend milestone, which reinforced the preference for Sonnet for routine code generation.

Beyond the base model, several specialised tools were used:

- **Claude Code** (claude-sonnet-4-6) — primary AI assistant for all implementation: scaffolding, writing backend and frontend code, updating tests, and generating the README
- **Software Architect agent** — used at the start of each milestone to decompose the task into phases, identify file-level impact, and produce a dependency-ordered implementation plan
- **QA Tester agent** — used alongside the Architect to produce a test plan before implementation started
- **Code Reviewer agent** — run after implementation to catch issues; used twice per milestone (once after initial generation, once after fixes to confirm all issues were resolved)
- **Playwright MCP** — browser automation for manual UI validation; used to navigate the running app and verify all three views worked before writing automated tests
- **Context7 MCP** — fetched up-to-date documentation for FastAPI, SQLAlchemy, and React during implementation

### Examples of effective prompting

**Planning prompt (used at the start of each milestone):**

> "Before starting, create a plan. Read the original requirements and the milestone description. Use the Architect agent to decompose the task into small steps and identify what can run in parallel. Use the QA agent for a test plan. Key constraints: [list of specific constraints for the milestone]."

Providing all constraints upfront in a single prompt — rather than correcting the AI mid-implementation — consistently produced more accurate output with fewer back-and-forth rounds.

**Schema correction prompt (Milestone 4):**

> Pasted the raw requirements JSON directly and asked the Architect agent to plan how to change the app, including migration strategy, noting that random values could be generated for existing data.

Giving the agent the raw requirement rather than a paraphrase produced a precise plan. The hint about migrations ("maybe delete all") let the agent confirm and justify that recommendation rather than defaulting to a forward-only migration.

**Error fixing:**

When the dev server failed to start, the AI was asked to diagnose the error from the output rather than guess. Providing the actual error message (e.g. Node.js version incompatibility with Vite 8) let it identify the root cause immediately and apply a targeted fix.

### Where we chose NOT to follow AI suggestions

**Project setup:** The AI described a setup process, but the init steps — installing `uv`, configuring Python, setting up the virtual environment — were done manually. It is faster to run these commands directly than to describe preferences and have the AI generate them. The AI was brought in after the environment was ready.

**Final review before PR:** Before creating each pull request, a manual review of all changed files was done independently. AI-generated code was not merged on trust alone — the review caught issues like the NullPool being placed in production code, and the `raise_server_exceptions=False` flag hiding real errors in tests.

**Ruff configuration:** The AI defaulted to its own style preferences. The project's existing ruff config (line length 80, specific rule sets) was pasted in directly so the AI adopted it exactly rather than rewriting it.

### How you validated AI-generated code

- **Code Reviewer agent** — run after each implementation phase; the first pass typically caught 5–8 issues, the second pass confirmed they were resolved
- **Tests** — the AI was asked to write tests as part of each milestone, not after. Backend tests used real database connections with no mocks; Playwright tests covered all three frontend views end-to-end
- **Manual checks** — the running app was opened and exercised manually (via Playwright MCP and direct curl) before the automated tests were written, to catch obvious failures early
- **Linting and formatting** — ruff (backend) and ESLint + Prettier (frontend) were run after every implementation phase; issues flagged by the linter were fixed before moving on. Refactoring was not done manually — the linter and formatter handled code style concerns

---

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

#### What AI Generated
- `uv init` backend project scaffold with `pyproject.toml`, `.python-version`, `.venv`
- `ruff` and `pre-commit` configuration in `pyproject.toml` and `.pre-commit-config.yaml`
- `alembic init` migrations folder with `env.py`, `script.py.mako`, `alembic.ini`
- `.claude/CLAUDE.md` with project context, stack, commands, and conventions
- Analysis of 100+ agents from the external repo with grouped descriptions

#### How We Validated
- **Pre-commit hook** — observed ruff auto-fix alembic files on the first commit attempt, then pass cleanly on the second. Confirmed the hook was working correctly.
- **pyproject.toml** — manually read through after generation, caught the ruff config mismatch and replaced with personal standard.
- **alembic init** — intentionally deferred; will review `env.py` when models and migrations are generated.
- **CLAUDE.md** — manually read through after generation, approved as accurate.
- **Agent list analysis** — spotted AI execution error before commit, manually reviewed remaining files before approving deletions.

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
- Tests: `pytest` — endpoints + verification logic
- `docker-compose.yml` — PostgreSQL
- `Dockerfile` for backend
- `docker-compose.yml` + API

#### What AI Generated
- Full app structure under `backend/app/`: `config.py`, `database.py`, `models.py`, `schemas.py`, `routes.py`, `verification.py`, `main.py`
- `VerificationStatus` as `StrEnum`, deterministic `verify(id)` using `id % 3` mapping to `verified / failed / inconclusive`
- Async SQLAlchemy engine with `async_sessionmaker` and `get_db` dependency
- Alembic `env.py` rewritten for async engine pattern (`run_sync` + `asyncio.run`)
- Autogenerated migration for `samples` table
- `docker-compose.yml` with PostgreSQL 16, health check, named volume `pgdata`
- `Dockerfile` with `uv sync --frozen --no-dev`, runs `alembic upgrade head` before starting uvicorn
- CORS middleware for React frontend origin
- 13 tests: 6 unit tests for `verify()`, 7 E2E endpoint tests — sync, no mocks, real DB

#### How We Validated
- **Lint** — ruff caught `str + Enum` pattern and suggested `StrEnum`; caught `AsyncGenerator[T, None]` with unnecessary type arg; both auto-fixed
- **Manual curl** — tested all three endpoints via `curl` against running dev server before writing tests
- **Manual app check** — after generation, manually ran the application and verified it worked end-to-end before proceeding to tests
- **pytest** — 13/13 passed; initial run revealed stale connection bug (wrong fix applied first — see overrides)
- **Docker build** — `docker compose build api` ran successfully end-to-end
- **Code review** — ran two passes of the Code Reviewer agent; second pass confirmed all issues resolved

#### Effective Prompting

| Prompt | Result | Notes |
|--------|--------|-------|
| "Before starting, create a plan. Read the original requirements and backend milestone. Use the Architect agent to decompose the task into small steps and identify what can run in parallel. Use the QA agent for a test plan. Key constraints: simple verification logic based on `id % 3`; use PostgreSQL in Docker; be careful with Alembic — ruff deletes unused imports so use `#noqa`; use sync pytest because async tests are harder to debug; use E2E tests without mocks to validate real app logic." | AI spawned Software Architect + QA Tester agents in parallel and returned a full implementation plan with dependency graph + test plan | Providing all constraints and agent roles in one prompt avoided back-and-forth. Specifying which agents to use and what to focus on produced more targeted output than a generic "make a plan" request |
| Provided all constraints upfront in agent prompts (sync tests, NullPool, `id % 3` logic, `#noqa` for Alembic) | AI followed all constraints without needing corrections | Specific, complete context in the initial prompt avoids back-and-forth |
| Ran Code Reviewer agent twice — after implementation and after fixes | Caught 8 issues first pass, confirmed all resolved on second pass | Using reviewer as a checkpoint rather than self-reviewing caught things that would have been missed |
| Accidentally switched to Opus 4.6 during code generation | Opus produced the code correctly, but exhausted the usage limit mid-session | Model selection matters for cost — Sonnet is sufficient for code generation; Opus should be reserved for complex planning or reasoning tasks only |

#### Where We Overrode AI Suggestions

| Step | AI suggested | We chose | Reason |
|------|-------------|----------|--------|
| NullPool fix | Put `NullPool` in `database.py` (production code) | `NullPool` only in test `conftest.py` via `dependency_overrides` | Reviewer flagged it — NullPool on production engine would degrade performance under load |
| Test cleanup | `TRUNCATE samples RESTART IDENTITY CASCADE` (deletes everything) | Delete only rows created during the test, identified by unique `test_name` in `species` | Truncating all rows is dangerous if tests accidentally run against a non-test database |
| Docker volume | `/tmp/agapitov_oritain/data` (host path) | Named Docker volume `pgdata` | `/tmp` is cleared on reboot; named volumes are portable and work on any machine |
| `raise_server_exceptions=False` on TestClient | AI added it to suppress errors | Removed | It hides real 500s — bugs would silently return a response instead of failing the test |

---

### 3. Frontend
- React 18 + TypeScript (Vite)
- ESLint (linter) + Prettier (formatter)
- Submit form view
- Results table view
- Detail view
- Tests: `playwright` — submit form, results table, detail view
- `Dockerfile` for frontend
- `docker-compose.yml` + frontend

#### What AI Generated
- Full component set: `Nav.tsx`, `SubmitForm.tsx`, `SampleTable.tsx`, `SampleDetail.tsx`, `App.tsx`
- Typed API client in `src/api/client.ts` with `VITE_API_URL` env var
- Shared TypeScript types in `src/types/sample.ts`
- View state machine in `App.tsx` using `useState` with discriminated union type — no React Router
- `data-testid` attributes on all interactive elements for Playwright targeting
- Plain CSS in `App.css` and `index.css` — status badge colors, form layout, detail definition list, nav bar
- 8 Playwright test files: config, fixtures, 3 page objects (POM pattern), 3 spec files (12 tests total)
- Multi-stage `Dockerfile` — `node:22-alpine` builder + `nginx:alpine` server
- `nginx.conf` with SPA fallback (`try_files`) and gzip
- Frontend service added to `docker-compose.yml` on port 3000

#### How We Validated
- **ESLint** — caught `react-hooks/set-state-in-effect` rule violation (`setLoading(true)` synchronously in `useEffect`); fixed by adding `key={view.id}` on `SampleDetail` so React remounts on id change, making the synchronous reset unnecessary
- **TypeScript** — `tsc -b --noEmit` confirmed clean after fixing `import type` and discriminated union narrowing issues
- **Playwright MCP** — used browser automation to open the running app and verify the UI manually; AI navigated to the app, waited for data to load, and confirmed all three views worked correctly
- **Manual error reporting** — AI asked the user to provide the error output after running the dev server, which revealed the Node.js version incompatibility with Vite 8; AI then diagnosed and fixed it

#### Effective Prompting

| Prompt | Result | Notes |
|--------|--------|-------|
| "Before starting, create a plan. Use the Architect agent to decompose the task into small steps and identify what can run in parallel. Use the QA agent for a test plan." | AI returned a full implementation plan with dependency graph and phase breakdown | Same pattern as backend — plan-first with agent roles specified produced a clear, actionable breakdown |
| Launched Playwright tests agent and Docker agent in parallel after Phase 2 was complete | Both completed independently without conflicts | Phases 3 and 4 had no shared files, so parallel execution saved time |

#### Where We Overrode AI Suggestions

| Step | AI suggested | We chose | Reason |
|------|-------------|----------|--------|
| Test folder location | `tests/frontend/` at project root (matching backend pattern) | `frontend/tests/` inside the frontend folder | User preference — keeps frontend self-contained |
| Vite 8 | Used by default from `npm create vite@latest` | Downgraded to Vite 5.x | Vite 8 requires Node.js 20.19+; machine has 20.13.1 — discovered when trying to run the dev server |
| CORS origins | Only `http://localhost:5173` (dev server) | Added `http://localhost:3000` (Docker nginx) | Discovered via Playwright MCP check — the app loaded but showed "Failed to fetch" because the Docker-served frontend was blocked by CORS; AI asked user to provide the error, diagnosed it, and added the missing origin |

---

### 4. Integration & Documentation
- Corrected sample schema to match requirements (`product_name`, `claimed_origin`, nested `sample_data` with isotope/trace fields)
- Dropped old migrations, regenerated a single clean migration
- Updated all backend models, schemas, routes, and tests end-to-end
- Updated all frontend types, components, page objects, and Playwright specs
- Created `README.md` with Docker quick start, local dev setup, API reference, and test instructions

#### What AI Generated
- Full schema migration plan via Software Architect agent — identified every file that needed changing, recommended dropping migrations over a forward-only migration, and produced a phased implementation plan with parallelism noted
- Updated `models.py`: replaced `species`, `origin_country`, `collected_at` with `product_name`, `claimed_origin`, and three `Float` columns
- Updated `schemas.py`: added `SampleData` nested Pydantic model; `SampleResponse` uses `@model_validator(mode='before')` to assemble flat ORM columns into nested `sample_data` for the response
- Updated `routes.py`: unpacks `data.sample_data.*` when constructing ORM objects
- Fresh Alembic migration via `alembic revision --autogenerate`
- Updated backend tests: new `_sample()` helper with `sample_data`, renamed field assertions, added `test_create_sample_missing_sample_data`
- Updated frontend: `sample.ts` types, all three components (`SubmitForm`, `SampleTable`, `SampleDetail`), test fixtures, page objects, and all three Playwright spec files
- Added `randomSampleData()` helper in test fixtures to generate plausible float values
- `README.md`: minimal, clear — Docker one-liner, local dev steps for both backend and frontend, API payload example, test commands

#### How We Validated
- **Backend tests** — 13/13 passed after migration reset and schema update; no regressions
- **ruff lint + format** — clean on the first run, no manual fixes needed
- **TypeScript** — `tsc -b --noEmit` clean; ESLint clean
- **Migration** — `alembic upgrade head` applied cleanly against the live Docker Postgres instance

#### Effective Prompting

| Prompt | Result | Notes |
|--------|--------|-------|
| Pasted the raw requirements JSON and asked the Architect agent to plan how to change the app, including migration strategy and noting we can create random values for existing items | Agent read all relevant files and returned a full phased plan with exact file-by-file impact and a clear migration recommendation (drop + recreate vs. forward migration) | Giving the agent the raw requirement rather than a paraphrase produced a more precise plan; specifying "maybe delete all migrations" as a hint let it confirm that recommendation with reasoning |

#### Where We Overrode AI Suggestions

| Step | AI suggested | We chose | Reason |
|------|-------------|----------|--------|
| Schema change approach | Forward-only migration with `ALTER TABLE RENAME COLUMN` | Drop all migrations and create a single fresh one | AI itself recommended this for a dev environment — accepted without override |
| `collected_at` removal | Keep as optional field for backward compatibility | Remove entirely | Field is not in the requirements; keeping dead fields adds noise |

---

