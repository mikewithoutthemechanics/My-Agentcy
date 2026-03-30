import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { ArrowLeft, Clock, CheckCircle2, Download, ThumbsUp, RefreshCw } from 'lucide-react'

const task = {
  id: '1',
  title: 'Q1 Market Analysis — Tech Sector',
  description: 'Comprehensive market analysis covering the technology sector for Q1 2026. Include competitor landscape, market sizing, growth trends, and key opportunities.',
  type: 'Analysis',
  status: 'in_progress',
  tier: 'T1',
  created: 'March 30, 2026 at 2:00 PM',
  deadline: 'March 30, 2026 at 8:00 PM',
  eta: '~4 hours',
  assigned_agents: ['Analyst', 'Builder', 'QA Reviewer'],
  requirements: [
    'Market size and growth rate',
    'Top 10 competitor analysis',
    'Key trends and opportunities',
    'Recommendations for market entry',
  ],
}

const timeline = [
  { time: '2:00 PM', event: 'Task submitted', icon: Clock, color: 'text-gray-400' },
  { time: '2:01 PM', event: 'Classified as T1 (spot-check review)', icon: CheckCircle2, color: 'text-blue-400' },
  { time: '2:02 PM', event: 'Assigned to Analyst agent', icon: CheckCircle2, color: 'text-blue-400' },
  { time: '2:15 PM', event: 'Research phase complete', icon: CheckCircle2, color: 'text-green-400' },
  { time: '2:30 PM', event: 'Builder agent generating report', icon: RefreshCw, color: 'text-blue-400' },
]

const statusStyle: Record<string, string> = {
  queued: 'bg-gray-100 text-gray-600',
  in_progress: 'bg-blue-50 text-blue-600',
  qa_review: 'bg-yellow-50 text-yellow-600',
  delivered: 'bg-green-50 text-green-600',
  completed: 'bg-green-50 text-green-600',
}

export default function ClientTaskDetail() {

  return (
    <div>
      {/* Back */}
      <Link to="/tasks" className="flex items-center gap-2 text-sm text-gray-400 hover:text-gray-600 mb-6">
        <ArrowLeft className="w-4 h-4" /> Back to tasks
      </Link>

      <div className="grid lg:grid-cols-3 gap-6">
        {/* Main Content */}
        <div className="lg:col-span-2">
          {/* Header */}
          <div className="bg-white rounded-xl border border-gray-100 p-6 mb-6">
            <div className="flex items-start justify-between mb-4">
              <div>
                <h1 className="text-xl font-bold">{task.title}</h1>
                <p className="text-sm text-gray-400 mt-1">{task.type} · {task.tier}</p>
              </div>
              <span className={`text-xs px-3 py-1.5 rounded-full font-medium ${statusStyle[task.status]}`}>
                {task.status.replace('_', ' ')}
              </span>
            </div>
            <p className="text-sm text-gray-500 leading-relaxed">{task.description}</p>

            {/* Requirements */}
            <div className="mt-6 pt-6 border-t border-gray-50">
              <h3 className="text-xs text-gray-400 uppercase tracking-wider mb-3">Requirements</h3>
              <ul className="space-y-2">
                {task.requirements.map((req, i) => (
                  <li key={i} className="flex items-center gap-2 text-sm text-gray-600">
                    <CheckCircle2 className="w-4 h-4 text-green-400 shrink-0" />
                    {req}
                  </li>
                ))}
              </ul>
            </div>
          </div>

          {/* Deliverable (when ready) */}
          {task.status === 'delivered' && (
            <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="bg-white rounded-xl border border-green-100 p-6">
              <div className="flex items-center gap-2 mb-4">
                <CheckCircle2 className="w-5 h-5 text-green-500" />
                <h2 className="text-sm font-semibold">Deliverable Ready</h2>
              </div>
              <div className="bg-gray-50 rounded-lg p-6 mb-4">
                <p className="text-sm text-gray-500">[Deliverable content preview would appear here]</p>
              </div>
              <div className="flex gap-3">
                <button className="flex items-center gap-2 px-4 py-2.5 rounded-lg bg-[#1A1A2E] text-white text-sm font-medium hover:bg-[#2D2D44] transition-colors">
                  <Download className="w-4 h-4" /> Download
                </button>
                <button className="flex items-center gap-2 px-4 py-2.5 rounded-lg border border-gray-200 text-sm text-gray-600 hover:bg-gray-50 transition-colors">
                  <ThumbsUp className="w-4 h-4" /> Approve
                </button>
                <button className="flex items-center gap-2 px-4 py-2.5 rounded-lg border border-gray-200 text-sm text-gray-600 hover:bg-gray-50 transition-colors">
                  <RefreshCw className="w-4 h-4" /> Request Revision
                </button>
              </div>
            </motion.div>
          )}
        </div>

        {/* Sidebar */}
        <div>
          {/* Status Card */}
          <div className="bg-white rounded-xl border border-gray-100 p-5 mb-4">
            <h3 className="text-xs text-gray-400 uppercase tracking-wider mb-3">Status</h3>
            <div className="space-y-3">
              <div className="flex justify-between text-sm">
                <span className="text-gray-400">Created</span>
                <span>{task.created}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-gray-400">Deadline</span>
                <span>{task.deadline}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-gray-400">ETA</span>
                <span className="text-blue-500 font-medium">{task.eta}</span>
              </div>
            </div>
          </div>

          {/* Agents */}
          <div className="bg-white rounded-xl border border-gray-100 p-5 mb-4">
            <h3 className="text-xs text-gray-400 uppercase tracking-wider mb-3">Working on it</h3>
            <div className="space-y-2">
              {task.assigned_agents.map(agent => (
                <div key={agent} className="flex items-center gap-2 text-sm">
                  <div className="w-2 h-2 rounded-full bg-green-400 animate-pulse" />
                  <span>{agent}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Timeline */}
          <div className="bg-white rounded-xl border border-gray-100 p-5">
            <h3 className="text-xs text-gray-400 uppercase tracking-wider mb-3">Timeline</h3>
            <div className="space-y-3">
              {timeline.map((item, i) => (
                <div key={i} className="flex items-start gap-3">
                  <item.icon className={`w-4 h-4 mt-0.5 shrink-0 ${item.color}`} />
                  <div>
                    <p className="text-sm">{item.event}</p>
                    <p className="text-[10px] text-gray-400">{item.time}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
