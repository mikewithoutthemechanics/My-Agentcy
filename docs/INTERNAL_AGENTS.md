# My-Agentcy — Internal Agent System

## Overview

My-Agentcy runs on a team of AI agents that handle both internal operations
and client-facing work. This document defines all internal agents that
automate Agentcy.co.za's own business processes.

---

## Internal Agent Roles

### 1. Lead Qualifier Agent
**Purpose:** Evaluate incoming leads, score them, and route to the right channel.

**Inputs:** Website form submissions, email inquiries, LinkedIn messages, referrals

**Process:**
1. Parse the inquiry — extract company, needs, budget signals, urgency
2. Research the company — size, industry, tech stack, funding
3. Score the lead — 1-100 based on fit, budget, urgency
4. Route:
   - Score 80+: Alert Michael immediately (WhatsApp/Telegram)
   - Score 50-79: Add to nurture sequence (email)
   - Score <50: Archive with notes

**Tools:** Web search, LinkedIn lookup, email parser, CRM API, WhatsApp API

**Output:** Lead score card with company profile, recommended action, talking points

---

### 2. Proposal Generator Agent
**Purpose:** Create professional proposals from brief conversations.

**Inputs:** Client meeting notes, requirements doc, scope discussion

**Process:**
1. Extract requirements from notes
2. Match to Agentcy service offerings
3. Estimate effort (hours, agents needed, timeline)
4. Calculate pricing based on tier and scope
5. Generate proposal document:
   - Executive summary
   - Scope of work
   - Timeline & milestones
   - Pricing breakdown
   - Terms & conditions
6. Format as PDF with Agentcy branding

**Tools:** Document generator, pricing engine, template system, PDF creator

**Output:** Professional proposal PDF ready to send

---

### 3. Project Coordinator Agent
**Purpose:** Manage active projects, track progress, handle communications.

**Inputs:** Task status updates, client messages, deadline calendar

**Process:**
1. Monitor all active tasks
2. Check for deadline risks (task behind schedule)
3. Generate daily status digest for Michael
4. Handle routine client communications:
   - "Your task is in progress, ETA 4 hours"
   - "Deliverable ready for review"
   - "Revision requested, working on it now"
5. Escalate blockers to Michael

**Tools:** Task API, calendar API, email/WhatsApp API, notification system

**Output:** Daily status report, client communications, escalation alerts

---

### 4. Invoice & Billing Agent
**Purpose:** Automate invoicing, track payments, manage subscriptions.

**Inputs:** Completed tasks, subscription plans, payment records

**Process:**
1. At month end (or task completion for per-task billing):
   - Compile completed tasks for each client
   - Calculate costs (agent tokens + human review time + margin)
   - Generate invoice with line items
2. Send invoice via email
3. Track payment status
4. Send reminders for overdue invoices
5. Update financial dashboard

**Tools:** Stripe API, email API, accounting integration, PDF generator

**Output:** Invoices, payment reminders, financial reports

---

### 5. Content & Marketing Agent
**Purpose:** Create marketing content, manage social presence.

**Inputs:** Content calendar, industry trends, project case studies

**Process:**
1. Weekly content creation:
   - 2 LinkedIn posts (industry insights, project showcases)
   - 1 blog post (deep dive on AI/agentic topic)
   - 3 Twitter/X posts (tips, observations)
2. Monthly case study from completed projects
3. SEO monitoring and optimization
4. Email newsletter compilation

**Tools:** Web search, content generator, social media API, analytics

**Output:** Social posts, blog articles, case studies, newsletters

---

### 6. Knowledge Base Agent
**Purpose:** Maintain internal knowledge base, learn from every project.

**Inputs:** Completed projects, client feedback, QA reviews, agent memories

