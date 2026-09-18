"""Pydantic schemas for programmes, training, workshops, and enrolment."""

from datetime import datetime
from enum import Enum
from typing import Optional
from pydantic import BaseModel, ConfigDict, EmailStr


class ProgrammeCategory(str, Enum):
    STUDENT = "student"
    PROFESSIONAL_DEVELOPMENT = "professional_development"
    TRAINING = "training"
    INSTITUTIONAL = "institutional"


class ProgrammeOut(BaseModel):
    id: str
    title: str
    category: ProgrammeCategory
    description: Optional[str] = None
    start_date: Optional[datetime] = None
    end_date: Optional[datetime] = None

    model_config = ConfigDict(from_attributes=True)


class EnrolmentCreate(BaseModel):
    full_name: Optional[str] = None
    email: Optional[EmailStr] = None
    phone: Optional[str] = None
    organization: Optional[str] = None
    notes: Optional[str] = None


class EnrolmentOut(BaseModel):
    id: str
    programme_id: str
    programme_title: Optional[str] = None
    user_id: Optional[str] = None
    full_name: Optional[str] = None
    email: Optional[str] = None
    status: str
    created_at: datetime

    model_config = ConfigDict(from_attributes=True)
