"""Pydantic schemas for AI-assistant style endpoints."""

from typing import Optional
from pydantic import BaseModel, Field


class AssistantQuery(BaseModel):
    prompt: str = Field(min_length=1, max_length=2000)
    context: Optional[str] = Field(default=None, max_length=4000)  # TODO: define richer context (user role, page, etc.)


class AssistantResponse(BaseModel):
    answer: str
    sources: list[str] = []  # TODO: populate with retrieval sources, if any