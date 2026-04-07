/** Bundles page - Client bundle selection and management. */

import { useState } from 'react'
import { Zap, Users, Briefcase, Code, Headphones, Crown, Palette, Search } from 'lucide-react'

const BUNDLES = [
  {
    id: 'sales',
    name: 'Sales Team',
    description: 'Complete salesforce - lead generation to deal closing',
    icon: Users,
    color: '#10B981',
    agents: ['SDR', 'Account Executive', 'Deal Closer', 'Account Manager', 'VP Sales', 'Pipeline Analyst'],
  },
  {
    id: 'marketing',
    name: 'Marketing Team',
    description: 'Full-stack marketing - SEO, content, social, paid',
    icon: Zap,
    color: '#F59E0B',
    agents: ['SEO Specialist', 'Content Creator', 'Social Media', 'Email Marketer', 'Paid Ads', 'Copywriter', 'Marketing Director'],
  },
  {
    id: 'development',
    name: 'Development Team',
    description: 'Engineering squad - build to deployment',
    icon: Code,
    color: '#3B82F6',
    agents: ['Frontend Dev', 'Backend Dev', 'Fullstack Dev', 'DevOps', 'QA Engineer', 'Security Engineer', 'Tech Lead'],
  },
  {
    id: 'operations',
    name: 'Operations Team',
    description: 'Day-to-day business running',
    icon: Briefcase,
    color: '#8B5CF6',
    agents: ['Project Manager', 'Virtual Assistant', 'Bookkeeper', 'HR Manager', 'Recruiter', 'Ops Manager'],
  },
  {
    id: 'executive',
    name: 'Executive Suite',
    description: 'C-level strategic decision making',
    icon: Crown,
    color: '#EF4444',
    agents: ['CEO', 'CFO', 'CTO', 'CMO', 'COO', 'CPO'],
  },
  {
    id: 'customer_success',
    name: 'Customer Success',
    description: 'Support and retention',
    icon: Headphones,
    color: '#06B6D4',
    agents: ['CS Manager', 'Onboarding Specialist', 'Support Agent', 'Success Analyst'],
  },
  {
    id: 'design',
    name: 'Design Team',
    description: 'Visual creation and branding',
    icon: Palette,
    color: '#EC4899',
    agents: ['UI Designer', 'UX Researcher', 'Graphic Designer', 'Web Designer', 'Brand Designer', 'Motion Designer'],
  },
  {
    id: 'research',
    name: 'Research Team',
    description: 'Data and market intelligence',
    icon: Search,
    color: '#14B8A6',
    agents: ['Market Researcher', 'Data Analyst', 'Product Researcher', 'Content Strategist'],
  },
]

