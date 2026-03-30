"""Agent management routes."""

from fastapi import APIRouter

router = APIRouter()


@router.get("/")
async def list_agents():
    """List available agents and their status."""
    return {
        "agents": [
            {"id": "analyst", "role": "Analyst", "status": "available", "active_tasks": 0},
            {"id": "builder", "role": "Builder", "status": "available", "active_tasks": 0},
            {"id": "qa_reviewer", "role": "QA Reviewer", "status": "available", "active_tasks": 0},
            {"id": "pm", "role": "Project Manager", "status": "available", "active_tasks": 0},
        ]
    }


@router.get("/{agent_id}")
async def get_agent(agent_id: str):
    """Get agent details and performance metrics."""
    return {"id": agent_id, "status": "not_found"}


@router.get("/{agent_id}/memory")
async def get_agent_memory(agent_id: str):
    """Get agent's learned memories and patterns."""
    return {"agent_id": agent_id, "memories": []}
