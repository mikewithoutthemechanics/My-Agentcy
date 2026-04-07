"""
Customer Success Team Agents
"""

from crewai import Agent
from ..config import specialist_llm, default_agent
from ..tools.custom_tools import WebSearchTool, DocumentReaderTool


class CSManagerAgent:
    """Customer Success Manager"""
    
    ROLE = "Customer Success Manager"
    GOAL = (
        "Manage CS team, handle escalations, track health scores, drive "
        "renewals and account expansion."
    )
    BACKSTORY = (
        "You turn customers into advocates. You know how to spot at-risk "
        "accounts early and intervene before they churn."
    )
    
    @classmethod
    def create(cls, **overrides) -> Agent:
        return Agent(
            role=cls.ROLE,
            goal=cls.GOAL,
            backstory=cls.BACKSTORY,
            tools=[WebSearchTool, DocumentReaderTool],
            llm=specialist_llm.model,
            verbose=overrides.pop("verbose", default_agent.verbose),
            allow_delegation=True,
            max_iter=12,
            **overrides,
        )


class OnboardingSpecialistAgent:
    """Onboarding Specialist"""
    
    ROLE = "Onboarding Specialist"
    GOAL = (
        "Guide new customers through setup, training, and kickoff to ensure "
        "successful adoption and time-to-value."
    )
    BACKSTORY = (
        "You make new customers feel welcome and set them up for success. "
        "You know exactly what needs to happen in the first 30, 60, 90 days."
    )
    
    @classmethod
    def create(cls, **overrides) -> Agent:
        return Agent(
            role=cls.ROLE,
            goal=cls.GOAL,
            backstory=cls.BACKSTORY,
            tools=[WebSearchTool, DocumentReaderTool],
            llm=specialist_llm.model,
            verbose=overrides.pop("verbose", default_agent.verbose),
            allow_delegation=False,
            max_iter=10,
            **overrides,
        )


class SupportAgent:
    """Support Agent"""
    
    ROLE = "Support Agent"
    GOAL = (
        "Resolve customer issues via ticket, email, or chat, provide troubleshooting, "
        "and ensure customer satisfaction."
    )
    BACKSTORY = (
        "You have infinite patience and actually enjoy solving problems. "
        "You know how to turn a frustrated customer into a happy one."
    )
    
    @classmethod
    def create(cls, **overrides) -> Agent:
        return Agent(
            role=cls.ROLE,
            goal=cls.GOAL,
            backstory=cls.BACKSTORY,
            tools=[WebSearchTool, DocumentReaderTool],
            llm=specialist_llm.model,
            verbose=overrides.pop("verbose", default_agent.verbose),
            allow_delegation=False,
            max_iter=10,
            **overrides,
        )


class SuccessAnalystAgent:
    """Success Analyst"""
    
    ROLE = "Success Analyst"
    GOAL = (
        "Track health metrics, analyze adoption, create reports on customer "
        "success performance and churn analysis."
    )
    BACKSTORY = (
        "You find patterns in data that others miss. You can predict which "
        "customers will churn and know what drives adoption."
    )
    
    @classmethod
    def create(cls, **overrides) -> Agent:
        return Agent(
            role=cls.ROLE,
            goal=cls.GOAL,
            backstory=cls.BACKSTORY,
            tools=[WebSearchTool, DocumentReaderTool],
            llm=specialist_llm.model,
            verbose=overrides.pop("verbose", default_agent.verbose),
            allow_delegation=False,
            max_iter=10,
            **overrides,
        )


__all__ = [
    "CSManagerAgent",
    "OnboardingSpecialistAgent",
    "SupportAgent",
    "SuccessAnalystAgent",
]