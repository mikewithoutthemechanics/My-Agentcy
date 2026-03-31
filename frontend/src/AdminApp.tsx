import { Routes, Route, Navigate, NavLink } from 'react-router-dom'
import { motion } from 'framer-motion'
import {
  LayoutDashboard,
  ListTodo,
  ShieldCheck,
  Bot,
  CreditCard,
  Settings,
  ChevronRight,
  Zap,
} from 'lucide-react'
import Dashboard from './pages/Dashboard'
import Tasks from './pages/Tasks'
import QAReview from './pages/QAReview'
import Agents from './pages/Agents'
import Billing from './pages/Billing'
import SettingsPage from './pages/Settings'
import './index.css'

const navItems = [
  { to: '/app/dashboard', icon: LayoutDashboard, label: 'Dashboard' },
  { to: '/app/tasks', icon: ListTodo, label: 'Tasks' },
  { to: '/app/qa', icon: ShieldCheck, label: 'QA Review' },
  { to: '/app/agents', icon: Bot, label: 'Agents' },
  { to: '/app/billing', icon: CreditCard, label: 'Billing' },
  { to: '/app/settings', icon: Settings, label: 'Settings' },
]

export default function AdminApp() {
  return (
    <div className="flex h-screen bg-[#0D0D12] text-white">
      {/* Sidebar */}
      <aside className="w-64 border-r border-white/5 flex flex-col">
        <div className="p-6 flex items-center gap-3">
          <div className="w-8 h-8 rounded-lg bg-[#C0C0C0]/10 flex items-center justify-center">
            <Zap className="w-4 h-4 text-[#C0C0C0]" />
          </div>
          <div>
            <h1 className="text-sm font-semibold tracking-tight">My-Agentcy</h1>
            <p className="text-[10px] text-white/30 uppercase tracking-widest">AI Workforce</p>
          </div>
        </div>

        <nav className="flex-1 px-3 py-4 space-y-1">
          {navItems.map(({ to, icon: Icon, label }) => (
            <NavLink
              key={to}
              to={to}
              end={to === '/app/dashboard'}
              className={({ isActive }) =>
                `flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm transition-colors ${
                  isActive
                    ? 'bg-white/5 text-white'
                    : 'text-white/40 hover:text-white/70 hover:bg-white/[0.02]'
                }`
              }
            >
              <Icon className="w-4 h-4" />
              <span>{label}</span>
              <ChevronRight className="w-3 h-3 ml-auto opacity-0 group-hover:opacity-50" />
            </NavLink>
          ))}
        </nav>

        <div className="p-4 border-t border-white/5">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-full bg-[#C0C0C0]/10 flex items-center justify-center text-xs font-medium text-[#C0C0C0]">
              MK
            </div>
            <div>
              <p className="text-xs font-medium">Michael Kidd</p>
              <p className="text-[10px] text-white/30">Agentcy.co.za</p>
            </div>
          </div>
        </div>
      </aside>

      {/* Main */}
      <main className="flex-1 overflow-auto">
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="p-8">
          <Routes>
            <Route path="dashboard" element={<Dashboard />} />
            <Route path="tasks" element={<Tasks />} />
            <Route path="qa" element={<QAReview />} />
            <Route path="agents" element={<Agents />} />
            <Route path="billing" element={<Billing />} />
            <Route path="settings" element={<SettingsPage />} />
            <Route path="*" element={<Navigate to="dashboard" replace />} />
          </Routes>
        </motion.div>
      </main>
    </div>
  )
}
