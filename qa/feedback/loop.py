"""
My-Agentcy — Feedback Loop & Self-Improvement System

The feedback loop drives continuous improvement:
1. Client rates every delivery (1-5 stars + feedback)
2. Low-rated deliveries trigger agent prompt updates
3. Track which task types consistently score high → reduce review frequency
4. Track which types fail → increase scrutiny or add guardrails

This is the system that makes the QA layer thinner over time.
"""

from dataclasses import dataclass, field
from datetime import datetime
from typing import Optional
from enum import Enum


class FeedbackCategory(str, Enum):
    ACCURACY = "accuracy"
    SPEED = "speed"
    COMMUNICATION = "communication"
    VALUE = "value"
    COMPLETENESS = "completeness"
    FORMAT = "format"


class ImprovementAction(str, Enum):
    UPDATE_PROMPT = "update_prompt"
    ADD_GUARDRAIL = "add_guardrail"
    REDUCE_REVIEW = "reduce_review"
    ESCALATE_REVIEW = "escalate_review"
    CREATE_TEMPLATE = "create_template"
    ADD_EXAMPLE = "add_example"


@dataclass
class ClientFeedback:
    """Feedback from a client on a delivered task."""
    task_id: str
    org_id: str
    rating: int  # 1-5
    feedback: str = ""
    revision_requested: bool = False
    revision_notes: str = ""
    categories: list[str] = field(default_factory=list)
    created_at: datetime = field(default_factory=datetime.utcnow)

    @property
    def is_positive(self) -> bool:
        return self.rating >= 4

    @property
    def needs_attention(self) -> bool:
        return self.rating <= 2 or self.revision_requested


@dataclass
class ImprovementInsight:
    """A learning extracted from feedback analysis."""
    insight_id: str
    agent_id: str
    task_type: str
    pattern: str  # What was observed
    action: ImprovementAction
    detail: str  # Specific change to make
    confidence: float  # 0-1
    source_task_ids: list[str] = field(default_factory=list)
    applied: bool = False
    created_at: datetime = field(default_factory=datetime.utcnow)


@dataclass
class TaskTypePerformance:
    """Performance metrics for a specific task type."""
    task_type: str
    total_tasks: int = 0
    avg_rating: float = 0.0
    avg_qa_score: float = 0.0
    revision_rate: float = 0.0  # % of tasks that needed revision
    avg_delivery_hours: float = 0.0
    avg_cost_usd: float = 0.0
    tier_distribution: dict = field(default_factory=dict)  # {T0: N, T1: N, ...}
    trend: str = "stable"  # improving, declining, stable


class FeedbackLoop:
    """
    Core feedback loop that drives self-improvement.
    
    Analyzes feedback patterns and generates improvement actions.
    """

    def __init__(self):
        self.feedback_history: list[ClientFeedback] = []
        self.insights: list[ImprovementInsight] = []
        self.task_type_performance: dict[str, TaskTypePerformance] = {}

    def record_feedback(self, feedback: ClientFeedback):
        """Record client feedback and check for improvement opportunities."""
        self.feedback_history.append(feedback)
        self._update_task_type_performance(feedback)

        if feedback.needs_attention:
            self._analyze_for_improvement(feedback)

    def _update_task_type_performance(self, feedback: ClientFeedback):
        """Update performance metrics for the task type."""
        # In production, look up task_type from task_id
        task_type = "general"  # placeholder

        if task_type not in self.task_type_performance:
            self.task_type_performance[task_type] = TaskTypePerformance(task_type=task_type)

        perf = self.task_type_performance[task_type]
        perf.total_tasks += 1

        # Rolling average
        n = perf.total_tasks
        perf.avg_rating = ((perf.avg_rating * (n - 1)) + feedback.rating) / n

        if feedback.revision_requested:
            perf.revision_rate = ((perf.revision_rate * (n - 1)) + 1) / n
        else:
            perf.revision_rate = (perf.revision_rate * (n - 1)) / n

    def _analyze_for_improvement(self, feedback: ClientFeedback):
        """Analyze negative feedback and generate improvement insights."""

        # Pattern: Frequent revisions on same task type
        if feedback.revision_requested:
            insight = ImprovementInsight(
                insight_id=f"insight-{len(self.insights)}",
                agent_id="builder",
                task_type="general",
                pattern="Client requested revision",
                action=ImprovementAction.UPDATE_PROMPT,
                detail=f"Revision reason: {feedback.revision_notes}",
                confidence=0.7,
                source_task_ids=[feedback.task_id],
            )
            self.insights.append(insight)

        # Pattern: Low rating with specific category issues
        if feedback.rating <= 2:
            for category in feedback.categories:
                insight = ImprovementInsight(
                    insight_id=f"insight-{len(self.insights)}",
                    agent_id="builder",
                    task_type="general",
                    pattern=f"Low rating due to {category}",
                    action=ImprovementAction.ADD_GUARDRAIL,
                    detail=f"Add guardrail for {category} quality check",
                    confidence=0.8,
                    source_task_ids=[feedback.task_id],
                )
                self.insights.append(insight)

    def should_reduce_review(self, task_type: str) -> bool:
        """
        Determine if we can reduce review frequency for a task type.
        Criteria: 50+ tasks, avg rating >4.5, revision rate <5%, avg QA score >90.
        """
        perf = self.task_type_performance.get(task_type)
        if not perf:
            return False

        return (
            perf.total_tasks >= 50
            and perf.avg_rating >= 4.5
            and perf.revision_rate <= 0.05
            and perf.avg_qa_score >= 90
        )

    def should_escalate_review(self, task_type: str) -> bool:
        """
        Determine if we need to increase review frequency.
        Criteria: avg rating <3.0 or revision rate >30%.
        """
        perf = self.task_type_performance.get(task_type)
        if not perf:
            return False

        return perf.avg_rating < 3.0 or perf.revision_rate > 0.30

    def get_pending_insights(self) -> list[ImprovementInsight]:
        """Get insights that haven't been applied yet."""
        return [i for i in self.insights if not i.applied]

    def get_dashboard_metrics(self) -> dict:
        """Metrics for the feedback dashboard."""
        if not self.feedback_history:
            return {"total_feedback": 0}

        total = len(self.feedback_history)
        avg_rating = sum(f.rating for f in self.feedback_history) / total
        revision_rate = sum(1 for f in self.feedback_history if f.revision_requested) / total

        return {
            "total_feedback": total,
            "avg_rating": round(avg_rating, 2),
            "revision_rate": round(revision_rate * 100, 1),
            "rating_distribution": {
                str(i): sum(1 for f in self.feedback_history if f.rating == i)
                for i in range(1, 6)
            },
            "task_type_performance": {
                k: {
                    "total_tasks": v.total_tasks,
                    "avg_rating": round(v.avg_rating, 2),
                    "revision_rate": round(v.revision_rate * 100, 1),
                    "trend": v.trend,
                }
                for k, v in self.task_type_performance.items()
            },
            "pending_insights": len(self.get_pending_insights()),
        }
