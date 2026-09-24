"""Routes for the separately deployed AI assistant."""

import httpx
from fastapi import APIRouter, HTTPException, status

from app.core.config import get_settings
from app.schemas.ai import AssistantQuery, AssistantResponse

router = APIRouter()


@router.post("/assistant", response_model=AssistantResponse)
async def ask_assistant(payload: AssistantQuery):
    """Forward a conversation prompt to the deployed Flask AI service."""
    settings = get_settings()
    if not settings.AI_FLASK_URL:
        raise HTTPException(
            status_code=status.HTTP_503_SERVICE_UNAVAILABLE,
            detail="The AI assistant is not configured yet.",
        )

    try:
        async with httpx.AsyncClient(timeout=30.0) as client:
            response = await client.post(
                settings.AI_FLASK_URL,
                json={"prompt": payload.prompt, "context": payload.context},
            )
            response.raise_for_status()
    except httpx.HTTPError as error:
        raise HTTPException(
            status_code=status.HTTP_502_BAD_GATEWAY,
            detail="The AI assistant could not be reached.",
        ) from error

    data = response.json()
    answer = data.get("answer") or data.get("response") or data.get("message")
    if not isinstance(answer, str) or not answer.strip():
        raise HTTPException(
            status_code=status.HTTP_502_BAD_GATEWAY,
            detail="The AI assistant returned an invalid response.",
        )

    sources = data.get("sources", [])
    return AssistantResponse(
        answer=answer,
        sources=sources if isinstance(sources, list) else [],
    )