export default function Bundles() {
  const [selectedBundle, setSelectedBundle] = useState<string | null>(null)
  const [tasks, setTasks] = useState<any[]>([])
  const [loading, setLoading] = useState(false)
  
  const selected = BUNDLES.find(b => b.id === selectedBundle)

  const runTask = async (agentId: string, task: string) => {
    setLoading(true)
    try {
      const res = await fetch(`/api/agents/${agentId}/execute`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ task }),
      })
      const data = await res.json()
      setTasks([...tasks, { agentId, task, result: data, time: new Date() }])
    } catch (err) {
      console.error(err)
    }
    setLoading(false)
  }

  return (
    <div style={{ padding: 24, maxWidth: 1200, margin: '0 auto' }}>
      <div style={{ marginBottom: 32 }}>
        <h1 style={{ fontSize: 28, fontWeight: 700, marginBottom: 8 }}>Profession Bundles</h1>
        <p style={{ color: '#666' }}>Select a bundle to see agents and assign tasks</p>
      </div>

      {/* Bundle Grid */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: 16, marginBottom: 32 }}>
        {BUNDLES.map(bundle => {
          const Icon = bundle.icon
          return (
            <div
              key={bundle.id}
              onClick={() => setSelectedBundle(bundle.id)}
              style={{
                padding: 20,
                borderRadius: 16,
                border: selectedBundle === bundle.id ? `2px solid ${bundle.color}` : '1px solid #E5E5E5',
                background: selectedBundle === bundle.id ? `${bundle.color}10` : '#fff',
                cursor: 'pointer',
                transition: 'all 0.2s',
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 12 }}>
                <div style={{ width: 40, height: 40, borderRadius: 10, background: bundle.color, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <Icon size={20} color="#fff" />
                </div>
                <div>
                  <div style={{ fontWeight: 600 }}>{bundle.name}</div>
                  <div style={{ fontSize: 12, color: '#666' }}>{bundle.agents.length} agents</div>
                </div>
              </div>
              <p style={{ fontSize: 13, color: '#666' }}>{bundle.description}</p>
            </div>
          )
        })}
      </div>

      {/* Selected Bundle Detail */}
      {selected && (
        <div style={{ background: '#fff', borderRadius: 16, padding: 24, border: '1px solid #E5E5E5' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 24 }}>
            <div style={{ width: 48, height: 48, borderRadius: 12, background: selected.color, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <selected.icon size={24} color="#fff" />
            </div>
            <div>
              <h2 style={{ fontSize: 20, fontWeight: 700 }}>{selected.name}</h2>
              <p style={{ color: '#666' }}>{selected.description}</p>
            </div>
          </div>

          <div style={{ marginBottom: 24 }}>
            <h3 style={{ fontSize: 14, fontWeight: 600, marginBottom: 12, color: '#666' }}>Agents in this bundle</h3>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
              {selected.agents.map(agent => (
                <span key={agent} style={{ padding: '6px 12px', background: `${selected.color}15`, borderRadius: 20, fontSize: 13, color: selected.color }}>
                  {agent}
                </span>
              ))}
            </div>
          </div>

          {/* Task Input */}
          <div style={{ borderTop: '1px solid #E5E5E5', paddingTop: 24 }}>
            <h3 style={{ fontSize: 14, fontWeight: 600, marginBottom: 12 }}>Assign a task</h3>
            <div style={{ display: 'flex', gap: 12 }}>
              <input
                type="text"
                placeholder={`Task for ${selected.name}...`}
                style={{ flex: 1, padding: '12px 16px', borderRadius: 12, border: '1px solid #E5E5E5', fontSize: 14 }}
                onKeyDown={(e) => {
                  if (e.key === 'Enter') {
                    const task = (e.target as HTMLInputElement).value
                    if (task) runTask(selected.agents[0].toLowerCase().replace(' ', '_'), task)
                  }
                }}
              />
              <button
                onClick={() => {
                  const input = document.querySelector('input') as HTMLInputElement
                  if (input?.value) runTask(selected.agents[0].toLowerCase().replace(' ', '_'), input.value)
                }}
                disabled={loading}
                style={{ padding: '12px 24px', background: selected.color, color: '#fff', border: 'none', borderRadius: 12, fontWeight: 600, cursor: loading ? 'not-allowed' : 'pointer' }}
              >
                {loading ? 'Running...' : 'Run Task'}
              </button>
            </div>
          </div>

          {/* Recent Tasks */}
          {tasks.length > 0 && (
            <div style={{ marginTop: 24 }}>
              <h3 style={{ fontSize: 14, fontWeight: 600, marginBottom: 12 }}>Recent Tasks</h3>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                {tasks.slice(-5).reverse().map((t, i) => (
                  <div key={i} style={{ padding: 12, background: '#F9F9F9', borderRadius: 8, fontSize: 13 }}>
                    <div style={{ fontWeight: 500 }}>{t.task}</div>
                    <div style={{ color: '#666', fontSize: 12 }}>{t.agentId} • {t.result?.success ? '✅ Completed' : '❌ Failed'}</div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  )
}