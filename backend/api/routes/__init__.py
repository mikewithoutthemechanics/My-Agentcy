"""Task management routes."""

from fastapi import APIRouter, HTTPException
from pydantic import BaseModel
from typing import Optional
from enum import Enum
import uuid
from datetime import datetime

router = APIRouter()


class TaskTier(str, Enum):
    T0 = "T0"  # Automated only
    T1 = "T1"  # Spot-check
    T2 = "T2"  # Full human review
    T3 = "T3"  # Senior + client sign-off


class TaskPriority(int, Enum):
    CRITICAL = 1
    HIGH = 2
    NORMAL = 3
    LOW = 4
    BACKLOG = 5


class TaskCreate(BaseModel):
    title: str
    description: str
    task_type: str
    priority: TaskPriority = TaskPriority.NORMAL
    brief: dict
    requirements: list[str] = []
    constraints: dict = {}
    deadline: Optional[str] = None


class TaskResponse(BaseModel):
    id: str
    title: str
    status: str
    tier: str
    priority: int
    created_at: str


@router.post("/", response_model=TaskResponse)
async def create_task(task: TaskCreate):
    """Submit a new task for the agent team."""
    task_id = str(uuid.uuid4())
    
    # Auto-classify tier based on task type
    tier = classify_task(task.task_type, task.priority)
    
    return TaskResponse(
        id=task_id,
        title=task.title,
        status="queued",
        tier=tier,
        priority=task.priority.value,
        created_at=datetime.utcnow().isoformat(),
    )


@router.get("/")
async def list_tasks(status: Optional[str] = None, limit: int = 20):
    """List tasks with optional status filter."""
    return {"tasks": [], "total": 0, "filter": status}


@router.get("/{task_id}")
async def get_task(task_id: str):
    """Get task details including current status and assigned agents."""
    return {"id": task_id, "status": "not_found"}


@router.post("/{task_id}/deliver")
async def deliver_task(task_id: str):
    """Mark task as delivered to client."""
    return {"id": task_id, "status": "delivered"}


@router.post("/{task_id}/revise")
async def request_revision(task_id: str, notes: str = ""):
    """Client requests revision on delivered work."""
    return {"id": task_id, "status": "revision", "notes": notes}


def classify_task(task_type: str, priority: TaskPriority) -> str:
    """Auto-classify task into QA tier."""
    # Simple tasks → automated QA only
    simple_types = {"data_entry", "formatting", "translation", "summarization"}
    # Complex tasks → full review
    complex_types = {"strategy", "legal", "financial", "brand"}
    # Critical → senior review
    critical_types = {"legal", "compliance", "contract"}
    
    if task_type in critical_types or priority == TaskPriority.CRITICAL:
        return TaskTier.T3
    elif task_type in complex_types or priority == TaskPriority.HIGH:
        return TaskTier.T2
    elif task_type in simple_types:
        return TaskTier.T0
    else:
        return TaskTier.T1
