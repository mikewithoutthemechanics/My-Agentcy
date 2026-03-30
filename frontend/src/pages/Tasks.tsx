import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Plus, Search, ChevronRight, Clock, Bot } from 'lucide-react'

const tasks = [
  { id: '1', title: 'Q1 Market Analysis — Tech Sector', type: 'analysis', status: 'in_progress', tier: 'T1', priority: 2, agent: 'Analyst', deadline: '4h', cost: '$1.80' },
  { id: '2', title: 'Competitive Report: SaaS Landscape', type: 'report', status: 'qa_review', tier: 'T1', priority: 3, agent: 'QA Reviewer', deadline: '6h', cost: '$2.40' },
  { id: '3', title: 'API Integration Documentation', type: 'content', status: 'delivered', tier: 'T0', priority: 3, agent: 'Builder', deadline: 'Done', cost: '$0.90' },
  { id: '4', title: 'Financial Model — Series A', type: 'analysis', status: 'human_review', tier: 'T2', priority: 1, agent: 'Human', deadline: '2h', cost: '$4.20' },
  { id: '5', title: 'Social Media Content Calendar', type: 'content', status: 'completed', tier: 'T0', priority: 4, agent: 'Writer', deadline: 'Done', cost: '$1.10' },
  { id: '6', title: 'Customer Segmentation Analysis', type: 'analysis', status: 'queued', tier: 'T1', priority: 3, agent: 'Pending', deadline: '12h', cost: '—' },
  { id: '7', title: 'Brand Guidelines Document', type: 'content', status: 'in_progress', tier: 'T1', priority: 2, agent: 'Designer', deadline: '8h', cost: '$2.80' },
  { id: '8', title: 'Sales Pipeline Automation Script', type: 'code', status: 'qa_review', tier: 'T1', priority: 2, agent: 'QA Reviewer', deadline: '3h', cost: '$3.50' },
]

const statusColors: Record<string, string> = {
  queued: 'bg-white/10 text-white/50',
  in_progress: 'bg-blue-500/10 text-blue-400',
  qa_review: 'bg-yellow-500/10 text-yellow-400',
  human_review: 'bg-purple-500/10 text-purple-400',
  delivered: 'bg-green-500/10 text-green-400',
  completed: 'bg-green-500/10 text-green-400',
}

const priorityColors: Record<number, string> = {
  1: 'text-red-400',
  2: 'text-orange-400',
  3: 'text-white/40',
  4: 'text-white/20',
  5: 'text-white/10',
}

