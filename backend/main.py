"""
My-Agentcy Backend — FastAPI Application
AI Workforce as a Service
"""

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from contextlib import asynccontextmanager

from api.routes import tasks, agents, qa, billing, feedback, dashboard
from websocket import router as ws_router


@asynccontextmanager
async def lifespan(app: FastAPI):
    """Startup & shutdown hooks."""
    # Initialize agent pools, task queue connections, etc.
    print("🤖 My-Agentcy backend starting...")
    yield
    print("👋 Shutting down...")


app = FastAPI(
    title="My-Agentcy API",
    description="AI Workforce as a Service — Agent teams that deliver reviewed work",
    version="0.1.0",
    lifespan=lifespan,
)

# CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173", "https://*.vercel.app"],
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
app.include_router(ws_router, tags=["WebSocket"])


@app.get("/health")
async def health():
    return {"status": "ok", "service": "my-agentcy"}
