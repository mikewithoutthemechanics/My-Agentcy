"""
My-Agentcy — Internal Business Agents
Full business automation from lead gen to handover.

These agents automate Agentcy.co.za's internal operations.
Each agent is a CrewAI-compatible module with tools, prompts, and workflows.
"""

from crewai import Agent, Task, Crew, Process
from crewai.tools import tool
from typing import Optional
import json


# ═══════════════════════════════════════════════════════
# TOOLS
# ═══════════════════════════════════════════════════════

@tool("web_research")
def web_research(query: str) -> str:
    """Search the web for information about a company, person, or topic."""
    # In production: use Tavily/Brave/Jina
    return f"Research results for: {query}"


@tool("send_notification")
def send_notification(channel: str, message: str) -> str:
    """Send a notification via WhatsApp, Telegram, Slack, or email."""
    return f"Notification sent to {channel}: {message}"


@tool("crm_lookup")
def crm_lookup(identifier: str) -> str:
    """Look up a contact or company in the CRM."""
    return f"CRM record for: {identifier}"


@tool("create_document")
def create_document(doc_type: str, content: str, filename: str) -> str:
    """Create a document (proposal, invoice, report) and save it."""
    return f"Created {doc_type}: {filename}"


@tool("calendar_check")
def calendar_check(date_range: str) -> str:
    """Check calendar for availability and upcoming events."""
    return f"Calendar checked for: {date_range}"


@tool("send_email")
def send_email(to: str, subject: str, body: str) -> str:
    """Send an email to a client or prospect."""
    return f"Email sent to {to}: {subject}"


@tool("update_crm")
def update_crm(contact_id: str, updates: str) -> str:
    """Update a CRM record with new information."""
    return f"CRM updated for {contact_id}"


@tool("generate_invoice")
def generate_invoice(org_id: str, task_ids: str) -> str:
    """Generate an invoice for completed tasks."""
    return f"Invoice generated for org {org_id}"


@tool("get_task_status")
def get_task_status(task_id: str) -> str:
    """Get the current status of a task."""
    return f"Task {task_id} status: in_progress"


@tool("create_social_post")
def create_social_post(platform: str, content: str) -> str:
    """Create a social media post for LinkedIn, Twitter, or Instagram."""
    return f"Post created for {platform}"


# ═══════════════════════════════════════════════════════
# 1. LEAD QUALIFIER — Find and score leads
# ═══════════════════════════════════════════════════════

def create_lead_qualifier():
    return Agent(
        role="Lead Qualification Specialist",
        goal="Identify, research, and score incoming leads to prioritize sales efforts",
        backstory="""You are an expert at identifying high-value business opportunities. 
        You research companies, evaluate fit, score leads 1-100, and route them appropriately.
        You understand SaaS, AI, and software services markets deeply.
        You know what makes a good client: budget, urgency, fit, and decision-making authority.""",
        tools=[web_research, crm_lookup, update_crm, send_notification],
        verbose=True,
    )


def qualify_lead_task(agent, lead_info: str):
    return Task(
        description=f"""Research and score this lead:
        {lead_info}
        
        1. Research the company (size, industry, tech stack, funding)
        2. Identify decision makers
        3. Score the lead 1-100 based on: budget signals, urgency, fit, authority
        4. Route: 80+ → immediate alert to Michael, 50-79 → nurture sequence, <50 → archive
        5. Prepare talking points for the sales conversation""",
        expected_output="Lead score card with company profile, score, recommended action, and talking points",
        agent=agent,
    )


# ═══════════════════════════════════════════════════════
# 2. PROPOSAL GENERATOR — Create winning proposals
# ═══════════════════════════════════════════════════════

def create_proposal_generator():
    return Agent(
        role="Proposal Architect",
        goal="Create compelling, professional proposals that win business",
        backstory="""You are an expert proposal writer for software and AI services.
        You understand how to scope projects, estimate effort, price competitively,
        and present solutions that resonate with decision-makers.
        Your proposals are clear, detailed, and always address the client's core pain points.""",
        tools=[create_document, crm_lookup, web_research],
        verbose=True,
    )


def generate_proposal_task(agent, meeting_notes: str, client_name: str):
    return Task(
        description=f"""Generate a professional proposal based on these meeting notes:
        {meeting_notes}
        
        Client: {client_name}
        
        1. Extract key requirements and pain points
        2. Define scope of work with clear deliverables
        3. Estimate timeline and effort
        4. Calculate pricing (use Agentcy's standard rates)
        5. Include relevant case studies
        6. Generate the proposal document with Agentcy branding""",
        expected_output="Complete proposal document with executive summary, scope, timeline, pricing, and terms",
        agent=agent,
    )


# ═══════════════════════════════════════════════════════
# 3. PROJECT COORDINATOR — Manage active projects
# ═══════════════════════════════════════════════════════

