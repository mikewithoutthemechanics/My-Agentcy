/**
 * Client Portal — separate route group for clients
 * Clients see their tasks, deliverables, and can give feedback.
 * NOT the admin dashboard — simplified, client-friendly UI.
 */

import { BrowserRouter, Routes, Route, NavLink, Navigate } from 'react-router-dom'
import {
  LayoutDashboard,
  ListTodo,
  MessageSquare,
  BarChart3,
  Settings,
  LogOut,
  Zap,
  Plus,
} from 'lucide-react'

// Client pages
import ClientDashboard from './pages/client/Dashboard'
import ClientTasks from './pages/client/Tasks'
import ClientTaskDetail from './pages/client/TaskDetail'
import ClientFeedback from './pages/client/Feedback'
import ClientAnalytics from './pages/client/Analytics'
import ClientSettings from './pages/client/Settings'

const navItems = [
  { to: '/dashboard', icon: LayoutDashboard, label: 'Overview' },
  { to: '/tasks', icon: ListTodo, label: 'My Tasks' },
  { to: '/feedback', icon: MessageSquare, label: 'Feedback' },
  { to: '/analytics', icon: BarChart3, label: 'Analytics' },
  { to: '/settings', icon: Settings, label: 'Settings' },
]

export default function ClientPortal() {
  return (
    <BrowserRouter>
      <div className="flex h-screen bg-[#FAFAF8] text-[#1A1A2E]">
        {/* Sidebar */}
        <aside className="w-60 bg-white border-r border-gray-100 flex flex-col">
          {/* Logo */}
          <div className="p-6 flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-[#1A1A2E] flex items-center justify-center">
              <Zap className="w-4 h-4 text-[#FF6B6B]" />
            </div>
            <div>
              <h1 className="text-sm font-semibold tracking-tight" style={{ fontFamily: 'Francy Regular, sans-serif' }}>My-Agentcy</h1>
              <p className="text-[10px] text-gray-400 uppercase tracking-widest">Client Portal</p>
            </div>
          </div>

          {/* New Task CTA */}
          <div className="px-4 mb-4">
            <NavLink
              to="/tasks?new=true"
              className="flex items-center justify-center gap-2 w-full py-2.5 rounded-lg bg-[#1A1A2E] text-white text-sm font-medium hover:bg-[#2D2D44] transition-colors"
            >
              <Plus className="w-4 h-4" /> New Task
            </NavLink>
          </div>

          {/* Nav */}
          <nav className="flex-1 px-3 space-y-1">
            {navItems.map(({ to, icon: Icon, label }) => (
              <NavLink
                key={to}
                to={to}
                className={({ isActive }) =>
                  `flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm transition-colors ${
                    isActive
                      ? 'bg-[#1A1A2E]/5 text-[#1A1A2E] font-medium'
                      : 'text-gray-400 hover:text-gray-600 hover:bg-gray-50'
                  }`
                }
              >
                <Icon className="w-4 h-4" />
                <span>{label}</span>
              </NavLink>
            ))}
          </nav>

          {/* User */}
          <div className="p-4 border-t border-gray-100">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-full bg-[#FF6B6B]/10 flex items-center justify-center text-xs font-medium text-[#FF6B6B]">
                AC
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium truncate">Acme Corp</p>
                <p className="text-[10px] text-gray-400">Pro Plan</p>
              </div>
              <LogOut className="w-4 h-4 text-gray-300 hover:text-gray-500 cursor-pointer" />
            </div>
          </div>
        </aside>

        {/* Main */}
        <main className="flex-1 overflow-auto">
          <div className="p-8 max-w-6xl mx-auto">
            <Routes>
              <Route path="/" element={<Navigate to="/dashboard" replace />} />
              <Route path="/dashboard" element={<ClientDashboard />} />
              <Route path="/tasks" element={<ClientTasks />} />
              <Route path="/tasks/:taskId" element={<ClientTaskDetail />} />
              <Route path="/feedback" element={<ClientFeedback />} />
              <Route path="/analytics" element={<ClientAnalytics />} />
              <Route path="/settings" element={<ClientSettings />} />
            </Routes>
          </div>
        </main>
      </div>
    </BrowserRouter>
  )
}
