-- 003_functions.sql
-- My-Agentcy: Utility Functions

-- ============================================================
-- get_dashboard_metrics(org_id UUID)
-- Returns aggregated metrics for an organization dashboard
-- ============================================================

CREATE OR REPLACE FUNCTION get_dashboard_metrics(p_org_id UUID)
RETURNS JSONB AS $$
DECLARE
    result JSONB;
BEGIN
    SELECT jsonb_build_object(
        'total_tasks', COUNT(*),
        'queued', COUNT(*) FILTER (WHERE status = 'queued'),
        'in_progress', COUNT(*) FILTER (WHERE status = 'in_progress'),
        'review', COUNT(*) FILTER (WHERE status = 'review'),
        'revision', COUNT(*) FILTER (WHERE status = 'revision'),
        'completed', COUNT(*) FILTER (WHERE status = 'completed'),
        'cancelled', COUNT(*) FILTER (WHERE status = 'cancelled'),
        'failed', COUNT(*) FILTER (WHERE status = 'failed'),
        'avg_rating', (
            SELECT ROUND(AVG(cf.rating), 2)
            FROM client_feedback cf
            JOIN tasks t ON t.id = cf.task_id
            WHERE t.org_id = p_org_id
        ),
        'total_cost_usd', (
            SELECT COALESCE(SUM(ce.cost_usd), 0)
            FROM cost_entries ce
            JOIN tasks t ON t.id = ce.task_id
            WHERE t.org_id = p_org_id
        ),
        'avg_qa_score', (
            SELECT ROUND(AVG(qr.score_overall), 1)
            FROM qa_reviews qr
            JOIN tasks t ON t.id = qr.task_id
            WHERE t.org_id = p_org_id
        ),
        'tasks_by_type', (
            SELECT jsonb_object_agg(task_type, cnt)
            FROM (
                SELECT task_type, COUNT(*) AS cnt
                FROM tasks WHERE org_id = p_org_id
                GROUP BY task_type
            ) sub
        ),
        'tasks_by_priority', (
            SELECT jsonb_object_agg(priority, cnt)
            FROM (
                SELECT priority, COUNT(*) AS cnt
                FROM tasks WHERE org_id = p_org_id
                GROUP BY priority
            ) sub
        ),
        'open_invoices', (
            SELECT COUNT(*)
            FROM invoices
            WHERE org_id = p_org_id AND status IN ('draft', 'sent', 'overdue')
        ),
        'unbilled_cost_usd', (
            SELECT COALESCE(SUM(ce.cost_usd), 0)
            FROM cost_entries ce
            JOIN tasks t ON t.id = ce.task_id
            WHERE t.org_id = p_org_id
              AND t.id NOT IN (
                  SELECT UNNEST(task_ids) FROM invoices WHERE org_id = p_org_id
              )
        )
    ) INTO result
    FROM tasks
    WHERE org_id = p_org_id;

    RETURN COALESCE(result, '{}'::JSONB);
END;
$$ LANGUAGE plpgsql STABLE;

-- ============================================================
-- get_agent_performance(agent_id TEXT)
-- Returns performance metrics for a specific agent
-- ============================================================

CREATE OR REPLACE FUNCTION get_agent_performance(p_agent_id TEXT)
RETURNS JSONB AS $$
DECLARE
    result JSONB;
BEGIN
    SELECT jsonb_build_object(
        'agent_id', p_agent_id,
        'total_tasks', COUNT(DISTINCT ce.task_id),
        'total_cost_usd', COALESCE(SUM(ce.cost_usd), 0),
        'total_input_tokens', COALESCE(SUM(ce.input_tokens), 0),
        'total_output_tokens', COALESCE(SUM(ce.output_tokens), 0),
        'avg_qa_score', (
            SELECT ROUND(AVG(qr.score_overall), 1)
            FROM qa_reviews qr
            JOIN cost_entries ce2 ON ce2.task_id = qr.task_id
            WHERE ce2.agent_id = p_agent_id
        ),
        'avg_client_rating', (
            SELECT ROUND(AVG(cf.rating), 2)
            FROM client_feedback cf
            JOIN cost_entries ce3 ON ce3.task_id = cf.task_id
            WHERE ce3.agent_id = p_agent_id
        ),
        'completion_rate', (
            SELECT ROUND(
                COUNT(*) FILTER (WHERE t.status = 'completed')::NUMERIC /
                NULLIF(COUNT(*), 0) * 100, 1
            )
            FROM tasks t
            JOIN cost_entries ce4 ON ce4.task_id = t.id
            WHERE ce4.agent_id = p_agent_id
        ),
        'memory_entries', (
            SELECT COUNT(*) FROM agent_memory WHERE agent_id = p_agent_id
        ),
        'cost_by_model', (
            SELECT jsonb_object_agg(model, model_cost)
            FROM (
                SELECT model, SUM(cost_usd) AS model_cost
                FROM cost_entries
                WHERE agent_id = p_agent_id AND model IS NOT NULL
                GROUP BY model
            ) sub
        ),
        'operations_breakdown', (
            SELECT jsonb_object_agg(operation, op_count)
            FROM (
                SELECT operation, COUNT(*) AS op_count
                FROM cost_entries
                WHERE agent_id = p_agent_id AND operation IS NOT NULL
                GROUP BY operation
            ) sub
        )
    ) INTO result
    FROM cost_entries ce
    WHERE ce.agent_id = p_agent_id;

    RETURN COALESCE(result, jsonb_build_object('agent_id', p_agent_id, 'total_tasks', 0));