**Process:**
1. After each completed task:
   - Extract learnings (what worked, what didn't)
   - Update agent prompts with improvements
   - Add to knowledge base (searchable by future agents)
2. Weekly knowledge consolidation:
   - Identify patterns across tasks
   - Create reusable templates
   - Update rubrics based on common issues
3. On-demand research:
   - Agents can query the knowledge base for context
   - "How did we handle X last time?"

**Tools:** Vector database, embedding model, knowledge graph, agent memory API

**Output:** Updated knowledge base, improved agent prompts, reusable templates

---

### 7. Quality Assurance Coordinator
**Purpose:** Manage the QA pipeline, assign human reviewers, track quality trends.

**Inputs:** QA review results, human reviewer availability, quality metrics

**Process:**
1. Route deliverables to appropriate QA path (T0-T3)
2. For human reviews:
   - Assign to available reviewer
   - Set review deadline based on task priority
   - Track reviewer performance
3. Weekly quality report:
   - Pass rates by tier, task type, agent
   - Common flag categories
   - Improvement trends
4. Trigger agent retraining when quality drops

**Tools:** QA engine, reviewer assignment system, analytics

**Output:** QA assignments, quality reports, retraining triggers

---

### 8. Client Success Agent
**Purpose:** Proactively manage client relationships, prevent churn.

**Inputs:** Client activity, feedback scores, usage patterns, support tickets

**Process:**
1. Monitor client health signals:
   - Task submission frequency (declining = risk)
   - Revision request rate (increasing = dissatisfaction)
   - Feedback scores (below 3 = intervention needed)
2. Proactive outreach:
   - Monthly check-in email
   - Usage summary and recommendations
   - New feature announcements
3. At-risk intervention:
   - Personal message from "account manager"
   - Offer training session
   - Propose plan adjustment

**Tools:** CRM API, email API, analytics, notification system

**Output:** Client health scores, outreach messages, intervention alerts

---

## Agent Orchestration

### Communication Protocol
All internal agents communicate via a message bus:

```json
{
  "from": "lead_qualifier",
  "to": "proposal_generator",
  "type": "new_lead",
  "payload": {
    "lead_id": "uuid",
    "company": "Acme Corp",
    "score": 85,
    "requirements": "...",
    "talking_points": "..."
  },
  "priority": "high",
  "timestamp": "ISO-8601"
}
```

### Scheduling
- **Lead Qualifier:** On-demand (triggered by new inquiry)
- **Proposal Generator:** On-demand (triggered by qualified lead)
- **Project Coordinator:** Every 4 hours
- **Invoice Agent:** Monthly + on task completion
- **Content Agent:** Weekly (Monday, Wednesday, Friday)
- **Knowledge Base:** After every completed task + weekly consolidation
- **QA Coordinator:** Continuous (monitors QA pipeline)
- **Client Success:** Weekly health check + on-trigger

### Monitoring
All agents report to a central dashboard:
- Tasks processed
- Success/failure rate
- Token usage / cost
- Human intervention needed (and why)
- Self-improvement metrics (are outputs getting better?)

---

## Integration Map

```
┌──────────────┐     ┌──────────────┐     ┌──────────────┐
│ Lead Qualifier│────▶│  Proposal    │────▶│   Project    │
│              │     │  Generator   │     │  Coordinator │
└──────────────┘     └──────────────┘     └──────────────┘
       │                                         │
       ▼                                         ▼
┌──────────────┐     ┌──────────────┐     ┌──────────────┐
│   Client     │     │   Invoice    │     │     QA       │
│   Success    │◀───▶│   & Billing  │     │ Coordinator  │
└──────────────┘     └──────────────┘     └──────────────┘
       │                                         │
       ▼                                         ▼
┌──────────────┐     ┌──────────────┐     ┌──────────────┐
│   Content    │     │  Knowledge   │     │   Agent      │
│  & Marketing │     │    Base      │◀───▶│   Teams      │
└──────────────┘     └──────────────┘     └──────────────┘
```

---

*Internal agents spec v1.0 — My-Agentcy*
