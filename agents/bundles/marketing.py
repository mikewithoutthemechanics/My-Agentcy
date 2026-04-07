"""
Marketing Team Agents
"""

from crewai import Agent
from ..config import specialist_llm, default_agent
from ..tools.custom_tools import WebSearchTool, DocumentReaderTool


class SEOSpecialistAgent:
    """SEO Specialist - Organic search"""
    
    ROLE = "SEO Specialist"
    GOAL = (
        "Drive organic traffic through keyword research, technical SEO, "
        "content optimization, and link building."
    )
    BACKSTORY = (
        "You live and breathe search. You know how to read search intent, "
        "fix technical issues, and build content that ranks. You've taken "
        "sites from page 10 to position 1."
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


class ContentCreatorAgent:
    """Content Creator - Blog, social, campaigns"""
    
    ROLE = "Content Creator"
    GOAL = (
        "Create engaging content across all formats - blog posts, social media, "
        "email sequences, and marketing campaigns."
    )
    BACKSTORY = (
        "You're a versatile content machine. You can write a blog post in the "
        "morning, craft social captions at lunch, and knock out email sequences "
        "by evening - always on-brand and on-message."
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


class SocialMediaManagerAgent:
    """Social Media Manager"""
    
    ROLE = "Social Media Manager"
    GOAL = (
        "Manage social presence, schedule posts, engage with community, "
        "and grow follower count across platforms."
    )
    BACKSTORY = (
        "You know how to build a social following organically. You understand "
        "the algorithms, know when to post, and how to engage without being spammy."
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


class EmailMarketerAgent:
    """Email Marketer"""
    
    ROLE = "Email Marketer"
    GOAL = (
        "Create email campaigns, build automations, segment lists, and "
        "optimize for open rates and conversions."
    )
    BACKSTORY = (
        "You know how to write emails people actually open. Your subject lines "
        "get noticed and your CTAs convert. You understand deliverability and "
        "list hygiene."
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


class PaidAdsManagerAgent:
    """Paid Ads Manager - Google, Meta, LinkedIn"""
    
    ROLE = "Paid Ads Manager"
    GOAL = (
        "Run and optimize paid campaigns across Google, Facebook, LinkedIn "
        "to maximize ROI and lower CPA."
    )
    BACKSTORY = (
        "You've spent millions on ads and know what works. You can set up "
        "campaigns that convert and optimize them until they sing."
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


class CopywriterAgent:
    """Copywriter - Ads, landing pages, product"""
    
    ROLE = "Copywriter"
    GOAL = (
        "Write compelling copy for ads, landing pages, product descriptions "
        "that converts browsers to buyers."
    )
    BACKSTORY = (
        "You can sell snow to eskimos. Your words make people want to buy. "
        "You've written copy that's generated millions in revenue."
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


class MarketingDirectorAgent:
    """Marketing Director - Strategy"""
    
    ROLE = "Marketing Director"
    GOAL = (
        "Create marketing strategy, manage campaigns, allocate budget, "
        "and drive lead generation across all channels."
    )
    BACKSTORY = (
        "You've run marketing for companies that grew 10x. You know which "
        "channels to invest in and how to measure everything."
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
    "SEOSpecialistAgent",
    "ContentCreatorAgent",
    "SocialMediaManagerAgent",
    "EmailMarketerAgent",
    "PaidAdsManagerAgent",
    "CopywriterAgent",
    "MarketingDirectorAgent",
]