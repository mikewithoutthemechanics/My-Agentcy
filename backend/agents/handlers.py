"""
My-Agentcy — Internal Agent Handlers
Actual business logic for each internal agent.
These are called by the scheduler or on-demand.
"""

from datetime import datetime, timedelta
from typing import Optional
import uuid

from db import get_client


# ═══════════════════════════════════════════════════════
# 1. LEAD QUALIFIER
# ═══════════════════════════════════════════════════════

async def qualify_lead(lead_data: dict) -> dict:
    """
    Score and route an incoming lead.
    
    lead_data: {name, email, company, message, source}
    Returns: {score, tier, action, talking_points}
    """
    score = 50  # Base score
    signals = []

    # Company size signals
    company = lead_data.get("company", "").lower()
    if any(w in company for w in ["enterprise", "group", "holdings", "international"]):
        score += 20
        signals.append("Enterprise keyword detected")

    # Budget signals in message
    message = lead_data.get("message", "").lower()
    budget_keywords = ["budget", "invest", "spend", "cost", "price", "afford", "roi", "revenue"]
    budget_hits = sum(1 for w in budget_keywords if w in message)
    score += budget_hits * 5
    if budget_hits:
        signals.append(f"Budget language detected ({budget_hits} hits)")

    # Urgency signals
    urgency_keywords = ["urgent", "asap", "immediately", "deadline", "now", "this week", "soon"]
    urgency_hits = sum(1 for w in urgency_keywords if w in message)
    score += urgency_hits * 8
    if urgency_hits:
        signals.append(f"Urgency language detected ({urgency_hits} hits)")

    # Tech sophistication
    tech_keywords = ["api", "integration", "automate", "ai", "ml", "data", "software", "platform", "saas"]
    tech_hits = sum(1 for w in tech_keywords if w in message)
    score += tech_hits * 3
    if tech_hits:
        signals.append(f"Tech sophistication ({tech_hits} hits)")

    # Cap at 100
    score = min(score, 100)

    # Route
    if score >= 80:
        action = "alert_michael"
        tier = "hot"
    elif score >= 50:
        action = "nurture"
        tier = "warm"
    else:
        action = "archive"
        tier = "cold"

    # Generate talking points
    talking_points = []
    if "ai" in message or "automate" in message:
        talking_points.append("Lead is interested in AI/automation — lead with Agentcy's AI workforce story")
    if budget_hits:
        talking_points.append("Lead mentioned budget — prepared to discuss pricing and ROI")
    if urgency_hits:
        talking_points.append("Lead has urgency — offer expedited onboarding")
    if not talking_points:
        talking_points.append("Standard discovery call — understand their pain points first")

    # Save to database
    db = get_client(use_admin=True)
    db.table("leads").upsert({
        "id": str(uuid.uuid4()),
        "email": lead_data.get("email"),
        "name": lead_data.get("name"),
        "company": lead_data.get("company"),
        "message": lead_data.get("message"),
        "source": lead_data.get("source", "website"),
        "score": score,
        "tier": tier,
        "signals": signals,
        "action": action,
        "status": "new",
        "created_at": datetime.utcnow().isoformat(),
    }).execute()

    return {
        "score": score,
        "tier": tier,
        "action": action,
        "signals": signals,
        "talking_points": talking_points,
    }


# ═══════════════════════════════════════════════════════
# 2. PROJECT COORDINATOR
# ═══════════════════════════════════════════════════════

