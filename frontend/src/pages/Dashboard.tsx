import { motion } from 'framer-motion'
import {
  ListTodo,
  Clock,
  ShieldCheck,
  Heart,
  DollarSign,
  TrendingUp,
  Bot,
  ArrowUpRight,
  ArrowDownRight,
  Sparkles,
} from 'lucide-react'
import { AreaChart, Area, XAxis, YAxis, Tooltip, ResponsiveContainer, Line } from 'recharts'

const ease = [0.16, 1, 0.3, 1] as const

const stats = [
  { title: 'Active Tasks', value: '12', change: +3, changeLabel: 'today', icon: ListTodo, gradient: 'from-blue-500/10 to-blue-600/5', iconBg: 'bg-blue-500/10', iconColor: 'text-blue-400', borderColor: 'border-blue-500/10' },
  { title: 'Avg Delivery', value: '4.2h', change: -18, changeLabel: 'vs last week', icon: Clock, gradient: 'from-emerald-500/10 to-emerald-600/5', iconBg: 'bg-emerald-500/10', iconColor: 'text-emerald-400', borderColor: 'border-emerald-500/10' },
  { title: 'QA Pass Rate', value: '94%', change: +2, changeLabel: 'vs last week', icon: ShieldCheck, gradient: 'from-violet-500/10 to-violet-600/5', iconBg: 'bg-violet-500/10', iconColor: 'text-violet-400', borderColor: 'border-violet-500/10' },
  { title: 'Satisfaction', value: '4.7', change: null, icon: Heart, gradient: 'from-rose-500/10 to-rose-600/5', iconBg: 'bg-rose-500/10', iconColor: 'text-rose-400', borderColor: 'border-rose-500/10' },
  { title: 'Cost / Task', value: '$2.40', change: -12, changeLabel: 'vs last month', icon: DollarSign, gradient: 'from-amber-500/10 to-amber-600/5', iconBg: 'bg-amber-500/10', iconColor: 'text-amber-400', borderColor: 'border-amber-500/10' },
  { title: 'Revenue Today', value: '$847', change: null, icon: TrendingUp, gradient: 'from-cyan-500/10 to-cyan-600/5', iconBg: 'bg-cyan-500/10', iconColor: 'text-cyan-400', borderColor: 'border-cyan-500/10' },
]

const costTrend = [
  { day: 'Mon', cost: 45, target: 60 }, { day: 'Tue', cost: 62, target: 60 },
  { day: 'Wed', cost: 38, target: 60 }, { day: 'Thu', cost: 71, target: 60 },
  { day: 'Fri', cost: 55, target: 60 }, { day: 'Sat', cost: 82, target: 60 },
  { day: 'Sun', cost: 48, target: 60 }, { day: 'Mon', cost: 65, target: 60 },
  { day: 'Tue', cost: 73, target: 60 }, { day: 'Wed', cost: 58, target: 60 },
  { day: 'Thu', cost: 90, target: 60 }, { day: 'Fri', cost: 72, target: 60 },
  { day: 'Sat', cost: 68, target: 60 }, { day: 'Sun', cost: 52, target: 60 },
]

const taskDistribution = [
  { type: 'Report', count: 24, color: '#C0C0C0' },
  { type: 'Analysis', count: 18, color: '#60A5FA' },
  { type: 'Content', count: 15, color: '#4ADE80' },
  { type: 'Code', count: 12, color: '#F472B6' },
  { type: 'Research', count: 8, color: '#FBBF24' },
]

const revenueTrend = [
  { day: '1', revenue: 240 }, { day: '2', revenue: 380 }, { day: '3', revenue: 290 },
  { day: '4', revenue: 520 }, { day: '5', revenue: 410 }, { day: '6', revenue: 680 },
  { day: '7', revenue: 540 }, { day: '8', revenue: 720 }, { day: '9', revenue: 590 },
  { day: '10', revenue: 830 }, { day: '11', revenue: 920 }, { day: '12', revenue: 760 },
  { day: '13', revenue: 680 }, { day: '14', revenue: 847 },
]

const recentTasks = [
  { id: '1', title: 'Q1 Market Analysis — Tech Sector', status: 'in_progress', tier: 'T1', agent: 'Analyst → Builder', time: '2h ago', progress: 65 },
  { id: '2', title: 'Competitive Report: SaaS Landscape', status: 'qa_review', tier: 'T1', agent: 'QA Reviewer', time: '3h ago', progress: 90 },
  { id: '3', title: 'API Integration Documentation', status: 'delivered', tier: 'T0', agent: 'Builder', time: '5h ago', progress: 100 },
  { id: '4', title: 'Financial Model — Series A', status: 'human_review', tier: 'T2', agent: 'Human Reviewer', time: '6h ago', progress: 95 },
  { id: '5', title: 'Social Media Content Calendar', status: 'completed', tier: 'T0', agent: 'Writer', time: '8h ago', progress: 100 },
]

