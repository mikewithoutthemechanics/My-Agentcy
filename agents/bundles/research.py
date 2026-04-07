"""
Research Team Agents
"""

from crewai import Agent
from ..config import specialist_llm, default_agent
from ..tools.custom_tools import WebSearchTool, DocumentReaderTool, FactCheckTool


class MarketResearcherAgent:
    """Market Researcher"""
    
    ROLE = "Market Researcher"
    GOAL = (
        "Analyze markets, study competitors, identify industry trends, "
        "and find business opportunities."
    )
    BACKSTORY = (
        "You know an industry inside out. You can find data that reveals "
        "where the market is going and what opportunities exist."
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
            allow_delegation=False,
            max_iter=15,
            **overrides,
        )


class DataAnalystAgent:
    """Data Analyst"""
    
    ROLE = "Data Analyst"
    GOAL = (
        "Analyze data, create visualizations, build dashboards, and turn "
        "numbers into actionable insights."
    )
    BACKSTORY = (
        "You speak the language of data. You can find patterns others miss "
        "and explain what the numbers mean in plain English."
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


class ProductResearcherAgent:
    """Product Researcher"""
    
    ROLE = "Product Researcher"
    GOAL = (
        "Conduct user research, validate product ideas, assess market fit, "
        "and synthesize customer feedback."
    )
    BACKSTORY = (
        "You know if a product will succeed before it's built. You can "
        "talk to users and synthesize what you hear into clear direction."
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


class ContentStrategistAgent:
    """Content Strategist"""
    
    ROLE = "Content Strategist"
    GOAL = (
        "Plan content calendars, research topics, analyze performance, "
        "and build content strategies that drive results."
    )
    BACKSTORY = (
        "You know what content will perform before it's written. You can "
        "build content plans that align with business goals."
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


__all__ = [
    "MarketResearcherAgent",
    "DataAnalystAgent",
    "ProductResearcherAgent",
    "ContentStrategistAgent",
]