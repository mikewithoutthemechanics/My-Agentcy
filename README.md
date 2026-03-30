# My-Agentcy

**AI Workforce as a Service** — Deploy AI agent teams that deliver real work, reviewed and guaranteed.

> "Every delivery is reviewed. Most by AI. All by a system that gets smarter with every project."

---

## What It Is

My-Agentcy is an AI-powered agency delivery platform. Clients submit tasks, AI agent teams complete them, a layered QA system ensures quality, and polished deliverables are returned.

The difference from raw AI tools: **human-verified quality at AI speed and cost.**

## Architecture

```
Client Request
    │
    ▼
┌─────────────┐
│  Task Queue  │  (priority, dedup, backpressure)
└──────┬──────┘
       │
       ▼
┌─────────────┐
│  Classifier  │  (tier assignment: T0-T3)
└──────┬──────┘
       │
       ▼
┌─────────────┐
│ Agent Team   │  (CrewAI: Analyst → Builder → QA)
└──────┬──────┘
       │
       ▼
┌─────────────┐
│  QA Layer    │  (automated + human review)
└──────┬──────┘
       │
       ▼
┌─────────────┐
│  Delivery    │  (client delivery + feedback)
└─────────────┘
```

## QA Tiers

| Tier | Review Type | Use Case |
|------|------------|----------|
| T0 | Automated only | Data entry, formatting, summaries |
| T1 | Spot-check (20%) | Reports, analysis, code review |
| T2 | Full human review | Strategy docs, client-facing work |
| T3 | Senior + client sign-off | Legal, financial, brand-critical |

## Tech Stack

- **Agent Engine:** CrewAI (multi-agent orchestration)
- **Cost Tracking:** AgentOps (per-task LLM cost visibility)
- **Task Queue:** Custom (priority + backpressure)
- **Backend:** FastAPI + Python
- **Frontend:** React + Vite + Tailwind
- **Database:** Supabase (PostgreSQL)
- **Memory:** MCP Memory Service (agent learning)
- **Deployment:** Vercel (frontend) + Railway/Fly.io (backend)

## Project Structure

```
my-agentcy/
├── agents/          # CrewAI agent definitions & prompts
│   ├── roles/       # Analyst, Builder, QA, PM agents
│   ├── tools/       # Custom tools for agents
│   └── crews/       # Agent team configurations
├── backend/         # FastAPI API server
│   ├── api/         # REST endpoints
│   ├── tasks/       # Task queue & management
│   ├── billing/     # Cost tracking & invoicing
│   └── auth/        # Multi-tenant auth
├── qa/              # Quality assurance layer
│   ├── automated/   # QA agent & rubrics
│   ├── review/      # Human review dashboard
│   └── feedback/    # Client feedback loop
├── frontend/        # React dashboard
│   ├── src/
│   │   ├── pages/   # Dashboard, Tasks, Deliverables, Settings
│   │   ├── components/
│   │   └── services/
│   └── public/
├── database/        # Supabase migrations & schema
├── shared/          # Shared types & utilities
├── scripts/         # Setup, deploy, maintenance
├── docs/            # Documentation
└── dashboard/       # Internal ops dashboard
```

## Getting Started

```bash
# Backend
cd backend
python -m venv venv
source venv/bin/activate
pip install -r requirements.txt
uvicorn main:app --reload

# Frontend
cd frontend
npm install
npm run dev
```

## Roadmap

- [ ] Task queue with priority & deduplication
- [ ] CrewAI agent team (Analyst, Builder, QA, PM)
- [ ] Automated QA agent with rubric scoring
- [ ] Human review dashboard
- [ ] Client delivery portal
- [ ] Feedback loop & self-improvement
- [ ] Cost tracking per task
- [ ] Billing & invoicing
- [ ] Multi-tenant auth
- [ ] Agent memory & learning

---

*Built by Agentcy.co.za — Leaders in Software. Experts in Intelligence.*