const agentStatus = [
  { name: 'Analyst', status: 'active' as const, tasks: 3, avgScore: 92, color: '#60A5FA' },
  { name: 'Builder', status: 'active' as const, tasks: 5, avgScore: 88, color: '#4ADE80' },
  { name: 'QA Reviewer', status: 'active' as const, tasks: 2, avgScore: 95, color: '#FBBF24' },
  { name: 'PM', status: 'idle' as const, tasks: 0, avgScore: 90, color: '#A78BFA' },
]

const statusConfig: Record<string, { bg: string; text: string; dot: string }> = {
  queued: { bg: 'bg-white/5', text: 'text-white/40', dot: 'bg-white/30' },
  in_progress: { bg: 'bg-blue-500/10', text: 'text-blue-400', dot: 'bg-blue-400' },
  qa_review: { bg: 'bg-amber-500/10', text: 'text-amber-400', dot: 'bg-amber-400' },
  human_review: { bg: 'bg-violet-500/10', text: 'text-violet-400', dot: 'bg-violet-400' },
  delivered: { bg: 'bg-emerald-500/10', text: 'text-emerald-400', dot: 'bg-emerald-400' },
  completed: { bg: 'bg-emerald-500/10', text: 'text-emerald-400', dot: 'bg-emerald-400' },
}

const CustomTooltip = ({ active, payload, label }: any) => {
  if (!active || !payload?.length) return null
  return (
    <div className="bg-[#1A1A2E] border border-white/10 rounded-xl px-4 py-3 shadow-2xl">
      <p className="text-[10px] text-white/40 uppercase tracking-wider mb-1">{label}</p>
      {payload.map((p: any, i: number) => (
        <p key={i} className="text-sm font-semibold" style={{ color: p.color }}>
          {p.name === 'cost' ? '$' : ''}{p.value}{p.name === 'cost' ? '' : ''}
        </p>
      ))}
    </div>
  )
}

