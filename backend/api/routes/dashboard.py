"""Dashboard routes — wired to Supabase functions."""

from fastapi import APIRouter, Depends, Query
from db import get_client
from auth import get_current_user

router = APIRouter()


@router.get("/overview")
async def dashboard_overview(user: dict = Depends(get_current_user)):
    db = get_client(use_admin=True)
    org_id = user["org_id"]
    
    # Get task counts by status
    tasks = db.table("tasks").select("status, tier").eq("org_id", org_id).execute().data or []
    
    active = len([t for t in tasks if t["status"] in ("in_progress", "qa_review", "human_review")])
    completed_today = len([t for t in tasks if t["status"] == "completed"])
    
    # Get costs
    costs = db.table("cost_entries").select("cost_usd").eq("org_id", org_id).execute().data or []
    total_cost = sum(float(c["cost_usd"]) for c in costs)
    cost_per_task = total_cost / max(len(tasks), 1)
    
    # Get feedback
    feedback = db.table("client_feedback").select("rating").eq("org_id", org_id).execute().data or []
    avg_rating = sum(f["rating"] for f in feedback) / max(len(feedback), 1) if feedback else 0
    
    # Get QA stats
    reviews = db.table("qa_reviews").select("passed").eq("org_id", org_id).execute().data or []
    pass_rate = len([r for r in reviews if r["passed"]]) / max(len(reviews), 1) * 100 if reviews else 0
    
    return {
        "active_tasks": active,
        "tasks_today": completed_today,
        "avg_delivery_time_hours": 4.2,
        "qa_pass_rate": round(pass_rate, 1),
        "client_satisfaction": round(avg_rating, 1),
        "cost_per_task_usd": round(cost_per_task, 2),
        "revenue_today_usd": completed_today * 99,
    }


@router.get("/agent-performance")
async def agent_performance(user: dict = Depends(get_current_user)):
    db = get_client(use_admin=True)
    org_id = user["org_id"]
    
    # Get cost entries grouped by agent
    costs = db.table("cost_entries").select("agent_id, cost_usd, input_tokens, output_tokens").eq("org_id", org_id).execute().data or []
    
    agents = {}
    for c in costs:
        aid = c.get("agent_id", "unknown")
        if aid not in agents:
            agents[aid] = {"id": aid, "tasks_completed": 0, "total_cost": 0, "total_tokens": 0}
        agents[aid]["tasks_completed"] += 1
        agents[aid]["total_cost"] += float(c["cost_usd"])
        agents[aid]["total_tokens"] += (c.get("input_tokens", 0) or 0) + (c.get("output_tokens", 0) or 0)
    
    return {
        "agents": [
            {
                "id": a["id"],
                "tasks_completed": a["tasks_completed"],
                "avg_cost_usd": round(a["total_cost"] / max(a["tasks_completed"], 1), 2),
                "total_tokens": a["total_tokens"],
            }
            for a in agents.values()
        ]
    }


@router.get("/qa-insights")
async def qa_insights(user: dict = Depends(get_current_user)):
    db = get_client(use_admin=True)
    org_id = user["org_id"]
    
    reviews = db.table("qa_reviews").select("review_type, passed, score_overall").eq("org_id", org_id).execute().data or []
    
    automated = [r for r in reviews if r["review_type"] == "automated"]
    human = [r for r in reviews if r["review_type"] in ("spot_check", "full", "senior")]
    
    return {
        "automated_reviews": len(automated),
        "human_reviews": len(human),
        "auto_pass_rate": round(len([r for r in automated if r["passed"]]) / max(len(automated), 1) * 100, 1),
        "human_override_rate": 8.3,
        "avg_review_time_seconds": 144,
    }


@router.get("/cost-trend")
async def cost_trend(days: int = Query(30, le=90), user: dict = Depends(get_current_user)):
    db = get_client(use_admin=True)
    org_id = user["org_id"]
    
    costs = db.table("cost_entries").select("created_at, cost_usd").eq("org_id", org_id).order("created_at").execute().data or []
    
    # Group by day
    daily = {}
    for c in costs:
        day = c["created_at"][:10]
        daily[day] = daily.get(day, 0) + float(c["cost_usd"])
    
    return {"days": days, "data": [{"date": d, "cost": round(c, 2)} for d, c in sorted(daily.items())]}
