"""Client feedback routes."""

from fastapi import APIRouter

router = APIRouter()


@router.post("/")
async def submit_feedback(task_id: str, rating: int, feedback: str = ""):
    """Client submits feedback on delivered work."""
    return {"status": "recorded", "task_id": task_id, "rating": rating}


@router.post("/revise")
async def request_revision(task_id: str, notes: str = ""):
    """Client requests revision."""
    return {"status": "revision_requested", "task_id": task_id}


@router.get("/summary")
async def feedback_summary():
    """Aggregated feedback metrics."""
    return {
        "avg_rating": 0,
        "total_reviews": 0,
        "revision_rate": 0,
        "by_task_type": {},
    }