async def generate_daily_digest() -> dict:
    """Generate daily status digest for all active projects."""
    db = get_client(use_admin=True)

    # Get all non-completed tasks
    tasks = db.table("tasks").select("*").not_.in_("status", ["completed", "failed"]).order("priority").execute().data or []

    # Categorize
    at_risk = []
    on_track = []
    needs_review = []

    for task in tasks:
        deadline = task.get("deadline")
        status = task.get("status")

        if deadline:
            dl = datetime.fromisoformat(deadline.replace("Z", "+00:00"))
            hours_left = (dl - datetime.utcnow()).total_seconds() / 3600
            if hours_left < 4 and status not in ("delivered", "approved"):
                at_risk.append(task)
            else:
                on_track.append(task)
        elif status in ("qa_review", "human_review"):
            needs_review.append(task)
        else:
            on_track.append(task)

    # Get today's completions
    today = datetime.utcnow().strftime("%Y-%m-%d")
    completed_today = db.table("tasks").select("*").eq("status", "completed").gte("completed_at", today).execute().data or []

    digest = {
        "date": today,
        "summary": {
            "active_tasks": len(tasks),
            "at_risk": len(at_risk),
            "on_track": len(on_track),
            "needs_review": len(needs_review),
            "completed_today": len(completed_today),
        },
        "at_risk_tasks": [{"id": t["id"], "title": t["title"], "deadline": t.get("deadline")} for t in at_risk],
        "needs_review": [{"id": t["id"], "title": t["title"], "status": t["status"]} for t in needs_review],
        "alerts": [],
    }

    # Generate alerts
    if at_risk:
        digest["alerts"].append(f"⚠️ {len(at_risk)} tasks at risk of missing deadline")
    if len(needs_review) > 5:
        digest["alerts"].append(f"📋 {len(needs_review)} tasks awaiting review — consider clearing the queue")

    return digest


async def draft_client_updates() -> list:
    """Draft routine client communications for completed/delivered tasks."""
    db = get_client(use_admin=True)

    # Tasks delivered in last hour that haven't been notified
    recent = db.table("tasks").select("*").eq("status", "delivered").gte(
        "delivered_at", (datetime.utcnow() - timedelta(hours=1)).isoformat()
    ).execute().data or []

    updates = []
    for task in recent:
        updates.append({
            "task_id": task["id"],
            "org_id": task["org_id"],
            "type": "delivery_notification",
            "subject": f"Your task is ready: {task['title']}",
            "body": f"Hi! Your task '{task['title']}' has been completed and is ready for review. Please log in to approve or request revisions.",
        })

    return updates


# ═══════════════════════════════════════════════════════
# 3. BILLING AGENT
# ═══════════════════════════════════════════════════════

async def process_monthly_billing() -> dict:
    """Compile unbilled tasks and generate invoices per org."""
    db = get_client(use_admin=True)

    # Get all orgs with unbilled completed tasks
    tasks = db.table("tasks").select("*, cost_entries(*)").eq("status", "completed").is_("invoiced", "null").execute().data or {}

    # Group by org
    by_org = {}
    for task in tasks:
        org_id = task["org_id"]
        if org_id not in by_org:
            by_org[org_id] = []
        by_org[org_id].append(task)

    invoices = []
    for org_id, org_tasks in by_org.items():
        # Calculate total cost
        total_cost = 0
        for task in org_tasks:
            costs = task.get("cost_entries", [])
            total_cost += sum(float(c.get("cost_usd", 0)) for c in costs)

        # Apply margin (3x cost)
        invoice_amount = total_cost * 3

        # Create invoice
        invoice = {
            "id": str(uuid.uuid4()),
            "org_id": org_id,
            "subtotal_usd": round(invoice_amount, 2),
            "tax_usd": round(invoice_amount * 0.15, 2),  # 15% VAT for SA
            "total_usd": round(invoice_amount * 1.15, 2),
            "task_ids": [t["id"] for t in org_tasks],
            "status": "draft",
            "created_at": datetime.utcnow().isoformat(),
        }

        db.table("invoices").insert(invoice).execute()

        # Mark tasks as invoiced
        for task in org_tasks:
            db.table("tasks").update({"invoiced": True}).eq("id", task["id"]).execute()

        invoices.append(invoice)

    return {"invoices_generated": len(invoices), "total_value": sum(i["total_usd"] for i in invoices)}


