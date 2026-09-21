"""Pydantic schemas for AI-assistant style endpoints."""

from typing import Optional
from pydantic import BaseModel


class AssistantQuery(BaseModel):
    prompt: str
    context: Optional[str] = None  # TODO: define richer context (user role, page, etc.)


class AssistantResponse(BaseModel):
    answer: str
    sources: list[str] = []  # TODO: populate with retrieval sources, if any