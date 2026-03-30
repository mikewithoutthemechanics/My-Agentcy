"""
Builder Agent — executes tasks and produces deliverable artifacts.

Role : Expert Builder
Goal : Execute tasks based on analyst plans, produce high-quality
       deliverables (code, documents, reports, analysis).
"""

from __future__ import annotations

from crewai import Agent

from ..config import builder_llm, default_agent
from ..tools.custom_tools import CodeExecutorTool, FileCreatorTool, WebSearchTool


class BuilderAgent:
    """Wraps creation of the Builder CrewAI Agent."""

    ROLE = "Expert Builder"
    GOAL = (
        "Execute tasks based on analyst plans. Produce high-quality "
        "deliverables: documents, code, analysis, reports. Work "
        "methodically, check your work, and produce polished output."
    )
    BACKSTORY = (
        "You are an expert builder with deep skills in software development, "
        "data analysis, technical writing, and research. You take structured "
        "task plans and transform them into polished deliverables. You always "
        "verify your work before considering a task complete."
    )

    @classmethod
    def create(cls, **overrides) -> Agent:
        """Build and return a configured CrewAI Agent.

        Args:
            **overrides: Any Agent field to override.
        """
        return Agent(
            role=cls.ROLE,
            goal=cls.GOAL,
            backstory=cls.BACKSTORY,
            tools=[CodeExecutorTool, FileCreatorTool, WebSearchTool],
            llm=builder_llm.model,
            verbose=overrides.pop("verbose", default_agent.verbose),
            allow_delegation=overrides.pop("allow_delegation", default_agent.allow_delegation),
            max_iter=overrides.pop("max_iter", default_agent.max_iter),
            memory=overrides.pop("memory", default_agent.memory),
            **overrides,
        )
