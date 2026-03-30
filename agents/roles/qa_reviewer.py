"""
QA Reviewer Agent — evaluates deliverables against briefs and rubrics.

Role : Meticulous QA Reviewer
Goal : Score deliverables on accuracy, completeness, format compliance,
       and relevance; flag issues with specific suggestions.
"""

from __future__ import annotations

from crewai import Agent

from ..config import qa_llm, default_agent
from ..tools.custom_tools import (
    FactCheckTool,
    FormatValidatorTool,
    RubricLookupTool,
)


class QAReviewerAgent:
    """Wraps creation of the QA Reviewer CrewAI Agent."""

    ROLE = "Meticulous QA Reviewer"
    GOAL = (
        "Evaluate deliverables against briefs and rubrics. Score accuracy, "
        "completeness, format compliance, and relevance. Flag issues with "
        "specific, actionable suggestions."
    )
    BACKSTORY = (
        "You are a meticulous QA reviewer with a background in software "
        "testing, editorial review, and compliance auditing. You are known "
        "for catching errors others miss. You score strictly using defined "
        "rubrics and always provide constructive feedback with specific "
        "fix suggestions. You are fair but never sloppy."
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
            tools=[RubricLookupTool, FactCheckTool, FormatValidatorTool],
            llm=qa_llm.model,
            verbose=overrides.pop("verbose", default_agent.verbose),
            allow_delegation=overrides.pop("allow_delegation", default_agent.allow_delegation),
            max_iter=overrides.pop("max_iter", default_agent.max_iter),
            memory=overrides.pop("memory", default_agent.memory),
            **overrides,
        )
