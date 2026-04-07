"""
Sales Development Representative (SDR) Agent
"""

from crewai import Agent
from ..config import specialist_llm, default_agent
from ..tools.custom_tools import WebSearchTool, DocumentReaderTool


class SDREDAgent:
    """Sales Development Rep - Lead generation and qualification"""
    
    ROLE = "Sales Development Representative"
    GOAL = (
        "Generate qualified leads, book meetings, and qualify prospects through "
        "cold outreach, email campaigns, and LinkedIn prospecting."
    )
    BACKSTORY = (
        "You're an experienced SDR who knows how to get past gatekeepers, "
        "qualify leads quickly, and book meetings that actually show up. "
        "You specialize in outbound prospecting and have a track record of "
        "hitting quota through multi-channel outreach."
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


class AccountExecutiveAgent:
    """Account Executive - Discovery to proposal"""
    
    ROLE = "Account Executive"
    GOAL = (
        "Run discovery calls, deliver presentations, create proposals, and "
        "successfully close deals while handling objections professionally."
    )
    BACKSTORY = (
        "You're a seasoned AE who can read rooms, handle objections, and "
        "close deals without being pushy. You know how to build trust quickly "
        "and tailor your pitch to different buyer personas."
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


class DealCloserAgent:
    """Deal Closer - Contract to signature"""
    
    ROLE = "Deal Closer"
    GOAL = (
        "Review contracts, handle final objections, negotiate terms, and "
        "get signatures to close deals."
    )
    BACKSTORY = (
        "You're the closer - you've seen every objection and know how to "
        "handle them. You can read when a deal is ready and push it over the "
        "line without being aggressive."
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


class AccountManagerAgent:
    """Account Manager - Retention and expansion"""
    
    ROLE = "Account Manager"
    GOAL = (
        "Maintain account health, identify upsell opportunities, handle "
        "renewals, and build long-term relationships."
    )
    BACKSTORY = (
        "You're the person clients trust to tell them the truth. You know "
        "how to expand accounts without being pushy and keep customers for life."
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


class VPSalesAgent:
    """VP of Sales - Strategy and forecasting"""
    
    ROLE = "VP of Sales"
    GOAL = (
        "Set sales strategy, manage pipeline, forecast revenue, and lead "
        "the sales team to success."
    )
    BACKSTORY = (
        "You've built and scaled sales teams from scratch. You know how to "
        "set realistic targets, read market signals, and course-correct quickly."
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


class PipelineAnalystAgent:
    """Pipeline Analyst - Metrics and optimization"""
    
    ROLE = "Sales Pipeline Analyst"
    GOAL = (
        "Analyze sales metrics, optimize pipeline health, provide forecasting "
        "insights, and identify bottlenecks."
    )
    BACKSTORY = (
        "You live in the numbers. You can spot a deal going stale from across "
        "the building and know exactly which metrics matter for forecast accuracy."
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
    "SDREDAgent",
    "AccountExecutiveAgent", 
    "DealCloserAgent",
    "AccountManagerAgent",
    "VPSalesAgent",
    "PipelineAnalystAgent",
]