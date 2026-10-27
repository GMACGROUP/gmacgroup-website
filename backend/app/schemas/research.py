"""Pydantic schemas for research publications."""

from datetime import date
from enum import Enum
from typing import List, Optional

from pydantic import BaseModel, ConfigDict, Field, field_validator


class PublicationType(str, Enum):
    REPORT = "report"
    POLICY_BRIEF = "policy_brief"
    WORKING_PAPER = "working_paper"
    ARTICLE = "article"
    DATASET = "dataset"


def _https_only(value: Optional[str]) -> Optional[str]:
    if value and not value.startswith("https://"):
        raise ValueError("Links must start with https://")
    return value


class PublicationOut(BaseModel):
    id: str
    title: str
    type: PublicationType = PublicationType.REPORT
    summary: Optional[str] = None
    authors: List[str] = []
    published_at: Optional[date] = None
    url: Optional[str] = None
    practice: Optional[str] = None

    model_config = ConfigDict(from_attributes=True)


class PublicationCreate(BaseModel):
    title: str = Field(min_length=3, max_length=240)
    type: PublicationType = PublicationType.REPORT
    summary: Optional[str] = Field(default=None, max_length=1200)
    authors: List[str] = []
    published_at: Optional[date] = None
    url: Optional[str] = Field(default=None, max_length=500)
    practice: Optional[str] = Field(default=None, max_length=80)

    _check_url = field_validator("url")(_https_only)


class PublicationUpdate(BaseModel):
    title: Optional[str] = Field(default=None, min_length=3, max_length=240)
    type: Optional[PublicationType] = None
    summary: Optional[str] = Field(default=None, max_length=1200)
    authors: Optional[List[str]] = None
    published_at: Optional[date] = None
    url: Optional[str] = Field(default=None, max_length=500)
    practice: Optional[str] = Field(default=None, max_length=80)

    _check_url = field_validator("url")(_https_only)
