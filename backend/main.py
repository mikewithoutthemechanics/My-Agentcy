"""
My-Agentcy Backend — FastAPI Application
AI Workforce as a Service
"""

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from contextlib import asynccontextmanager

from api.routes import tasks, agents, qa, billing, feedback, dashboard, client_portal, internal_agents
from websocket import router as ws_router
from scheduler import scheduler
from pipeline import pipeline
from agents.orchestrator import orchestrator
from validation import error_handler, AppError
from agents.handlers import (
    generate_daily_digest,
    process_monthly_billing,
    analyze_client_health,
    check_proposal_followups,
    run_competitive_scan,
)


@asynccontextmanager
async def lifespan(app: FastAPI):
    """Startup & shutdown hooks."""
    print("🤖 My-Agentcy backend starting...")

    # Register internal agents with scheduler
    scheduler.register_daily("daily_digest", "08:00", generate_daily_digest)
    scheduler.register_daily("client_health", "09:00", analyze_client_health)
    scheduler.register_daily("sales_followups", "10:00", check_proposal_followups)
    scheduler.register_weekly("billing", "monday", "09:00", process_monthly_billing)
    scheduler.register_weekly("competitive_intel", "friday", "16:00", run_competitive_scan)

    # Start scheduler in background
    import asyncio
    scheduler_task = asyncio.create_task(scheduler.start(poll_interval=60))
    print(f"🕐 Scheduler started with {len(scheduler.agents)} agents")
    print("✅ My-Agentcy backend ready")

    yield

    scheduler.stop()
    print("👋 Shutting down...")


app = FastAPI(
    title="My-Agentcy API",
    description="AI Workforce as a Service — Agent teams that deliver reviewed work",
    version="0.2.0",
    lifespan=lifespan,
)

# Error handler
app.add_exception_handler(Exception, error_handler)

# CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Routes
app.include_router(tasks.router, prefix="/api/tasks", tags=["Tasks"])
app.include_router(agents.router, prefix="/api/agents", tags=["Agents"])
app.include_router(qa.router, prefix="/api/qa", tags=["QA"])
app.include_router(billing.router, prefix="/api/billing", tags=["Billing"])
app.include_router(feedback.router, prefix="/api/feedback", tags=["Feedback"])
app.include_router(dashboard.router, prefix="/api/dashboard", tags=["Dashboard"])
app.include_router(client_portal.router, prefix="/api/client", tags=["Client Portal"])
app.include_router(internal_agents.router, prefix="/api/internal", tags=["Internal Agents"])
app.include_router(ws_router, tags=["WebSocket"])


@app.get("/health")
async def health():
    """Health check endpoint."""
    return {
        "status": "ok",
        "service": "my-agentcy",
        "version": "0.2.0",
        "pipeline": pipeline.status(),
        "scheduler": {"running": scheduler._running, "agents": len(scheduler.agents)},
        "orchestrator": orchestrator.status(),
    }


@app.get("/status")
async def detailed_status():
    """Detailed system status."""
    return {
        "pipeline": pipeline.status(),
        "scheduler": scheduler.status(),
        "orchestrator": orchestrator.status(),
    }
