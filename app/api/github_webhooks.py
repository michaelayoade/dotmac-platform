"""GitHub Webhooks API — unauthenticated endpoint for receiving push events."""

from __future__ import annotations

import json
import logging
from uuid import UUID

from fastapi import APIRouter, HTTPException, Request, Response
from sqlalchemy.orm import Session

from app.rate_limit import github_webhook_limiter

logger = logging.getLogger(__name__)

router = APIRouter(prefix="/github-webhooks", tags=["github-webhooks"])


@router.post("/push/{repo_id}")
async def receive_push(
    repo_id: UUID,
    request: Request,
) -> Response:
    """Receive a GitHub push webhook event.

    This endpoint is unauthenticated — validation is done via HMAC signature.
    Processing is offloaded to a Celery task for fast response.
    """
    github_webhook_limiter.check(request)

    body = await request.body()
    signature = request.headers.get("X-Hub-Signature-256", "")
    event_type = request.headers.get("X-GitHub-Event", "")

    from app.db import SessionLocal

    db: Session = SessionLocal()
    try:
        from app.services.github_webhook_service import GitHubWebhookService

        svc = GitHubWebhookService(db)
        result = svc.receive_push_event(repo_id, body, signature, event_type)
        db.commit()
        return Response(status_code=200, content=json.dumps(result))
    except ValueError as e:
        raise HTTPException(status_code=400, detail=str(e))
    except PermissionError:
        raise HTTPException(status_code=403, detail="Invalid signature")
    finally:
        db.close()
