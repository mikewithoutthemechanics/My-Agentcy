"""Agent management routes - includes all bundle agents."""

from fastapi import APIRouter, HTTPException
from pydantic import BaseModel
from typing import Optional
import os

router = APIRouter()

# Bundle definitions (mirrors the code bundles)
BUNDLES = {
    "sales": {
        "name": "Sales Team",
        "description": "Complete salesforce - lead generation to deal closing",
        "agents": ["sdr", "ae", "closer", "account_manager", "vp_sales", "pipeline_analyst"],
        "color": "#10B981",
    },
    "marketing": {
        "name": "Marketing Team",
        "description": "Full-stack marketing - SEO, content, social, paid",
        "agents": ["seo_specialist", "content_creator", "social_media", "email_marketer", "paid_ads", "copywriter", "marketing_director"],
        "color": "#F59E0B",
    },
    "development": {
        "name": "Development Team",
        "description": "Engineering squad - build to deployment",
        "agents": ["frontend_dev", "backend_dev", "fullstack_dev", "devops", "qa_engineer", "security_engineer", "tech_lead"],
        "color": "#3B82F6",
    },
    "operations": {
        "name": "Operations Team",
        "description": "Day-to-day business running",
        "agents": ["project_manager", "virtual_assistant", "bookkeeper", "hr_manager", "recruiter", "operations_manager"],
        "color": "#8B5CF6",
    },
    "executive": {
        "name": "Executive Suite",
        "description": "C-level strategic decision making",
        "agents": ["ceo", "cfo", "cto", "cmo", "coo", "cpo"],
        "color": "#EF4444",
    },
    "customer_success": {
        "name": "Customer Success",
        "description": "Support and retention",
        "agents": ["cs_manager", "onboarding_specialist", "support_agent", "success_analyst"],
        "color": "#06B6D4",
    },
    "design": {
        "name": "Design Team",
        "description": "Visual creation and branding",
        "agents": ["ui_designer", "ux_researcher", "graphic_designer", "web_designer", "brand_designer", "motion_designer"],
        "color": "#EC4899",
    },
    "research": {
        "name": "Research Team",
        "description": "Data and market intelligence",
        "agents": ["market_researcher", "data_analyst", "product_researcher", "content_strategist"],
        "color": "#14B8A6",
    },
}

# Flat agent list
ALL_AGENTS = {}
for bundle_id, bundle in BUNDLES.items():
    for agent_id in bundle["agents"]:
        ALL_AGENTS[agent_id] = {
            "id": agent_id,
            "bundle": bundle_id,
            "bundle_name": bundle["name"],
            "color": bundle["color"],
        }


@router.get("/")
async def list_agents():
    """List all available agents and bundles."""
    return {
        "bundles": [
            {
                "id": bid,
                "name": BUNDLES[bid]["name"],
                "description": BUNDLES[bid]["description"],
                "agent_count": len(BUNDLES[bid]["agents"]),
                "color": BUNDLES[bid]["color"],
            }
            for bid in BUNDLES
        ],
        "agents": [
            {
                "id": aid,
                "bundle": ALL_AGENTS[aid]["bundle"],
                "bundle_name": ALL_AGENTS[aid]["bundle_name"],
                "color": ALL_AGENTS[aid]["color"],
            }
            for aid in ALL_AGENTS
        ],
        "total_agents": len(ALL_AGENTS),
        "total_bundles": len(BUNDLES),
    }


@router.get("/bundles")
async def list_bundles():
    """List available bundles."""
    return {
        "bundles": [
            {
                "id": bid,
                "name": BUNDLES[bid]["name"],
                "description": BUNDLES[bid]["description"],
                "agent_count": len(BUNDLES[bid]["agents"]),
                "color": BUNDLES[bid]["color"],
            }
            for bid in BUNDLES
        ]
    }


@router.get("/bundles/{bundle_id}")
async def get_bundle(bundle_id: str):
    """Get bundle details and its agents."""
    if bundle_id not in BUNDLES:
        raise HTTPException(status_code=404, detail="Bundle not found")
    
    bundle = BUNDLES[bundle_id]
    return {
        "id": bundle_id,
        "name": bundle["name"],
        "description": bundle["description"],
        "color": bundle["color"],
        "agents": [
            {"id": aid, "name": aid.replace("_", " ").title()}
            for aid in bundle["agents"]
        ],
    }