def create_project_coordinator():
    return Agent(
        role="Project Coordinator",
        goal="Keep all projects on track, clients informed, and issues escalated",
        backstory="""You are a meticulous project coordinator who ensures nothing falls through the cracks.
        You monitor task deadlines, track progress, communicate proactively with clients,
        and escalate blockers before they become problems.
        You send daily digests and handle routine client communications.""",
        tools=[get_task_status, send_notification, send_email, calendar_check],
        verbose=True,
    )


def coordinate_projects_task(agent):
    return Task(
        description="""Review all active projects and:
        1. Check each task for deadline risks
        2. Identify blocked or stalled tasks
        3. Generate daily status digest for Michael
        4. Draft routine client updates (progress, ETAs, completions)
        5. Escalate any critical issues immediately""",
        expected_output="Daily status report with task summaries, risks identified, client communications drafted, and escalations",
        agent=agent,
    )


# ═══════════════════════════════════════════════════════
# 4. INVOICE & BILLING AGENT — Automate finances
# ═══════════════════════════════════════════════════════

def create_billing_agent():
    return Agent(
        role="Billing Specialist",
        goal="Automate invoicing, track payments, and manage subscriptions",
        backstory="""You are a detail-oriented billing specialist who ensures accurate invoicing
        and timely payments. You compile task costs, generate professional invoices,
        track payment status, and send polite but effective reminders.""",
        tools=[generate_invoice, send_email, crm_lookup, update_crm],
        verbose=True,
    )


def billing_task(agent, org_id: str):
    return Task(
        description=f"""For organization {org_id}:
        1. Compile all completed but unbilled tasks
        2. Calculate costs (agent tokens + human review + margin)
        3. Generate itemized invoice
        4. Check for any overdue invoices and draft reminders
        5. Update financial dashboard""",
        expected_output="Invoice generated, payment reminders drafted, financial summary",
        agent=agent,
    )


# ═══════════════════════════════════════════════════════
# 5. CONTENT & MARKETING AGENT — Grow the brand
# ═══════════════════════════════════════════════════════

def create_marketing_agent():
    return Agent(
        role="Content & Marketing Strategist",
        goal="Create compelling content that builds authority and drives leads",
        backstory="""You are a skilled content marketer who understands B2B SaaS and AI services.
        You create LinkedIn posts, blog articles, case studies, and newsletters
        that position Agentcy as a thought leader in AI workforce solutions.
        You know SEO, social media algorithms, and what content converts.""",
        tools=[create_social_post, web_research, create_document],
        verbose=True,
    )


def marketing_task(agent):
    return Task(
        description="""Create this week's marketing content:
        1. 2 LinkedIn posts (1 industry insight, 1 project showcase)
        2. 1 blog post outline (deep dive on AI/agentic topic)
        3. 3 Twitter/X posts (tips, observations)
        4. Draft a case study from a recent completed project
        5. Suggest content calendar for next week""",
        expected_output="5+ pieces of content ready for review, plus a content calendar",
        agent=agent,
    )


# ═══════════════════════════════════════════════════════
# 6. CLIENT SUCCESS AGENT — Prevent churn
# ═══════════════════════════════════════════════════════

def create_client_success_agent():
    return Agent(
        role="Client Success Manager",
        goal="Ensure client satisfaction, prevent churn, and drive expansion revenue",
        backstory="""You are a proactive client success manager who catches problems before clients do.
        You monitor health signals (usage patterns, feedback scores, support tickets),
        reach out at the right moments, and turn satisfied clients into advocates.
        You understand that retaining a client is 5x cheaper than acquiring a new one.""",
        tools=[crm_lookup, send_email, send_notification, update_crm],
        verbose=True,
    )


def client_success_task(agent):
    return Task(
        description="""Analyze all active clients:
        1. Check health signals (task frequency trends, revision rates, feedback scores)
        2. Identify at-risk clients (declining activity, low scores, no tasks in 2+ weeks)
        3. Draft proactive outreach for at-risk clients
        4. Identify expansion opportunities (clients who could use more services)
        5. Prepare monthly check-in emails for all active clients
        6. Generate client health dashboard""",
        expected_output="Client health report with at-risk alerts, outreach drafts, and expansion opportunities",
        agent=agent,
    )


# ═══════════════════════════════════════════════════════
# 7. SALES FOLLOW-UP AGENT — Close deals
# ═══════════════════════════════════════════════════════

def create_sales_agent():
    return Agent(
        role="Sales Follow-Up Specialist",
        goal="Nurture leads, follow up on proposals, and close deals",
        backstory="""You are a persistent but professional sales follow-up specialist.
        You know that most deals are won in the follow-up, not the first meeting.
        You craft personalized follow-ups that add value, handle objections gracefully,
        and know when to push and when to give space.""",
        tools=[send_email, crm_lookup, update_crm, calendar_check, send_notification],
        verbose=True,
    )


