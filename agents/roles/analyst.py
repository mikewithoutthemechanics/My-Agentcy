"""
Analyst Agent — breaks client briefs into structured execution plans.

Role : Senior Business Analyst
Goal : Understand client briefs, decompose them into actionable tasks,
       identify dependencies, and produce a JSON task plan.
"""

from __future__ import annotations

from crewai import Agent

from ..config import analyst_llm, default_agent
from ..tools.custom_tools import DocumentReaderTool, WebSearchTool


class AnalystAgent:
    """Wraps creation of the Analyst CrewAI Agent."""

    ROLE = "Senior Business Analyst"
    GOAL = (
        "Understand client briefs, break them into actionable tasks, "
        "identify dependencies, and create structured execution plans "
        "with time estimates."
    )
    BACKSTORY = (
        "You are a senior business analyst with 15 years of experience "
        "in consulting firms and tech companies. You have a talent for "
        "decomposing complex projects into clear, dependency-aware task "
        "graphs. You research context, find relevant data, and always "
        "produce structured JSON task plans that other agents can execute."
    )

    @classmethod
    def create(cls, **overrides) -> Agent:
        """Build and return a configured CrewAI Agent.

        Args:
            **overrides: Any Agent field to override (tools, llm, etc.).
        """
        return Agent(
            role=cls.ROLE,
            goal=cls.GOAL,
            backstory=cls.BACKSTORY,
            tools=[WebSearchTool, DocumentReaderTool],
            llm=analyst_llm.model,
            verbose=overrides.pop("verbose", default_agent.verbose),
            allow_delegation=overrides.pop("allow_delegation", default_agent.allow_delegation),
            max_iter=overrides.pop("max_iter", default_agent.max_iter),
            memory=overrides.pop("memory", default_agent.memory),
            **overrides,
        )
