"""QA & review routes."""

from fastapi import APIRouter

router = APIRouter()


@router.get("/queue")
async def review_queue():
    """Get items pending human review."""
    return {"queue": [], "total": 0}


@router.post("/{review_id}/approve")
async def approve_review(review_id: str):
    """Approve a deliverable after review."""
    return {"id": review_id, "status": "approved"}


@router.post("/{review_id}/reject")
async def reject_review(review_id: str, reason: str = ""):
    """Reject and send back for revision."""
    return {"id": review_id, "status": "rejected", "reason": reason}


@router.get("/rubrics")
async def list_rubrics():
    """List available QA rubrics by task type."""
    return {"rubrics": []}


@router.get("/stats")
async def qa_stats():
    """QA performance statistics."""
    return {
        "total_reviewed": 0,
        "pass_rate": 0,
        "avg_score": 0,
        "automated_pass_rate": 0,
        "human_override_rate": 0,
    }
