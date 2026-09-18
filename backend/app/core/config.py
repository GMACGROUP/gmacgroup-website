"""
Application configuration.

TODO:
- Move real values into environment variables (see /.env.example at repo root)
- Add Supabase URL/keys, AI provider keys, email service config, etc.
"""

from functools import lru_cache
from pydantic_settings import BaseSettings, SettingsConfigDict


class Settings(BaseSettings):
    ENVIRONMENT: str = "development"

    # Frontend origins allowed to call this API
    ALLOWED_ORIGINS: list[str] = ["http://localhost:3000"]

    # Database
    DATABASE_URL: str = "postgresql://user:password@localhost:5432/gmacgroup"

    # Supabase
    SUPABASE_URL: str = ""
    SUPABASE_ANON_KEY: str = ""
    SUPABASE_SERVICE_ROLE_KEY: str = ""

    # Auth / JWT
    JWT_SECRET: str = "change-me"
    JWT_ALGORITHM: str = "HS256"

    # AI provider (placeholder — TODO: define provider-specific settings)
    AI_PROVIDER_API_KEY: str = ""

    model_config = SettingsConfigDict(env_file=".env", extra="ignore")


@lru_cache
def get_settings() -> Settings:
    return Settings()
