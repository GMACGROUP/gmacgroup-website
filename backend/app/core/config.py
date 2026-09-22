"""
Application configuration.

TODO:
- Move real values into environment variables (see /.env.example at repo root)
- Add Supabase URL/keys, AI provider keys, email service config, etc.
"""

from functools import lru_cache
from pydantic_settings import BaseSettings, SettingsConfigDict
from pydantic import model_validator


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

    # Flutterwave payments
    FLW_SECRET_KEY: str = ""
    FLW_WEBHOOK_SECRET_HASH: str = ""
    FRONTEND_URL: str = "http://localhost:3000"

    # Email notifications (Resend or SMTP / Gmail)
    EMAIL_PROVIDER: str = "none"
    RESEND_API_KEY: str = ""
    EMAIL_FROM: str = "GMACGROUP <notifications@gmacgroup.org>"
    OPERATIONS_EMAIL: str = ""

    # SMTP configuration (for sending from Gmail / standard SMTP without custom domain)
    SMTP_HOST: str = "smtp.gmail.com"
    SMTP_PORT: int = 587
    SMTP_USER: str = ""
    SMTP_PASSWORD: str = ""
    SMTP_TLS: bool = True


    # Document & file storage (local / supabase / s3)
    STORAGE_PROVIDER: str = "local"
    UPLOAD_DIR: str = "uploads"
    STORAGE_BUCKET: str = "resumes"
    MAX_UPLOAD_SIZE_MB: int = 10

    model_config = SettingsConfigDict(env_file=".env", extra="ignore")

    @model_validator(mode="after")
    def validate_production_settings(self):
        if self.ENVIRONMENT.lower() in {"production", "staging"}:
            if self.JWT_SECRET in {"change-me", "generate-a-strong-secret-key"} or len(self.JWT_SECRET) < 32:
                raise ValueError("JWT_SECRET must be a strong value with at least 32 characters in production")
            if not self.ALLOWED_ORIGINS:
                raise ValueError("ALLOWED_ORIGINS must contain the deployed frontend origin")
            if self.STORAGE_PROVIDER.lower() == "local":
                raise ValueError("STORAGE_PROVIDER must use durable object storage in production")
        return self


@lru_cache
def get_settings() -> Settings:
    return Settings()