def sales_followup_task(agent):
    return Task(
        description="""Review the sales pipeline:
        1. Check proposals awaiting response (3+ days old)
        2. Draft follow-up emails that add new value (case study, insight, offer)
        3. Check leads in nurture sequence — advance those ready
        4. Identify deals that need Michael's personal touch
        5. Update CRM with latest interaction notes
        6. Prepare a pipeline summary for Michael""",
        expected_output="Follow-up emails drafted, pipeline updated, summary for Michael",
        agent=agent,
    )


# ═══════════════════════════════════════════════════════
# 8. ONBOARDING AGENT — Smooth client start
# ═══════════════════════════════════════════════════════

def create_onboarding_agent():
    return Agent(
        role="Client Onboarding Specialist",
        goal="Create a seamless onboarding experience that sets clients up for success",
        backstory="""You are an onboarding expert who knows that the first 48 hours determine
        the entire client relationship. You set up accounts, send welcome materials,
        schedule kick-off calls, and ensure clients know exactly how to get value
        from My-Agentcy from day one.""",
        tools=[send_email, create_document, crm_lookup, calendar_check],
        verbose=True,
    )


def onboarding_task(agent, client_name: str, plan: str):
    return Task(
        description=f"""Onboard new client: {client_name} (Plan: {plan})
        1. Create welcome email with getting-started guide
        2. Generate custom brief template for their industry
        3. Schedule kick-off call
        4. Set up their dashboard preferences
        5. Create first-task suggestion based on their industry
        6. Add to appropriate communication channels""",
        expected_output="Welcome email, brief template, kick-off scheduled, first-task suggestion",
        agent=agent,
    )


# ═══════════════════════════════════════════════════════
# 9. HANDOVER AGENT — Project completion
# ═══════════════════════════════════════════════════════

def create_handover_agent():
    return Agent(
        role="Project Handover Specialist",
        goal="Ensure smooth project completion and client handover with documentation",
        backstory="""You are a meticulous handover specialist who ensures nothing is lost
        when a project or engagement ends. You compile all deliverables, create
        summary documentation, extract learnings, and ensure the client has everything
        they need to continue independently if desired.""",
        tools=[create_document, send_email, crm_lookup],
        verbose=True,
    )


def handover_task(agent, project_id: str):
    return Task(
        description=f"""Complete handover for project {project_id}:
        1. Compile all deliverables and artifacts
        2. Create project summary document
        3. Document key decisions and rationale
        4. Extract lessons learned for internal knowledge base
        5. Create maintenance/runbook if applicable
        6. Draft handover email to client
        7. Schedule final review call""",
        expected_output="Handover package: summary doc, artifacts bundle, runbook, client email",
        agent=agent,
    )


# ═══════════════════════════════════════════════════════
# 10. COMPETITIVE INTELLIGENCE AGENT
# ═══════════════════════════════════════════════════════

def create_competitive_intel_agent():
    return Agent(
        role="Competitive Intelligence Analyst",
        goal="Track competitors, identify market opportunities, and inform strategy",
        backstory="""You are a sharp competitive analyst who tracks the AI services landscape.
        You monitor competitor pricing, features, messaging, wins, and losses.
        You identify gaps in the market that Agentcy can exploit and threats that need response.""",
        tools=[web_research, create_document, send_notification],
        verbose=True,
    )


def competitive_intel_task(agent):
    return Task(
        description="""Weekly competitive intelligence report:
        1. Scan competitor websites and social media for changes
        2. Check for new entrants in AI agency space
        3. Monitor pricing changes across competitors
        4. Track competitor client wins/losses
        5. Identify market gaps and opportunities for Agentcy
        6. Flag any threats requiring immediate response""",
        expected_output="Weekly competitive intelligence brief with opportunities and threats",
        agent=agent,
    )


# ═══════════════════════════════════════════════════════
# CREW ASSEMBLY
# ═══════════════════════════════════════════════════════

# Registry of all internal agents
INTERNAL_AGENTS = {
    "lead_qualifier": create_lead_qualifier,
    "proposal_generator": create_proposal_generator,
    "project_coordinator": create_project_coordinator,
    "billing": create_billing_agent,
    "marketing": create_marketing_agent,
    "client_success": create_client_success_agent,
    "sales_followup": create_sales_agent,
    "onboarding": create_onboarding_agent,
    "handover": create_handover_agent,
    "competitive_intel": create_competitive_intel_agent,
}


def run_internal_agent(agent_name: str, task_fn, **kwargs):
    """Run a specific internal agent with a task."""
    agent = INTERNAL_AGENTS[agent_name]()
    task = task_fn(agent, **kwargs)
    
    crew = Crew(
        agents=[agent],
        tasks=[task],
        process=Process.sequential,
        verbose=True,
    )
    
    return crew.kickoff()
