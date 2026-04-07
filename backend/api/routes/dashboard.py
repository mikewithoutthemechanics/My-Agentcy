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
    
    # Get agent stats
    agents = db.table("agent_status").select("name, status, active_tasks, avg_score").eq("org_id", org_id).execute().data or []
    
    return {
        "active_tasks": active,
        "completed_today": completed_today,
        "total_cost": total_cost,
        "cost_per_task": round(cost_per_task, 2),
        "avg_rating": round(avg_rating, 1),
        "agent_count": len(agents),
        "active_agents": len([a for a in agents if a.get("status") == "active"]),
    }


@router.get("/tasks/recent")
async def recent_tasks(user: dict = Depends(get_current_user), limit: int = 10):
    db = get_client(use_admin=True)
    tasks = db.table("tasks").select(
        "id, title, status, tier, created_at, agent_name"
    ).eq("org_id", user["org_id"]).order("created_at", desc=True).limit(limit).execute().data or []
    return {"tasks": tasks}


@router.get("/agents/status")
async def agent_status(user: dict = Depends(get_current_user)):
    db = get_client(use_admin=True)
    agents = db.table("agent_status").select(
        "name, status, active_tasks, avg_score"
    ).eq("org_id", user["org_id"]).execute().data or []
    return {"agents": agents}


@router.get("/costs/trend")
async def cost_trend(user: dict = Depends(get_current_user), days: int = 14):
    db = get_client(use_admin=True)
    costs = db.table("cost_entries").select("cost_usd, created_at").eq("org_id", user["org_id"]).execute().data or []
    return {"costs": costs}