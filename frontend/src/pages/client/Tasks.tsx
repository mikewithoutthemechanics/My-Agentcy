import { useState } from 'react'
import { Link, useSearchParams } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { Plus, Search, ChevronRight, Clock, X } from 'lucide-react'

const tasks = [
  { id: '1', title: 'Q1 Market Analysis — Tech Sector', type: 'Analysis', status: 'in_progress', created: '2h ago', eta: '4 hours' },
  { id: '2', title: 'Competitor Pricing Report', type: 'Report', status: 'qa_review', created: '1d ago', eta: '6 hours' },
  { id: '3', title: 'API Documentation', type: 'Content', status: 'delivered', created: '2d ago', eta: 'Ready for review' },
  { id: '4', title: 'Customer Segmentation', type: 'Analysis', status: 'completed', created: '3d ago', eta: 'Completed' },
  { id: '5', title: 'Sales Email Templates', type: 'Content', status: 'completed', created: '5d ago', eta: 'Completed' },
]

const statusStyle: Record<string, string> = {
  queued: 'bg-gray-100 text-gray-500',
  in_progress: 'bg-blue-50 text-blue-600',
  qa_review: 'bg-yellow-50 text-yellow-600',
  delivered: 'bg-green-50 text-green-600',
  completed: 'bg-green-50 text-green-600',
}

export default function ClientTasks() {
  const [searchParams] = useSearchParams()
  const [showNew, setShowNew] = useState(searchParams.get('new') === 'true')
  const [filter, setFilter] = useState('all')

  const filtered = filter === 'all' ? tasks : tasks.filter(t => t.status === filter)

  return (
    <div>
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">My Tasks</h1>
          <p className="text-gray-400 text-sm mt-1">{tasks.length} total</p>
        </div>
        <button
          onClick={() => setShowNew(true)}
          className="flex items-center gap-2 px-4 py-2.5 rounded-lg bg-[#1A1A2E] text-white text-sm font-medium hover:bg-[#2D2D44] transition-colors"
        >
          <Plus className="w-4 h-4" /> New Task
        </button>
      </div>

      {/* Filters */}
      <div className="flex items-center gap-2 mb-6">
        {['all', 'in_progress', 'qa_review', 'delivered', 'completed'].map(f => (
          <button
            key={f}
            onClick={() => setFilter(f)}
            className={`px-3 py-1.5 rounded-full text-xs font-medium transition-colors ${
              filter === f ? 'bg-[#1A1A2E] text-white' : 'text-gray-400 hover:text-gray-600 hover:bg-gray-100'
            }`}
          >
            {f === 'all' ? 'All' : f.replace('_', ' ')}
          </button>
        ))}
      </div>

      {/* Search */}
      <div className="relative mb-6">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-300" />
        <input
          type="text"
          placeholder="Search your tasks..."
          className="w-full bg-white border border-gray-100 rounded-lg pl-10 pr-4 py-2.5 text-sm placeholder:text-gray-300 focus:outline-none focus:border-gray-200"
        />
      </div>

      {/* Task List */}
      <div className="space-y-2">
        {filtered.map((task, i) => (
          <motion.div key={task.id} initial={{ opacity: 0, y: 5 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.03 }}>
            <Link
              to={`/tasks/${task.id}`}
              className="flex items-center gap-4 p-4 bg-white rounded-xl border border-gray-100 hover:border-gray-200 transition-colors"
            >
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium truncate">{task.title}</p>
                <div className="flex items-center gap-3 mt-1">
                  <span className="text-[10px] text-gray-400">{task.type}</span>
                  <span className="flex items-center gap-1 text-[10px] text-gray-400">
                    <Clock className="w-3 h-3" /> {task.eta}
                  </span>
                </div>
              </div>
              <span className={`text-[10px] px-2.5 py-1 rounded-full ${statusStyle[task.status]}`}>
                {task.status.replace('_', ' ')}
              </span>
              <ChevronRight className="w-4 h-4 text-gray-200" />
            </Link>
          </motion.div>
        ))}
      </div>

      {/* New Task Modal */}
      <AnimatePresence>
        {showNew && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 z-50 flex items-center justify-center px-6" onClick={() => setShowNew(false)}>
            <div className="absolute inset-0 bg-black/30 backdrop-blur-sm" />
            <motion.div initial={{ scale: 0.95 }} animate={{ scale: 1 }} exit={{ scale: 0.95 }} className="relative w-full max-w-lg bg-white rounded-2xl shadow-2xl p-8" onClick={e => e.stopPropagation()}>
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-lg font-bold">Submit a Task</h2>
                <button onClick={() => setShowNew(false)} className="text-gray-300 hover:text-gray-500"><X className="w-5 h-5" /></button>
              </div>
              <div className="space-y-4">
                <div>
                  <label className="text-xs text-gray-400 uppercase tracking-wider block mb-1.5">What do you need?</label>
                  <input className="w-full border border-gray-100 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:border-[#1A1A2E]/20" placeholder="e.g., Q1 market analysis for SaaS industry" />
                </div>
                <div>
                  <label className="text-xs text-gray-400 uppercase tracking-wider block mb-1.5">Describe it in detail</label>
                  <textarea className="w-full border border-gray-100 rounded-lg px-4 py-2.5 text-sm h-28 resize-none focus:outline-none focus:border-[#1A1A2E]/20" placeholder="Include any specific requirements, data sources, format preferences..." />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="text-xs text-gray-400 uppercase tracking-wider block mb-1.5">Type</label>
                    <select className="w-full border border-gray-100 rounded-lg px-4 py-2.5 text-sm focus:outline-none">
                      <option>Report</option>
                      <option>Analysis</option>
                      <option>Content</option>
                      <option>Research</option>
                      <option>Code</option>
                    </select>
                  </div>
                  <div>
                    <label className="text-xs text-gray-400 uppercase tracking-wider block mb-1.5">Priority</label>
                    <select className="w-full border border-gray-100 rounded-lg px-4 py-2.5 text-sm focus:outline-none">
                      <option>Normal</option>
                      <option>High</option>
                      <option>Urgent</option>
                    </select>
                  </div>
                </div>
                <div>
                  <label className="text-xs text-gray-400 uppercase tracking-wider block mb-1.5">Deadline (optional)</label>
                  <input type="date" className="w-full border border-gray-100 rounded-lg px-4 py-2.5 text-sm focus:outline-none" />
                </div>
                <div>
                  <label className="text-xs text-gray-400 uppercase tracking-wider block mb-1.5">Attachments (optional)</label>
                  <div className="border-2 border-dashed border-gray-100 rounded-lg p-6 text-center text-sm text-gray-300 hover:border-gray-200 transition-colors cursor-pointer">
                    Drop files here or click to upload
                  </div>
                </div>
                <div className="flex gap-3 pt-2">
                  <button onClick={() => setShowNew(false)} className="flex-1 px-4 py-2.5 rounded-lg border border-gray-100 text-sm text-gray-400 hover:text-gray-600 transition-colors">Cancel</button>
                  <button className="flex-1 px-4 py-2.5 rounded-lg bg-[#1A1A2E] text-white text-sm font-medium hover:bg-[#2D2D44] transition-colors">Submit Task</button>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
