-- My-Agentcy Database Schema
-- Supabase PostgreSQL

-- ═══════════════════════════════════════════════════════
-- TENANTS & AUTH
-- ═══════════════════════════════════════════════════════

CREATE TABLE organizations (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name TEXT NOT NULL,
    slug TEXT UNIQUE NOT NULL,
    plan TEXT DEFAULT 'starter' CHECK (plan IN ('starter', 'pro', 'enterprise')),
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE users (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    org_id UUID REFERENCES organizations(id) ON DELETE CASCADE,
    email TEXT UNIQUE NOT NULL,
    name TEXT,
    role TEXT DEFAULT 'member' CHECK (role IN ('owner', 'admin', 'member', 'viewer')),
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ═══════════════════════════════════════════════════════
-- TASKS
-- ═══════════════════════════════════════════════════════

CREATE TABLE tasks (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    org_id UUID REFERENCES organizations(id) ON DELETE CASCADE,
    created_by UUID REFERENCES users(id),
    
    -- Task details
    title TEXT NOT NULL,
    description TEXT NOT NULL,
    task_type TEXT NOT NULL, -- 'report', 'code', 'analysis', 'content', 'data', etc.
    priority INTEGER DEFAULT 3 CHECK (priority BETWEEN 1 AND 5), -- 1=highest
    
    -- Classification
    tier TEXT DEFAULT 'T1' CHECK (tier IN ('T0', 'T1', 'T2', 'T3')),
    
    -- Status
    status TEXT DEFAULT 'queued' CHECK (status IN (
        'queued', 'classifying', 'in_progress', 
        'qa_review', 'human_review', 'revision',
        'approved', 'delivered', 'completed', 'failed'
    )),
    
    -- Brief & requirements
    brief JSONB NOT NULL, -- structured brief from client
    requirements TEXT[], -- checklist items
    constraints JSONB, -- deadline, budget, style preferences
    
    -- Assignment
    assigned_crew TEXT, -- which crew/team is handling this
    assigned_agents TEXT[], -- specific agent IDs
    
    -- Timestamps
    deadline TIMESTAMPTZ,
    started_at TIMESTAMPTZ,
    completed_at TIMESTAMPTZ,
    delivered_at TIMESTAMPTZ,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_tasks_org ON tasks(org_id);
CREATE INDEX idx_tasks_status ON tasks(status);
CREATE INDEX idx_tasks_tier ON tasks(tier);
CREATE INDEX idx_tasks_priority ON tasks(priority);

-- ═══════════════════════════════════════════════════════
-- DELIVERABLES
-- ═══════════════════════════════════════════════════════

CREATE TABLE deliverables (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    task_id UUID REFERENCES tasks(id) ON DELETE CASCADE,
    
    -- Content
    content_type TEXT NOT NULL, -- 'document', 'code', 'data', 'report', 'design'
    content JSONB NOT NULL, -- the actual deliverable
    artifacts TEXT[], -- file paths / URLs to generated files
    
    -- Version
    version INTEGER DEFAULT 1,
    is_final BOOLEAN DEFAULT FALSE,
    
    -- Agent metadata
    produced_by TEXT, -- agent ID that created this
    token_usage JSONB, -- {input: N, output: N, cost: N}
    
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ═══════════════════════════════════════════════════════
-- QA & REVIEW
-- ═══════════════════════════════════════════════════════

CREATE TABLE qa_reviews (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    task_id UUID REFERENCES tasks(id) ON DELETE CASCADE,
    deliverable_id UUID REFERENCES deliverables(id),
    
    -- Review type
    review_type TEXT NOT NULL CHECK (review_type IN ('automated', 'spot_check', 'full', 'senior')),
    reviewer TEXT, -- 'qa_agent' or user_id for human
    
    -- Scores (0-100)
    score_overall INTEGER CHECK (score_overall BETWEEN 0 AND 100),
    score_accuracy INTEGER CHECK (score_accuracy BETWEEN 0 AND 100),
    score_completeness INTEGER CHECK (score_completeness BETWEEN 0 AND 100),
    score_format INTEGER CHECK (score_format BETWEEN 0 AND 100),
    score_relevance INTEGER CHECK (score_relevance BETWEEN 0 AND 100),
    
    -- Results
    passed BOOLEAN DEFAULT FALSE,
    flags JSONB, -- [{field, issue, severity, suggestion}]
    comments TEXT,
    
    -- Rubric reference
    rubric_used TEXT, -- rubric ID
    rubric_version TEXT,
    
    created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_qa_task ON qa_reviews(task_id);

-- ═══════════════════════════════════════════════════════
-- CLIENT FEEDBACK
-- ═══════════════════════════════════════════════════════

CREATE TABLE client_feedback (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    task_id UUID REFERENCES tasks(id) ON DELETE CASCADE,
    org_id UUID REFERENCES organizations(id),
    
    -- Rating
    rating INTEGER CHECK (rating BETWEEN 1 AND 5),
    
    -- Feedback
    feedback TEXT,
    revision_requested BOOLEAN DEFAULT FALSE,
    revision_notes TEXT,
    
    -- Categories
    categories TEXT[], -- 'accuracy', 'speed', 'communication', 'value'
    
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ═══════════════════════════════════════════════════════
-- COST TRACKING
-- ═══════════════════════════════════════════════════════

CREATE TABLE cost_entries (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    task_id UUID REFERENCES tasks(id) ON DELETE CASCADE,
    
    -- What was spent
    entry_type TEXT NOT NULL CHECK (entry_type IN ('llm_tokens', 'api_call', 'compute', 'human_review')),
    
    -- LLM costs
    model TEXT, -- 'gpt-4o', 'claude-sonnet', etc.
    input_tokens BIGINT DEFAULT 0,
    output_tokens BIGINT DEFAULT 0,
    
    -- Money
    cost_usd DECIMAL(10, 6) NOT NULL DEFAULT 0,
    
    -- Metadata
    agent_id TEXT, -- which agent incurred this
    operation TEXT, -- 'research', 'generate', 'review', etc.
    
    created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_cost_task ON cost_entries(task_id);

-- ═══════════════════════════════════════════════════════
-- AGENT MEMORY (learning from past tasks)
-- ═══════════════════════════════════════════════════════

CREATE TABLE agent_memory (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    
    agent_id TEXT NOT NULL,
    memory_type TEXT NOT NULL CHECK (memory_type IN ('lesson', 'pattern', 'preference', 'correction')),
    
    -- What was learned
    context TEXT NOT NULL, -- situation where this applies
    insight TEXT NOT NULL, -- what to remember
    confidence DECIMAL(3, 2) DEFAULT 0.5, -- 0.0 to 1.0
    
    -- Source
    source_task_id UUID REFERENCES tasks(id),
    source_feedback_id UUID REFERENCES client_feedback(id),
    
    -- Usage
    times_applied INTEGER DEFAULT 0,
    last_applied TIMESTAMPTZ,
    
    created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_memory_agent ON agent_memory(agent_id);
CREATE INDEX idx_memory_type ON agent_memory(memory_type);

-- ═══════════════════════════════════════════════════════
-- BILLING
-- ═══════════════════════════════════════════════════════

CREATE TABLE invoices (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    org_id UUID REFERENCES organizations(id),
    
    -- Amounts
    subtotal_usd DECIMAL(10, 2) NOT NULL,
    tax_usd DECIMAL(10, 2) DEFAULT 0,
    total_usd DECIMAL(10, 2) NOT NULL,
    
    -- Line items reference
    task_ids UUID[],
    
    -- Status
    status TEXT DEFAULT 'draft' CHECK (status IN ('draft', 'sent', 'paid', 'overdue', 'cancelled')),
    
    -- Dates
    issued_at TIMESTAMPTZ,
    due_at TIMESTAMPTZ,
    paid_at TIMESTAMPTZ,
    
    created_at TIMESTAMPTZ DEFAULT NOW()
);
