"""
Configuration for the My-Agentcy CrewAI agent system.

Centralizes model selection, temperature, token limits, and other
agent-level settings so they can be tuned from one place.
"""

from dataclasses import dataclass, field
from typing import Optional


@dataclass
class LLMConfig:
    """LLM settings shared across all agents."""
    model: str = "gpt-4o"
    temperature: float = 0.2
    max_tokens: int = 4096
    api_key: Optional[str] = None          # falls back to env var
    base_url: Optional[str] = None         # for custom / proxy endpoints
    timeout: int = 120
    max_retries: int = 3


@dataclass
class AgentConfig:
    """Per-agent behavioural knobs."""
    verbose: bool = True
    allow_delegation: bool = False
    max_iter: int = 15
    max_rpm: Optional[int] = None          # rate-limit (requests/min)
    memory: bool = True
    step_callback: Optional[callable] = None


@dataclass
class CrewConfig:
    """Crew-level execution settings."""
    verbose: bool = True
    memory: bool = True
    max_rpm: Optional[int] = None
    share_crew: bool = False


# ── Convenience singletons ──────────────────────────────────────────

default_llm = LLMConfig()
default_agent = AgentConfig()
default_crew = CrewConfig()

# Specialist overrides — heavier models for deep work, lighter for review
analyst_llm = LLMConfig(model="gpt-4o", temperature=0.15)
builder_llm = LLMConfig(model="gpt-4o", temperature=0.3)
qa_llm = LLMConfig(model="gpt-4o-mini", temperature=0.1)
pm_llm = LLMConfig(model="gpt-4o-mini", temperature=0.2)
specialist_llm = LLMConfig(model="gpt-4o", temperature=0.25)
scorer_llm = LLMConfig(model="gpt-4o-mini", temperature=0.0)
