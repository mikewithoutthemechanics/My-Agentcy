"""
My-Agentcy Agents — CrewAI agent system for AI Workforce as a Service.

Quick start::

    from agents import TaskCrew, QACrew
    from agents.roles import AnalystAgent, BuilderAgent, QAReviewerAgent

    # Run a full pipeline
    crew = TaskCrew.build_sequential(
        brief="Create a competitive analysis for SaaS CRM tools",
        task_type="analysis",
    )
    result = crew.kickoff()

    # Or just run QA on existing content
    qa = QACrew.build(
        deliverable="My report content...",
        task_type="document",
        expected_format="markdown",
    )
    qa_result = qa.kickoff()
"""

# ── Roles ────────────────────────────────────────────────────────────
from .roles import (
    AnalystAgent,
    BuilderAgent,
    DesignerAgent,
    DeveloperAgent,
    ProjectManagerAgent,
    QAReviewerAgent,
    ResearcherAgent,
    WriterAgent,
)

# ── Crews ────────────────────────────────────────────────────────────
from .crews import QACrew, TaskCrew

# ── Tools ────────────────────────────────────────────────────────────
from .tools import (
    ALL_TOOLS,
    CodeExecutorTool,
    DocumentReaderTool,
    EscalationTool,
    FactCheckTool,
    FileCreatorTool,
    FormatValidatorTool,
    NotificationTool,
    RubricLookupTool,
    StatusUpdateTool,
    WebSearchTool,
)

# ── Config ───────────────────────────────────────────────────────────
from .config import (
    AgentConfig,
    CrewConfig,
    LLMConfig,
    analyst_llm,
    builder_llm,
    default_agent,
    default_crew,
    default_llm,
    pm_llm,
    qa_llm,
    scorer_llm,
    specialist_llm,
)

__all__ = [
    # Roles
    "AnalystAgent",
    "BuilderAgent",
    "QAReviewerAgent",
    "ProjectManagerAgent",
    "ResearcherAgent",
    "DeveloperAgent",
    "WriterAgent",
    "DesignerAgent",
    # Crews
    "TaskCrew",
    "QACrew",
    # Tools
    "ALL_TOOLS",
    "WebSearchTool",
    "DocumentReaderTool",
    "CodeExecutorTool",
    "FileCreatorTool",
    "RubricLookupTool",
    "FactCheckTool",
    "FormatValidatorTool",
    "StatusUpdateTool",
    "NotificationTool",
    "EscalationTool",
    # Config
    "LLMConfig",
    "AgentConfig",
    "CrewConfig",
    "default_llm",
    "default_agent",
    "default_crew",
    "analyst_llm",
    "builder_llm",
    "qa_llm",
    "pm_llm",
    "specialist_llm",
    "scorer_llm",
]
