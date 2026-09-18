"""Business logic for research projects, publications, and expert talent.
TODO: implement DB access; consider a separate search/index layer for experts.
"""


class ResearchService:
    async def list_projects(self):
        raise NotImplementedError

    async def list_publications(self):
        raise NotImplementedError

    async def list_experts(self):
        raise NotImplementedError