END;
$$ LANGUAGE plpgsql STABLE;

-- ============================================================
-- calculate_task_cost(task_id UUID)
-- Returns total cost breakdown for a task
-- ============================================================

CREATE OR REPLACE FUNCTION calculate_task_cost(p_task_id UUID)
RETURNS JSONB AS $$
DECLARE
    result JSONB;
BEGIN
    SELECT jsonb_build_object(
        'task_id', p_task_id,
        'total_cost_usd', COALESCE(SUM(cost_usd), 0),
        'total_input_tokens', COALESCE(SUM(input_tokens), 0),
        'total_output_tokens', COALESCE(SUM(output_tokens), 0),
        'entry_count', COUNT(*),
        'by_type', (
            SELECT jsonb_object_agg(entry_type::TEXT, type_sum)
            FROM (
                SELECT entry_type, SUM(cost_usd) AS type_sum
                FROM cost_entries
                WHERE task_id = p_task_id
                GROUP BY entry_type
            ) sub
        ),
        'by_model', (
            SELECT jsonb_object_agg(COALESCE(model, 'unknown'), model_sum)
            FROM (
                SELECT model, SUM(cost_usd) AS model_sum
                FROM cost_entries
                WHERE task_id = p_task_id
                GROUP BY model
            ) sub
        ),
        'by_agent', (
            SELECT jsonb_object_agg(COALESCE(agent_id, 'unassigned'), agent_sum)
            FROM (
                SELECT agent_id, SUM(cost_usd) AS agent_sum
                FROM cost_entries
                WHERE task_id = p_task_id
                GROUP BY agent_id
            ) sub
        )
    ) INTO result
    FROM cost_entries
    WHERE task_id = p_task_id;

    RETURN COALESCE(result, jsonb_build_object('task_id', p_task_id, 'total_cost_usd', 0));
END;
$$ LANGUAGE plpgsql STABLE;

-- ============================================================
-- auto_classify_tier(task_type, priority)
-- Automatically assigns a task tier based on type and priority
-- Tier 1: Simple/routine | Tier 2: Moderate complexity | Tier 3: Complex/critical
-- ============================================================

CREATE OR REPLACE FUNCTION auto_classify_tier(
    p_task_type task_type,
    p_priority task_priority
)
RETURNS task_tier AS $$
BEGIN
    -- Urgent + complex types → tier3
    IF p_priority = 'urgent' AND p_task_type IN ('code', 'automation', 'design') THEN
        RETURN 'tier3';
    END IF;

    -- High priority + complex types → tier3
    IF p_priority = 'high' AND p_task_type IN ('code', 'automation') THEN
        RETURN 'tier3';
    END IF;

    -- Urgent + moderate types → tier2
    IF p_priority = 'urgent' THEN
        RETURN 'tier2';
    END IF;

    -- Complex types regardless of priority → tier2
    IF p_task_type IN ('code', 'automation', 'design', 'research') THEN
        RETURN 'tier2';
    END IF;

    -- High priority → tier2
    IF p_priority = 'high' THEN
        RETURN 'tier2';
    END IF;

    -- Everything else → tier1
    RETURN 'tier1';
END;
$$ LANGUAGE plpgsql IMMUTABLE;

-- ============================================================
-- auto_classify_tier trigger: auto-set tier on tasks insert/update
-- ============================================================

CREATE OR REPLACE FUNCTION trg_auto_classify_tier()
RETURNS TRIGGER AS $$
BEGIN
    IF NEW.tier IS NULL THEN
        NEW.tier := auto_classify_tier(NEW.task_type, NEW.priority);
    END IF;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trg_tasks_auto_tier
    BEFORE INSERT OR UPDATE OF task_type, priority ON tasks
    FOR EACH ROW EXECUTE FUNCTION trg_auto_classify_tier();
