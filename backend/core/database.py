import asyncpg
from core.config import settings
import logging
from fastapi import HTTPException

logger = logging.getLogger(__name__)
_pool = None


def is_database_connected() -> bool:
    return _pool is not None


async def init_db():
    global _pool
    if not settings.DATABASE_URL:
        logger.warning("DATABASE_URL is not configured; database-backed API endpoints are disabled")
        return

    try:
        _pool = await asyncpg.create_pool(
            settings.DATABASE_URL,
            min_size=2,
            max_size=10,
            command_timeout=60,
        )
        logger.info("Database pool initialized")
    except Exception as e:
        logger.error(f"Database init failed: {e}")
        raise


async def get_db():
    if _pool is None:
        raise HTTPException(
            status_code=503,
            detail="Database-backed features are unavailable. Configure DATABASE_URL to enable them.",
        )
    async with _pool.acquire() as conn:
        yield conn