async def check_overdue_invoices() -> list:
    """Find overdue invoices and draft reminders."""
    db = get_client(use_admin=True)

    overdue = db.table("invoices").select("*").eq("status", "sent").lt(
        "due_at", datetime.utcnow().isoformat()
    ).execute().data or []

    reminders = []
    for inv in overdue:
        days_overdue = (datetime.utcnow() - datetime.fromisoformat(inv["due_at"].replace("Z", "+00:00"))).days
        reminders.append({
            "invoice_id": inv["id"],
            "org_id": inv["org_id"],
            "amount": inv["total_usd"],
            "days_overdue": days_overdue,
            "urgency": "high" if days_overdue > 14 else "medium" if days_overdue > 7 else "low",
            "suggested_action": "phone_call" if days_overdue > 14 else "email_reminder",
        })

    return reminders


# ═══════════════════════════════════════════════════════
# 4. CLIENT SUCCESS AGENT
# ═══════════════════════════════════════════════════════

async def analyze_client_health() -> dict:
    """Analyze all clients for health signals."""
    db = get_client(use_admin=True)

    # Get all orgs
    orgs = db.table("organizations").select("*").execute().data or []

    health_report = {"healthy": [], "at_risk": [], "churned": []}

    for org in orgs:
        org_id = org["id"]

        # Get recent tasks
        tasks = db.table("tasks").select("status, created_at").eq("org_id", org_id).execute().data or []

        # Get feedback
        feedback = db.table("client_feedback").select("rating, created_at").eq("org_id", org_id).order("created_at", desc=True).limit(5).execute().data or []

        # Calculate signals
        recent_tasks = [t for t in tasks if t["created_at"] > (datetime.utcnow() - timedelta(days=30)).isoformat()]
        old_tasks = [t for t in tasks if t["created_at"] <= (datetime.utcnow() - timedelta(days=30)).isoformat()]

        avg_rating = sum(f["rating"] for f in feedback) / max(len(feedback), 1) if feedback else 5
        task_trend = len(recent_tasks) / max(len(old_tasks), 1)  # <1 = declining

        # Score health
        health_score = 100
        issues = []

        if avg_rating < 3.5:
            health_score -= 30
            issues.append(f"Low satisfaction ({avg_rating:.1f}/5)")

        if task_trend < 0.5 and len(old_tasks) > 3:
            health_score -= 25
            issues.append("Task frequency declining significantly")

        if len(recent_tasks) == 0 and len(tasks) > 0:
            health_score -= 35
            issues.append("No tasks in last 30 days")

        revision_count = len([t for t in recent_tasks if t["status"] == "revision"])
        if revision_count > 2:
            health_score -= 15
            issues.append(f"{revision_count} revisions recently")

        # Categorize
        client = {"org_id": org_id, "name": org.get("name", "Unknown"), "health_score": health_score, "issues": issues}
        if health_score >= 70:
            health_report["healthy"].append(client)
        elif health_score >= 40:
            health_report["at_risk"].append(client)
        else:
            health_report["churned"].append(client)

    return health_report


async def draft_outreach(client: dict) -> dict:
    """Draft personalized outreach for an at-risk client."""
    issues = client.get("issues", [])
    name = client.get("name", "there")

    if "No tasks in last 30 days" in issues:
        return {
            "type": "reactivation",
            "subject": f"Hey {name} — got something for you",
            "body": f"Hi {name},\n\nHaven't seen you in a while! We've just launched some new capabilities that might interest you — especially around [relevant feature].\n\nWant me to put together a quick demo of what's new?\n\nBest,\nAgentcy Team",
        }

    if "Low satisfaction" in str(issues):
        return {
            "type": "retention",
            "subject": f"{name} — we'd love your feedback",
            "body": f"Hi {name},\n\nI noticed you might not have been fully happy with recent deliveries. We take quality seriously and I'd love to understand what we can do better.\n\nWould you have 10 minutes for a quick call this week?\n\nBest,\nAgentcy Team",
        }

    return {
        "type": "check_in",
        "subject": f"{name} — monthly check-in",
        "body": f"Hi {name},\n\nJust checking in! How are things going? Is there anything we can help with this month?\n\nBest,\nAgentcy Team",
    }


