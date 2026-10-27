"""
User management routes: profiles, roles, account settings.
"""

from fastapi import APIRouter, Depends, HTTPException, status
from app.api.dependencies import get_current_user
from app.core.database import get_db
from app.models.user import User
from app.schemas.user import UserOut, UserUpdate
from sqlalchemy import select
from sqlalchemy.orm import Session

router = APIRouter()


@router.get("/me", response_model=UserOut)
async def get_my_profile(current_user: dict = Depends(get_current_user)):
    """Return the authenticated user's profile."""
    return current_user


@router.put("/me", response_model=UserOut)
def update_my_profile(
    payload: UserUpdate,
    current_user: dict = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    """Update profile fields for the authenticated user."""
    user = db.scalar(select(User).where(User.id == current_user["id"]))
    if user is None:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Profile not found")
    for field in ("full_name", "bio", "organization", "phone"):
        value = getattr(payload, field)
        if value is not None:
            setattr(user, field, value)
    db.commit()
    db.refresh(user)
    return user


@router.get("/{user_id}", response_model=UserOut)
def get_user(user_id: str, current_user: dict = Depends(get_current_user), db: Session = Depends(get_db)):
    """Look up a user profile (your own, or anyone's for admins)."""
    if str(user_id) == str(current_user["id"]):
        return current_user
    if current_user.get("role") != "admin":
        raise HTTPException(status_code=status.HTTP_403_FORBIDDEN, detail="Profile access denied")
    try:
        user = db.get(User, user_id)
    except Exception:
        user = None
    if user is None:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Profile not found")
    return user
