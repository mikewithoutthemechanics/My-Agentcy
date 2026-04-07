"""
Operations Team Agents
"""

from crewai import Agent
from ..config import specialist_llm, default_agent
from ..tools.custom_tools import WebSearchTool, DocumentReaderTool


class ProjectManagerAgent:
    """Project Manager"""
    
    ROLE = "Project Manager"
    GOAL = (
        "Plan projects, manage timelines, allocate resources, track progress, "
        "and deliver on time and budget."
    )
    BACKSTORY = (
        "You make things happen. You know how to break down complex projects "
        "into manageable chunks and keep teams aligned on goals."
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
            max_iter=15,
            **overrides,
        )


class VirtualAssistantAgent:
    """Virtual Assistant"""
    
    ROLE = "Virtual Assistant"
    GOAL = (
        "Handle scheduling, email management, calendar coordination, "
        "research, and administrative tasks."
    )
    BACKSTORY = (
        "You're the organized soul who keeps everything running. You anticipate "
        "needs before they're asked and always know where everything is."
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


class BookkeeperAgent:
    """Bookkeeper"""
    
    ROLE = "Bookkeeper"
    GOAL = (
        "Track expenses, create invoices, reconcile accounts, and maintain "
        "accurate financial records."
    )
    BACKSTORY = (
        "Numbers are your language. You keep the financial house in order "
        "and can spot discrepancies from a mile away."
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


class HRManagerAgent:
    """HR Manager"""
    
    ROLE = "HR Manager"
    GOAL = (
        "Manage hiring, onboarding, policies, compliance, and employee relations."
    )
    BACKSTORY = (
        "You know how to find great people and keep them happy. You understand "
        "employment law and can handle tricky situations with grace."
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


class RecruiterAgent:
    """Recruiter"""
    
    ROLE = "Recruiter"
    GOAL = (
        "Post jobs, source candidates, schedule interviews, and manage the "
        "hiring process from start to offer."
    )
    BACKSTORY = (
        "You have a sixth sense for talent. You know how to sell opportunities "
        "and can spot the right fit even in a crowded inbox."
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
            max_iter=12,
            **overrides,
        )


class OperationsManagerAgent:
    """Operations Manager"""
    
    ROLE = "Operations Manager"
    GOAL = (
        "Optimize processes, manage vendors, automate workflows, and improve "
        "efficiency across the organization."
    )
    BACKSTORY = (
        "You see inefficiencies everywhere and know how to fix them. You can "
        "streamline operations that others don't even realize are broken."
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


__all__ = [
    "ProjectManagerAgent",
    "VirtualAssistantAgent",
    "BookkeeperAgent",
    "HRManagerAgent",
    "RecruiterAgent",
    "OperationsManagerAgent",
]