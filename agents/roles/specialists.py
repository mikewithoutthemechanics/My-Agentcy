"""
Specialist Agents — focused agents for specific deep-work tasks.

Provides: ResearcherAgent, DeveloperAgent, WriterAgent, DesignerAgent.

Each specialist has a narrow, deep system prompt and tools tailored
to their craft. They are building blocks that TaskCrew and QACrew
can compose into larger workflows.
"""

from __future__ import annotations

from crewai import Agent

from ..config import specialist_llm, default_agent
from ..tools.custom_tools import (
    CodeExecutorTool,
    DocumentReaderTool,
    FactCheckTool,
    FileCreatorTool,
    FormatValidatorTool,
    WebSearchTool,
)


# ─────────────────────────────────────────────────────────────────────
# Researcher
# ─────────────────────────────────────────────────────────────────────

class ResearcherAgent:
    """Deep-research specialist — finds, verifies, and synthesizes information."""

    ROLE = "Research Specialist"
    GOAL = (
        "Conduct thorough research on assigned topics. Find credible "
        "sources, verify facts, and synthesize findings into clear, "
        "well-structured reports with citations."
    )
    BACKSTORY = (
        "You are a former academic researcher turned industry analyst. "
        "You have a PhD in information science and years of experience "
        "in market research, competitive analysis, and literature reviews. "
        "You never cite a source you haven't verified, and you always "
        "distinguish between facts, expert opinions, and speculation."
    )

    @classmethod
    def create(cls, **overrides) -> Agent:
        return Agent(
            role=cls.ROLE,
            goal=cls.GOAL,
            backstory=cls.BACKSTORY,
            tools=[WebSearchTool, DocumentReaderTool, FactCheckTool],
            llm=specialist_llm.model,
            verbose=overrides.pop("verbose", default_agent.verbose),
            allow_delegation=overrides.pop("allow_delegation", default_agent.allow_delegation),
            max_iter=overrides.pop("max_iter", default_agent.max_iter),
            memory=overrides.pop("memory", default_agent.memory),
            **overrides,
        )


# ─────────────────────────────────────────────────────────────────────
# Developer
# ─────────────────────────────────────────────────────────────────────

class DeveloperAgent:
    """Full-stack developer specialist — writes, tests, and ships code."""

    ROLE = "Senior Developer"
    GOAL = (
        "Write clean, efficient, well-tested code. Follow best practices, "
        "handle edge cases, and produce production-ready deliverables "
        "with documentation."
    )
    BACKSTORY = (
        "You are a senior full-stack developer with 10+ years of experience "
        "across Python, JavaScript/TypeScript, Go, and cloud platforms. "
        "You write code that other developers enjoy reading. You test "
        "everything, document what matters, and refactor relentlessly."
    )

    @classmethod
    def create(cls, **overrides) -> Agent:
        return Agent(
            role=cls.ROLE,
            goal=cls.GOAL,
            backstory=cls.BACKSTORY,
            tools=[CodeExecutorTool, FileCreatorTool, WebSearchTool],
            llm=specialist_llm.model,
            verbose=overrides.pop("verbose", default_agent.verbose),
            allow_delegation=overrides.pop("allow_delegation", default_agent.allow_delegation),
            max_iter=overrides.pop("max_iter", default_agent.max_iter),
            memory=overrides.pop("memory", default_agent.memory),
            **overrides,
        )


# ─────────────────────────────────────────────────────────────────────
# Writer
# ─────────────────────────────────────────────────────────────────────

class WriterAgent:
    """Content writer specialist — creates polished prose and copy."""

    ROLE = "Senior Writer"
    GOAL = (
        "Write clear, engaging, well-structured content. Adapt tone and "
        "style to the audience. Produce polished drafts that need minimal "
        "editing."
    )
    BACKSTORY = (
        "You are a senior writer with experience in journalism, technical "
        "writing, marketing copy, and executive communications. You can "
        "explain complex topics simply, tell compelling stories, and adapt "
        "your voice from corporate formal to casual conversational. You "
        "always outline before writing and edit ruthlessly."
    )

    @classmethod
    def create(cls, **overrides) -> Agent:
        return Agent(
            role=cls.ROLE,
            goal=cls.GOAL,
            backstory=cls.BACKSTORY,
            tools=[WebSearchTool, DocumentReaderTool, FileCreatorTool],
            llm=specialist_llm.model,
            verbose=overrides.pop("verbose", default_agent.verbose),
            allow_delegation=overrides.pop("allow_delegation", default_agent.allow_delegation),
            max_iter=overrides.pop("max_iter", default_agent.max_iter),
            memory=overrides.pop("memory", default_agent.memory),
            **overrides,
        )


# ─────────────────────────────────────────────────────────────────────
# Designer
# ─────────────────────────────────────────────────────────────────────

class DesignerAgent:
    """Design specialist — creates specs, wireframes, and design docs."""

    ROLE = "Senior Designer"
    GOAL = (
        "Create clear design specifications, wireframes, UX flows, and "
        "visual documentation. Balance aesthetics with usability and "
        "always consider accessibility."
    )
    BACKSTORY = (
        "You are a senior product designer with experience at both startups "
        "and enterprise companies. You think in systems — design tokens, "
        "component libraries, and interaction patterns. You communicate "
        "design decisions with rationale and always consider edge cases "
        "in user flows."
    )

    @classmethod
    def create(cls, **overrides) -> Agent:
        return Agent(
            role=cls.ROLE,
            goal=cls.GOAL,
            backstory=cls.BACKSTORY,
            tools=[DocumentReaderTool, FileCreatorTool, WebSearchTool],
            llm=specialist_llm.model,
            verbose=overrides.pop("verbose", default_agent.verbose),
            allow_delegation=overrides.pop("allow_delegation", default_agent.allow_delegation),
            max_iter=overrides.pop("max_iter", default_agent.max_iter),
            memory=overrides.pop("memory", default_agent.memory),
            **overrides,
        )


# ─────────────────────────────────────────────────────────────────────
# Convenience
# ─────────────────────────────────────────────────────────────────────

ALL_SPECIALISTS = [ResearcherAgent, DeveloperAgent, WriterAgent, DesignerAgent]

__all__ = [
    "ResearcherAgent",
    "DeveloperAgent",
    "WriterAgent",
    "DesignerAgent",
    "ALL_SPECIALISTS",
]