# ═══════════════════════════════════════════════════════
# 5. SALES FOLLOW-UP
# ═══════════════════════════════════════════════════════

async def check_proposal_followups() -> list:
    """Find proposals that need follow-up."""
    db = get_client(use_admin=True)

    # Get leads with proposals sent 3+ days ago, no response
    cutoff = (datetime.utcnow() - timedelta(days=3)).isoformat()
    leads = db.table("leads").select("*").eq("status", "proposal_sent").lt("updated_at", cutoff).execute().data or []

    followups = []
    for lead in leads:
        days_since = (datetime.utcnow() - datetime.fromisoformat(lead["updated_at"].replace("Z", "+00:00"))).days

        if days_since >= 14:
            urgency = "final"
            approach = "Offer a limited-time incentive or ask directly if still interested"
        elif days_since >= 7:
            urgency = "high"
            approach = "Share a relevant case study or new insight"
        else:
            urgency = "medium"
            approach = "Gentle check-in with additional value"

        followups.append({
            "lead_id": lead["id"],
            "name": lead.get("name"),
            "company": lead.get("company"),
            "days_since_proposal": days_since,
            "urgency": urgency,
            "suggested_approach": approach,
        })

    return followups


async def draft_followup_email(lead: dict) -> dict:
    """Draft a personalized follow-up email."""
    days = lead["days_since_proposal"]
    name = lead.get("name", "there")
    company = lead.get("company", "your company")

    if days >= 14:
        return {
            "subject": f"Closing the loop, {name}",
            "body": f"Hi {name},\n\nI wanted to check in one last time about the proposal we sent for {company}. If the timing isn't right, no worries at all — just let me know and I'll close this out.\n\nIf you'd like to revisit in the future, we'll be here.\n\nBest,\nAgentcy Team",
        }

    if days >= 7:
        return {
            "subject": f"Thought you'd find this relevant, {name}",
            "body": f"Hi {name},\n\nI came across this case study that's very relevant to what we discussed for {company}: [case study link]\n\nThe results they achieved are similar to what we projected for your project. Happy to walk through it if you're interested.\n\nBest,\nAgentcy Team",
        }

    return {
        "subject": f"Quick check-in, {name}",
        "body": f"Hi {name},\n\nJust wanted to make sure you received our proposal and see if you have any questions. Happy to clarify anything or adjust the scope if needed.\n\nBest,\nAgentcy Team",
    }


# ═══════════════════════════════════════════════════════
# 6. COMPETITIVE INTELLIGENCE
# ═══════════════════════════════════════════════════════

async def run_competitive_scan() -> dict:
    """Weekly competitive intelligence scan."""
    # In production: use web_research tool to scan competitor sites
    # For now, return the structure

    competitors = [
        {"name": "Devin (Cognition)", "focus": "AI software engineer", "status": "monitoring"},
        {"name": "Replit Agent", "focus": "AI coding", "status": "monitoring"},
        {"name": "Cursor", "focus": "AI IDE", "status": "monitoring"},
        {"name": "Aider", "focus": "AI pair programming", "status": "monitoring"},
        {"name": "Traditional agencies", "focus": "Manual delivery", "status": "differentiated"},
    ]

    return {
        "scan_date": datetime.utcnow().isoformat(),
        "competitors": competitors,
        "opportunities": [
            "No competitor offers human QA layer — our key differentiator",
            "Most AI tools are developer-focused, not business-focused",
            "Enterprise clients want guarantees, not just tools",
        ],
        "threats": [
            "Claude Code / Cursor making AI coding mainstream",
            "Large agencies starting to adopt AI internally",
        ],
        "recommendations": [
            "Double down on 'reviewed, guaranteed' messaging",
            "Target non-technical buyers who can't use coding tools",
            "Build case studies showing ROI vs traditional agencies",
        ],
    }
