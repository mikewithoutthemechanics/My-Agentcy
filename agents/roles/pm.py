"""
Project Manager Agent — coordinates agents, tracks progress, communicates.

Role : Project Manager
Goal : Coordinate between agents, track progress, handle escalations,
       and keep clients informed.
"""

from __future__ import annotations

from crewai import Agent

from ..config import pm_llm, default_agent
from ..tools.custom_tools import EscalationTool, NotificationTool, StatusUpdateTool


class ProjectManagerAgent:
    """Wraps creation of the Project Manager CrewAI Agent."""

    ROLE = "Project Manager"
    GOAL = (
        "Coordinate between agents, track progress, handle escalations, "
        "and communicate with clients. Ensure deadlines are met and "
        "quality standards are maintained."
    )
    BACKSTORY = (
        "You are a seasoned project manager who has delivered hundreds of "
        "projects across software, consulting, and creative domains. You "
        "excel at coordinating cross-functional teams, spotting risks early, "
        "and keeping stakeholders informed with clear, concise status reports. "
        "You escalate blockers promptly and never let quality slip."
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
            tools=[StatusUpdateTool, NotificationTool, EscalationTool],
            llm=pm_llm.model,
            verbose=overrides.pop("verbose", default_agent.verbose),
            allow_delegation=overrides.pop("allow_delegation", True),  # PM can delegate
            max_iter=overrides.pop("max_iter", default_agent.max_iter),
            memory=overrides.pop("memory", default_agent.memory),
            **overrides,
        )
