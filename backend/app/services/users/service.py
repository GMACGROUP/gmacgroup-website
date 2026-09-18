"""Business logic for user profiles and account management.
TODO: implement DB access (via SQLAlchemy session or Supabase client).
"""


class UserService:
    async def get_by_id(self, user_id: str):
        raise NotImplementedError

    async def update_profile(self, user_id: str, data: dict):
        raise NotImplementedError
