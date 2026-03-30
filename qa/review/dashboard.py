"""
My-Agentcy — Human Review Dashboard Backend

Routes and logic for the human QA review interface.
Reviewers see flagged deliverables, score them, and approve/reject.
"""

from fastapi import APIRouter, HTTPException
from pydantic import BaseModel
from typing import Optional
from datetime import datetime
import uuid

router = APIRouter()


class ReviewAssignment(BaseModel):
    task_id: str
    deliverable_id: str
    reviewer_id: str
    review_type: str  # spot_check, full, senior
    deadline: Optional[str] = None


class ReviewSubmission(BaseModel):
    review_id: str
    scores: dict  # {accuracy: 85, completeness: 90, format: 80, relevance: 88}
    flags: list[dict]  # [{field, issue, severity, suggestion}]
    comments: str
    decision: str  # approve, reject, request_revision


class ReviewQueueItem(BaseModel):
    review_id: str
    task_id: str
    task_title: str
    task_type: str
    tier: str
    review_type: str
    priority: int
    deadline: Optional[str]
    assigned_to: Optional[str]
    qa_agent_score: int
    qa_agent_flags: int
    status: str  # pending, in_progress, completed
    created_at: str


@router.get("/queue")
async def get_review_queue(
    reviewer_id: Optional[str] = None,
    review_type: Optional[str] = None,
    limit: int = 20,
):
    """
    Get items pending human review.
    Filter by reviewer or review type.
    """
    # In production: query qa_reviews where review_type != 'automated' and passed = false
    return {
        "queue": [],
        "total": 0,
        "filters": {"reviewer_id": reviewer_id, "review_type": review_type},
    }


@router.get("/queue/{review_id}")
async def get_review_detail(review_id: str):
    """
    Get full review details including:
    - Original brief
    - Deliverable content
    - QA agent's scores and flags
    - Rubric criteria
    - Previous review history for this task
    """
    return {
        "review_id": review_id,
        "brief": {},
        "deliverable": {},
        "qa_agent_review": {},
        "rubric": {},
        "history": [],
    }


@router.post("/assign")
async def assign_review(assignment: ReviewAssignment):
    """Assign a review to a human reviewer."""
    return {
        "status": "assigned",
        "review_id": str(uuid.uuid4()),
        "assigned_to": assignment.reviewer_id,
        "deadline": assignment.deadline,
    }


@router.post("/submit")
async def submit_review(submission: ReviewSubmission):
    """
    Reviewer submits their review.
    Updates the QA review record and triggers next steps:
    - approve → deliver to client
    - reject → send back to agent for revision
    - request_revision → notify agent with specific feedback
    """
    return {
        "status": "submitted",
        "review_id": submission.review_id,
        "decision": submission.decision,
        "next_action": _get_next_action(submission.decision),
    }


@router.post("/batch-approve")
async def batch_approve(review_ids: list[str]):
    """Approve multiple reviews at once (for spot-check batch)."""
    return {
        "status": "batch_approved",
        "count": len(review_ids),
        "review_ids": review_ids,
    }


@router.get("/reviewer/{reviewer_id}/stats")
async def reviewer_stats(reviewer_id: str):
    """Get reviewer performance stats."""
    return {
        "reviewer_id": reviewer_id,
        "total_reviews": 0,
        "avg_review_time_minutes": 0,
        "approval_rate": 0,
        "avg_score_given": 0,
        "agreement_with_qa_agent": 0,  # How often reviewer agrees with automated QA
    }


@router.get("/diff/{review_id}")
async def get_review_diff(review_id: str):
    """
    Get a diff-based view for faster review:
    - What the brief asked for vs. what was delivered
    - Highlighted sections the QA agent flagged
    - Side-by-side with similar past deliverables
    """
    return {
        "review_id": review_id,
        "brief_vs_deliverable": [],
        "flagged_sections": [],
        "similar_past_work": [],
    }


def _get_next_action(decision: str) -> str:
    """Determine what happens after a review decision."""
    actions = {
        "approve": "deliver_to_client",
        "reject": "revise_and_resubmit",
        "request_revision": "revise_with_feedback",
    }
    return actions.get(decision, "manual_intervention")
