"""
Internal Agents API — manage and trigger internal business agents.
"""

from fastapi import APIRouter, HTTPException, Depends
from pydantic import BaseModel
from typing import Optional

from auth import get_current_user, require_admin
from scheduler import scheduler
from agents.handlers import (
    qualify_lead,
    generate_daily_digest,
    draft_client_updates,
    process_monthly_billing,
    check_overdue_invoices,
    analyze_client_health,
    check_proposal_followups,
    run_competitive_scan,
)

router = APIRouter()


class LeadInput(BaseModel):
    name: str
    email: str
    company: str = ""
    message: str = ""
    source: str = "website"


@router.get("/status")
async def agents_status(user: dict = Depends(get_current_user)):
    """Get status of all internal agents."""
    return scheduler.status()


@router.post("/trigger/{agent_name}")
async def trigger_agent(agent_name: str, user: dict = Depends(require_admin)):
    """Manually trigger an internal agent."""
    result = await scheduler.trigger(agent_name)
    if "error" in result:
        raise HTTPException(status_code=404, detail=result["error"])
    return result


@router.post("/leads/qualify")
async def api_qualify_lead(lead: LeadInput):
    """Submit a lead for qualification (public endpoint for website)."""
    result = await qualify_lead(lead.dict())
    return result


@router.get("/digest")
async def get_daily_digest(user: dict = Depends(require_admin)):
    """Get current daily project digest."""
    return await generate_daily_digest()


@router.get("/client-health")
async def get_client_health(user: dict = Depends(require_admin)):
    """Get client health analysis."""
    return await analyze_client_health()


@router.get("/sales/followups")
async def get_sales_followups(user: dict = Depends(require_admin)):
    """Get proposals needing follow-up."""
    return await check_proposal_followups()


@router.get("/billing/overdue")
async def get_overdue_invoices(user: dict = Depends(require_admin)):
    """Get overdue invoices."""
    return await check_overdue_invoices()


@router.get("/competitive")
async def get_competitive_intel(user: dict = Depends(require_admin)):
    """Get latest competitive intelligence."""
    return await run_competitive_scan()
