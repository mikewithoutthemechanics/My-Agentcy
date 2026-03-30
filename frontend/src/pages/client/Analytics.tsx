import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts'

const tasksByType = [
  { type: 'Report', count: 6 }, { type: 'Analysis', count: 4 },
  { type: 'Content', count: 3 }, { type: 'Research', count: 2 },
]

const tasksByStatus = [
  { name: 'Completed', value: 12, color: '#4ADE80' },
  { name: 'In Progress', value: 3, color: '#60A5FA' },
  { name: 'Queued', value: 1, color: '#9CA3AF' },
]

const monthlyUsage = [
  { month: 'Oct', tasks: 8 }, { month: 'Nov', tasks: 12 },
  { month: 'Dec', tasks: 10 }, { month: 'Jan', tasks: 15 },
  { month: 'Feb', tasks: 11 }, { month: 'Mar', tasks: 15 },
]

export default function ClientAnalytics() {
  return (
    <div>
      <div className="mb-8">
        <h1 className="text-2xl font-bold tracking-tight">Analytics</h1>
        <p className="text-gray-400 text-sm mt-1">Your usage and performance metrics</p>
      </div>

      {/* Summary */}
      <div className="grid grid-cols-4 gap-4 mb-8">
        {[
          { label: 'Total Tasks', value: '15' },
          { label: 'This Month', value: '15' },
          { label: 'Avg Delivery', value: '4.2h' },
          { label: 'Satisfaction', value: '4.7★' },
        ].map(s => (
          <div key={s.label} className="bg-white rounded-xl border border-gray-100 p-5">
            <p className="text-xs text-gray-400 uppercase tracking-wider mb-1">{s.label}</p>
            <p className="text-2xl font-bold">{s.value}</p>
          </div>
        ))}
      </div>

      <div className="grid lg:grid-cols-2 gap-6">
        {/* Tasks by Type */}
        <div className="bg-white rounded-xl border border-gray-100 p-6">
          <h2 className="text-sm font-semibold mb-4">Tasks by Type</h2>
          <ResponsiveContainer width="100%" height={200}>
            <BarChart data={tasksByType}>
              <XAxis dataKey="type" tick={{ fill: '#9CA3AF', fontSize: 11 }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fill: '#9CA3AF', fontSize: 11 }} axisLine={false} tickLine={false} />
              <Tooltip contentStyle={{ background: '#fff', border: '1px solid #eee', borderRadius: 8, fontSize: 12 }} />
              <Bar dataKey="count" fill="#1A1A2E" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* Tasks by Status */}
        <div className="bg-white rounded-xl border border-gray-100 p-6">
          <h2 className="text-sm font-semibold mb-4">Tasks by Status</h2>
          <div className="flex items-center gap-8">
            <ResponsiveContainer width="50%" height={200}>
              <PieChart>
                <Pie data={tasksByStatus} dataKey="value" cx="50%" cy="50%" innerRadius={50} outerRadius={80}>
                  {tasksByStatus.map((entry, i) => (
                    <Cell key={i} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip contentStyle={{ background: '#fff', border: '1px solid #eee', borderRadius: 8, fontSize: 12 }} />
              </PieChart>
            </ResponsiveContainer>
            <div className="space-y-3">
              {tasksByStatus.map(s => (
                <div key={s.name} className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded-full" style={{ backgroundColor: s.color }} />
                  <span className="text-sm text-gray-500">{s.name}</span>
                  <span className="text-sm font-medium">{s.value}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Monthly Usage */}
        <div className="lg:col-span-2 bg-white rounded-xl border border-gray-100 p-6">
          <h2 className="text-sm font-semibold mb-4">Monthly Usage</h2>
          <ResponsiveContainer width="100%" height={200}>
            <BarChart data={monthlyUsage}>
              <XAxis dataKey="month" tick={{ fill: '#9CA3AF', fontSize: 11 }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fill: '#9CA3AF', fontSize: 11 }} axisLine={false} tickLine={false} />
              <Tooltip contentStyle={{ background: '#fff', border: '1px solid #eee', borderRadius: 8, fontSize: 12 }} />
              <Bar dataKey="tasks" fill="#FF6B6B" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  )
}
