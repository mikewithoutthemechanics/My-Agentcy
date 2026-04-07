"""Tasks routes."""

from fastapi import APIRouter, Depends
from db import get_client
from auth import get_current_user

router = APIRouter()


@router.get("/")
async def list_tasks(user: dict = Depends(get_current_user), status: str = None, limit: int = 50):
    db = get_client(use_admin=True)
    org_id = user["org_id"]
    
    query = db.table("tasks").select("*").eq("org_id", org_id).order("created_at", desc=True).limit(limit)
    if status:
        query = query.eq("status", status)
    
    tasks = query.execute().data or []
    return {"tasks": tasks, "count": len(tasks)}


@router.post("/")
async def create_task(task: dict, user: dict = Depends(get_current_user)):
    db = get_client(use_admin=True)
    task["org_id"] = user["org_id"]
    result = db.table("tasks").insert(task).execute()
    return {"task": result.data[0] if result.data else {}}


@router.get("/{task_id}")
async def get_task(task_id: str, user: dict = Depends(get_current_user)):
    db = get_client(use_admin=True)
    tasks = db.table("tasks").select("*").eq("id", task_id).eq("org_id", user["org_id"]).execute().data
    if not tasks:
        return {"error": "Task not found"}
    return {"task": tasks[0]}


@router.patch("/{task_id}")
async def update_task(task_id: str, updates: dict, user: dict = Depends(get_current_user)):
    db = get_client(use_admin=True)
    result = db.table("tasks").update(updates).eq("id", task_id).eq("org_id", user["org_id"]).execute()
    return {"task": result.data[0] if result.data else {}}