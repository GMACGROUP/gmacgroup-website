"""SQLAlchemy declarative base. TODO: wire to a real engine/session in core/config.py."""

from sqlalchemy.orm import DeclarativeBase


class Base(DeclarativeBase):
    pass
