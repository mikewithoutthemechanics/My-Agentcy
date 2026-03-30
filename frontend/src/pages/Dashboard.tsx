import { motion } from 'framer-motion'
import {
  ListTodo,
  Clock,
  ShieldCheck,
  Heart,
  DollarSign,
  TrendingUp,
  Bot,
  AlertTriangle,
  CheckCircle2,
  Timer,
} from 'lucide-react'
import StatCard from '../components/ui/StatCard'

const stats = [
  { title: 'Active Tasks', value: '12', change: 3, changeLabel: 'today', icon: ListTodo, iconColor: 'text-[#C0C0C0]' },
  { title: 'Avg Delivery', value: '4.2h', change: -18, changeLabel: 'vs last week', icon: Clock, iconColor: 'text-[#4ADE80]' },
  { title: 'QA Pass Rate', value: '94%', change: 2, changeLabel: 'vs last week', icon: ShieldCheck, iconColor: 'text-[#60A5FA]' },
  { title: 'Satisfaction', value: '4.7', change: undefined, changeLabel: '★ average', icon: Heart, iconColor: 'text-[#F472B6]' },
  { title: 'Cost per Task', value: '$2.40', change: -12, changeLabel: 'vs last month', icon: DollarSign, iconColor: 'text-[#FBBF24]' },
  { title: 'Revenue Today', value: '$847', change: undefined, changeLabel: '8 tasks', icon: TrendingUp, iconColor: 'text-[#34D399]' },
]

const recentTasks = [
  { id: '1', title: 'Q1 Market Analysis — Tech Sector', status: 'in_progress', tier: 'T1', agent: 'Analyst → Builder', time: '2h ago' },
  { id: '2', title: 'Competitive Report: SaaS Landscape', status: 'qa_review', tier: 'T1', agent: 'QA Reviewer', time: '3h ago' },
  { id: '3', title: 'API Integration Documentation', status: 'delivered', tier: 'T0', agent: 'Builder', time: '5h ago' },
  { id: '4', title: 'Financial Model — Series A', status: 'human_review', tier: 'T2', agent: 'Human Reviewer', time: '6h ago' },
  { id: '5', title: 'Social Media Content Calendar', status: 'completed', tier: 'T0', agent: 'Writer', time: '8h ago' },
]

const agentStatus = [
  { name: 'Analyst', status: 'active', tasks: 3, avgScore: 92 },
  { name: 'Builder', status: 'active', tasks: 5, avgScore: 88 },
  { name: 'QA Reviewer', status: 'active', tasks: 2, avgScore: 95 },
  { name: 'PM', status: 'idle', tasks: 0, avgScore: 90 },
]

const statusColors: Record<string, string> = {
  queued: 'bg-white/10 text-white/50',
  in_progress: 'bg-blue-500/10 text-blue-400',
  qa_review: 'bg-yellow-500/10 text-yellow-400',
  human_review: 'bg-purple-500/10 text-purple-400',
  delivered: 'bg-green-500/10 text-green-400',
  completed: 'bg-green-500/10 text-green-400',
}

export default function Dashboard() {
  return (
    <div>
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-2xl font-bold tracking-tight">Dashboard</h1>
        <p className="text-white/40 text-sm mt-1">AI Workforce overview — real-time metrics</p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-4 mb-8">
        {stats.map((stat, i) => (
          <motion.div
            key={stat.title}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.05 }}
          >
            <StatCard {...stat} />
          </motion.div>
        ))}
      </div>

      <div className="grid lg:grid-cols-3 gap-6">
        {/* Recent Tasks */}
        <div className="lg:col-span-2 bg-white/[0.02] rounded-xl border border-white/5 p-6">
          <h2 className="text-sm font-semibold mb-4">Recent Tasks</h2>
          <div className="space-y-3">
            {recentTasks.map((task) => (
              <div key={task.id} className="flex items-center gap-4 p-3 rounded-lg hover:bg-white/[0.02] transition-colors">
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium truncate">{task.title}</p>
                  <p className="text-xs text-white/30 mt-0.5">{task.agent} · {task.time}</p>
                </div>
                <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-white/5 text-white/40">{task.tier}</span>
                <span className={`text-[10px] px-2 py-1 rounded-full ${statusColors[task.status] || ''}`}>
                  {task.status.replace('_', ' ')}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Agent Status */}
        <div className="bg-white/[0.02] rounded-xl border border-white/5 p-6">
          <h2 className="text-sm font-semibold mb-4">Agent Status</h2>
          <div className="space-y-4">
            {agentStatus.map((agent) => (
              <div key={agent.name} className="flex items-center gap-3">
                <div className={`w-2 h-2 rounded-full ${agent.status === 'active' ? 'bg-green-400 animate-pulse' : 'bg-white/20'}`} />
                <div className="flex-1">
                  <p className="text-sm font-medium">{agent.name}</p>
                  <p className="text-xs text-white/30">
                    {agent.tasks} active · avg score {agent.avgScore}
                  </p>
                </div>
                <Bot className="w-4 h-4 text-white/20" />
              </div>
            ))}
          </div>

          {/* QA Insights */}
          <div className="mt-6 pt-6 border-t border-white/5">
            <h3 className="text-xs font-semibold text-white/50 uppercase tracking-wider mb-3">QA Insights</h3>
            <div className="space-y-2">
              <div className="flex items-center gap-2 text-xs">
                <CheckCircle2 className="w-3.5 h-3.5 text-green-400" />
                <span className="text-white/50">47 automated reviews passed</span>
              </div>
              <div className="flex items-center gap-2 text-xs">
                <AlertTriangle className="w-3.5 h-3.5 text-yellow-400" />
                <span className="text-white/50">3 flagged for human review</span>
              </div>
              <div className="flex items-center gap-2 text-xs">
                <Timer className="w-3.5 h-3.5 text-blue-400" />
                <span className="text-white/50">Avg review time: 2.4 min</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
