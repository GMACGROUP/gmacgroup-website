"""Pydantic schemas for user profiles, roles, authentication, and account settings."""

from datetime import datetime
from enum import Enum
from typing import Optional
from pydantic import BaseModel, ConfigDict, EmailStr


class UserRole(str, Enum):
    STUDENT = "student"
    PROFESSIONAL = "professional"
    RESEARCHER = "researcher"
    EMPLOYER = "employer"
    INSTITUTION = "institution"
    EMPLOYEE = "employee"
    ADMIN = "admin"


class UserBase(BaseModel):
    email: EmailStr
    full_name: Optional[str] = None
    role: UserRole = UserRole.STUDENT


class UserCreate(UserBase):
    password: str


class UserLogin(BaseModel):
    email: EmailStr
    password: str


class UserUpdate(BaseModel):
    full_name: Optional[str] = None
    bio: Optional[str] = None
    organization: Optional[str] = None
    phone: Optional[str] = None


class UserOut(UserBase):
    id: str
    created_at: datetime
    bio: Optional[str] = None
    organization: Optional[str] = None
    phone: Optional[str] = None

    model_config = ConfigDict(from_attributes=True)


class AuthResponse(BaseModel):
    access_token: str
    token_type: str = "bearer"
    user: UserOut
