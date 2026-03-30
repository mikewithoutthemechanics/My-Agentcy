-- 002_rls.sql
-- My-Agentcy: Row Level Security Policies for Multi-Tenant Isolation

-- ============================================================
-- ENABLE RLS ON ALL TENANT TABLES
-- ============================================================

ALTER TABLE organizations ENABLE ROW LEVEL SECURITY;
ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE tasks ENABLE ROW LEVEL SECURITY;
ALTER TABLE deliverables ENABLE ROW LEVEL SECURITY;
ALTER TABLE qa_reviews ENABLE ROW LEVEL SECURITY;
ALTER TABLE client_feedback ENABLE ROW LEVEL SECURITY;
ALTER TABLE cost_entries ENABLE ROW LEVEL SECURITY;
ALTER TABLE invoices ENABLE ROW LEVEL SECURITY;
ALTER TABLE task_queue ENABLE ROW LEVEL SECURITY;

-- agent_memory and rubrics are shared resources (not tenant-scoped)
-- agent_memory is scoped by agent_id, rubrics are global

-- ============================================================
-- HELPER: Current user's org_id from JWT
-- ============================================================

-- Expects auth.uid() to return the user UUID
-- and a JWT claim 'org_id' for tenant isolation

CREATE OR REPLACE FUNCTION auth_org_id()
RETURNS UUID AS $$
    SELECT COALESCE(
        current_setting('request.jwt.claims', true)::jsonb ->> 'org_id',
        current_setting('app.current_org_id', true)
    )::UUID;
$$ LANGUAGE sql STABLE;

-- ============================================================
-- ORGANIZATIONS
-- ============================================================

CREATE POLICY org_select ON organizations
    FOR SELECT USING (id = auth_org_id());

CREATE POLICY org_update ON organizations
    FOR UPDATE USING (id = auth_org_id());

-- ============================================================
-- USERS
-- ============================================================

CREATE POLICY users_select ON users
    FOR SELECT USING (org_id = auth_org_id());

CREATE POLICY users_insert ON users
    FOR INSERT WITH CHECK (org_id = auth_org_id());

CREATE POLICY users_update ON users
    FOR UPDATE USING (org_id = auth_org_id());

CREATE POLICY users_delete ON users
    FOR DELETE USING (org_id = auth_org_id());

-- ============================================================
-- TASKS
-- ============================================================

CREATE POLICY tasks_select ON tasks
    FOR SELECT USING (org_id = auth_org_id());

CREATE POLICY tasks_insert ON tasks
    FOR INSERT WITH CHECK (org_id = auth_org_id());

CREATE POLICY tasks_update ON tasks
    FOR UPDATE USING (org_id = auth_org_id());

CREATE POLICY tasks_delete ON tasks
    FOR DELETE USING (org_id = auth_org_id());

-- ============================================================
-- DELIVERABLES (scoped via task_id → tasks.org_id)
-- ============================================================

CREATE POLICY deliverables_select ON deliverables
    FOR SELECT USING (
        task_id IN (SELECT id FROM tasks WHERE org_id = auth_org_id())
    );

CREATE POLICY deliverables_insert ON deliverables
    FOR INSERT WITH CHECK (
        task_id IN (SELECT id FROM tasks WHERE org_id = auth_org_id())
    );

CREATE POLICY deliverables_update ON deliverables
    FOR UPDATE USING (
        task_id IN (SELECT id FROM tasks WHERE org_id = auth_org_id())
    );

CREATE POLICY deliverables_delete ON deliverables
    FOR DELETE USING (
        task_id IN (SELECT id FROM tasks WHERE org_id = auth_org_id())
    );

-- ============================================================
-- QA REVIEWS (scoped via task_id → tasks.org_id)
-- ============================================================

CREATE POLICY qa_reviews_select ON qa_reviews
    FOR SELECT USING (
        task_id IN (SELECT id FROM tasks WHERE org_id = auth_org_id())
    );

CREATE POLICY qa_reviews_insert ON qa_reviews
    FOR INSERT WITH CHECK (
        task_id IN (SELECT id FROM tasks WHERE org_id = auth_org_id())
    );

CREATE POLICY qa_reviews_update ON qa_reviews
    FOR UPDATE USING (
        task_id IN (SELECT id FROM tasks WHERE org_id = auth_org_id())
    );

CREATE POLICY qa_reviews_delete ON qa_reviews
    FOR DELETE USING (
        task_id IN (SELECT id FROM tasks WHERE org_id = auth_org_id())
    );

-- ============================================================
-- CLIENT FEEDBACK
-- ============================================================

CREATE POLICY client_feedback_select ON client_feedback
    FOR SELECT USING (org_id = auth_org_id());

CREATE POLICY client_feedback_insert ON client_feedback
    FOR INSERT WITH CHECK (org_id = auth_org_id());

CREATE POLICY client_feedback_update ON client_feedback
    FOR UPDATE USING (org_id = auth_org_id());

CREATE POLICY client_feedback_delete ON client_feedback
    FOR DELETE USING (org_id = auth_org_id());

-- ============================================================
-- COST ENTRIES (scoped via task_id → tasks.org_id)
-- ============================================================

CREATE POLICY cost_entries_select ON cost_entries
    FOR SELECT USING (
        task_id IN (SELECT id FROM tasks WHERE org_id = auth_org_id())
    );

CREATE POLICY cost_entries_insert ON cost_entries
    FOR INSERT WITH CHECK (
        task_id IN (SELECT id FROM tasks WHERE org_id = auth_org_id())
    );

-- Cost entries are append-only (no update/delete)

-- ============================================================
-- INVOICES
-- ============================================================

CREATE POLICY invoices_select ON invoices
    FOR SELECT USING (org_id = auth_org_id());

CREATE POLICY invoices_insert ON invoices
    FOR INSERT WITH CHECK (org_id = auth_org_id());

CREATE POLICY invoices_update ON invoices
    FOR UPDATE USING (org_id = auth_org_id());

CREATE POLICY invoices_delete ON invoices
    FOR DELETE USING (org_id = auth_org_id());

-- ============================================================
-- TASK QUEUE (scoped via task_id → tasks.org_id)
-- ============================================================

CREATE POLICY task_queue_select ON task_queue
    FOR SELECT USING (
        task_id IN (SELECT id FROM tasks WHERE org_id = auth_org_id())
    );

CREATE POLICY task_queue_insert ON task_queue
    FOR INSERT WITH CHECK (
        task_id IN (SELECT id FROM tasks WHERE org_id = auth_org_id())
    );

CREATE POLICY task_queue_update ON task_queue
    FOR UPDATE USING (
        task_id IN (SELECT id FROM tasks WHERE org_id = auth_org_id())
    );

CREATE POLICY task_queue_delete ON task_queue
    FOR DELETE USING (
        task_id IN (SELECT id FROM tasks WHERE org_id = auth_org_id())
    );
