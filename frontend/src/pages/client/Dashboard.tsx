import { motion } from 'framer-motion'
import { Link } from 'react-router-dom'
import { ListTodo, CheckCircle2, Clock, TrendingUp, ArrowRight, Plus } from 'lucide-react'

export default function ClientDashboard() {
  const overview = {
    active_tasks: 3,
    completed_tasks: 12,
    total_tasks: 15,
    your_satisfaction: 4.7,
    plan: 'Pro',
    tasks_remaining: 65,
  }

  const recentTasks = [
    { id: '1', title: 'Q1 Market Analysis', status: 'in_progress', type: 'Analysis', eta: '4 hours' },
    { id: '2', title: 'Competitor Pricing Report', status: 'qa_review', type: 'Report', eta: '6 hours' },
    { id: '3', title: 'API Documentation', status: 'delivered', type: 'Content', eta: 'Ready' },
  ]

  const statusStyle: Record<string, string> = {
    queued: 'bg-gray-100 text-gray-500',
    in_progress: 'bg-blue-50 text-blue-600',
    qa_review: 'bg-yellow-50 text-yellow-600',
    delivered: 'bg-green-50 text-green-600',
    completed: 'bg-green-50 text-green-600',
  }

  return (
    <div>
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-2xl font-bold tracking-tight">Welcome back 👋</h1>
        <p className="text-gray-400 text-sm mt-1">Here's what your AI team is working on</p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        {[
          { label: 'Active Tasks', value: overview.active_tasks, icon: ListTodo, color: 'text-blue-500' },
          { label: 'Completed', value: overview.completed_tasks, icon: CheckCircle2, color: 'text-green-500' },
          { label: 'Avg Satisfaction', value: `${overview.your_satisfaction}★`, icon: TrendingUp, color: 'text-yellow-500' },
          { label: 'Tasks Remaining', value: overview.tasks_remaining, icon: Clock, color: 'text-gray-400' },
        ].map((stat, i) => (
          <motion.div
            key={stat.label}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.05 }}
            className="bg-white rounded-xl border border-gray-100 p-5"
          >
            <div className="flex items-center gap-2 mb-2">
              <stat.icon className={`w-4 h-4 ${stat.color}`} />
              <span className="text-[10px] text-gray-400 uppercase tracking-wider">{stat.label}</span>
            </div>
            <p className="text-2xl font-bold">{stat.value}</p>
          </motion.div>
        ))}
      </div>

      {/* Plan Info */}
      <div className="bg-[#1A1A2E] rounded-xl p-6 mb-8 text-white">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-xs text-white/50 uppercase tracking-wider mb-1">Your Plan</p>
            <h2 className="text-xl font-bold">{overview.plan} — {overview.tasks_remaining} tasks remaining</h2>
            <p className="text-white/50 text-sm mt-1">Resets April 1st</p>
          </div>
          <Link
            to="/tasks?new=true"
            className="flex items-center gap-2 px-5 py-2.5 rounded-full bg-[#FF6B6B] text-white text-sm font-medium hover:bg-[#FF5252] transition-colors"
          >
            <Plus className="w-4 h-4" /> New Task
          </Link>
        </div>
      </div>

      {/* Recent Tasks */}
      <div className="bg-white rounded-xl border border-gray-100 p-6">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-sm font-semibold">Recent Tasks</h2>
          <Link to="/tasks" className="text-xs text-gray-400 hover:text-gray-600 flex items-center gap-1">
            View all <ArrowRight className="w-3 h-3" />
          </Link>
        </div>
        <div className="space-y-3">
          {recentTasks.map(task => (
            <Link
              key={task.id}
              to={`/tasks/${task.id}`}
              className="flex items-center gap-4 p-3 rounded-lg hover:bg-gray-50 transition-colors"
            >
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium truncate">{task.title}</p>
                <p className="text-xs text-gray-400 mt-0.5">{task.type}</p>
              </div>
              <span className="text-xs text-gray-400">{task.eta}</span>
              <span className={`text-[10px] px-2.5 py-1 rounded-full ${statusStyle[task.status]}`}>
                {task.status.replace('_', ' ')}
              </span>
            </Link>
          ))}
        </div>
      </div>
    </div>
  )
}
