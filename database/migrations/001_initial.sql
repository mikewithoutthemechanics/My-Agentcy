-- 001_initial.sql
-- My-Agentcy: AI Workforce as a Service — Initial Schema

-- Enable required extensions
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- ============================================================
-- ENUMS
-- ============================================================

CREATE TYPE plan_tier AS ENUM ('free', 'starter', 'pro', 'enterprise');
CREATE TYPE user_role AS ENUM ('owner', 'admin', 'member', 'viewer');
CREATE TYPE task_type AS ENUM ('report', 'code', 'analysis', 'content', 'data', 'research', 'design', 'automation');
CREATE TYPE task_priority AS ENUM ('low', 'medium', 'high', 'urgent');
CREATE TYPE task_tier AS ENUM ('tier1', 'tier2', 'tier3');
CREATE TYPE task_status AS ENUM ('queued', 'in_progress', 'review', 'revision', 'completed', 'cancelled', 'failed');
CREATE TYPE review_type AS ENUM ('internal', 'client', 'automated');
CREATE TYPE invoice_status AS ENUM ('draft', 'sent', 'paid', 'overdue', 'cancelled');
CREATE TYPE memory_type AS ENUM ('preference', 'pattern', 'error_correction', 'domain_knowledge', 'workflow');
CREATE TYPE cost_entry_type AS ENUM ('llm', 'embedding', 'tool', 'infra');

-- ============================================================
-- TABLES
-- ============================================================

