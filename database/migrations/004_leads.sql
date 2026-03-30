-- Leads table for internal business operations
CREATE TABLE IF NOT EXISTS leads (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    email TEXT,
    name TEXT,
    company TEXT,
    message TEXT,
    source TEXT DEFAULT 'website',
    score INTEGER DEFAULT 0,
    tier TEXT CHECK (tier IN ('cold', 'warm', 'hot')),
    signals JSONB DEFAULT '[]',
    action TEXT,
    status TEXT DEFAULT 'new' CHECK (status IN ('new', 'contacted', 'proposal_sent', 'won', 'lost', 'archived')),
    notes TEXT,
    assigned_to TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_leads_status ON leads(status);
CREATE INDEX idx_leads_tier ON leads(tier);
CREATE INDEX idx_leads_score ON leads(score DESC);

-- Add invoiced column to tasks if not exists
ALTER TABLE tasks ADD COLUMN IF NOT EXISTS invoiced BOOLEAN DEFAULT FALSE;
