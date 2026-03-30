"""Dashboard & analytics routes."""

from fastapi import APIRouter

router = APIRouter()


@router.get("/overview")
async def dashboard_overview():
    """Main dashboard metrics."""
    return {
        "active_tasks": 0,
        "tasks_today": 0,
        "avg_delivery_time_minutes": 0,
        "qa_pass_rate": 0,
        "client_satisfaction": 0,
        "cost_per_task_usd": 0,
        "revenue_today_usd": 0,
    }


@router.get("/agent-performance")
async def agent_performance():
    """Per-agent performance metrics."""
    return {
        "agents": [
            {
                "id": "analyst",
                "tasks_completed": 0,
                "avg_score": 0,
                "avg_tokens": 0,
                "avg_cost_usd": 0,
            },
            {
                "id": "builder",
                "tasks_completed": 0,
                "avg_score": 0,
                "avg_tokens": 0,
                "avg_cost_usd": 0,
            },
            {
                "id": "qa_reviewer",
                "tasks_completed": 0,
                "avg_score": 0,
                "avg_tokens": 0,
                "avg_cost_usd": 0,
            },
        ]
    }


@router.get("/qa-insights")
async def qa_insights():
    """QA layer effectiveness."""
    return {
        "automated_reviews": 0,
        "human_reviews": 0,
        "auto_pass_rate": 0,
        "human_override_rate": 0,
        "avg_review_time_seconds": 0,
        "flag_categories": {},
    }


@router.get("/cost-trend")
async def cost_trend(days: int = 30):
    """Cost per task trend over time."""
    return {"days": days, "data": []}
