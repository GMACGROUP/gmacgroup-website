"""Business logic for internships, jobs, fellowships, and applications.
TODO: implement DB access and application-tracking workflow.
"""


class OpportunityService:
    async def list_opportunities(self, opportunity_type: str | None = None):
        raise NotImplementedError

    async def submit_application(self, opportunity_id: str, user_id: str, data: dict):
        raise NotImplementedError
