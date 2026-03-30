"""Billing & cost tracking routes."""

from fastapi import APIRouter

router = APIRouter()


@router.get("/costs")
async def get_costs():
    """Get cost breakdown by task, agent, time period."""
    return {"costs": [], "total_usd": 0}


@router.get("/costs/task/{task_id}")
async def get_task_costs(task_id: str):
    """Get detailed cost breakdown for a specific task."""
    return {
        "task_id": task_id,
        "llm_costs": {"input_tokens": 0, "output_tokens": 0, "usd": 0},
        "api_costs": {"usd": 0},
        "human_review_costs": {"minutes": 0, "usd": 0},
        "total_usd": 0,
    }


@router.get("/invoices")
async def list_invoices():
    """List invoices."""
    return {"invoices": []}


@router.post("/invoices/generate")
async def generate_invoice(org_id: str):
    """Generate invoice for unbilled tasks."""
    return {"status": "generated", "invoice_id": None}
