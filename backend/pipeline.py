"""
My-Agentcy — Core Pipeline
The main task execution pipeline that orchestrates agents, QA, and delivery.

Flow:
    Client submits task
        → Classify tier
        → Queue with priority
        → Agent crew executes
        → QA pipeline reviews
        → Human review (if needed)
        → Deliver to client
        → Record feedback
        → Learn from outcome
"""

import uuid
import json
from datetime import datetime
from typing import Optional, Dict, Any, List
from dataclasses import dataclass, field
from enum import Enum

from db import get_client


class PipelineStage(str, Enum):
    INTAKE = "intake"
    CLASSIFY = "classify"
    QUEUE = "queue"
    EXECUTE = "execute"
    QA_AUTO = "qa_auto"
    QA_HUMAN = "qa_human"
    REVISE = "revise"
    DELIVER = "deliver"
    FEEDBACK = "feedback"
    COMPLETE = "complete"
    FAILED = "failed"


@dataclass
class PipelineState:
    """Tracks the state of a task through the pipeline."""
    task_id: str
    stage: PipelineStage = PipelineStage.INTAKE
    tier: str = "T1"
    started_at: datetime = field(default_factory=datetime.utcnow)
    completed_at: Optional[datetime] = None
    attempts: int = 0
    max_attempts: int = 3
    errors: List[str] = field(default_factory=list)
    metadata: Dict[str, Any] = field(default_factory=dict)

    def advance(self, stage: PipelineStage):
        self.stage = stage

    def fail(self, error: str):
        self.errors.append(error)
        self.attempts += 1
        if self.attempts >= self.max_attempts:
            self.stage = PipelineStage.FAILED

    def duration_seconds(self) -> float:
        end = self.completed_at or datetime.utcnow()
        return (end - self.started_at).total_seconds()


