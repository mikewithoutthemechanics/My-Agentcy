# My-Agentcy — Client Product Specification

## Product Name
**My-Agentcy** — AI Workforce on Demand

## Tagline
"Your AI team, reviewed and guaranteed."

## Pricing Tiers

### Starter — R2,999/month
- 20 tasks/month
- T0-T1 QA (automated + spot check)
- Standard task types (reports, analysis, content, data)
- 24-hour turnaround
- Email support
- Dashboard access

### Pro — R7,999/month
- 80 tasks/month
- T0-T2 QA (includes full human review)
- All task types including strategy & design
- 12-hour turnaround
- Priority queue
- Slack/WhatsApp integration
- Dedicated account manager
- Custom templates & branding

### Enterprise — Custom
- Unlimited tasks
- T0-T3 QA (includes senior review + client sign-off)
- Custom agent training on your data
- 4-hour turnaround
- API access
- SSO & audit logs
- On-premise deployment option
- SLA guarantee

## Task Types Available

| Category | Types | Starter | Pro | Enterprise |
|----------|-------|---------|-----|------------|
| Research | Market research, competitive analysis, literature review | ✅ | ✅ | ✅ |
| Analysis | Data analysis, financial modeling, trend analysis | ✅ | ✅ | ✅ |
| Content | Blog posts, reports, documentation, proposals | ✅ | ✅ | ✅ |
| Code | Scripts, integrations, automation, bug fixes | ❌ | ✅ | ✅ |
| Strategy | Business strategy, go-to-market, growth plans | ❌ | ✅ | ✅ |
| Design | UI specs, wireframes, design systems | ❌ | ✅ | ✅ |
| Legal | Contract review, compliance checks | ❌ | ❌ | ✅ |
| Custom | Anything else | ❌ | ❌ | ✅ |

## Client Portal Features

### Task Submission
- Structured brief form (title, description, requirements, constraints)
- File attachments (PDFs, spreadsheets, images)
- Priority selection
- Deadline setting
- Recurring task setup

### Delivery & Review
- View deliverables in-browser
- Download artifacts (documents, code, data)
- Request revision with notes
- Approve & close

### Analytics
- Tasks completed vs. submitted
- Average delivery time
- Quality scores over time
- Cost breakdown
- Agent performance view

### Integrations
- **Slack** — Submit tasks, receive notifications, approve deliverables
- **WhatsApp** — Task updates, quick approvals
- **Email** — Delivery notifications, weekly summaries
- **Google Drive** — Auto-save deliverables
- **Notion** — Sync tasks to workspace
- **Jira** — Import/export tasks

## API

### Endpoints

```
POST   /api/v1/tasks              — Submit a new task
GET    /api/v1/tasks              — List tasks
GET    /api/v1/tasks/:id          — Get task details
POST   /api/v1/tasks/:id/revise   — Request revision
POST   /api/v1/tasks/:id/approve  — Approve deliverable
GET    /api/v1/tasks/:id/costs    — Get task cost breakdown

GET    /api/v1/deliverables/:id   — Get deliverable content
GET    /api/v1/deliverables/:id/download — Download artifacts

GET    /api/v1/analytics/overview — Dashboard metrics
GET    /api/v1/analytics/costs    — Cost analytics
```

### Authentication
- API key (X-API-Key header)
- OAuth 2.0 (for integrations)
- JWT (for portal sessions)

## Quality Guarantees

1. **Every deliverable is reviewed** — automated minimum, human for complex tasks
2. **Revision guarantee** — unlimited revisions until satisfied
3. **Turnaround SLA** — compensation if deadline missed (Pro+)
4. **Accuracy guarantee** — factual errors corrected at no cost
5. **Confidentiality** — all data encrypted, never used for training

## Onboarding Flow

1. **Sign up** — email/password or SSO
2. **Choose plan** — Starter, Pro, Enterprise
3. **Connect integrations** — Slack, WhatsApp, Drive (optional)
4. **Submit first task** — guided brief builder
5. **Receive delivery** — within turnaround window
6. **Review & approve** — or request revision

## Marketing Position

**For:** Small-to-medium businesses that need professional work done but can't afford full-time specialists.

**Unlike:** Freelancer marketplaces (inconsistent quality), agencies (expensive, slow), raw AI tools (no quality control).

**We:** Combine AI speed with human quality assurance. Every deliverable reviewed. Every client satisfied.

---

*Product spec v1.0 — My-Agentcy by Agentcy.co.za*
