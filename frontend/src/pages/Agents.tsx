import { motion } from 'framer-motion'
import { Brain, Code, PenTool, BarChart3, Shield, Users, Zap } from 'lucide-react'

const agents = [
  { id: 'analyst', name: 'Analyst', role: 'Research & Planning', icon: BarChart3, status: 'active', tasks: 3, avgScore: 92, tokens: '124K', cost: '$3.10', memory: 47, color: '#60A5FA' },
  { id: 'builder', name: 'Builder', role: 'Execution & Delivery', icon: Code, status: 'active', tasks: 5, avgScore: 88, tokens: '312K', cost: '$7.80', memory: 83, color: '#4ADE80' },
  { id: 'qa', name: 'QA Reviewer', role: 'Quality Assurance', icon: Shield, status: 'active', tasks: 2, avgScore: 95, tokens: '89K', cost: '$2.20', memory: 62, color: '#FBBF24' },
  { id: 'pm', name: 'Project Manager', role: 'Coordination', icon: Users, status: 'idle', tasks: 0, avgScore: 90, tokens: '45K', cost: '$1.10', memory: 31, color: '#A78BFA' },
  { id: 'researcher', name: 'Researcher', role: 'Deep Research', icon: Brain, status: 'active', tasks: 2, avgScore: 91, tokens: '198K', cost: '$4.95', memory: 55, color: '#F472B6' },
  { id: 'writer', name: 'Writer', role: 'Content Creation', icon: PenTool, status: 'active', tasks: 1, avgScore: 89, tokens: '156K', cost: '$3.90', memory: 38, color: '#2DD4BF' },
]

export default function Agents() {
  return (
    <div>
      <div className="mb-8">
        <h1 className="text-2xl font-bold tracking-tight">Agents</h1>
        <p className="text-white/40 text-sm mt-1">Agent team status, performance, and learning</p>
      </div>

      {/* Agent Grid */}
      <div className="grid md:grid-cols-2 xl:grid-cols-3 gap-4">
        {agents.map((agent, i) => (
          <motion.div
            key={agent.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.05 }}
            className="bg-white/[0.02] rounded-xl border border-white/5 p-5 hover:bg-white/[0.04] transition-colors"
          >
            {/* Header */}
            <div className="flex items-start justify-between mb-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-lg flex items-center justify-center" style={{ backgroundColor: `${agent.color}15` }}>
                  <agent.icon className="w-5 h-5" style={{ color: agent.color }} />
                </div>
                <div>
                  <h3 className="text-sm font-semibold">{agent.name}</h3>
                  <p className="text-[10px] text-white/30">{agent.role}</p>
                </div>
              </div>
              <div className="flex items-center gap-1.5">
                <div className={`w-2 h-2 rounded-full ${agent.status === 'active' ? 'bg-green-400 animate-pulse' : 'bg-white/20'}`} />
                <span className="text-[10px] text-white/30 capitalize">{agent.status}</span>
              </div>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-2 gap-3 mb-4">
              <div>
                <p className="text-[10px] text-white/30 uppercase tracking-wider">Active Tasks</p>
                <p className="text-lg font-bold mt-0.5">{agent.tasks}</p>
              </div>
              <div>
                <p className="text-[10px] text-white/30 uppercase tracking-wider">Avg Score</p>
                <p className="text-lg font-bold mt-0.5" style={{ color: agent.avgScore >= 90 ? '#4ADE80' : agent.avgScore >= 80 ? '#FBBF24' : '#EF4444' }}>
                  {agent.avgScore}
                </p>
              </div>
              <div>
                <p className="text-[10px] text-white/30 uppercase tracking-wider">Tokens Used</p>
                <p className="text-sm font-medium mt-0.5 text-white/60">{agent.tokens}</p>
              </div>
              <div>
                <p className="text-[10px] text-white/30 uppercase tracking-wider">Cost</p>
                <p className="text-sm font-medium mt-0.5 text-white/60">{agent.cost}</p>
              </div>
            </div>

            {/* Memory */}
            <div className="pt-3 border-t border-white/5">
              <div className="flex items-center justify-between text-xs">
                <span className="text-white/30 flex items-center gap-1.5">
                  <Brain className="w-3 h-3" /> Learned patterns
                </span>
                <span className="text-white/50 font-medium">{agent.memory}</span>
              </div>
              <div className="mt-2 h-1 bg-white/5 rounded-full overflow-hidden">
                <div className="h-full rounded-full bg-[#C0C0C0]/30" style={{ width: `${Math.min(agent.memory, 100)}%` }} />
              </div>
            </div>
          </motion.div>
        ))}
      </div>

      {/* Agent Memory Feed */}
      <div className="mt-8 bg-white/[0.02] rounded-xl border border-white/5 p-6">
        <h2 className="text-sm font-semibold mb-4">Recent Learnings</h2>
        <div className="space-y-3">
          {[
            { agent: 'Analyst', insight: 'Clients in SaaS prefer competitive analysis with pricing tiers comparison', time: '2h ago', confidence: 0.85 },
            { agent: 'Builder', insight: 'Financial reports should include YoY growth charts, not just QoQ', time: '4h ago', confidence: 0.72 },
            { agent: 'QA Reviewer', insight: 'Code deliverables with >3 flags usually need full revision, not partial', time: '6h ago', confidence: 0.91 },
            { agent: 'Writer', insight: 'Blog posts perform better with 3+ subheadings and bullet points', time: '1d ago', confidence: 0.68 },
          ].map((item, i) => (
            <div key={i} className="flex items-start gap-3 p-3 rounded-lg hover:bg-white/[0.02]">
              <Zap className="w-4 h-4 text-[#C0C0C0]/50 mt-0.5 shrink-0" />
              <div className="flex-1 min-w-0">
                <p className="text-sm">{item.insight}</p>
                <div className="flex items-center gap-3 mt-1">
                  <span className="text-[10px] text-white/30">{item.agent}</span>
                  <span className="text-[10px] text-white/30">{item.time}</span>
                  <span className="text-[10px] text-white/20">confidence: {Math.round(item.confidence * 100)}%</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
