"""
QACrew — dedicated crew for automated quality assurance.

Runs three QA agents (FactChecker, FormatValidator, Scorer) in parallel
and produces a combined quality score with detailed flags.
"""

from __future__ import annotations

from typing import Optional

from crewai import Agent, Crew, Process, Task

from ..config import qa_llm, scorer_llm, default_crew, CrewConfig
from ..tools.custom_tools import (
    FactCheckTool,
    FormatValidatorTool,
    RubricLookupTool,
)


# ─────────────────────────────────────────────────────────────────────
# Internal agent factories
# ─────────────────────────────────────────────────────────────────────

def _fact_checker_agent() -> Agent:
    """Agent that verifies factual claims in deliverables."""
    return Agent(
        role="Fact Checker",
        goal=(
            "Identify and verify all factual claims in the deliverable. "
            "Flag inaccuracies, unsupported claims, and outdated information."
        ),
        backstory=(
            "You are a rigorous fact-checker with a background in journalism "
            "and data verification. You cross-reference every claim against "
            "credible sources and never accept statements at face value."
        ),
        tools=[FactCheckTool],
        llm=qa_llm.model,
        verbose=True,
        allow_delegation=False,
        memory=True,
    )


def _format_validator_agent() -> Agent:
    """Agent that validates deliverable formatting and structure."""
    return Agent(
        role="Format Validator",
        goal=(
            "Validate that deliverables conform to expected formatting "
            "standards. Check structure, syntax, style, and completeness."
        ),
        backstory=(
            "You are a detail-oriented format validator who has reviewed "
            "thousands of documents, code files, and reports. You catch "
            "formatting inconsistencies that others overlook and ensure "
            "everything meets the specified template or style guide."
        ),
        tools=[FormatValidatorTool],
        llm=qa_llm.model,
        verbose=True,
        allow_delegation=False,
        memory=True,
    )


def _scorer_agent() -> Agent:
    """Agent that computes the final weighted QA score."""
    return Agent(
        role="QA Scorer",
        goal=(
            "Aggregate fact-check and format-validation results into a "
            "single weighted QA score. Use the rubric weights to compute "
            "the final score and issue a clear pass/fail recommendation."
        ),
        backstory=(
            "You are a QA scoring specialist who synthesizes multiple "
            "evaluation signals into clear, defensible scores. You apply "
            "rubric weights precisely and always explain your scoring."
        ),
        tools=[RubricLookupTool],
        llm=scorer_llm.model,
        verbose=True,
        allow_delegation=False,
        memory=True,
    )


# ─────────────────────────────────────────────────────────────────────
# Task factories
# ─────────────────────────────────────────────────────────────────────

def _fact_check_task(deliverable: str, agent: Agent) -> Task:
    return Task(
        description=(
            f"Review the following deliverable and verify every factual "
            f"claim. For each claim, state whether it is supported, "
            f"contradicted, or inconclusive.\n\nDeliverable:\n{deliverable}"
        ),
        expected_output=(
            "A JSON list of {claim, verdict (supported|contradicted|"
            "inconclusive), confidence, explanation} for each claim found."
        ),
        agent=agent,
    )


def _format_validation_task(deliverable: str, expected_format: str, agent: Agent) -> Task:
    return Task(
        description=(
            f"Validate the following deliverable against the expected "
            f"format '{expected_format}'. Check structure, syntax, and "
            f"style compliance.\n\nDeliverable:\n{deliverable}"
        ),
        expected_output=(
            "A JSON object with keys: valid (bool), errors (list), "
            "warnings (list), score (float 0-1)."
        ),
        agent=agent,
    )


def _scoring_task(task_type: str, agent: Agent) -> Task:
    return Task(
        description=(
            f"Using the rubric for task type '{task_type}' and the "
            f"results from the Fact Checker and Format Validator, "
            f"compute the final weighted QA score. Issue a pass/fail "
            f"verdict with detailed reasoning."
        ),
        expected_output=(
            "A JSON object with keys: overall_score (float 0-1), "
            "pass (bool), criteria_scores (dict), flags (list), "
            "recommendation ('approve'|'revise'|'reject'), "
            "summary (string)."
        ),
        agent=agent,
    )


# ─────────────────────────────────────────────────────────────────────
# QACrew
# ─────────────────────────────────────────────────────────────────────

class QACrew:
    """Factory for assembling and running QA-specific crews.

    Usage::

        crew = QACrew.build(
            deliverable="The report content...",
            task_type="document",
            expected_format="markdown",
        )
        result = crew.kickoff()
    """

    @classmethod
    def build(
        cls,
        deliverable: str,
        task_type: str = "general",
        expected_format: str = "markdown",
        config: Optional[CrewConfig] = None,
    ) -> Crew:
        """Assemble a QA crew with FactChecker, FormatValidator, and Scorer.

        Args:
            deliverable: The content to review.
            task_type: Drives rubric selection (code, document, analysis, …).
            expected_format: Expected output format for validation.
            config: Optional crew-level overrides.
        """
        cfg = config or default_crew

        # Create agents
        fc_agent = _fact_checker_agent()
        fv_agent = _format_validator_agent()
        scorer = _scorer_agent()

        # Create tasks
        # Fact check and format validation run "independently" —
        # in sequential process they still run in order, but the scorer
        # depends on both outputs.
        fc_task = _fact_check_task(deliverable, fc_agent)
        fv_task = _format_validation_task(deliverable, expected_format, fv_agent)
        score_task = _scoring_task(task_type, scorer)

        return Crew(
            agents=[fc_agent, fv_agent, scorer],
            tasks=[fc_task, fv_task, score_task],
            process=Process.sequential,
            verbose=cfg.verbose,
            memory=cfg.memory,
            max_rpm=cfg.max_rpm,
        )

    @classmethod
    def quick_score(
        cls,
        deliverable: str,
        task_type: str = "general",
        expected_format: str = "markdown",
    ) -> Crew:
        """Minimal QA crew — just scoring with rubric, no deep checks."""
        scorer = _scorer_agent()
        score_task = _scoring_task(task_type, scorer)
        # Override description for quick mode
        score_task.description = (
            f"Review this deliverable and produce a quick QA score "
            f"using the '{task_type}' rubric.\n\nDeliverable:\n{deliverable}"
        )
        return Crew(
            agents=[scorer],
            tasks=[score_task],
            process=Process.sequential,
            verbose=True,
            memory=False,
        )
