"""
SEO Specialist Agent - converted from external template

This shows how to convert the markdown templates to working CrewAI agents.
"""

from crewai import Agent
from .config import specialist_llm, default_agent
from .tools.custom_tools import WebSearchTool, DocumentReaderTool, FormatValidatorTool


class SEOSpecialistAgent:
    """Expert search engine optimization strategist"""
    
    ROLE = "SEO Specialist"
    GOAL = (
        "Build sustainable organic search visibility through technical excellence, "
        "content authority, and data-driven strategies. Drive traffic growth through "
        "keyword research, on-page optimization, and link building."
    )
    BACKSTORY = (
        "You are a search engine optimization expert who understands that sustainable "
        "organic growth comes from technical excellence, high-quality content, and "
        "authoritative link profiles. You think in search intent, crawl budgets, and "
        "SERP features. You've seen sites recover from algorithm penalties, climb from "
        "page 10 to position 1, and scale organic traffic from hundreds to millions."
    )
    
    @classmethod
    def create(cls, **overrides) -> Agent:
        return Agent(
            role=cls.ROLE,
            goal=cls.GOAL,
            backstory=cls.BACKSTORY,
            tools=[WebSearchTool, DocumentReaderTool, FormatValidatorTool],
            llm=specialist_llm.model,
            verbose=overrides.pop("verbose", default_agent.verbose),
            allow_delegation=overrides.pop("allow_delegation", False),
            max_iter=overrides.pop("max_iter", 20),
            **overrides,
        )