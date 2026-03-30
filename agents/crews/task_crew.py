"""
TaskCrew — assembles agents into a crew for executing a specific task.

Supports:
  - Sequential process: analyst → builder → QA (linear pipeline)
  - Hierarchical process: PM delegates to analyst/builder/QA (complex tasks)
"""

from __future__ import annotations

from typing import Any, Optional

from crewai import Agent, Crew, Process, Task

from ..config import CrewConfig, default_crew
from ..roles.analyst import AnalystAgent
from ..roles.builder import BuilderAgent
from ..roles.pm import ProjectManagerAgent
from ..roles.qa_reviewer import QAReviewerAgent


class TaskCrew:
    """Factory for assembling and kicking off task-oriented crews.

    Usage::

        crew = TaskCrew.build(
            brief="Build a landing page for product X",
            task_type="code",          # drives rubric selection
            process="sequential",      # or "hierarchical"
        )
        result = crew.kickoff()
    """

    # ── builders ─────────────────────────────────────────────────────

    @staticmethod
    def _build_analyst_task(brief: str) -> Task:
        return Task(
            description=(
                f"Analyze the following client brief and produce a structured "
                f"JSON task plan. Include: task steps (id, title, description), "
                f"dependencies between steps, estimated time per step, and "
                f"acceptance criteria.\n\nBrief:\n{brief}"
            ),
            expected_output=(
                "A JSON object with keys: tasks (list of {id, title, description, "
                "dependencies, estimated_minutes, acceptance_criteria}), "
                "total_estimated_minutes (int), summary (string)."
            ),
            agent=AnalystAgent.create(),
        )

    @staticmethod
    def _build_builder_task(task_type: str = "general") -> Task:
        return Task(
            description=(
                "Take the analyst's task plan and execute each step. "
                "For each completed step, note the output artifact path "
                "or content. Produce a final deliverable that matches "
                "the acceptance criteria from the plan."
            ),
            expected_output=(
                "A list of completed tasks with their output artifacts. "
                "A final summary of what was delivered."
            ),
            agent=BuilderAgent.create(),
        )

    @staticmethod
    def _build_qa_task(task_type: str = "general") -> Task:
        return Task(
            description=(
                f"Evaluate the builder's deliverables against the analyst's "
                f"plan and the rubric for task type '{task_type}'. "
                f"Score each criterion, compute a weighted total, and "
                f"produce a QA report with pass/fail and specific flags."
            ),
            expected_output=(
                "A JSON object with keys: score (float 0-1), pass (bool), "
                "criteria_scores (dict), flags (list of issues), "
                "recommendation ('approve' | 'revise' | 'reject')."
            ),
            agent=QAReviewerAgent.create(),
        )

    @staticmethod
    def _build_pm_task() -> Task:
        return Task(
            description=(
                "Compile a client-facing status report summarizing: "
                "what was planned, what was built, QA results, and "
                "next steps or recommendations."
            ),
            expected_output=(
                "A clear, concise status report suitable for the client."
            ),
            agent=ProjectManagerAgent.create(),
        )

    # ── public API ───────────────────────────────────────────────────

    @classmethod
    def build(
        cls,
        brief: str,
        task_type: str = "general",
        process: str = "sequential",
        config: Optional[CrewConfig] = None,
        agents: Optional[list[Agent]] = None,
        tasks: Optional[list[Task]] = None,
    ) -> Crew:
        """Assemble and return a Crew ready to kick off.

        Args:
            brief: The client brief / task description.
            task_type: Category (code, document, analysis, …) — used for rubric.
            process: 'sequential' or 'hierarchical'.
            config: Optional crew-level config overrides.
            agents: Override default agent list.
            tasks: Override default task list.
        """
        cfg = config or default_crew
        proc = Process.hierarchical if process == "hierarchical" else Process.sequential

        if tasks is None:
            tasks = [
                cls._build_analyst_task(brief),
                cls._build_builder_task(task_type),
                cls._build_qa_task(task_type),
                cls._build_pm_task(),
            ]

        if agents is None:
            agents = [t.agent for t in tasks]

        return Crew(
            agents=agents,
            tasks=tasks,
            process=proc,
            verbose=cfg.verbose,
            memory=cfg.memory,
            max_rpm=cfg.max_rpm,
            share_crew=cfg.share_crew,
        )

    @classmethod
    def build_sequential(cls, brief: str, task_type: str = "general", **kwargs) -> Crew:
        """Shortcut for sequential pipeline: analyst → builder → QA → PM."""
        return cls.build(brief=brief, task_type=task_type, process="sequential", **kwargs)

    @classmethod
    def build_hierarchical(cls, brief: str, task_type: str = "general", **kwargs) -> Crew:
        """Shortcut for hierarchical process (PM as manager)."""
        return cls.build(brief=brief, task_type=task_type, process="hierarchical", **kwargs)
