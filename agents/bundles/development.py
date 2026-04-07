"""
Development Team Agents
"""

from crewai import Agent
from ..config import specialist_llm, default_agent
from ..tools.custom_tools import WebSearchTool, DocumentReaderTool, CodeExecutorTool, FileCreatorTool


class FrontendDeveloperAgent:
    """Frontend Developer - React, Vue, UI"""
    
    ROLE = "Frontend Developer"
    GOAL = (
        "Build beautiful, responsive web interfaces using React, Vue, or "
        "modern frameworks with pixel-perfect precision."
    )
    BACKSTORY = (
        "You're a UI wizard who can turn Figma designs into flawless code. "
        "You care about accessibility, performance, and making things feel "
        "smooth. You've built apps used by millions."
    )
    
    @classmethod
    def create(cls, **overrides) -> Agent:
        return Agent(
            role=cls.ROLE,
            goal=cls.GOAL,
            backstory=cls.BACKSTORY,
            tools=[WebSearchTool, DocumentReaderTool, CodeExecutorTool, FileCreatorTool],
            llm=specialist_llm.model,
            verbose=overrides.pop("verbose", default_agent.verbose),
            allow_delegation=False,
            max_iter=20,
            **overrides,
        )


class BackendDeveloperAgent:
    """Backend Developer - Python, Node, APIs"""
    
    ROLE = "Backend Developer"
    GOAL = (
        "Build robust APIs, databases, and server-side systems that scale "
        "reliably and securely."
    )
    BACKSTORY = (
        "You think in data structures and APIs. You know how to design "
        "systems that don't crash and can handle millions of requests. "
        "Security is always on your mind."
    )
    
    @classmethod
    def create(cls, **overrides) -> Agent:
        return Agent(
            role=cls.ROLE,
            goal=cls.GOAL,
            backstory=cls.BACKSTORY,
            tools=[WebSearchTool, DocumentReaderTool, CodeExecutorTool, FileCreatorTool],
            llm=specialist_llm.model,
            verbose=overrides.pop("verbose", default_agent.verbose),
            allow_delegation=False,
            max_iter=20,
            **overrides,
        )


class FullStackDeveloperAgent:
    """Full Stack Developer"""
    
    ROLE = "Full Stack Developer"
    GOAL = (
        "Build complete applications from database to UI, handling both "
        "frontend and backend with equal fluency."
    )
    BACKSTORY = (
        "You're the complete package - you can spin up a database, build "
        "an API, and wrap it in a beautiful UI. You've shipped full products "
        "from idea to launch."
    )
    
    @classmethod
    def create(cls, **overrides) -> Agent:
        return Agent(
            role=cls.ROLE,
            goal=cls.GOAL,
            backstory=cls.BACKSTORY,
            tools=[WebSearchTool, DocumentReaderTool, CodeExecutorTool, FileCreatorTool],
            llm=specialist_llm.model,
            verbose=overrides.pop("verbose", default_agent.verbose),
            allow_delegation=False,
            max_iter=20,
            **overrides,
        )


class DevOpsEngineerAgent:
    """DevOps Engineer - CI/CD, Cloud"""
    
    ROLE = "DevOps Engineer"
    GOAL = (
        "Build CI/CD pipelines, manage cloud infrastructure, and ensure "
        "reliable deployments with monitoring."
    )
    BACKSTORY = (
        "You sleep better when deployments are automated. You know AWS, "
        "Kubernetes, and can debug production issues in your sleep."
    )
    
    @classmethod
    def create(cls, **overrides) -> Agent:
        return Agent(
            role=cls.ROLE,
            goal=cls.GOAL,
            backstory=cls.BACKSTORY,
            tools=[WebSearchTool, DocumentReaderTool, CodeExecutorTool, FileCreatorTool],
            llm=specialist_llm.model,
            verbose=overrides.pop("verbose", default_agent.verbose),
            allow_delegation=False,
            max_iter=15,
            **overrides,
        )


class QAEngineerAgent:
    """QA Engineer - Testing"""
    
    ROLE = "QA Engineer"
    GOAL = (
        "Write test plans, execute tests, track bugs, and ensure quality "
        "before every release."
    )
    BACKSTORY = (
        "You break things for a living - in a good way. You find the bugs "
        "before users do and know how to write tests that actually catch issues."
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
            max_iter=15,
            **overrides,
        )


class SecurityEngineerAgent:
    """Security Engineer - Pen testing, vulnerability"""
    
    ROLE = "Security Engineer"
    GOAL = (
        "Identify vulnerabilities, conduct penetration testing, and ensure "
        "applications are secure against threats."
    )
    BACKSTORY = (
        "You think like an attacker to stop attackers. You know OWASP Top 10 "
        "and can find security holes before the bad guys do."
    )
    
    @classmethod
    def create(cls, **overrides) -> Agent:
        return Agent(
            role=cls.ROLE,
            goal=cls.GOAL,
            backstory=cls.BACKSTORY,
            tools=[WebSearchTool, DocumentReaderTool, CodeExecutorTool],
            llm=specialist_llm.model,
            verbose=overrides.pop("verbose", default_agent.verbose),
            allow_delegation=False,
            max_iter=15,
            **overrides,
        )


class TechLeadAgent:
    """Tech Lead - Architecture, code review"""
    
    ROLE = "Tech Lead"
    GOAL = (
        "Make architectural decisions, code review, mentor developers, "
        "and ensure technical excellence."
    )
    BACKSTORY = (
        "You've led teams that ship. You know when to refactor and when "
        "to ship. You can explain complex technical decisions to business "
        "stakeholders and developers alike."
    )
    
    @classmethod
    def create(cls, **overrides) -> Agent:
        return Agent(
            role=cls.ROLE,
            goal=cls.GOAL,
            backstory=cls.BACKSTORY,
            tools=[WebSearchTool, DocumentReaderTool, CodeExecutorTool, FileCreatorTool],
            llm=specialist_llm.model,
            verbose=overrides.pop("verbose", default_agent.verbose),
            allow_delegation=True,
            max_iter=12,
            **overrides,
        )


__all__ = [
    "FrontendDeveloperAgent",
    "BackendDeveloperAgent",
    "FullStackDeveloperAgent",
    "DevOpsEngineerAgent",
    "QAEngineerAgent",
    "SecurityEngineerAgent",
    "TechLeadAgent",
]