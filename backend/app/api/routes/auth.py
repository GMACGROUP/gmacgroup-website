"""
Authentication routes: register, login, current user verification.
"""

from fastapi import APIRouter, Depends, HTTPException, Response, status
from pydantic import BaseModel
from sqlalchemy import select
from sqlalchemy.orm import Session
from app.api.dependencies import (
    clear_session_cookie,
    create_action_token,
    create_password_reset_token,
    create_session_token,
    get_current_user,
    password_version,
    read_action_token,
    require_role,
    set_session_cookie,
    verify_password_reset_token,
)
from app.core.database import get_db
from app.core.ratelimit import rate_limit
from app.core.passwords import hash_password, verify_password
from app.models.user import User
from app.schemas.user import (
    AuthResponse,
    PasswordResetConfirm,
    PasswordResetRequest,
    PasswordResetResponse,
    UserCreate,
    UserLogin,
    UserOut,
)
from app.services.notifications import notification_service

router = APIRouter()


@router.post("/register", response_model=AuthResponse, status_code=status.HTTP_201_CREATED)
async def register(
    payload: UserCreate,
    response: Response,
    db: Session = Depends(get_db),
    _: None = Depends(rate_limit("register", limit=5, window_seconds=3600)),
):
    """Register a new user, store profile, and return JWT access token."""
    email_lower = payload.email.lower().strip()

    # Check if user already exists
    if db.scalar(select(User).where(User.email == email_lower)):
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="An account with this email address already exists.",
        )

    if len(payload.password) < 8:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Password must be at least 8 characters.",
        )

    requested_role = payload.role.value if hasattr(payload.role, "value") else str(payload.role)
    # Admin and staff roles are never self-assigned; they are granted in the database.
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

    notification_service.fire_and_forget(
        notification_service.notify_member_registered(
            user.email,
            user.full_name or "Member",
            role=user.role,
        )
    )
    notification_service.fire_and_forget(
        notification_service.notify_member_registration(
            user.email,
            user.full_name or "Member",
            user.role,
        )
    )

    token = create_session_token(user)
    set_session_cookie(response, token)
    return {"access_token": token, "token_type": "bearer", "user": user}


@router.post("/login", response_model=AuthResponse)
def login(
    payload: UserLogin,
    response: Response,
    db: Session = Depends(get_db),
    _: None = Depends(rate_limit("login", limit=10, window_seconds=600)),
):
    """Authenticate user with email and password and return JWT access token."""
    email_lower = payload.email.lower().strip()
    user = db.scalar(select(User).where(User.email == email_lower))

    if not user or not verify_password(payload.password, user.password_hash):
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid email or password. Please check your credentials.",
        )

    token = create_session_token(user)
    set_session_cookie(response, token)
    return {"access_token": token, "token_type": "bearer", "user": user}


@router.post("/logout", status_code=status.HTTP_204_NO_CONTENT)
def logout(response: Response):
    """End the browser session by clearing the session cookie."""
    clear_session_cookie(response)
    response.status_code = status.HTTP_204_NO_CONTENT
    return response


class ActionTokenCheck(BaseModel):
    token: str
    action: str = "revalidate"


@router.post("/action-token")
def issue_action_token(current_user: dict = Depends(require_role("admin"))):
    """Five-minute token the admin console passes to the website to refresh public pages."""
    return {"token": create_action_token(current_user, "revalidate")}


@router.post("/action-token/verify")
def verify_action_token(payload: ActionTokenCheck):
    claims = read_action_token(payload.token, payload.action)
    if not claims or claims.get("role") != "admin":
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="Invalid or expired token")
    return {"ok": True}


@router.post("/forgot-password", response_model=PasswordResetResponse)
async def forgot_password(
    payload: PasswordResetRequest,
    db: Session = Depends(get_db),
    _: None = Depends(rate_limit("forgot", limit=5, window_seconds=3600)),
):
    """Initiate self-service password recovery."""
    email_lower = payload.email.lower().strip()
    user = db.scalar(select(User).where(User.email == email_lower))

    if user:
        reset_token = create_password_reset_token(user.email, user.password_hash)
        notification_service.fire_and_forget(
            notification_service.notify_password_reset(
                user.email,
                user.full_name or "Member",
                reset_token,
            )
        )

    # Identical response regardless of whether email exists to prevent enumeration attacks
    return {
        "status": "success",
        "message": "If an account exists with this email address, a password reset link has been sent.",
    }


@router.post("/reset-password", response_model=PasswordResetResponse)
def reset_password(payload: PasswordResetConfirm, db: Session = Depends(get_db)):
    """Reset user password using a valid reset token."""
    claims = verify_password_reset_token(payload.token)
    if not claims:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="The password reset link is invalid or has expired. Please request a new one.",
        )

    if len(payload.new_password) < 8:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Password must be at least 8 characters.",
        )

    user = db.scalar(select(User).where(User.email == claims["email"]))
    if not user or (claims.get("pv") and claims["pv"] != password_version(user.password_hash)):
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="The password reset link is invalid or has expired. Please request a new one.",
        )

    user.password_hash = hash_password(payload.new_password)
    db.commit()

    return {
        "status": "success",
        "message": "Your password has been successfully reset. You can now sign in with your new password.",
    }


@router.get("/me", response_model=UserOut)
async def get_current_user_profile(current_user: dict = Depends(get_current_user)):
    """Return the profile of the currently authenticated user."""
    return current_user

