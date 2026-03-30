"""Roles package — agent role definitions for My-Agentcy."""

from .analyst import AnalystAgent
from .builder import BuilderAgent
from .pm import ProjectManagerAgent
from .qa_reviewer import QAReviewerAgent
from .specialists import (
    DesignerAgent,
    DeveloperAgent,
    ResearcherAgent,
    WriterAgent,
)

__all__ = [
    "AnalystAgent",
    "BuilderAgent",
    "ProjectManagerAgent",
    "QAReviewerAgent",
    "ResearcherAgent",
    "DeveloperAgent",
    "WriterAgent",
    "DesignerAgent",
]
