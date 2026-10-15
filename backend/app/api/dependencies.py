"""
Shared FastAPI dependencies (auth, token generation, user verification).
"""

import hashlib
from datetime import datetime, timedelta, timezone
from typing import Optional
from fastapi import Depends, HTTPException, Request, Response, status
from fastapi.security import HTTPBearer, HTTPAuthorizationCredentials
import jwt
from jwt import PyJWTError as JWTError
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


def password_version(password_hash: str | None) -> str:
    """Short fingerprint of the password hash. Changing the password changes it,
    which signs the account out everywhere and spends any reset link."""
    return hashlib.sha256((password_hash or "").encode()).hexdigest()[:12]


def create_access_token(data: dict, expires_delta: Optional[timedelta] = None, password_hash: str | None = None) -> str:
    """Create a signed JWT access token."""
    settings = get_settings()
    to_encode = data.copy()
    expire = datetime.now(timezone.utc) + (expires_delta or timedelta(days=settings.SESSION_DAYS))
    to_encode.update({"exp": expire, "typ": "access"})
    if password_hash is not None:
        to_encode["pv"] = password_version(password_hash)
    return jwt.encode(to_encode, settings.JWT_SECRET, algorithm=settings.JWT_ALGORITHM)


def create_session_token(user: User) -> str:
    return create_access_token(
        {"sub": str(user.id), "email": user.email, "name": user.full_name, "role": user.role},
        password_hash=user.password_hash,
    )


def set_session_cookie(response: Response, token: str) -> None:
    """Store the session in an httpOnly cookie that page scripts cannot read."""
    settings = get_settings()
    response.set_cookie(
        key=settings.SESSION_COOKIE_NAME,
        value=token,
        max_age=settings.SESSION_DAYS * 86400,
        httponly=True,
        secure=settings.is_production,
        # Cross-site in production until the API moves to api.gmac-group.com;
        # cross-site requests are then guarded by the Origin check in main.py.
        samesite="none" if settings.is_production else "lax",
        domain=settings.SESSION_COOKIE_DOMAIN or None,
        path="/",
    )


def clear_session_cookie(response: Response) -> None:
    settings = get_settings()
    response.delete_cookie(
        key=settings.SESSION_COOKIE_NAME,
        domain=settings.SESSION_COOKIE_DOMAIN or None,
        path="/",
        secure=settings.is_production,
        httponly=True,
        samesite="none" if settings.is_production else "lax",
    )


def create_password_reset_token(email: str, password_hash: str | None = None) -> str:
    """Create a short-lived (15 minutes) signed JWT for password recovery.
    Tied to the current password, so the link works only once."""
    expire = datetime.now(timezone.utc) + timedelta(minutes=15)
    to_encode = {
        "sub": email.lower().strip(),
        "type": "password_reset",
        "exp": expire,
    }
    if password_hash is not None:
        to_encode["pv"] = password_version(password_hash)
    settings = get_settings()
    return jwt.encode(to_encode, settings.JWT_SECRET, algorithm=settings.JWT_ALGORITHM)


def verify_password_reset_token(token: str) -> Optional[dict]:
    """Verify a password reset JWT. Returns {"email", "pv"} if valid."""
    settings = get_settings()
    try:
        payload = jwt.decode(token, settings.JWT_SECRET, algorithms=[settings.JWT_ALGORITHM])
        if payload.get("type") != "password_reset":
            return None
        email: str = payload.get("sub")
        return {"email": email.lower().strip(), "pv": payload.get("pv")} if email else None
    except JWTError:
        return None


def create_action_token(user: dict, action: str, minutes: int = 5) -> str:
    """Short-lived token an admin's browser hands to the website (for example to refresh pages)."""
    settings = get_settings()
    return jwt.encode(
        {"sub": str(user["id"]), "typ": action, "role": user["role"], "exp": datetime.now(timezone.utc) + timedelta(minutes=minutes)},
        settings.JWT_SECRET,
        algorithm=settings.JWT_ALGORITHM,
    )


def read_action_token(token: str, action: str) -> Optional[dict]:
    settings = get_settings()
    try:
        claims = jwt.decode(token, settings.JWT_SECRET, algorithms=[settings.JWT_ALGORITHM])
    except JWTError:
        return None
    return claims if claims.get("typ") == action else None


def _token_from(request: Request, credentials: Optional[HTTPAuthorizationCredentials]) -> Optional[str]:
    if credentials is not None:
        return credentials.credentials
    return request.cookies.get(get_settings().SESSION_COOKIE_NAME)


async def get_current_user(
    request: Request,
    credentials: Optional[HTTPAuthorizationCredentials] = Depends(bearer_scheme),
    db: Session = Depends(get_db),
) -> dict:
    """Verify the session (cookie, or a Bearer header for API clients) and expose the user record."""
    token = _token_from(request, credentials)
    if not token:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Authentication required",
            headers={"WWW-Authenticate": "Bearer"},
        )
    try:
        settings = get_settings()
        claims = jwt.decode(
            token,
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
    if claims.get("typ", "access") != "access" or claims.get("type") == "password_reset":
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="Invalid authentication token")
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
    if "pv" in claims and claims["pv"] != password_version(user.password_hash):
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="Your session has ended. Please sign in again.")
    return user_to_dict(user)


async def get_optional_user(
    request: Request,
    credentials: Optional[HTTPAuthorizationCredentials] = Depends(bearer_scheme),
    db: Session = Depends(get_db),
) -> Optional[dict]:
    """Return the authenticated user if a session is present, or None."""
    if not _token_from(request, credentials):
        return None
    try:
        return await get_current_user(request, credentials, db)
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
