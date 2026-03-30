"""
Client Portal API Routes
Separate from admin — clients use this to submit tasks, view deliverables, give feedback.
"""

from fastapi import APIRouter, HTTPException, Depends, Query
from pydantic import BaseModel
from typing import Optional, List
from datetime import datetime
import uuid

from db import get_client
from auth import get_current_user

router = APIRouter()


class ClientTaskCreate(BaseModel):
    title: str
    description: str
    task_type: str
    priority: int = 3
    requirements: List[str] = []
    deadline: Optional[str] = None
    attachments: List[str] = []


class ClientFeedback(BaseModel):
    task_id: str
    rating: int
    feedback: str = ""


# ── Client Dashboard ──────────────────────────────────

@router.get("/overview")
async def client_overview(user: dict = Depends(get_current_user)):
    """Client's personal dashboard — their tasks and stats."""
    db = get_client(use_admin=True)
    org_id = user["org_id"]
    
    tasks = db.table("tasks").select("status, created_at").eq("org_id", org_id).execute().data or []
    
    active = len([t for t in tasks if t["status"] not in ("completed", "failed")])
    completed = len([t for t in tasks if t["status"] == "completed"])
    
    feedback = db.table("client_feedback").select("rating").eq("org_id", org_id).execute().data or []
    avg_rating = sum(f["rating"] for f in feedback) / max(len(feedback), 1) if feedback else 0
    
    return {
        "active_tasks": active,
        "completed_tasks": completed,
        "total_tasks": len(tasks),
        "your_satisfaction": round(avg_rating, 1),
        "plan": "Pro",  # From org record
        "tasks_remaining": max(80 - len(tasks), 0),
    }


# ── Client Task Management ───────────────────────────

@router.post("/tasks")
async def submit_task(task: ClientTaskCreate, user: dict = Depends(get_current_user)):
    """Submit a new task with a brief."""
    db = get_client(use_admin=True)
    
    data = {
        "id": str(uuid.uuid4()),
        "org_id": user["org_id"],
        "created_by": user["id"],
        "title": task.title,
        "description": task.description,
        "task_type": task.task_type,
        "priority": task.priority,
        "tier": "T1",
        "status": "queued",
        "brief": {"description": task.description, "requirements": task.requirements, "attachments": task.attachments},
        "requirements": task.requirements,
        "deadline": task.deadline,
        "created_at": datetime.utcnow().isoformat(),
    }
    
    db.table("tasks").insert(data).execute()
    return {"id": data["id"], "status": "queued", "message": "Task submitted! Our AI team will begin working on it shortly."}


@router.get("/tasks")
async def list_my_tasks(
    status: Optional[str] = None,
    limit: int = Query(20, le=50),
    user: dict = Depends(get_current_user),
):
    """List your tasks with status."""
    db = get_client(use_admin=True)
    query = db.table("tasks").select("id, title, task_type, status, tier, created_at, deadline").eq("org_id", user["org_id"])
    
    if status:
        query = query.eq("status", status)
    
    result = query.order("created_at", desc=True).limit(limit).execute()
    return {"tasks": result.data}


@router.get("/tasks/{task_id}")
async def get_my_task(task_id: str, user: dict = Depends(get_current_user)):
    """Get task details and deliverable."""
    db = get_client(use_admin=True)
    result = db.table("tasks").select("*, deliverables(*)").eq("id", task_id).eq("org_id", user["org_id"]).execute()
    
    if not result.data:
        raise HTTPException(status_code=404, detail="Task not found")
    return result.data[0]


@router.post("/tasks/{task_id}/revise")
async def request_task_revision(task_id: str, notes: str = "", user: dict = Depends(get_current_user)):
    """Request revision on a delivered task."""
    db = get_client(use_admin=True)
    
    db.table("tasks").update({
        "status": "revision",
        "updated_at": datetime.utcnow().isoformat(),
    }).eq("id", task_id).eq("org_id", user["org_id"]).execute()
    
    db.table("client_feedback").insert({
        "id": str(uuid.uuid4()),
        "task_id": task_id,
        "org_id": user["org_id"],
        "revision_requested": True,
        "revision_notes": notes,
        "created_at": datetime.utcnow().isoformat(),
    }).execute()
    
    return {"status": "revision_requested", "message": "Revision requested. Our team will update the deliverable."}


@router.post("/tasks/{task_id}/approve")
async def approve_task(task_id: str, user: dict = Depends(get_current_user)):
    """Approve a delivered task."""
    db = get_client(use_admin=True)
    db.table("tasks").update({
        "status": "completed",
        "completed_at": datetime.utcnow().isoformat(),
    }).eq("id", task_id).eq("org_id", user["org_id"]).execute()
    
    return {"status": "completed", "message": "Task approved and completed!"}


# ── Client Feedback ───────────────────────────────────

@router.post("/feedback")
async def submit_feedback(feedback: ClientFeedback, user: dict = Depends(get_current_user)):
    """Rate and review a completed task."""
    db = get_client(use_admin=True)
    
    db.table("client_feedback").insert({
        "id": str(uuid.uuid4()),
        "task_id": feedback.task_id,
        "org_id": user["org_id"],
        "rating": feedback.rating,
        "feedback": feedback.feedback,
        "created_at": datetime.utcnow().isoformat(),
    }).execute()
    
    return {"status": "recorded", "message": "Thank you for your feedback!"}


# ── Client Analytics ──────────────────────────────────

@router.get("/analytics")
async def client_analytics(user: dict = Depends(get_current_user)):
    """Your usage analytics."""
    db = get_client(use_admin=True)
    org_id = user["org_id"]
    
    tasks = db.table("tasks").select("task_type, status, created_at").eq("org_id", org_id).execute().data or []
    
    by_type = {}
    for t in tasks:
        tt = t["task_type"]
        by_type[tt] = by_type.get(tt, 0) + 1
    
    by_status = {}
    for t in tasks:
        s = t["status"]
        by_status[s] = by_status.get(s, 0) + 1
    
    return {
        "tasks_by_type": by_type,
        "tasks_by_status": by_status,
        "total_tasks": len(tasks),
    }
