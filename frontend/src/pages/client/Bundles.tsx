"""Client Bundles page - Client-facing bundle selection."""

import { useState } from 'react'
import { Zap, Check, Users, Briefcase, Code, Headphones, Crown, Palette, Search, Play } from 'lucide-react'

const BUNDLES = [
  { id: 'sales', name: 'Sales Team', icon: Users, color: '#10B981', agents: 6 },
  { id: 'marketing', name: 'Marketing Team', icon: Zap, color: '#F59E0B', agents: 7 },
  { id: 'development', name: 'Development Team', icon: Code, color: '#3B82F6', agents: 7 },
  { id: 'operations', name: 'Operations Team', icon: Briefcase, color: '#8B5CF6', agents: 6 },
  { id: 'executive', name: 'Executive Suite', icon: Crown, color: '#EF4444', agents: 6 },
  { id: 'customer_success', name: 'Customer Success', icon: Headphones, color: '#06B6D4', agents: 4 },
  { id: 'design', name: 'Design Team', icon: Palette, color: '#EC4899', agents: 6 },
  { id: 'research', name: 'Research Team', icon: Search, color: '#14B8A6', agents: 4 },
]

export default function ClientBundles() {
  const [selected, setSelected] = useState<string | null>(null)
  const [taskInput, setTaskInput] = useState('')
  const [running, setRunning] = useState(false)
  const [history, setHistory] = useState<{bundle: string; task: string; status: string}[]>([])

  const runTask = async () => {
    if (!selected || !taskInput) return
    setRunning(true)
    // Simulate task - in real app would call API
    setTimeout(() => {
      setHistory([{ bundle: selected, task: taskInput, status: 'completed' }, ...history])
      setTaskInput('')
      setRunning(false)
    }, 1500)
  }

  return (
    <div className="p-6">
      <div className="mb-6">
        <h1 className="text-2xl font-bold">AI Teams</h1>
        <p className="text-gray-400 text-sm">Select a team and assign a task</p>
      </div>

      {/* Bundle Grid */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
        {BUNDLES.map(b => {
          const Icon = b.icon
          return (
            <button
              key={b.id}
              onClick={() => setSelected(b.id)}
              className={`p-4 rounded-xl border text-left transition-all ${
                selected === b.id 
                  ? 'border-transparent ring-2 ring-offset-2' 
                  : 'border-gray-200 hover:border-gray-300'
              }`}
              style={{ 
                background: selected === b.id ? `${b.color}15` : 'white',
                ringColor: b.color 
              }}
            >
              <div className={`w-10 h-10 rounded-lg flex items-center justify-center mb-3`} style={{ background: b.color }}>
                <Icon className="w-5 h-5 text-white" />
              </div>
              <div className="font-medium text-sm">{b.name}</div>
              <div className="text-xs text-gray-400">{b.agents} agents</div>
            </button>
          )
        })}
      </div>

      {/* Task Input */}
      {selected && (
        <div className="bg-white rounded-xl border border-gray-200 p-6">
          <div className="flex items-center gap-3 mb-4">
            <div className={`w-8 h-8 rounded-lg flex items-center justify-center`} style={{ background: BUNDLES.find(b => b.id === selected)?.color }}>
              {(() => { const Icon = BUNDLES.find(b => b.id === selected)?.icon; return Icon ? <Icon className="w-4 h-4 text-white" /> : null })()}
            </div>
            <div>
              <div className="font-medium">{BUNDLES.find(b => b.id === selected)?.name}</div>
              <div className="text-xs text-gray-400">Ready for tasks</div>
            </div>
          </div>
          
          <div className="flex gap-3">
            <input
              type="text"
              value={taskInput}
              onChange={(e) => setTaskInput(e.target.value)}
              placeholder="Describe what you need..."
              className="flex-1 px-4 py-3 rounded-lg border border-gray-200 text-sm"
              onKeyDown={(e) => e.key === 'Enter' && runTask()}
            />
            <button
              onClick={runTask}
              disabled={running || !taskInput}
              className="px-6 py-3 rounded-lg font-medium text-sm flex items-center gap-2 disabled:opacity-50"
              style={{ background: BUNDLES.find(b => b.id === selected)?.color, color: 'white' }}
            >
              <Play className="w-4 h-4" />
              {running ? 'Running...' : 'Run'}
            </button>
          </div>

          {/* History */}
          {history.length > 0 && (
            <div className="mt-6 pt-6 border-t border-gray-100">
              <div className="text-xs font-medium text-gray-400 mb-3">Recent Tasks</div>
              <div className="space-y-2">
                {history.slice(0, 5).map((h, i) => (
                  <div key={i} className="flex items-center gap-3 text-sm">
                    <Check className="w-4 h-4 text-green-500" />
                    <span className="flex-1 truncate">{h.task}</span>
                    <span className="text-gray-400 text-xs">{h.bundle}</span>
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