export default function Tasks() {
  const [filter, setFilter] = useState('all')
  const [showCreate, setShowCreate] = useState(false)

  const filtered = filter === 'all' ? tasks : tasks.filter(t => t.status === filter)

  return (
    <div>
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Tasks</h1>
          <p className="text-white/40 text-sm mt-1">{tasks.length} total · {tasks.filter(t => t.status === 'in_progress').length} in progress</p>
        </div>
        <button
          onClick={() => setShowCreate(true)}
          className="flex items-center gap-2 px-4 py-2.5 rounded-lg bg-[#C0C0C0] text-black text-sm font-medium hover:bg-[#D4D4D4] transition-colors"
        >
          <Plus className="w-4 h-4" /> New Task
        </button>
      </div>

      {/* Filters */}
      <div className="flex items-center gap-2 mb-6 overflow-x-auto pb-2">
        {['all', 'queued', 'in_progress', 'qa_review', 'human_review', 'delivered', 'completed'].map(f => (
          <button
            key={f}
            onClick={() => setFilter(f)}
            className={`px-3 py-1.5 rounded-full text-xs font-medium whitespace-nowrap transition-colors ${
              filter === f ? 'bg-white/10 text-white' : 'text-white/30 hover:text-white/50'
            }`}
          >
            {f === 'all' ? 'All' : f.replace('_', ' ')}
            {f !== 'all' && <span className="ml-1.5 text-white/20">{tasks.filter(t => t.status === f).length}</span>}
          </button>
        ))}
      </div>

      {/* Search */}
      <div className="relative mb-6">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-white/20" />
        <input
          type="text"
          placeholder="Search tasks..."
          className="w-full bg-white/[0.02] border border-white/5 rounded-lg pl-10 pr-4 py-2.5 text-sm text-white placeholder:text-white/20 focus:outline-none focus:border-white/10"
        />
      </div>

      {/* Task List */}
      <div className="space-y-2">
        {filtered.map((task, i) => (
          <motion.div
            key={task.id}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.03 }}
            className="flex items-center gap-4 p-4 rounded-xl bg-white/[0.02] border border-white/5 hover:bg-white/[0.04] transition-colors cursor-pointer"
          >
            {/* Priority */}
            <div className={`text-lg font-bold ${priorityColors[task.priority]}`}>•</div>

            {/* Content */}
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium truncate">{task.title}</p>
              <div className="flex items-center gap-3 mt-1">
                <span className="text-[10px] text-white/30">{task.type}</span>
                <span className="flex items-center gap-1 text-[10px] text-white/30">
                  <Bot className="w-3 h-3" /> {task.agent}
                </span>
                <span className="flex items-center gap-1 text-[10px] text-white/30">
                  <Clock className="w-3 h-3" /> {task.deadline}
                </span>
              </div>
            </div>

            {/* Tier */}
            <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-white/5 text-white/40">{task.tier}</span>

            {/* Cost */}
            <span className="text-xs text-white/30 w-12 text-right">{task.cost}</span>

            {/* Status */}
            <span className={`text-[10px] px-2.5 py-1 rounded-full ${statusColors[task.status]}`}>
              {task.status.replace('_', ' ')}
            </span>

            <ChevronRight className="w-4 h-4 text-white/10" />
          </motion.div>
        ))}
      </div>

      {/* Create Task Modal */}
      <AnimatePresence>
        {showCreate && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center px-6"
            onClick={() => setShowCreate(false)}
          >
            <div className="absolute inset-0 bg-black/80 backdrop-blur-sm" />
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className="relative w-full max-w-lg bg-[#1A1A2E] rounded-2xl border border-white/10 p-8"
              onClick={e => e.stopPropagation()}
            >
              <h2 className="text-lg font-bold mb-6">Create Task</h2>
              <div className="space-y-4">
                <div>
                  <label className="text-xs text-white/40 uppercase tracking-wider block mb-1.5">Title</label>
                  <input className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-2.5 text-sm text-white placeholder:text-white/20 focus:outline-none focus:border-[#C0C0C0]/30" placeholder="What needs to be done?" />
                </div>
                <div>
                  <label className="text-xs text-white/40 uppercase tracking-wider block mb-1.5">Description</label>
                  <textarea className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-2.5 text-sm text-white placeholder:text-white/20 focus:outline-none focus:border-[#C0C0C0]/30 h-24 resize-none" placeholder="Detailed brief..." />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="text-xs text-white/40 uppercase tracking-wider block mb-1.5">Type</label>
                    <select className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-2.5 text-sm text-white focus:outline-none focus:border-[#C0C0C0]/30">
                      <option value="report">Report</option>
                      <option value="analysis">Analysis</option>
                      <option value="content">Content</option>
                      <option value="code">Code</option>
                      <option value="research">Research</option>
                    </select>
                  </div>
                  <div>
                    <label className="text-xs text-white/40 uppercase tracking-wider block mb-1.5">Priority</label>
                    <select className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-2.5 text-sm text-white focus:outline-none focus:border-[#C0C0C0]/30">
                      <option value="3">Normal</option>
                      <option value="1">Critical</option>
                      <option value="2">High</option>
                      <option value="4">Low</option>
                    </select>
                  </div>
                </div>
                <div className="flex gap-3 pt-4">
                  <button onClick={() => setShowCreate(false)} className="flex-1 px-4 py-2.5 rounded-lg border border-white/10 text-sm text-white/50 hover:text-white transition-colors">Cancel</button>
                  <button className="flex-1 px-4 py-2.5 rounded-lg bg-[#C0C0C0] text-black text-sm font-medium hover:bg-[#D4D4D4] transition-colors">Create Task</button>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