-- Organizations (tenants)
CREATE TABLE organizations (
    id          UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name        TEXT NOT NULL,
    slug        TEXT NOT NULL UNIQUE,
    plan        plan_tier NOT NULL DEFAULT 'free',
    settings    JSONB NOT NULL DEFAULT '{}',
    created_at  TIMESTAMPTZ NOT NULL DEFAULT now(),
    updated_at  TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Users
CREATE TABLE users (
    id          UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    org_id      UUID NOT NULL REFERENCES organizations(id) ON DELETE CASCADE,
    email       TEXT NOT NULL,
    name        TEXT NOT NULL,
    role        user_role NOT NULL DEFAULT 'member',
    avatar_url  TEXT,
    metadata    JSONB NOT NULL DEFAULT '{}',
    created_at  TIMESTAMPTZ NOT NULL DEFAULT now(),
    updated_at  TIMESTAMPTZ NOT NULL DEFAULT now(),
    UNIQUE (org_id, email)
);

CREATE INDEX idx_users_org ON users(org_id);

-- Tasks
CREATE TABLE tasks (
    id               UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    org_id           UUID NOT NULL REFERENCES organizations(id) ON DELETE CASCADE,
    title            TEXT NOT NULL,
    description      TEXT,
    task_type        task_type NOT NULL,
    priority         task_priority NOT NULL DEFAULT 'medium',
    tier             task_tier,
    status           task_status NOT NULL DEFAULT 'queued',
    brief            JSONB NOT NULL DEFAULT '{}',
    requirements     TEXT[] NOT NULL DEFAULT '{}',
    constraints      JSONB NOT NULL DEFAULT '{}',
    assigned_crew    TEXT,
    assigned_agents  TEXT[] NOT NULL DEFAULT '{}',
    deadline         TIMESTAMPTZ,
    started_at       TIMESTAMPTZ,
    completed_at     TIMESTAMPTZ,
    created_at       TIMESTAMPTZ NOT NULL DEFAULT now(),
    updated_at       TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX idx_tasks_org ON tasks(org_id);
CREATE INDEX idx_tasks_status ON tasks(org_id, status);
CREATE INDEX idx_tasks_type ON tasks(org_id, task_type);
CREATE INDEX idx_tasks_priority ON tasks(org_id, priority);
CREATE INDEX idx_tasks_deadline ON tasks(deadline) WHERE deadline IS NOT NULL;

-- Deliverables
CREATE TABLE deliverables (
    id            UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    task_id       UUID NOT NULL REFERENCES tasks(id) ON DELETE CASCADE,
    content_type  TEXT NOT NULL DEFAULT 'text',
    content       JSONB NOT NULL DEFAULT '{}',
    artifacts     TEXT[] NOT NULL DEFAULT '{}',
    version       INTEGER NOT NULL DEFAULT 1,
    is_final      BOOLEAN NOT NULL DEFAULT false,
    produced_by   TEXT,
    token_usage   JSONB NOT NULL DEFAULT '{}',
    created_at    TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX idx_deliverables_task ON deliverables(task_id);

-- QA Reviews
CREATE TABLE qa_reviews (
    id               UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    task_id          UUID NOT NULL REFERENCES tasks(id) ON DELETE CASCADE,
    deliverable_id   UUID REFERENCES deliverables(id) ON DELETE SET NULL,
    review_type      review_type NOT NULL DEFAULT 'internal',
    reviewer         TEXT NOT NULL,
    score_overall    INTEGER NOT NULL CHECK (score_overall >= 0 AND score_overall <= 100),
    score_accuracy   INTEGER NOT NULL CHECK (score_accuracy >= 0 AND score_accuracy <= 100),
    score_completeness INTEGER NOT NULL CHECK (score_completeness >= 0 AND score_completeness <= 100),
    score_format     INTEGER NOT NULL CHECK (score_format >= 0 AND score_format <= 100),
    score_relevance  INTEGER NOT NULL CHECK (score_relevance >= 0 AND score_relevance <= 100),
    passed           BOOLEAN NOT NULL DEFAULT false,
    flags            JSONB NOT NULL DEFAULT '{}',
    comments         TEXT,
    rubric_used      UUID,
    created_at       TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX idx_qa_reviews_task ON qa_reviews(task_id);
CREATE INDEX idx_qa_reviews_deliverable ON qa_reviews(deliverable_id);

-- Client Feedback
CREATE TABLE client_feedback (
    id                 UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    task_id            UUID NOT NULL REFERENCES tasks(id) ON DELETE CASCADE,
    org_id             UUID NOT NULL REFERENCES organizations(id) ON DELETE CASCADE,
    rating             INTEGER NOT NULL CHECK (rating >= 1 AND rating <= 5),
    feedback           TEXT,
    revision_requested BOOLEAN NOT NULL DEFAULT false,
    revision_notes     TEXT,
    categories         TEXT[] NOT NULL DEFAULT '{}',
    created_at         TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX idx_client_feedback_task ON client_feedback(task_id);
CREATE INDEX idx_client_feedback_org ON client_feedback(org_id);

-- Cost Entries
CREATE TABLE cost_entries (
    id            UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    task_id       UUID NOT NULL REFERENCES tasks(id) ON DELETE CASCADE,
    entry_type    cost_entry_type NOT NULL DEFAULT 'llm',
    model         TEXT,
    input_tokens  BIGINT NOT NULL DEFAULT 0,
    output_tokens BIGINT NOT NULL DEFAULT 0,
    cost_usd      NUMERIC(12, 6) NOT NULL DEFAULT 0,
    agent_id      TEXT,
    operation     TEXT,
    created_at    TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX idx_cost_entries_task ON cost_entries(task_id);
CREATE INDEX idx_cost_entries_agent ON cost_entries(agent_id);

-- Agent Memory
CREATE TABLE agent_memory (
    id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    agent_id        TEXT NOT NULL,
    memory_type     memory_type NOT NULL,
    context         TEXT NOT NULL,
    insight         TEXT NOT NULL,
    confidence      NUMERIC(3, 2) NOT NULL CHECK (confidence >= 0 AND confidence <= 1),
    source_task_id  UUID REFERENCES tasks(id) ON DELETE SET NULL,
    times_applied   INTEGER NOT NULL DEFAULT 0,
    last_applied    TIMESTAMPTZ,
    created_at      TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX idx_agent_memory_agent ON agent_memory(agent_id);
CREATE INDEX idx_agent_memory_type ON agent_memory(agent_id, memory_type);

-- Invoices
CREATE TABLE invoices (
    id          UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    org_id      UUID NOT NULL REFERENCES organizations(id) ON DELETE CASCADE,
    subtotal_usd NUMERIC(12, 2) NOT NULL DEFAULT 0,
    tax_usd     NUMERIC(12, 2) NOT NULL DEFAULT 0,
    total_usd   NUMERIC(12, 2) NOT NULL DEFAULT 0,
    task_ids    UUID[] NOT NULL DEFAULT '{}',
    status      invoice_status NOT NULL DEFAULT 'draft',
    issued_at   TIMESTAMPTZ,
    due_at      TIMESTAMPTZ,
    paid_at     TIMESTAMPTZ,
    created_at  TIMESTAMPTZ NOT NULL DEFAULT now(),
    updated_at  TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX idx_invoices_org ON invoices(org_id);
CREATE INDEX idx_invoices_status ON invoices(org_id, status);

-- Task Queue
CREATE TABLE task_queue (
    id         UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    task_id    UUID NOT NULL REFERENCES tasks(id) ON DELETE CASCADE,
    priority   INTEGER NOT NULL DEFAULT 0,
    queued_at  TIMESTAMPTZ NOT NULL DEFAULT now(),
    started_at TIMESTAMPTZ,
    worker_id  TEXT,
    UNIQUE (task_id)
);

CREATE INDEX idx_task_queue_priority ON task_queue(priority DESC, queued_at ASC) WHERE started_at IS NULL;

-- Rubrics
CREATE TABLE rubrics (
    id         UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    task_type  task_type NOT NULL,
    name       TEXT NOT NULL,
    criteria   JSONB NOT NULL DEFAULT '{}',
    version    INTEGER NOT NULL DEFAULT 1,
    is_active  BOOLEAN NOT NULL DEFAULT true,
    created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX idx_rubrics_type ON rubrics(task_type) WHERE is_active = true;

-- ============================================================
-- UPDATED_AT TRIGGER
-- ============================================================

CREATE OR REPLACE FUNCTION update_updated_at()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = now();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trg_organizations_updated BEFORE UPDATE ON organizations
    FOR EACH ROW EXECUTE FUNCTION update_updated_at();

CREATE TRIGGER trg_users_updated BEFORE UPDATE ON users
    FOR EACH ROW EXECUTE FUNCTION update_updated_at();

CREATE TRIGGER trg_tasks_updated BEFORE UPDATE ON tasks
    FOR EACH ROW EXECUTE FUNCTION update_updated_at();

CREATE TRIGGER trg_invoices_updated BEFORE UPDATE ON invoices
    FOR EACH ROW EXECUTE FUNCTION update_updated_at();
