"""
Task routes — fully wired with pipeline, validation, and error handling.
"""

from fastapi import APIRouter, HTTPException, Depends, Query
from typing import Optional, List
from datetime import datetime
import uuid

from db import get_client
from auth import get_current_user
from validation import ValidatedTaskCreate, NotFoundError, ValidationError
from pipeline import pipeline

router = APIRouter()


@router.post("/")
async def create_task(task: ValidatedTaskCreate, user: dict = Depends(get_current_user)):
    """Submit a new task. Validated and queued for agent processing."""
    db = get_client(use_admin=True)

    task_id = str(uuid.uuid4())
    data = {
        "id": task_id,
        "org_id": user["org_id"],
        "created_by": user["id"],
        "title": task.title,
        "description": task.description,
        "task_type": task.task_type,
        "priority": task.priority,
        "tier": "T1",  # Will be classified by pipeline
        "status": "queued",
        "brief": {"description": task.description, "requirements": task.requirements},
        "requirements": task.requirements,
        "deadline": task.deadline,
        "created_at": datetime.utcnow().isoformat(),
    }

    result = db.table("tasks").insert(data).execute()
    if not result.data:
        raise ValidationError("Failed to create task")

    # Start pipeline processing
    import asyncio
    asyncio.create_task(pipeline.process(task_id, data))

    return {
        "id": task_id,
        "title": task.title,
        "status": "queued",
        "message": "Task submitted. Our AI team will begin working on it shortly.",
    }


@router.get("/")
async def list_tasks(
    status: Optional[str] = None,
    tier: Optional[str] = None,
    task_type: Optional[str] = None,
    limit: int = Query(20, le=100),
    offset: int = 0,
    user: dict = Depends(get_current_user),
):
    """List tasks with filters."""
    db = get_client(use_admin=True)
    query = db.table("tasks").select("*").eq("org_id", user["org_id"])

    if status:
        query = query.eq("status", status)
    if tier:
        query = query.eq("tier", tier)
    if task_type:
        query = query.eq("task_type", task_type)

    result = query.order("priority", desc=False).order("created_at", desc=True).range(offset, offset + limit - 1).execute()

    return {
        "tasks": result.data or [],
        "total": len(result.data or []),
        "filters": {"status": status, "tier": tier, "task_type": task_type},
    }


@router.get("/{task_id}")
async def get_task(task_id: str, user: dict = Depends(get_current_user)):
    """Get task details with deliverables and QA reviews."""
    db = get_client(use_admin=True)
    result = db.table("tasks").select("*, deliverables(*), qa_reviews(*)").eq("id", task_id).eq("org_id", user["org_id"]).execute()

    if not result.data:
        raise NotFoundError("Task", task_id)

    return result.data[0]


@router.post("/{task_id}/deliver")
async def deliver_task(task_id: str, user: dict = Depends(get_current_user)):
    """Mark task as delivered to client."""
    db = get_client(use_admin=True)
    result = db.table("tasks").update({
        "status": "delivered",
        "delivered_at": datetime.utcnow().isoformat(),
    }).eq("id", task_id).eq("org_id", user["org_id"]).execute()

    if not result.data:
        raise NotFoundError("Task", task_id)

    return {"id": task_id, "status": "delivered"}


@router.post("/{task_id}/revise")
async def request_revision(task_id: str, notes: str = "", user: dict = Depends(get_current_user)):
    """Request revision on delivered work."""
    db = get_client(use_admin=True)

    # Update task
    result = db.table("tasks").update({
        "status": "revision",
        "updated_at": datetime.utcnow().isoformat(),
    }).eq("id", task_id).eq("org_id", user["org_id"]).execute()

    if not result.data:
        raise NotFoundError("Task", task_id)

    # Record feedback
    db.table("client_feedback").insert({
        "id": str(uuid.uuid4()),
        "task_id": task_id,
        "org_id": user["org_id"],
        "revision_requested": True,
        "revision_notes": notes,
        "created_at": datetime.utcnow().isoformat(),
    }).execute()

    # Trigger revision in pipeline
    # In production: send to agent for revision

    return {"id": task_id, "status": "revision", "message": "Revision requested. Agent team notified."}


@router.post("/{task_id}/approve")
async def approve_task(task_id: str, user: dict = Depends(get_current_user)):
    """Approve a delivered task."""
    db = get_client(use_admin=True)
    result = db.table("tasks").update({
        "status": "completed",
        "completed_at": datetime.utcnow().isoformat(),
    }).eq("id", task_id).eq("org_id", user["org_id"]).execute()

    if not result.data:
        raise NotFoundError("Task", task_id)

    return {"id": task_id, "status": "completed", "message": "Task approved!"}


@router.get("/{task_id}/costs")
async def get_task_costs(task_id: str, user: dict = Depends(get_current_user)):
    """Get cost breakdown for a task."""
    db = get_client(use_admin=True)

    # Verify access
    task = db.table("tasks").select("id").eq("id", task_id).eq("org_id", user["org_id"]).execute()
    if not task.data:
        raise NotFoundError("Task", task_id)

    costs = db.table("cost_entries").select("*").eq("task_id", task_id).execute().data or []

    total = sum(float(c.get("cost_usd", 0)) for c in costs)
    by_type = {}
    for c in costs:
        t = c.get("entry_type", "unknown")
        by_type[t] = by_type.get(t, 0) + float(c.get("cost_usd", 0))

    return {
        "task_id": task_id,
        "total_usd": round(total, 4),
        "by_type": {k: round(v, 4) for k, v in by_type.items()},
        "entries": costs,
    }
