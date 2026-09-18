"""
AI-powered service routes: information assistant, programme
recommendations, knowledge retrieval, document analysis, etc.
TODO: implement against app.services.ai (provider-agnostic wrapper).
"""

from fastapi import APIRouter
from app.schemas.ai import AssistantQuery, AssistantResponse

router = APIRouter()


@router.post("/assistant", response_model=AssistantResponse)
async def ask_assistant(payload: AssistantQuery):
    """TODO: route to the configured AI provider via app.services.ai."""
    raise NotImplementedError
