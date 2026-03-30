"""
Task routes — fully wired to Supabase.
"""

from fastapi import APIRouter, HTTPException, Depends, Query
from pydantic import BaseModel
from typing import Optional, List
from datetime import datetime
import uuid

from db import get_client
from auth import get_current_user

router = APIRouter()


class TaskCreate(BaseModel):
    title: str
    description: str
    task_type: str
    priority: int = 3
    brief: dict
    requirements: List[str] = []
    constraints: dict = {}
    deadline: Optional[str] = None


class TaskResponse(BaseModel):
    id: str
    title: str
    description: str
    task_type: str
    priority: int
    tier: str
    status: str
    brief: dict
    requirements: List[str]
    deadline: Optional[str]
    created_at: str


class TaskRevision(BaseModel):
    notes: str = ""


def classify_tier(task_type: str, priority: int) -> str:
    simple = {"data_entry", "formatting", "translation", "summarization", "extraction"}
    complex_types = {"strategy", "legal", "financial", "brand"}
    if task_type in complex_types or priority == 1:
        return "T3" if task_type in {"legal", "compliance", "contract"} else "T2"
    elif task_type in simple:
        return "T0"
    return "T1"


@router.post("/", response_model=TaskResponse)
async def create_task(task: TaskCreate, user: dict = Depends(get_current_user)):
    db = get_client(use_admin=True)
    tier = classify_tier(task.task_type, task.priority)
    
    data = {
        "id": str(uuid.uuid4()),
        "org_id": user["org_id"],
        "created_by": user["id"],
        "title": task.title,
        "description": task.description,
        "task_type": task.task_type,
        "priority": task.priority,
        "tier": tier,
        "status": "queued",
        "brief": task.brief,
        "requirements": task.requirements,
        "constraints": task.constraints,
        "deadline": task.deadline,
        "created_at": datetime.utcnow().isoformat(),
    }
    
    result = db.table("tasks").insert(data).execute()
    if not result.data:
        raise HTTPException(status_code=500, detail="Failed to create task")
    
    row = result.data[0]
    return TaskResponse(**row)


@router.get("/")
async def list_tasks(
    status: Optional[str] = None,
    tier: Optional[str] = None,
    limit: int = Query(20, le=100),
    offset: int = 0,
    user: dict = Depends(get_current_user),
):
    db = get_client(use_admin=True)
    query = db.table("tasks").select("*").eq("org_id", user["org_id"])
    
    if status:
        query = query.eq("status", status)
    if tier:
        query = query.eq("tier", tier)
    
    query = query.order("priority", desc=False).order("created_at", desc=True).range(offset, offset + limit - 1)
    result = query.execute()
    
    return {"tasks": result.data, "total": len(result.data)}


@router.get("/{task_id}")
async def get_task(task_id: str, user: dict = Depends(get_current_user)):
    db = get_client(use_admin=True)
    result = db.table("tasks").select("*, deliverables(*), qa_reviews(*)").eq("id", task_id).eq("org_id", user["org_id"]).execute()
    
    if not result.data:
        raise HTTPException(status_code=404, detail="Task not found")
    
    return result.data[0]


@router.post("/{task_id}/deliver")
async def deliver_task(task_id: str, user: dict = Depends(get_current_user)):
    db = get_client(use_admin=True)
    result = db.table("tasks").update({
        "status": "delivered",
        "delivered_at": datetime.utcnow().isoformat(),
    }).eq("id", task_id).eq("org_id", user["org_id"]).execute()
    
    if not result.data:
        raise HTTPException(status_code=404, detail="Task not found")
    
    return {"id": task_id, "status": "delivered"}


@router.post("/{task_id}/revise")
async def request_revision(task_id: str, revision: TaskRevision, user: dict = Depends(get_current_user)):
    db = get_client(use_admin=True)
    result = db.table("tasks").update({
        "status": "revision",
        "updated_at": datetime.utcnow().isoformat(),
    }).eq("id", task_id).eq("org_id", user["org_id"]).execute()
    
    if not result.data:
        raise HTTPException(status_code=404, detail="Task not found")
    
    # Record revision feedback
    db.table("client_feedback").insert({
        "id": str(uuid.uuid4()),
        "task_id": task_id,
        "org_id": user["org_id"],
        "revision_requested": True,
        "revision_notes": revision.notes,
        "created_at": datetime.utcnow().isoformat(),
    }).execute()
    
    return {"id": task_id, "status": "revision", "notes": revision.notes}


@router.post("/{task_id}/approve")
async def approve_task(task_id: str, user: dict = Depends(get_current_user)):
    db = get_client(use_admin=True)
    result = db.table("tasks").update({
        "status": "completed",
        "completed_at": datetime.utcnow().isoformat(),
    }).eq("id", task_id).eq("org_id", user["org_id"]).execute()
    
    if not result.data:
        raise HTTPException(status_code=404, detail="Task not found")
    
    return {"id": task_id, "status": "completed"}
