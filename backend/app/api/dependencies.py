"""
Shared FastAPI dependencies (auth, token generation, user verification).
"""

from datetime import datetime, timedelta, timezone
from typing import Optional
from fastapi import Depends, HTTPException, status
from fastapi.security import HTTPBearer, HTTPAuthorizationCredentials
from jose import JWTError, jwt
from sqlalchemy import select
from sqlalchemy.orm import Session
from app.core.config import get_settings
from app.core.database import get_db
from app.models.user import User


def user_to_dict(user: User) -> dict:
    return {
        "id": user.id,
        "email": user.email,
        "full_name": user.full_name,
        "role": user.role,
        "created_at": user.created_at,
        "bio": user.bio,
        "organization": user.organization,
        "phone": user.phone,
    }

bearer_scheme = HTTPBearer(auto_error=False)


def create_access_token(data: dict, expires_delta: Optional[timedelta] = None) -> str:
    """Create a signed JWT access token."""
    to_encode = data.copy()
    if expires_delta:
        expire = datetime.now(timezone.utc) + expires_delta
    else:
        expire = datetime.now(timezone.utc) + timedelta(days=7)
    to_encode.update({"exp": expire})
    settings = get_settings()
    return jwt.encode(to_encode, settings.JWT_SECRET, algorithm=settings.JWT_ALGORITHM)


def create_password_reset_token(email: str) -> str:
    """Create a short-lived (15 minutes) signed JWT for password recovery."""
    expire = datetime.now(timezone.utc) + timedelta(minutes=15)
    to_encode = {
        "sub": email.lower().strip(),
        "type": "password_reset",
        "exp": expire,
    }
    settings = get_settings()
    return jwt.encode(to_encode, settings.JWT_SECRET, algorithm=settings.JWT_ALGORITHM)


def verify_password_reset_token(token: str) -> Optional[str]:
    """Verify password reset JWT and return user's email if valid."""
    settings = get_settings()
    try:
        payload = jwt.decode(token, settings.JWT_SECRET, algorithms=[settings.JWT_ALGORITHM])
        if payload.get("type") != "password_reset":
            return None
        email: str = payload.get("sub")
        return email.lower().strip() if email else None
    except JWTError:
        return None


async def get_current_user(
    credentials: Optional[HTTPAuthorizationCredentials] = Depends(bearer_scheme),
    db: Session = Depends(get_db),
) -> dict:
    """Verify a locally signed JWT and expose the user record."""
    if credentials is None:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Authentication required",
            headers={"WWW-Authenticate": "Bearer"},
        )
    try:
        settings = get_settings()
        claims = jwt.decode(
            credentials.credentials,
            settings.JWT_SECRET,
            algorithms=[settings.JWT_ALGORITHM],
        )
    except JWTError as exc:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid authentication token",
            headers={"WWW-Authenticate": "Bearer"},
        ) from exc

    subject = claims.get("sub")
    if not subject:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Token has no subject",
        )

    try:
        user = db.scalar(select(User).where(User.id == subject))
    except (ValueError, TypeError):
        user = None
    if user is None:
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="Account not found")
    return user_to_dict(user)


async def get_optional_user(
    credentials: Optional[HTTPAuthorizationCredentials] = Depends(bearer_scheme),
    db: Session = Depends(get_db),
) -> Optional[dict]:
    """Return the authenticated user if token is provided, or None."""
    if credentials is None:
        return None
    try:
        return await get_current_user(credentials, db)
    except Exception:
        return None


def require_role(role: str):
    """Role-guard factory."""
    async def _checker(user=Depends(get_current_user)):
        if user.get("role") != role:
            raise HTTPException(
                status_code=status.HTTP_403_FORBIDDEN,
                detail="Insufficient permissions",
            )
        return user

    return _checker
