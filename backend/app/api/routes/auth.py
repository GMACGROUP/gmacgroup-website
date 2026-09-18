"""
Authentication routes: register, login, current user verification.
"""

from datetime import datetime, timezone
from uuid import uuid4
from fastapi import APIRouter, Depends, HTTPException, status
from app.api.dependencies import create_access_token, get_current_user
from app.schemas.user import AuthResponse, UserCreate, UserLogin, UserOut
from app.data import USERS

router = APIRouter()


@router.post("/register", response_model=AuthResponse, status_code=status.HTTP_201_CREATED)
async def register(payload: UserCreate):
    """Register a new user, store profile, and return JWT access token."""
    email_lower = payload.email.lower().strip()
    
    # Check if user already exists
    if any(u["email"].lower() == email_lower for u in USERS):
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="An account with this email address already exists.",
        )

    if len(payload.password) < 6:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Password must be at least 6 characters.",
        )

    user_id = f"usr-{uuid4().hex[:12]}"
    user_record = {
        "id": user_id,
        "email": email_lower,
        "password": payload.password,
        "full_name": payload.full_name or email_lower.split("@")[0].capitalize(),
        "role": payload.role.value if hasattr(payload.role, "value") else str(payload.role),
        "created_at": datetime.now(timezone.utc),
        "bio": None,
        "organization": None,
        "phone": None,
    }
    USERS.append(user_record)

    token = create_access_token({
        "sub": user_id,
        "email": user_record["email"],
        "name": user_record["full_name"],
        "role": user_record["role"],
    })

    return {
        "access_token": token,
        "token_type": "bearer",
        "user": user_record,
    }


@router.post("/login", response_model=AuthResponse)
async def login(payload: UserLogin):
    """Authenticate user with email and password and return JWT access token."""
    email_lower = payload.email.lower().strip()
    user = next((u for u in USERS if u["email"].lower() == email_lower), None)

    if not user or user.get("password") != payload.password:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid email or password. Please check your credentials.",
        )

    token = create_access_token({
        "sub": user["id"],
        "email": user["email"],
        "name": user.get("full_name"),
        "role": user.get("role", "student"),
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
