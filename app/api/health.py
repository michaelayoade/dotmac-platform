import datetime
from typing import Dict, Any

from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session

from app.db import get_engine
from sqlalchemy import text

router = APIRouter()


@router.get("/health")
async def health_check() -> Dict[str, Any]:
    """
    Health check endpoint that returns status, timestamp, and database connectivity.
    """
    timestamp = datetime.datetime.now(datetime.timezone.utc).isoformat()
    
    # Check database connectivity
    db_status = "ok"
    try:
        engine = get_engine()
        with engine.connect() as connection:
            # Execute a simple query to check database connectivity
            connection.execute(text("SELECT 1"))
    except Exception as e:
        db_status = f"error: {str(e)}"
    
    return {
        "status": "ok",
        "timestamp": timestamp,
        "database": db_status
    }
