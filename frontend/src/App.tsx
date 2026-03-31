import { Routes, Route, Navigate, Link, useNavigate, BrowserRouter } from 'react-router-dom'
import { useState } from 'react'
import { motion } from 'framer-motion'
import { Zap, ArrowRight, Shield, Bot, Clock, CheckCircle2, Menu, X, Eye, EyeOff } from 'lucide-react'

const ease = [0.16, 1, 0.3, 1] as const

// ═══════════════════════════════════════════════════════
// LANDING PAGE
// ═══════════════════════════════════════════════════════

function Landing() {
  const [menuOpen, setMenuOpen] = useState(false)

  return (
    <div className="min-h-screen bg-[#0D0D12] text-white overflow-x-hidden">
      {/* Nav */}
      <nav className="fixed top-0 left-0 right-0 z-50 px-6 md:px-10 py-5 flex items-center justify-between max-w-7xl mx-auto">
        <Link to="/" className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-lg bg-[#C0C0C0]/10 flex items-center justify-center">
            <Zap className="w-4 h-4 text-[#C0C0C0]" />
          </div>
          <span className="text-lg font-bold tracking-tight">My-Agentcy</span>
        </Link>
        <div className="hidden md:flex items-center gap-8 text-sm text-white/40">
          <a href="#features" className="hover:text-white transition-colors">Features</a>
          <a href="#pricing" className="hover:text-white transition-colors">Pricing</a>
          <a href="#how" className="hover:text-white transition-colors">How it works</a>
        </div>
        <div className="flex items-center gap-3">
          <Link to="/auth/login" className="text-sm text-white/40 hover:text-white transition-colors hidden sm:block">Sign in</Link>
          <Link to="/auth/signup" className="px-5 py-2.5 rounded-full bg-[#C0C0C0] text-black text-sm font-semibold hover:bg-[#D4D4D4] transition-colors">
            Get started
          </Link>
          <button onClick={() => setMenuOpen(!menuOpen)} className="md:hidden text-white/40">
            {menuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </nav>

      {/* Mobile menu */}
      {menuOpen && (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="fixed inset-0 z-40 bg-[#0D0D12] flex flex-col items-center justify-center gap-8 md:hidden">
          <a href="#features" onClick={() => setMenuOpen(false)} className="text-2xl font-semibold text-white/60 hover:text-white">Features</a>
          <a href="#pricing" onClick={() => setMenuOpen(false)} className="text-2xl font-semibold text-white/60 hover:text-white">Pricing</a>
          <a href="#how" onClick={() => setMenuOpen(false)} className="text-2xl font-semibold text-white/60 hover:text-white">How it works</a>
          <Link to="/auth/signup" className="px-8 py-4 rounded-full bg-[#C0C0C0] text-black text-lg font-semibold">Get started</Link>
        </motion.div>
      )}

      {/* Hero */}
      <section className="pt-32 pb-20 md:pt-44 md:pb-32 px-6 md:px-10 relative">
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[500px] rounded-full opacity-[0.04]" style={{ background: 'radial-gradient(ellipse, #C0C0C0, transparent 70%)' }} />
        </div>
        <div className="relative max-w-5xl mx-auto text-center">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8, ease }} className="mb-6">
            <span className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-white/5 border border-white/10 text-[10px] uppercase tracking-widest text-white/40">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" /> Now accepting clients
            </span>
          </motion.div>
          <motion.h1
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1, duration: 0.8, ease }}
            className="text-[clamp(2.5rem,8vw,5.5rem)] font-bold tracking-tighter leading-[0.9] mb-6"
          >
            Your AI team,<br />
            <span className="text-[#C0C0C0]">reviewed & guaranteed.</span>
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2, duration: 0.8, ease }}
            className="text-white/40 text-lg md:text-xl max-w-2xl mx-auto leading-relaxed mb-10"
          >
            AI agent teams that deliver real work — reports, analysis, code, content. Every deliverable reviewed. Every client satisfied.
          </motion.p>
          <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }} className="flex flex-wrap justify-center gap-4">
            <Link to="/auth/signup" className="group px-7 py-4 rounded-full bg-[#C0C0C0] text-black text-sm font-semibold flex items-center gap-2 hover:bg-[#D4D4D4] transition-colors">
              Start free <ArrowRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
            </Link>
            <a href="#how" className="px-7 py-4 rounded-full border border-white/10 text-sm text-white/50 hover:text-white hover:border-white/20 transition-colors">
              See how it works
            </a>
          </motion.div>
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.5 }} className="mt-12 flex items-center justify-center gap-6 text-white/30 text-xs">
            <div className="flex -space-x-2">
              {['bg-blue-500', 'bg-emerald-500', 'bg-violet-500', 'bg-rose-500'].map((c, i) => (
                <div key={i} className={`w-7 h-7 rounded-full ${c} border-2 border-[#0D0D12]`} />
              ))}
            </div>
            <span>50+ businesses trust My-Agentcy</span>
          </motion.div>
        </div>
      </section>

      {/* Features */}
      <section id="features" className="py-20 px-6 md:px-10">
        <div className="max-w-7xl mx-auto">
          <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="text-center mb-16">
            <h2 className="text-3xl md:text-5xl font-bold tracking-tight mb-4">How it's different</h2>
            <p className="text-white/30 max-w-lg mx-auto">Not just AI. AI with quality assurance.</p>
          </motion.div>
          <div className="grid md:grid-cols-3 gap-6">
            {[
              { icon: Bot, title: 'AI Agent Teams', desc: 'Specialized agents handle research, building, writing, and analysis. Each with deep expertise in their domain.' },
              { icon: Shield, title: 'Quality Guaranteed', desc: 'Every deliverable passes through automated QA scoring. Complex tasks get human review. No guesswork.' },
              { icon: Clock, title: 'Fast Turnaround', desc: 'Most tasks completed in 4-12 hours. Not days or weeks. Your AI team works 24/7.' },
            ].map((f, i) => (
              <motion.div key={f.title} initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.1 }}
                className="p-8 rounded-2xl bg-white/[0.02] border border-white/5 hover:border-white/10 transition-colors"
              >
                <div className="w-12 h-12 rounded-xl bg-[#C0C0C0]/10 flex items-center justify-center mb-5">
                  <f.icon className="w-5 h-5 text-[#C0C0C0]" />
                </div>
                <h3 className="text-lg font-semibold mb-2">{f.title}</h3>
                <p className="text-white/30 text-sm leading-relaxed">{f.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* How it works */}
      <section id="how" className="py-20 px-6 md:px-10 bg-white/[0.01]">
        <div className="max-w-5xl mx-auto">
          <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="text-center mb-16">
            <h2 className="text-3xl md:text-5xl font-bold tracking-tight mb-4">How it works</h2>
            <p className="text-white/30">Four steps from brief to delivery.</p>
          </motion.div>
          <div className="grid md:grid-cols-4 gap-6">
            {[
              { step: '01', title: 'Submit', desc: 'Describe what you need. Attach files. Set a deadline.' },
              { step: '02', title: 'AI Works', desc: 'Agent team researches, builds, and creates your deliverable.' },
              { step: '03', title: 'QA Review', desc: 'Automated scoring + human review for complex tasks.' },
              { step: '04', title: 'Deliver', desc: 'Polished output delivered. Approve or request revisions.' },
            ].map((s, i) => (
              <motion.div key={s.step} initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.1 }}
                className="text-center"
              >
                <span className="text-4xl font-bold text-white/10 block mb-3">{s.step}</span>
                <h3 className="text-lg font-semibold mb-2">{s.title}</h3>
                <p className="text-white/30 text-sm">{s.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Pricing */}
      <section id="pricing" className="py-20 px-6 md:px-10">
        <div className="max-w-5xl mx-auto">
          <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="text-center mb-16">
            <h2 className="text-3xl md:text-5xl font-bold tracking-tight mb-4">Simple pricing</h2>
            <p className="text-white/30">No hidden fees. Cancel anytime.</p>
          </motion.div>
          <div className="grid md:grid-cols-3 gap-6">
            {[
              { name: 'Starter', price: 'R2,999', period: '/month', features: ['20 tasks/month', 'Automated + spot-check QA', 'Reports, analysis, content', '24-hour turnaround', 'Email support'], cta: 'Start free' },
              { name: 'Pro', price: 'R7,999', period: '/month', featured: true, features: ['80 tasks/month', 'Full human review included', 'All task types', '12-hour turnaround', 'Priority queue', 'Slack & WhatsApp', 'Dedicated account manager'], cta: 'Start free' },
              { name: 'Enterprise', price: 'Custom', period: '', features: ['Unlimited tasks', 'Senior review + sign-off', 'Custom agent training', '4-hour turnaround', 'API access', 'SSO & audit logs', 'SLA guarantee'], cta: 'Contact us' },
            ].map((plan, i) => (
              <motion.div key={plan.name} initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.1 }}
                className={`p-8 rounded-2xl border ${plan.featured ? 'bg-[#C0C0C0]/5 border-[#C0C0C0]/20' : 'bg-white/[0.02] border-white/5'}`}
              >
                {plan.featured && <span className="text-[10px] uppercase tracking-widest text-[#C0C0C0] font-semibold mb-4 block">Most popular</span>}
                <h3 className="text-lg font-semibold mb-1">{plan.name}</h3>
                <div className="flex items-baseline gap-1 mb-6">
                  <span className="text-4xl font-bold">{plan.price}</span>
                  <span className="text-white/30 text-sm">{plan.period}</span>
                </div>
                <ul className="space-y-3 mb-8">
                  {plan.features.map(f => (
                    <li key={f} className="flex items-center gap-2 text-sm text-white/50">
                      <CheckCircle2 className="w-4 h-4 text-[#C0C0C0]/50 shrink-0" /> {f}
                    </li>
                  ))}
                </ul>
                <Link to="/auth/signup" className={`block text-center py-3 rounded-full text-sm font-semibold transition-colors ${plan.featured ? 'bg-[#C0C0C0] text-black hover:bg-[#D4D4D4]' : 'bg-white/5 text-white/60 hover:bg-white/10'}`}>
                  {plan.cta}
                </Link>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-20 px-6 md:px-10">
        <div className="max-w-3xl mx-auto text-center">
          <h2 className="text-3xl md:text-5xl font-bold tracking-tight mb-4">Ready to scale?</h2>
          <p className="text-white/30 text-lg mb-8">Your AI team is waiting. Start with a free task today.</p>
          <Link to="/auth/signup" className="inline-flex items-center gap-2 px-8 py-4 rounded-full bg-[#C0C0C0] text-black text-sm font-semibold hover:bg-[#D4D4D4] transition-colors">
            Get started free <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-white/5 py-10 px-6 md:px-10">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <Zap className="w-4 h-4 text-[#C0C0C0]/50" />
            <span className="text-sm text-white/30">My-Agentcy by Agentcy.co.za</span>
          </div>
          <p className="text-xs text-white/20">Leaders in Software. Experts in Intelligence.</p>
        </div>
      </footer>
    </div>
  )
}


// ═══════════════════════════════════════════════════════
// AUTH PAGES
// ═══════════════════════════════════════════════════════

function LoginPage() {
  const navigate = useNavigate()
  const [showPassword, setShowPassword] = useState(false)

  return (
    <div className="min-h-screen bg-[#0D0D12] flex items-center justify-center px-6">
      <div className="w-full max-w-sm">
        <Link to="/" className="flex items-center gap-2.5 justify-center mb-10">
          <div className="w-8 h-8 rounded-lg bg-[#C0C0C0]/10 flex items-center justify-center">
            <Zap className="w-4 h-4 text-[#C0C0C0]" />
          </div>
          <span className="text-lg font-bold tracking-tight">My-Agentcy</span>
        </Link>

        <h1 className="text-2xl font-bold tracking-tight text-center mb-2">Welcome back</h1>
        <p className="text-white/30 text-sm text-center mb-8">Sign in to your account</p>

        <div className="space-y-4">
          <div>
            <label className="text-[10px] text-white/30 uppercase tracking-wider block mb-1.5">Email</label>
            <input type="email" className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-sm text-white placeholder:text-white/20 focus:border-[#C0C0C0]/30 transition-colors" placeholder="you@company.com" />
          </div>
          <div>
            <label className="text-[10px] text-white/30 uppercase tracking-wider block mb-1.5">Password</label>
            <div className="relative">
              <input type={showPassword ? 'text' : 'password'} className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-sm text-white placeholder:text-white/20 focus:border-[#C0C0C0]/30 transition-colors pr-10" placeholder="••••••••" />
              <button onClick={() => setShowPassword(!showPassword)} className="absolute right-3 top-1/2 -translate-y-1/2 text-white/20 hover:text-white/40">
                {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>
          </div>
          <button onClick={() => navigate('/app/dashboard')} className="w-full py-3 rounded-xl bg-[#C0C0C0] text-black text-sm font-semibold hover:bg-[#D4D4D4] transition-colors">
            Sign in
          </button>
        </div>

        <p className="text-center text-sm text-white/30 mt-6">
          Don't have an account? <Link to="/auth/signup" className="text-[#C0C0C0] hover:underline">Sign up</Link>
        </p>
      </div>
    </div>
  )
}

function SignupPage() {
  const navigate = useNavigate()
  const [showPassword, setShowPassword] = useState(false)

  return (
    <div className="min-h-screen bg-[#0D0D12] flex items-center justify-center px-6">
      <div className="w-full max-w-sm">
        <Link to="/" className="flex items-center gap-2.5 justify-center mb-10">
          <div className="w-8 h-8 rounded-lg bg-[#C0C0C0]/10 flex items-center justify-center">
            <Zap className="w-4 h-4 text-[#C0C0C0]" />
          </div>
          <span className="text-lg font-bold tracking-tight">My-Agentcy</span>
        </Link>

        <h1 className="text-2xl font-bold tracking-tight text-center mb-2">Create your account</h1>
        <p className="text-white/30 text-sm text-center mb-8">Start with a free task today</p>

        <div className="space-y-4">
          <div>
            <label className="text-[10px] text-white/30 uppercase tracking-wider block mb-1.5">Company name</label>
            <input className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-sm text-white placeholder:text-white/20 focus:border-[#C0C0C0]/30 transition-colors" placeholder="Acme Corp" />
          </div>
          <div>
            <label className="text-[10px] text-white/30 uppercase tracking-wider block mb-1.5">Email</label>
            <input type="email" className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-sm text-white placeholder:text-white/20 focus:border-[#C0C0C0]/30 transition-colors" placeholder="you@company.com" />
          </div>
          <div>
            <label className="text-[10px] text-white/30 uppercase tracking-wider block mb-1.5">Password</label>
            <div className="relative">
              <input type={showPassword ? 'text' : 'password'} className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-sm text-white placeholder:text-white/20 focus:border-[#C0C0C0]/30 transition-colors pr-10" placeholder="••••••••" />
              <button onClick={() => setShowPassword(!showPassword)} className="absolute right-3 top-1/2 -translate-y-1/2 text-white/20 hover:text-white/40">
                {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>
          </div>
          <div>
            <label className="text-[10px] text-white/30 uppercase tracking-wider block mb-1.5">Plan</label>
            <select className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-sm text-white focus:border-[#C0C0C0]/30 transition-colors">
              <option value="starter">Starter — R2,999/month</option>
              <option value="pro">Pro — R7,999/month</option>
              <option value="enterprise">Enterprise — Custom</option>
            </select>
          </div>
          <button onClick={() => navigate('/app/dashboard')} className="w-full py-3 rounded-xl bg-[#C0C0C0] text-black text-sm font-semibold hover:bg-[#D4D4D4] transition-colors">
            Create account
          </button>
        </div>

        <p className="text-center text-sm text-white/30 mt-6">
          Already have an account? <Link to="/auth/login" className="text-[#C0C0C0] hover:underline">Sign in</Link>
        </p>
      </div>
    </div>
  )
}


// ═══════════════════════════════════════════════════════
// MAIN APP ROUTER
// ═══════════════════════════════════════════════════════

import AdminApp from './AdminApp'

export default function AppRouter() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Marketing */}
        <Route path="/" element={<Landing />} />

        {/* Auth */}
        <Route path="/auth/login" element={<LoginPage />} />
        <Route path="/auth/signup" element={<SignupPage />} />

        {/* App */}
        <Route path="/app/*" element={<AdminApp />} />

        {/* Catch all */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  )
}
