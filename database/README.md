# My-Agentcy Database

Supabase database schema for the **My-Agentcy** AI Workforce as a Service platform.

## Structure

```
database/
├── migrations/
│   ├── 001_initial.sql      # Full schema (tables, enums, indexes, triggers)
│   ├── 002_rls.sql          # Row Level Security policies
│   └── 003_functions.sql    # Utility functions
├── seed/
│   └── rubrics.sql          # Default QA rubrics for task types
├── supabase/
│   └── config.toml          # Supabase project config
└── README.md
```

## Tables

| Table | Purpose |
|---|---|
| `organizations` | Tenants (multi-tenant root) |
| `users` | Users scoped to organizations |
| `tasks` | Work orders with type, priority, tier, status |
| `deliverables` | Versioned outputs produced by agents |
| `qa_reviews` | Quality scores on deliverables |
| `client_feedback` | Client ratings and revision requests |
| `cost_entries` | Token/cost tracking per task per agent |
| `agent_memory` | Persistent agent learning across tasks |
| `invoices` | Billing with linked task IDs |
| `task_queue` | Priority queue for task scheduling |
| `rubrics` | Configurable QA rubrics per task type |

## Running Migrations

### Option A: Supabase CLI (recommended)

```bash
# Install
npm install -g supabase

# Start local Supabase
cd projects/my-agentcy/database
supabase start

# Apply migrations in order
supabase migration up

# Or apply manually
psql postgresql://postgres:postgres@localhost:54322/postgres \
  -f migrations/001_initial.sql
psql postgresql://postgres:postgres@localhost:54322/postgres \
  -f migrations/002_rls.sql
psql postgresql://postgres:postgres@localhost:54322/postgres \
  -f migrations/003_functions.sql

# Seed data
psql postgresql://postgres:postgres@localhost:54322/postgres \
  -f seed/rubrics.sql
```

### Option B: Remote Supabase

```bash
# Link to your project
supabase link --project-ref <your-project-ref>

# Push migrations
supabase db push
```

### Option C: Direct psql

```bash
psql "postgresql://postgres:[PASSWORD]@db.[REF].supabase.co:5432/postgres" \
  -f migrations/001_initial.sql \
  -f migrations/002_rls.sql \
  -f migrations/003_functions.sql \
  -f seed/rubrics.sql
```

## Functions

| Function | Returns | Description |
|---|---|---|
| `get_dashboard_metrics(org_id)` | JSONB | Aggregated task counts, costs, ratings |
| `get_agent_performance(agent_id)` | JSONB | Agent stats: tasks, tokens, costs, QA scores |
| `calculate_task_cost(task_id)` | JSONB | Cost breakdown by type, model, agent |
| `auto_classify_tier(type, priority)` | task_tier | Maps task type + priority → tier1/2/3 |

## RLS

All tenant-scoped tables enforce Row Level Security. The tenant is resolved via:
- `request.jwt.claims` → `org_id` (Supabase Auth JWT), or
- `app.current_org_id` session variable (for service-role access)

## Task Auto-Classification

Tasks automatically get a `tier` assigned on insert/update via trigger if not explicitly set:
- **tier1**: Simple tasks (content, data, report at low/medium priority)
- **tier2**: Moderate (research, design, high priority)
- **tier3**: Complex (code, automation at high/urgent priority)
