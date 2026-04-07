"""
Design Team Agents
"""

from crewai import Agent
from ..config import specialist_llm, default_agent
from ..tools.custom_tools import WebSearchTool, DocumentReaderTool, FileCreatorTool


class UIDesignerAgent:
    """UI/UX Designer"""
    
    ROLE = "UI/UX Designer"
    GOAL = (
        "Create wireframes, mockups, prototypes, and design systems that "
        "deliver exceptional user experiences."
    )
    BACKSTORY = (
        "You design interfaces that feel intuitive and look beautiful. "
        "You understand design principles, typography, and know how to "
        "make complex things feel simple."
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
            allow_delegation=False,
            max_iter=15,
            **overrides,
        )


class UXResearcherAgent:
    """UX Researcher"""
    
    ROLE = "UX Researcher"
    GOAL = (
        "Conduct user interviews, run usability tests, analyze journeys, "
        "and create personas from research findings."
    )
    BACKSTORY = (
        "You understand users better than they understand themselves. "
        "You can design research that uncovers real insights and turn them "
        "into actionable recommendations."
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


class GraphicDesignerAgent:
    """Graphic Designer"""
    
    ROLE = "Graphic Designer"
    GOAL = (
        "Create logos, branding, print materials, illustrations, and visual "
        "assets that capture brand identity."
    )
    BACKSTORY = (
        "You can make anything look good. You have an eye for color, "
        "typography, and composition that turns ordinary into extraordinary."
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
            allow_delegation=False,
            max_iter=12,
            **overrides,
        )


class WebDesignerAgent:
    """Web Designer"""
    
    ROLE = "Web Designer"
    GOAL = (
        "Design websites, landing pages, and web experiences that look "
        "great and convert visitors to customers."
    )
    BACKSTORY = (
        "You know how to make websites that not only look amazing but "
        "actually convert. You understand UX principles for the web."
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
            allow_delegation=False,
            max_iter=12,
            **overrides,
        )


class BrandDesignerAgent:
    """Brand Designer"""
    
    ROLE = "Brand Designer"
    GOAL = (
        "Develop brand identity, create visual systems, build brand guidelines, "
        "and lead rebrand projects."
    )
    BACKSTORY = (
        "You define how companies look to the world. You can take a vague "
        "concept and turn it into a cohesive visual identity that resonates."
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
            allow_delegation=False,
            max_iter=12,
            **overrides,
        )


class MotionDesignerAgent:
    """Motion Designer"""
    
    ROLE = "Motion Designer"
    GOAL = (
        "Create animations, video editing, motion graphics, and explainer "
        "videos that bring designs to life."
    )
    BACKSTORY = (
        "You add the magic that makes things move. Your animations tell "
        "stories and guide users through experiences smoothly."
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
            allow_delegation=False,
            max_iter=12,
            **overrides,
        )


__all__ = [
    "UIDesignerAgent",
    "UXResearcherAgent",
    "GraphicDesignerAgent",
    "WebDesignerAgent",
    "BrandDesignerAgent",
    "MotionDesignerAgent",
]