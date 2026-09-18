"""Business logic for programmes, training, workshops, and enrolment.
TODO: implement DB access and enrolment workflow (capacity checks, confirmations).
"""


class ProgrammeService:
    async def list_programmes(self, category: str | None = None):
        raise NotImplementedError

    async def enrol_user(self, programme_id: str, user_id: str, notes: str | None = None):
        raise NotImplementedError
