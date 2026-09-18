"""
Provider-agnostic AI service wrapper.

TODO:
- Pick initial provider (Anthropic API, etc.) and implement `ask()`
- Add retrieval-augmented context building for programme/opportunity/research recommendations
- Keep this layer swappable so the provider can change without touching route code
"""


class AIService:
    async def ask(self, prompt: str, context: str | None = None) -> str:
        raise NotImplementedError
