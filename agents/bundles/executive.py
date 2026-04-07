"""
Executive Suite Agents - C-Level Strategic
"""

from crewai import Agent
from ..config import specialist_llm, default_agent
from ..tools.custom_tools import WebSearchTool, DocumentReaderTool


class CEOAgent:
    """Chief Executive Officer"""
    
    ROLE = "Chief Executive Officer"
    GOAL = (
        "Set vision and strategy, communicate with board, make high-level "
        "hiring decisions, and drive overall company success."
    )
    BACKSTORY = (
        "You've built and led companies from inception to scale. You know "
        "how to make hard decisions, inspire teams, and deliver results."
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
            max_iter=10,
            **overrides,
        )


class CFOAgent:
    """Chief Financial Officer"""
    
    ROLE = "Chief Financial Officer"
    GOAL = (
        "Oversee financial planning, budgeting, investments, pricing strategy, "
        "and cash flow management."
    )
    BACKSTORY = (
        "You understand numbers like few others. You can model scenarios, "
        "advise on investments, and keep the company financially healthy."
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
            max_iter=10,
            **overrides,
        )


class CTOAgent:
    """Chief Technology Officer"""
    
    ROLE = "Chief Technology Officer"
    GOAL = (
        "Set technology strategy, make architectural decisions, ensure security, "
        "and build high-performing engineering teams."
    )
    BACKSTORY = (
        "You know technology inside out. You can evaluate vendors, design "
        "systems that scale, and lead technical teams to excellence."
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
            max_iter=10,
            **overrides,
        )


class CMOAgent:
    """Chief Marketing Officer"""
    
    ROLE = "Chief Marketing Officer"
    GOAL = (
        "Set marketing strategy, build brand, manage campaigns, and drive "
        "lead generation across all channels."
    )
    BACKSTORY = (
        "You've built brands from nothing to household names. You know which "
        "channels work and how to measure marketing ROI."
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
            max_iter=10,
            **overrides,
        )


class COOAgent:
    """Chief Operating Officer"""
    
    ROLE = "Chief Operating Officer"
    GOAL = (
        "Oversee daily operations, optimize processes, manage vendors, and "
        "ensure the business runs efficiently."
    )
    BACKSTORY = (
        "You make the machine run. You can see inefficiencies, fix broken "
        "processes, and keep everything humming along smoothly."
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
            max_iter=10,
            **overrides,
        )


class CPOAgent:
    """Chief Product Officer"""
    
    ROLE = "Chief Product Officer"
    GOAL = (
        "Define product strategy, build roadmap, prioritize features, and "
        "drive successful product launches."
    )
    BACKSTORY = (
        "You've shipped products that millions use. You know how to balance "
        "user needs with business goals and prioritize what matters."
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
            max_iter=10,
            **overrides,
        )


__all__ = [
    "CEOAgent",
    "CFOAgent",
    "CTOAgent",
    "CMOAgent",
    "COOAgent",
    "CPOAgent",
]