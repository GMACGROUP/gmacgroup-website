"""
Security helpers: password hashing, JWT encode/decode.

TODO:
- Confirm whether auth is fully delegated to Supabase Auth (likely),
  in which case this may only need JWT *verification*, not issuance.
"""

from datetime import datetime, timedelta
from passlib.context import CryptContext
from jose import jwt

from app.core.config import get_settings

settings = get_settings()
pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")


def hash_password(password: str) -> str:
    return pwd_context.hash(password)


def verify_password(plain_password: str, hashed_password: str) -> bool:
    return pwd_context.verify(plain_password, hashed_password)


def create_access_token(subject: str, expires_delta: timedelta | None = None) -> str:
    """TODO: confirm claims structure required by the frontend/Supabase."""
    expire = datetime.utcnow() + (expires_delta or timedelta(hours=1))
    to_encode = {"sub": subject, "exp": expire}
    return jwt.encode(to_encode, settings.JWT_SECRET, algorithm=settings.JWT_ALGORITHM)


def decode_access_token(token: str) -> dict:
    """TODO: handle Supabase-issued tokens (different signing key/JWKS)."""
    return jwt.decode(token, settings.JWT_SECRET, algorithms=[settings.JWT_ALGORITHM])