export default function Dashboard() {
  const totalCost = costTrend.reduce((s, d) => s + d.cost, 0)
  const avgCost = Math.round(totalCost / costTrend.length)

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex items-end justify-between">
        <div>
          <motion.h1
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, ease }}
            className="text-3xl font-bold tracking-tight"
          >
            Dashboard
          </motion.h1>
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.1, duration: 0.5 }}
            className="text-white/30 text-sm mt-1"
          >
            AI Workforce overview — Monday, March 30
          </motion.p>
        </div>
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2 }}
          className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-emerald-500/10 border border-emerald-500/20"
        >
          <div className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
          <span className="text-[10px] font-medium text-emerald-400 uppercase tracking-wider">All systems active</span>
        </motion.div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-4">
        {stats.map((stat, i) => (
          <motion.div
            key={stat.title}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.05 + i * 0.04, duration: 0.5, ease }}
            className={`relative overflow-hidden rounded-2xl bg-gradient-to-b ${stat.gradient} border ${stat.borderColor} p-5 group hover:border-white/10 transition-colors`}
          >
            {/* Glow effect */}
            <div className="absolute -top-10 -right-10 w-24 h-24 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-500" style={{ background: `radial-gradient(circle, ${stat.iconColor.replace('text-', '').replace('-400', '')} / 0.1)` }} />
            
            <div className="relative">
              <div className="flex items-center justify-between mb-4">
                <div className={`w-9 h-9 rounded-xl ${stat.iconBg} flex items-center justify-center`}>
                  <stat.icon className={`w-4 h-4 ${stat.iconColor}`} />
                </div>
                {stat.change !== null && (
                  <div className={`flex items-center gap-0.5 text-[10px] font-medium ${stat.change > 0 ? 'text-emerald-400' : 'text-rose-400'}`}>
                    {stat.change > 0 ? <ArrowUpRight className="w-3 h-3" /> : <ArrowDownRight className="w-3 h-3" />}
                    {Math.abs(stat.change)}%
                  </div>
                )}
              </div>
              <p className="text-[26px] font-bold tracking-tight leading-none">{stat.value}</p>
              <p className="text-[10px] text-white/30 mt-1.5 uppercase tracking-wider">{stat.title}</p>
            </div>
          </motion.div>
        ))}
      </div>

      {/* Charts Row */}
      <div className="grid lg:grid-cols-3 gap-6">
        {/* Cost Trend — larger */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3, duration: 0.5, ease }}
          className="lg:col-span-2 rounded-2xl bg-white/[0.02] border border-white/5 p-6"
        >
          <div className="flex items-center justify-between mb-6">
            <div>
              <h2 className="text-sm font-semibold">Cost Trend</h2>
              <p className="text-[10px] text-white/30 mt-0.5">14-day agent spend · avg ${avgCost}/day</p>
            </div>
            <div className="flex items-center gap-4 text-[10px] text-white/30">
              <span className="flex items-center gap-1.5"><span className="w-2.5 h-0.5 rounded-full bg-[#C0C0C0]" /> Actual</span>
              <span className="flex items-center gap-1.5"><span className="w-2.5 h-0.5 rounded-full bg-white/10" /> Target</span>
            </div>
          </div>
          <ResponsiveContainer width="100%" height={220}>
            <AreaChart data={costTrend} margin={{ top: 5, right: 5, bottom: 0, left: -20 }}>
              <defs>
                <linearGradient id="costGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#C0C0C0" stopOpacity={0.15} />
                  <stop offset="95%" stopColor="#C0C0C0" stopOpacity={0} />
                </linearGradient>
              </defs>
              <XAxis dataKey="day" tick={{ fill: '#555', fontSize: 10 }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fill: '#555', fontSize: 10 }} axisLine={false} tickLine={false} tickFormatter={v => `$${v}`} />
              <Tooltip content={<CustomTooltip />} />
              <Line type="monotone" dataKey="target" stroke="rgba(255,255,255,0.08)" strokeDasharray="4 4" strokeWidth={1} dot={false} />
              <Area type="monotone" dataKey="cost" stroke="#C0C0C0" fillOpacity={1} fill="url(#costGrad)" strokeWidth={2} />
            </AreaChart>
          </ResponsiveContainer>
        </motion.div>

        {/* Tasks by Type */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.35, duration: 0.5, ease }}
          className="rounded-2xl bg-white/[0.02] border border-white/5 p-6"
        >
          <div className="flex items-center justify-between mb-6">
            <div>
              <h2 className="text-sm font-semibold">Tasks by Type</h2>
              <p className="text-[10px] text-white/30 mt-0.5">This month · 77 total</p>
            </div>
          </div>
          <div className="space-y-3">
            {taskDistribution.map((item, i) => {
              const maxCount = Math.max(...taskDistribution.map(d => d.count))
              return (
                <div key={item.type}>
                  <div className="flex items-center justify-between mb-1.5">
                    <span className="text-xs text-white/50">{item.type}</span>
                    <span className="text-xs font-medium text-white/70">{item.count}</span>
                  </div>
                  <div className="h-1.5 bg-white/5 rounded-full overflow-hidden">
                    <motion.div
                      initial={{ width: 0 }}
                      animate={{ width: `${(item.count / maxCount) * 100}%` }}
                      transition={{ delay: 0.4 + i * 0.05, duration: 0.6, ease }}
                      className="h-full rounded-full"
                      style={{ backgroundColor: item.color }}
                    />
                  </div>
                </div>
              )
            })}
          </div>
        </motion.div>
      </div>

      {/* Revenue + Tasks Row */}
      <div className="grid lg:grid-cols-3 gap-6">
        {/* Revenue Chart */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4, duration: 0.5, ease }}
          className="rounded-2xl bg-white/[0.02] border border-white/5 p-6"
        >
          <div className="flex items-center justify-between mb-6">
            <div>
              <h2 className="text-sm font-semibold">Revenue</h2>
              <p className="text-[10px] text-white/30 mt-0.5">14-day trend</p>
            </div>
            <span className="flex items-center gap-1 text-[10px] text-emerald-400 font-medium">
              <TrendingUp className="w-3 h-3" /> +24%
            </span>
          </div>
          <ResponsiveContainer width="100%" height={160}>
            <AreaChart data={revenueTrend} margin={{ top: 5, right: 5, bottom: 0, left: -20 }}>
              <defs>
                <linearGradient id="revGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#4ADE80" stopOpacity={0.15} />
                  <stop offset="95%" stopColor="#4ADE80" stopOpacity={0} />
                </linearGradient>
              </defs>
              <XAxis dataKey="day" tick={{ fill: '#555', fontSize: 9 }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fill: '#555', fontSize: 9 }} axisLine={false} tickLine={false} tickFormatter={v => `$${v}`} />
              <Tooltip content={<CustomTooltip />} />
              <Area type="monotone" dataKey="revenue" stroke="#4ADE80" fillOpacity={1} fill="url(#revGrad)" strokeWidth={2} />
            </AreaChart>
          </ResponsiveContainer>
        </motion.div>

        {/* Agent Status */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.45, duration: 0.5, ease }}
          className="lg:col-span-2 rounded-2xl bg-white/[0.02] border border-white/5 p-6"
        >
          <div className="flex items-center justify-between mb-6">
            <div>
              <h2 className="text-sm font-semibold">Agent Team</h2>
              <p className="text-[10px] text-white/30 mt-0.5">Real-time status</p>
            </div>
            <div className="flex items-center gap-1.5 text-[10px] text-emerald-400">
              <Sparkles className="w-3 h-3" /> 3 active
            </div>
          </div>
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
            {agentStatus.map((agent, i) => (
              <motion.div
                key={agent.name}
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.5 + i * 0.05 }}
                className="relative p-4 rounded-xl bg-white/[0.02] border border-white/5 hover:border-white/10 transition-colors group"
              >
                {/* Status dot */}
                <div className={`absolute top-3 right-3 w-2 h-2 rounded-full ${agent.status === 'active' ? 'bg-emerald-400 animate-pulse' : 'bg-white/20'}`} />
                
                <div className="w-8 h-8 rounded-lg flex items-center justify-center mb-3" style={{ backgroundColor: `${agent.color}15` }}>
                  <Bot className="w-4 h-4" style={{ color: agent.color }} />
                </div>
                <p className="text-sm font-medium mb-0.5">{agent.name}</p>
                <div className="flex items-center gap-2 text-[10px] text-white/30">
                  <span>{agent.tasks} tasks</span>
                  <span>·</span>
                  <span style={{ color: agent.avgScore >= 90 ? '#4ADE80' : '#FBBF24' }}>{agent.avgScore} avg</span>
                </div>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </div>

      {/* Recent Tasks */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5, duration: 0.5, ease }}
        className="rounded-2xl bg-white/[0.02] border border-white/5 p-6"
      >
        <div className="flex items-center justify-between mb-6">
          <div>
            <h2 className="text-sm font-semibold">Recent Tasks</h2>
            <p className="text-[10px] text-white/30 mt-0.5">Active work pipeline</p>
          </div>
          <button className="text-[10px] text-white/30 hover:text-white/50 transition-colors">View all →</button>
        </div>
        <div className="space-y-2">
          {recentTasks.map((task, i) => {
            const cfg = statusConfig[task.status]
            return (
              <motion.div
                key={task.id}
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.55 + i * 0.04 }}
                className="flex items-center gap-4 p-4 rounded-xl hover:bg-white/[0.02] transition-colors cursor-pointer group"
              >
                {/* Status dot */}
                <div className={`w-2 h-2 rounded-full ${cfg.dot} shrink-0`} />

                {/* Content */}
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium truncate group-hover:text-white/90 transition-colors">{task.title}</p>
                  <div className="flex items-center gap-3 mt-1">
                    <span className="text-[10px] text-white/25 font-mono">{task.tier}</span>
                    <span className="flex items-center gap-1 text-[10px] text-white/25">
                      <Bot className="w-2.5 h-2.5" /> {task.agent}
                    </span>
                    <span className="flex items-center gap-1 text-[10px] text-white/25">
                      <Clock className="w-2.5 h-2.5" /> {task.time}
                    </span>
                  </div>
                </div>

                {/* Progress */}
                <div className="w-16 shrink-0">
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-[10px] text-white/20">{task.progress}%</span>
                  </div>
                  <div className="h-1 bg-white/5 rounded-full overflow-hidden">
                    <motion.div
                      initial={{ width: 0 }}
                      animate={{ width: `${task.progress}%` }}
                      transition={{ delay: 0.6 + i * 0.05, duration: 0.8, ease }}
                      className="h-full rounded-full"
                      style={{ backgroundColor: task.progress === 100 ? '#4ADE80' : '#C0C0C0' }}
                    />
                  </div>
                </div>

                {/* Status badge */}
                <span className={`text-[10px] px-2.5 py-1 rounded-full font-medium ${cfg.bg} ${cfg.text} shrink-0`}>
                  {task.status.replace('_', ' ')}
                </span>
              </motion.div>
            )
          })}
        </div>
      </motion.div>
    </div>
  )
}
