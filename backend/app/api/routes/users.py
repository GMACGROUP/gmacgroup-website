"""
User management routes: profiles, roles, account settings.
"""

from datetime import datetime, timezone
from fastapi import APIRouter, Depends, HTTPException, status
from app.api.dependencies import get_current_user
from app.schemas.user import UserOut, UserUpdate
from app.data import USERS

router = APIRouter()


@router.get("/me", response_model=UserOut)
async def get_my_profile(current_user: dict = Depends(get_current_user)):
    """Return the authenticated user's profile."""
    return {
        **current_user,
        "created_at": current_user.get("created_at") or datetime.now(timezone.utc),
    }


@router.put("/me", response_model=UserOut)
async def update_my_profile(
    payload: UserUpdate,
    current_user: dict = Depends(get_current_user),
):
    """Update profile fields for the authenticated user."""
    user = next((u for u in USERS if u["id"] == current_user["id"]), None)
    if user:
        if payload.full_name is not None:
            user["full_name"] = payload.full_name
        if payload.bio is not None:
            user["bio"] = payload.bio
        if payload.organization is not None:
            user["organization"] = payload.organization
        if payload.phone is not None:
            user["phone"] = payload.phone
        return user

    # If user was decoded from token claims only
    updated = {
        **current_user,
        "full_name": payload.full_name or current_user.get("full_name"),
        "bio": payload.bio or current_user.get("bio"),
        "organization": payload.organization or current_user.get("organization"),
        "phone": payload.phone or current_user.get("phone"),
        "created_at": current_user.get("created_at") or datetime.now(timezone.utc),
    }
    return updated


@router.get("/{user_id}", response_model=UserOut)
async def get_user(user_id: str, current_user: dict = Depends(get_current_user)):
    """Look up a user profile."""
    if user_id != current_user["id"] and current_user.get("role") != "admin":
        raise HTTPException(status_code=status.HTTP_403_FORBIDDEN, detail="Profile access denied")
    return {
        **current_user,
        "created_at": current_user.get("created_at") or datetime.now(timezone.utc),
    }
