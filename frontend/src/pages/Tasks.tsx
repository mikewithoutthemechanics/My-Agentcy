import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Plus, Search, Clock, Bot, Loader2 } from 'lucide-react'

const statusColors: Record<string, string> = {
  queued: 'bg-white/10 text-white/50',
  in_progress: 'bg-blue-500/10 text-blue-400',
  qa_review: 'bg-yellow-500/10 text-yellow-400',
  human_review: 'bg-purple-500/10 text-purple-400',
  delivered: 'bg-green-500/10 text-green-400',
  completed: 'bg-green-500/10 text-green-400',
}

// Fallback data if API unavailable
const fallbackTasks = [
  { id: '1', title: 'Q1 Market Analysis — Tech Sector', type: 'analysis', status: 'in_progress', tier: 'T1', priority: 2, agent: 'Analyst', deadline: '4h', cost: '$1.80' },
  { id: '2', title: 'Competitive Report: SaaS Landscape', type: 'report', status: 'qa_review', tier: 'T1', priority: 3, agent: 'QA Reviewer', deadline: '6h', cost: '$2.40' },
  { id: '3', title: 'API Integration Documentation', type: 'content', status: 'delivered', tier: 'T0', priority: 3, agent: 'Builder', deadline: 'Done', cost: '$0.90' },
  { id: '4', title: 'Financial Model — Series A', type: 'analysis', status: 'human_review', tier: 'T2', priority: 1, agent: 'Human', deadline: '2h', cost: '$4.20' },
  { id: '5', title: 'Social Media Content Calendar', type: 'content', status: 'completed', tier: 'T0', priority: 4, agent: 'Writer', deadline: 'Done', cost: '$1.10' },
]

export default function Tasks() {
  const [tasks, setTasks] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [filter, setFilter] = useState<string>('all')
  const [search, setSearch] = useState('')

  useEffect(() => {
    fetchTasks()
  }, [])

  const fetchTasks = async () => {
    try {
      const res = await fetch('/api/tasks/')
      if (res.ok) {
        const data = await res.json()
        if (data.tasks?.length) {
          setTasks(data.tasks)
          setLoading(false)
          return
        }
      }
    } catch (e) {
      console.log('Using fallback data')
    }
    setTasks(fallbackTasks)
    setLoading(false)
  }

  const filteredTasks = tasks.filter(t => {
    if (filter !== 'all' && t.status !== filter) return false
    if (search && !t.title.toLowerCase().includes(search.toLowerCase())) return false
    return true
  })

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">Tasks</h1>
          <p className="text-white/30 text-sm mt-1">{tasks.length} total tasks</p>
        </div>
        <button className="flex items-center gap-2 px-4 py-2 bg-[#C0C0C0] text-black rounded-lg text-sm font-medium hover:bg-[#d0d0d0] transition-colors">
          <Plus className="w-4 h-4" /> New Task
        </button>
      </div>

      <div className="flex items-center gap-4">
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-white/20" />
          <input
            type="text"
            placeholder="Search tasks..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-10 pr-4 py-2 bg-white/5 border border-white/10 rounded-lg text-sm focus:outline-none focus:border-white/20"
          />
        </div>
        <div className="flex gap-2">
          {['all', 'in_progress', 'qa_review', 'completed'].map(f => (
            <button
              key={f}
              onClick={() => setFilter(f)}
              className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-colors ${
                filter === f ? 'bg-white/10 text-white' : 'text-white/30 hover:text-white/50'
              }`}
            >
              {f === 'all' ? 'All' : f.replace('_', ' ')}
            </button>
          ))}
        </div>
      </div>

      {loading ? (
        <div className="flex items-center justify-center py-20">
          <Loader2 className="w-6 h-6 text-white/20 animate-spin" />
        </div>
      ) : (
        <div className="space-y-2">
          <AnimatePresence>
            {filteredTasks.map((task, i) => (
              <motion.div
                key={task.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.03 }}
                className="flex items-center gap-4 p-4 bg-white/[0.02] border border-white/5 rounded-xl hover:bg-white/[0.04] transition-colors"
              >
                <div className={`w-2 h-2 rounded-full ${task.status === 'in_progress' ? 'bg-blue-400' : task.status === 'completed' ? 'bg-green-400' : 'bg-white/20'}`} />
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium truncate">{task.title}</p>
                  <div className="flex items-center gap-3 mt-1 text-xs text-white/30">
                    <span className="font-mono">{task.tier || 'T1'}</span>
                    <span className="flex items-center gap-1"><Bot className="w-3 h-3" /> {task.agent || 'Analyst'}</span>
                    <span className="flex items-center gap-1"><Clock className="w-3 h-3" /> {task.deadline || '4h'}</span>
                  </div>
                </div>
                <div className="text-xs text-white/40">{task.cost || '$2.00'}</div>
                <span className={`text-[10px] px-2 py-1 rounded-full ${statusColors[task.status] || 'bg-white/10 text-white/50'}`}>
                  {(task.status || 'queued').replace('_', ' ')}
                </span>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>
      )}
    </div>
  )
}