@router.get("/{agent_id}")
async def get_agent(agent_id: str):
    """Get agent details."""
    if agent_id not in ALL_AGENTS:
        raise HTTPException(status_code=404, detail="Agent not found")
    
    agent = ALL_AGENTS[agent_id]
    return {
        "id": agent_id,
        "name": agent_id.replace("_", " ").title(),
        "bundle": agent["bundle"],
        "bundle_name": agent["bundle_name"],
        "color": agent["color"],
        "status": "available",
    }


class ExecuteRequest(BaseModel):
    task: str
    context: Optional[dict] = None


@router.post("/{agent_id}/execute")
async def execute_agent(agent_id: str, request: ExecuteRequest):
    """Execute a task with a specific agent via Romy backend."""
    if agent_id not in ALL_AGENTS:
        raise HTTPException(status_code=404, detail="Agent not found")
    
    romy_backend = os.environ.get("ROMY_BACKEND_URL", "https://romy-backend.vercel.app")
    
    try:
        import httpx
        async with httpx.AsyncClient() as client:
            # Map agent_id to Romy backend agent
            # For now, use generic agent based on bundle
            bundle = ALL_AGENTS[agent_id]["bundle"]
            
            # Map to appropriate Romy agent
            agent_mapping = {
                "sdr": "sdr",
                "ae": "ae",
                "closer": "closer",
                "account_manager": "account_manager",
                "vp_sales": "vp_sales",
                "pipeline_analyst": "vp_sales",
                "seo_specialist": "seo_specialist",
                "content_creator": "copywriter",
                "social_media": "social_media_manager",
                "email_marketer": "email_marketer",
                "paid_ads": "paid_ads_manager",
                "copywriter": "copywriter",
                "marketing_director": "marketing_director",
                "frontend_dev": "frontend_dev",
                "backend_dev": "backend_dev",
                "fullstack_dev": "fullstack_developer",
                "devops": "devops",
                "qa_engineer": "qa_engineer",
                "security_engineer": "security_tester",
                "tech_lead": "tech_lead",
                "project_manager": "project_manager",
                "virtual_assistant": "virtual_assistant",
                "bookkeeper": "bookkeeper",
                "hr_manager": "hr_manager",
                "recruiter": "recruiter",
                "operations_manager": "operations_manager",
                "ceo": "ceo",
                "cfo": "cfo",
                "cto": "cto",
                "cmo": "cmo",
                "coo": "coo",
                "cpo": "cpo",
                "cs_manager": "csm_manager",
                "onboarding_specialist": "onboarding_specialist",
                "support_agent": "support_agent",
                "success_analyst": "success_analyst",
                "ui_designer": "ui_designer",
                "ux_researcher": "ux_researcher",
                "graphic_designer": "graphic_designer",
                "web_designer": "web_designer",
                "brand_designer": "brand_designer",
                "motion_designer": "motion_designer",
                "market_researcher": "market_researcher",
                "data_analyst": "data_analyst",
                "product_researcher": "product_researcher",
                "content_strategist": "content_strategist",
            }
            
            romy_agent = agent_mapping.get(agent_id, "senior_engineer")
            
            response = await client.post(
                f"{romy_backend}/execute",
                params={
                    "agent_type": romy_agent,
                    "task": request.task,
                    "input_data": request.context or {},
                },
                timeout=120.0,
            )
            
            if response.status_code == 200:
                return {
                    "success": True,
                    "agent_id": agent_id,
                    "romy_agent": romy_agent,
                    "result": response.json(),
                }
            else:
                return {
                    "success": False,
                    "agent_id": agent_id,
                    "error": f"Romy backend returned {response.status_code}",
                }
                
    except Exception as e:
        return {
            "success": False,
            "agent_id": agent_id,
            "error": str(e),
            "note": "Romy backend may be unavailable",
        }


@router.get("/{agent_id}/memory")
async def get_agent_memory(agent_id: str):
    """Get agent's learned memories and patterns."""
    if agent_id not in ALL_AGENTS:
        raise HTTPException(status_code=404, detail="Agent not found")
    return {"agent_id": agent_id, "memories": []}