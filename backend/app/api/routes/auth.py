"""
Authentication routes: register, login, current user verification.
"""

from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy import select
from sqlalchemy.orm import Session
from app.api.dependencies import create_access_token, get_current_user
from app.core.database import get_db
from app.core.passwords import hash_password, verify_password
from app.models.user import User
from app.schemas.user import AuthResponse, UserCreate, UserLogin, UserOut
from app.services.notifications import notification_service

router = APIRouter()


@router.post("/register", response_model=AuthResponse, status_code=status.HTTP_201_CREATED)
async def register(payload: UserCreate, db: Session = Depends(get_db)):
    """Register a new user, store profile, and return JWT access token."""
    email_lower = payload.email.lower().strip()
    
    # Check if user already exists
    if db.scalar(select(User).where(User.email == email_lower)):
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="An account with this email address already exists.",
        )

    if len(payload.password) < 6:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Password must be at least 6 characters.",
        )

    requested_role = payload.role.value if hasattr(payload.role, "value") else str(payload.role)
    role = requested_role if requested_role in {"student", "professional", "researcher", "employer", "institution"} else "student"
    user = User(
        email=email_lower,
        full_name=payload.full_name or email_lower.split("@")[0].capitalize(),
        role=role,
        password_hash=hash_password(payload.password),
    )
    db.add(user)
    db.commit()
    db.refresh(user)
    await notification_service.notify_member_registered(user.email, user.full_name or "Member")

    token = create_access_token({
        "sub": str(user.id),
        "email": user.email,
        "name": user.full_name,
        "role": user.role,
    })

    return {
        "access_token": token,
        "token_type": "bearer",
        "user": user,
    }


@router.post("/login", response_model=AuthResponse)
async def login(payload: UserLogin, db: Session = Depends(get_db)):
    """Authenticate user with email and password and return JWT access token."""
    email_lower = payload.email.lower().strip()
    user = db.scalar(select(User).where(User.email == email_lower))

    if not user or not verify_password(payload.password, user.password_hash):
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid email or password. Please check your credentials.",
        )

    token = create_access_token({
        "sub": str(user.id),
        "email": user.email,
        "name": user.full_name,
        "role": user.role,
    })

    return {
        "access_token": token,
        "token_type": "bearer",
        "user": user,
    }


@router.get("/me", response_model=UserOut)
async def get_current_user_profile(current_user: dict = Depends(get_current_user)):
    """Return the profile of the currently authenticated user."""
    return current_user
