import { motion } from 'framer-motion'
import { DollarSign, TrendingUp, TrendingDown, FileText } from 'lucide-react'
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts'

const costBreakdown = [
  { agent: 'Analyst', tokens: '124K', cost: '$3.10', tasks: 12, perTask: '$0.26' },
  { agent: 'Builder', tokens: '312K', cost: '$7.80', tasks: 18, perTask: '$0.43' },
  { agent: 'QA Reviewer', tokens: '89K', cost: '$2.20', tasks: 47, perTask: '$0.05' },
  { agent: 'Researcher', tokens: '198K', cost: '$4.95', tasks: 8, perTask: '$0.62' },
  { agent: 'Writer', tokens: '156K', cost: '$3.90', tasks: 10, perTask: '$0.39' },
  { agent: 'PM', tokens: '45K', cost: '$1.10', tasks: 5, perTask: '$0.22' },
]

const invoices = [
  { id: 'INV-001', client: 'Acme Corp', amount: '$2,400', status: 'paid', date: 'Mar 15', tasks: 24 },
  { id: 'INV-002', client: 'TechFlow', amount: '$1,800', status: 'sent', date: 'Mar 20', tasks: 18 },
  { id: 'INV-003', client: 'DataDriven', amount: '$3,200', status: 'draft', date: 'Mar 25', tasks: 32 },
  { id: 'INV-004', client: 'GrowthLabs', amount: '$960', status: 'overdue', date: 'Mar 10', tasks: 12 },
]

const statusColors: Record<string, string> = {
  paid: 'bg-green-500/10 text-green-400',
  sent: 'bg-blue-500/10 text-blue-400',
  draft: 'bg-white/10 text-white/40',
  overdue: 'bg-red-500/10 text-red-400',
}

const dailyCosts = [
  { day: '1', cost: 45 }, { day: '2', cost: 62 }, { day: '3', cost: 38 },
  { day: '4', cost: 71 }, { day: '5', cost: 55 }, { day: '6', cost: 82 },
  { day: '7', cost: 48 }, { day: '8', cost: 65 }, { day: '9', cost: 73 },
  { day: '10', cost: 58 }, { day: '11', cost: 90 }, { day: '12', cost: 72 },
  { day: '13', cost: 68 }, { day: '14', cost: 85 },
]

export default function Billing() {
  const totalCost = costBreakdown.reduce((sum, a) => sum + parseFloat(a.cost.replace('$', '')), 0)
  const totalTasks = costBreakdown.reduce((sum, a) => sum + a.tasks, 0)

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-2xl font-bold tracking-tight">Billing</h1>
        <p className="text-white/40 text-sm mt-1">Cost tracking, invoices, and revenue</p>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        {[
          { label: 'Total Spend', value: `$${totalCost.toFixed(2)}`, change: '-12% vs last month', icon: DollarSign, color: '#FBBF24' },
          { label: 'Cost per Task', value: `$${(totalCost / totalTasks).toFixed(2)}`, change: '-8% improvement', icon: TrendingDown, color: '#4ADE80' },
          { label: 'Revenue MTD', value: '$8,360', change: '+24% vs last month', icon: TrendingUp, color: '#60A5FA' },
          { label: 'Open Invoices', value: '$5,960', change: '3 pending', icon: FileText, color: '#F472B6' },
        ].map((card, i) => (
          <motion.div
            key={card.label}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.05 }}
            className="bg-white/[0.02] rounded-xl border border-white/5 p-5"
          >
            <div className="flex items-center gap-2 mb-3">
              <card.icon className="w-4 h-4" style={{ color: card.color }} />
              <span className="text-[10px] text-white/30 uppercase tracking-wider">{card.label}</span>
            </div>
            <p className="text-2xl font-bold tracking-tight">{card.value}</p>
            <p className="text-[10px] text-white/30 mt-1">{card.change}</p>
          </motion.div>
        ))}
      </div>

      <div className="grid lg:grid-cols-3 gap-6">
        {/* Cost by Agent */}
        <div className="lg:col-span-2 bg-white/[0.02] rounded-xl border border-white/5 p-6">
          <h2 className="text-sm font-semibold mb-4">Cost by Agent</h2>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="text-[10px] text-white/30 uppercase tracking-wider">
                  <th className="text-left pb-3">Agent</th>
                  <th className="text-right pb-3">Tokens</th>
                  <th className="text-right pb-3">Cost</th>
                  <th className="text-right pb-3">Tasks</th>
                  <th className="text-right pb-3">Per Task</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5">
                {costBreakdown.map(a => (
                  <tr key={a.agent} className="hover:bg-white/[0.02]">
                    <td className="py-3 font-medium">{a.agent}</td>
                    <td className="py-3 text-right text-white/40">{a.tokens}</td>
                    <td className="py-3 text-right">{a.cost}</td>
                    <td className="py-3 text-right text-white/40">{a.tasks}</td>
                    <td className="py-3 text-right text-white/40">{a.perTask}</td>
                  </tr>
                ))}
              </tbody>
              <tfoot>
                <tr className="border-t border-white/10 font-medium">
                  <td className="pt-3">Total</td>
                  <td className="pt-3 text-right text-white/40">924K</td>
                  <td className="pt-3 text-right">${totalCost.toFixed(2)}</td>
                  <td className="pt-3 text-right text-white/40">{totalTasks}</td>
                  <td className="pt-3 text-right text-white/40">${(totalCost / totalTasks).toFixed(2)}</td>
                </tr>
              </tfoot>
            </table>
          </div>

          {/* Cost Trend Chart */}
          <div className="mt-6 pt-6 border-t border-white/5">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-xs text-white/50 uppercase tracking-wider">Daily Cost (Last 14 Days)</h3>
              <span className="text-xs text-[#4ADE80]">↓ trending down</span>
            </div>
            <ResponsiveContainer width="100%" height={96}>
              <BarChart data={dailyCosts}>
                <XAxis dataKey="day" tick={{ fill: '#666', fontSize: 9 }} axisLine={false} tickLine={false} />
                <YAxis hide />
                <Tooltip contentStyle={{ background: '#1A1A2E', border: '1px solid rgba(255,255,255,0.1)', borderRadius: 8, fontSize: 11 }} />
                <Bar dataKey="cost" fill="#C0C0C0" radius={[2, 2, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Invoices */}
        <div className="bg-white/[0.02] rounded-xl border border-white/5 p-6">
          <h2 className="text-sm font-semibold mb-4">Invoices</h2>
          <div className="space-y-3">
            {invoices.map(inv => (
              <div key={inv.id} className="p-3 rounded-lg hover:bg-white/[0.02] transition-colors">
                <div className="flex items-center justify-between mb-1">
                  <span className="text-sm font-medium">{inv.id}</span>
                  <span className={`text-[10px] px-2 py-0.5 rounded-full ${statusColors[inv.status]}`}>{inv.status}</span>
                </div>
                <p className="text-xs text-white/40">{inv.client}</p>
                <div className="flex items-center justify-between mt-2">
                  <span className="text-xs text-white/30">{inv.tasks} tasks · {inv.date}</span>
                  <span className="text-sm font-semibold">{inv.amount}</span>
                </div>
              </div>
            ))}
          </div>
          <button className="w-full mt-4 px-4 py-2.5 rounded-lg border border-white/10 text-xs text-white/40 hover:text-white hover:bg-white/5 transition-colors">
            Generate Invoice
          </button>
        </div>
      </div>
    </div>
  )
}
