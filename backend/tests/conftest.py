import sys
import uuid
from pathlib import Path

# Add backend to sys.path so `app.*` imports work
sys.path.insert(
    0,
    str(Path(__file__).resolve().parent.parent.parent / "backend"),
)

import pytest  # noqa: E402
from fastapi.testclient import TestClient  # noqa: E402
from sqlalchemy import create_engine, pool, text  # noqa: E402

from app.config import settings  # noqa: E402
from app.database import get_db  # noqa: E402
from app.main import app  # noqa: E402

sync_url = settings.database_url.replace("+asyncpg", "+psycopg2")
sync_engine = create_engine(sync_url)

# Test-specific async engine with NullPool to avoid
# stale connection issues between TestClient sessions
from sqlalchemy.ext.asyncio import (  # noqa: E402
    AsyncSession,
    async_sessionmaker,
    create_async_engine,
)

test_async_engine = create_async_engine(
    settings.database_url, poolclass=pool.NullPool
)
test_async_session = async_sessionmaker(
    test_async_engine,
    class_=AsyncSession,
    expire_on_commit=False,
)


async def _test_get_db():
    async with test_async_session() as session:
        yield session


@pytest.fixture()
def test_name():
    return f"test_{uuid.uuid4().hex[:8]}"


@pytest.fixture()
def client():
    app.dependency_overrides[get_db] = _test_get_db
    with TestClient(app) as c:
        yield c
    app.dependency_overrides.clear()


@pytest.fixture(autouse=True)
def cleanup_samples(test_name):
    yield
    with sync_engine.connect() as conn:
        conn.execute(
            text("DELETE FROM samples WHERE product_name LIKE :pat"),
            {"pat": f"%{test_name}%"},
        )
        conn.commit()
