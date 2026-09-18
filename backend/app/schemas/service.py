"""Pydantic schemas for the GMACGROUP service catalog."""

from typing import Optional
from pydantic import BaseModel, ConfigDict


class ServiceOut(BaseModel):
    id: str
    slug: str
    title: str
    summary: str
    description: Optional[str] = None
    category: Optional[str] = None  # e.g. "education", "consulting", "research"

    model_config = ConfigDict(from_attributes=True)