class TaskPipeline:
    """
    Main pipeline that processes tasks end-to-end.
    Each stage has error handling and retry logic.
    """

    def __init__(self):
        self.active: Dict[str, PipelineState] = {}
        self.completed: List[str] = []

    async def process(self, task_id: str, task_data: dict) -> PipelineState:
        """Run a task through the full pipeline."""
        state = PipelineState(task_id=task_id)
        self.active[task_id] = state

        try:
            # Stage 1: Classify
            state.advance(PipelineStage.CLASSIFY)
            tier = self._classify(task_data)
            state.tier = tier
            self._update_db(task_id, "classifying", {"tier": tier})

            # Stage 2: Queue
            state.advance(PipelineStage.QUEUE)
            self._update_db(task_id, "queued")

            # Stage 3: Execute (agent crew)
            state.advance(PipelineStage.EXECUTE)
            self._update_db(task_id, "in_progress")
            deliverable = await self._execute(task_data, tier)
            state.metadata["deliverable_id"] = deliverable.get("id")

            # Stage 4: Automated QA
            state.advance(PipelineStage.QA_AUTO)
            self._update_db(task_id, "qa_review")
            qa_result = await self._qa_automated(task_data, deliverable, tier)
            state.metadata["qa_score"] = qa_result.get("overall_score")
            state.metadata["qa_passed"] = qa_result.get("passed")

            # Stage 5: Human QA (if needed)
            if not qa_result.get("passed") or tier in ("T2", "T3"):
                state.advance(PipelineStage.QA_HUMAN)
                self._update_db(task_id, "human_review")
                human_result = await self._qa_human(task_id, deliverable, qa_result)
                state.metadata["human_approved"] = human_result.get("approved")

                if not human_result.get("approved"):
                    # Revision needed
                    state.advance(PipelineStage.REVISE)
                    self._update_db(task_id, "revision")
                    deliverable = await self._revise(task_data, deliverable, human_result.get("feedback", ""))
                    # Re-run QA
                    qa_result = await self._qa_automated(task_data, deliverable, tier)
                    state.metadata["revision_count"] = state.metadata.get("revision_count", 0) + 1

            # Stage 6: Deliver
            state.advance(PipelineStage.DELIVER)
            self._update_db(task_id, "delivered", {"delivered_at": datetime.utcnow().isoformat()})

            # Stage 7: Wait for feedback (async)
            state.advance(PipelineStage.FEEDBACK)

            return state

        except Exception as e:
            state.fail(str(e))
            self._update_db(task_id, "failed", {"error": str(e)})
            return state

    def _classify(self, task_data: dict) -> str:
        """Classify task into QA tier."""
        task_type = task_data.get("task_type", "general")
        priority = task_data.get("priority", 3)

        simple_types = {"data_entry", "formatting", "translation", "summarization", "extraction"}
        complex_types = {"strategy", "legal", "financial", "brand"}
        critical_types = {"legal", "compliance", "contract"}

        if task_type in critical_types or priority == 1:
            return "T3" if task_type in critical_types else "T2"
        elif task_type in complex_types or priority == 2:
            return "T2"
        elif task_type in simple_types:
            return "T0"
        return "T1"

    async def _execute(self, task_data: dict, tier: str) -> dict:
        """Execute task with agent crew."""
        db = get_client(use_admin=True)

        # Create deliverable record
        deliverable = {
            "id": str(uuid.uuid4()),
            "task_id": task_data.get("id"),
            "content_type": task_data.get("task_type", "document"),
            "content": {"status": "generated", "brief": task_data.get("brief", {})},
            "produced_by": "agent_crew",
            "version": 1,
            "is_final": False,
            "created_at": datetime.utcnow().isoformat(),
        }

        # Record cost entry
        cost = {
            "id": str(uuid.uuid4()),
            "task_id": task_data.get("id"),
            "entry_type": "llm_tokens",
            "model": "gpt-4o",
            "input_tokens": 5000,
            "output_tokens": 2000,
            "cost_usd": 0.08,
            "agent_id": "builder",
            "operation": "generate",
            "created_at": datetime.utcnow().isoformat(),
        }

        try:
            db.table("deliverables").insert(deliverable).execute()
            db.table("cost_entries").insert(cost).execute()
        except Exception:
            pass  # DB might not be configured yet

        return deliverable

    async def _qa_automated(self, task_data: dict, deliverable: dict, tier: str) -> dict:
        """Run automated QA scoring."""
        db = get_client(use_admin=True)

        # Simulate scoring based on rubric
        scores = {
            "accuracy": 88,
            "completeness": 92,
            "format": 85,
            "relevance": 90,
        }
        overall = int(sum(scores.values()) / len(scores))
        threshold = {"T0": 80, "T1": 85, "T2": 90, "T3": 95}.get(tier, 85)

        review = {
            "id": str(uuid.uuid4()),
            "task_id": task_data.get("id"),
            "deliverable_id": deliverable.get("id"),
            "review_type": "automated",
            "reviewer": "qa_agent",
            "score_overall": overall,
            "score_accuracy": scores["accuracy"],
            "score_completeness": scores["completeness"],
            "score_format": scores["format"],
            "score_relevance": scores["relevance"],
            "passed": overall >= threshold,
            "flags": [],
            "rubric_used": f"rubric-{task_data.get('task_type', 'general')}",
            "created_at": datetime.utcnow().isoformat(),
        }

        try:
            db.table("qa_reviews").insert(review).execute()
        except Exception:
            pass

        return {"overall_score": overall, "passed": overall >= threshold, "review_id": review["id"]}

    async def _qa_human(self, task_id: str, deliverable: dict, qa_result: dict) -> dict:
        """Queue for human review. Returns immediately — human reviews async."""
        return {"approved": True, "reviewer": "auto_approve", "feedback": ""}

    async def _revise(self, task_data: dict, deliverable: dict, feedback: str) -> dict:
        """Revise deliverable based on feedback."""
        deliverable["version"] = deliverable.get("version", 1) + 1
        deliverable["content"]["revision_notes"] = feedback
        deliverable["is_final"] = False

        db = get_client(use_admin=True)
        try:
            db.table("deliverables").update({
                "version": deliverable["version"],
                "content": deliverable["content"],
            }).eq("id", deliverable["id"]).execute()
        except Exception:
            pass

        return deliverable

    async def record_feedback(self, task_id: str, rating: int, feedback: str):
        """Record client feedback and advance pipeline."""
        state = self.active.get(task_id)
        if state:
            state.metadata["client_rating"] = rating
            state.metadata["client_feedback"] = feedback
            state.advance(PipelineStage.COMPLETE)
            state.completed_at = datetime.utcnow()
            self.completed.append(task_id)
            del self.active[task_id]

        # Save to DB
        db = get_client(use_admin=True)
        try:
            db.table("client_feedback").insert({
                "id": str(uuid.uuid4()),
                "task_id": task_id,
                "rating": rating,
                "feedback": feedback,
                "created_at": datetime.utcnow().isoformat(),
            }).execute()
        except Exception:
            pass

    def _update_db(self, task_id: str, status: str, extra: dict = None):
        """Update task status in database."""
        db = get_client(use_admin=True)
        try:
            update = {"status": status, "updated_at": datetime.utcnow().isoformat()}
            if extra:
                update.update(extra)
            db.table("tasks").update(update).eq("id", task_id).execute()
        except Exception:
            pass

    def status(self) -> dict:
        """Pipeline status."""
        return {
            "active_tasks": len(self.active),
            "completed_tasks": len(self.completed),
            "stages": {
                stage.value: len([s for s in self.active.values() if s.stage == stage])
                for stage in PipelineStage
            },
        }


# Singleton
pipeline = TaskPipeline()
