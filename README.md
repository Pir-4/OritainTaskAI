# Origin Trace API

Full-stack app for submitting product samples and running simulated geographic origin verification.

**Stack:** FastAPI · PostgreSQL · React 18 + TypeScript · Docker

---

## Quick start (Docker)

```bash
docker compose up --build
```

| Service  | URL                       |
|----------|---------------------------|
| Frontend | http://localhost:3000      |
| API      | http://localhost:8000      |
| API docs | http://localhost:8000/docs |

---

## Local development

### Prerequisites

- Python 3.13, [`uv`](https://github.com/astral-sh/uv)
- Node.js 20, npm
- Docker (for PostgreSQL)

### Backend

```bash
# Start the database
docker compose up -d db

# Install dependencies and run migrations
cd backend
uv sync
uv run alembic upgrade head

# Start the dev server
uv run uvicorn app.main:app --reload
```

API available at `http://localhost:8000`. Interactive docs at `/docs`.

### Frontend

```bash
cd frontend
npm install
npm run dev
```

App available at `http://localhost:5173`.

---

## API reference

### `POST /samples/`

Submit a new product sample.

```json
{
  "product_name": "Manuka Honey",
  "claimed_origin": "New Zealand",
  "sample_data": {
    "isotope_ratio_o18": -2.85,
    "isotope_ratio_c13": -25.1,
    "trace_element_sr": 0.7091
  }
}
```

Returns the created sample with a `status` of `verified`, `failed`, or `inconclusive`.

### `GET /samples/`

List all submitted samples.

### `GET /samples/{id}`

Get a single sample with its verification result.

---

## Running tests

### Backend

```bash
cd backend
uv run pytest tests/ -v
```

Requires the database to be running (`docker compose up -d db`).

### Frontend (Playwright)

```bash
# Requires the backend API to be running on port 8000
cd frontend/tests
npm install
npx playwright install chromium
npm test
```

Playwright starts the frontend dev server automatically.
