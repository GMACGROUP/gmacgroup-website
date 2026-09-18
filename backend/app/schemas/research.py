"""Pydantic schemas for research projects, publications, and experts."""

from datetime import datetime
from typing import Optional, List
from pydantic import BaseModel, ConfigDict, EmailStr


class ResearchProjectOut(BaseModel):
    id: str
    title: str
    summary: Optional[str] = None
    status: Optional[str] = None
    lead_researcher: Optional[str] = None

    model_config = ConfigDict(from_attributes=True)


class PublicationOut(BaseModel):
    id: str
    title: str
    authors: List[str] = []
    published_at: Optional[datetime] = None
    url: Optional[str] = None

    model_config = ConfigDict(from_attributes=True)


class ExpertOut(BaseModel):
    id: str
    full_name: str
    expertise_areas: List[str] = []
    bio: Optional[str] = None

    model_config = ConfigDict(from_attributes=True)


class PublicationRequestCreate(BaseModel):
    publication_id: Optional[str] = None
    publication_title: str
    full_name: str
    email: EmailStr
    organization: Optional[str] = None
    purpose: Optional[str] = None


class PublicationRequestOut(BaseModel):
    id: str
    publication_title: str
    full_name: str
    email: EmailStr
    status: str
    created_at: datetime

    model_config = ConfigDict(from_attributes=True)


class ExpertApplicationCreate(BaseModel):
    full_name: str
    email: EmailStr
    highest_degree: Optional[str] = None
    institution: Optional[str] = None
    expertise_areas: List[str] = []
    orcid_or_link: Optional[str] = None
    statement: Optional[str] = None


class ExpertApplicationOut(BaseModel):
    id: str
    full_name: str
    email: EmailStr
    status: str
    created_at: datetime

    model_config = ConfigDict(from_attributes=True)
