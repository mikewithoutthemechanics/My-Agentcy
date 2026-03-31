import { Routes, Route, Navigate, Link, useNavigate, BrowserRouter } from 'react-router-dom'
import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { Zap, ArrowRight, Shield, Bot, Clock, CheckCircle2, Play, Star, Sparkles, Eye, EyeOff } from 'lucide-react'
import AdminApp from './AdminApp'

const ease = [0.16, 1, 0.3, 1] as const

// ═══════════════════════════════════════════════════════
// LANDING PAGE — Premium design
// ═══════════════════════════════════════════════════════

function Landing() {
  const [scroll, setScroll] = useState(0)

  useEffect(() => {
    const onScroll = () => setScroll(window.scrollY)
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  return (
    <div className="min-h-screen bg-[#FAFAF8] text-[#1A1A2E] overflow-x-hidden">

      {/* ── NAV ─────────────────────────────────────── */}
      <nav className="fixed top-0 left-0 right-0 z-50 transition-all duration-300"
        style={{
          backgroundColor: scroll > 60 ? 'rgba(250,250,248,0.92)' : 'transparent',
          backdropFilter: scroll > 60 ? 'blur(20px)' : 'none',
          borderBottom: scroll > 60 ? '1px solid rgba(0,0,0,0.06)' : '1px solid transparent',
        }}
      >
        <div className="max-w-[1200px] mx-auto flex items-center justify-between px-6 lg:px-10 h-[72px]">
          <Link to="/" className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg flex items-center justify-center" style={{ background: '#1A1A2E' }}>
              <Zap className="w-4 h-4 text-[#FF6B6B]" />
            </div>
            <span className="text-[17px] font-bold tracking-tight" style={{ fontFamily: "'General Sans', 'Inter', sans-serif" }}>My-Agentcy</span>
          </Link>

          <div className="hidden md:flex items-center gap-7 text-[14px]" style={{ color: '#6B6B6B', fontFamily: "'General Sans', 'Inter', sans-serif" }}>
            {['How it works', 'Features', 'Pricing'].map(t => (
              <a key={t} href={`#${t.toLowerCase().replace(/ /g, '-')}`}
                className="hover:text-black transition-colors cursor-pointer"
              >{t}</a>
            ))}
          </div>

          <div className="flex items-center gap-4">
            <Link to="/auth/login" className="text-[14px] hidden sm:block" style={{ color: '#6B6B6B' }}>Sign in</Link>
            <Link to="/auth/signup"
              className="px-5 py-2.5 rounded-full text-[13px] font-semibold text-white transition-all hover:shadow-lg hover:shadow-black/10"
              style={{ backgroundColor: '#1A1A2E' }}
            >Start free →</Link>
          </div>
        </div>
      </nav>

      {/* ── HERO ────────────────────────────────────── */}
      <section className="relative min-h-screen flex flex-col items-center justify-center overflow-hidden" style={{ backgroundColor: '#1A1A2E' }}>
        {/* Video Background */}
        <div className="absolute inset-0 z-0 overflow-hidden">
          <video
            autoPlay muted loop playsInline
            className="absolute inset-0 w-full h-full object-cover"
            style={{ objectPosition: 'center 40%', filter: 'brightness(0.4) contrast(1.1)' }}
            poster="data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='1920' height='1080'%3E%3Crect fill='%231A1A2E' width='1920' height='1080'/%3E%3C/svg%3E"
          >
            <source src="https://videos.pexels.com/video-files/8468477/8468477-uhd_2560_1440_25fps.mp4" type="video/mp4" />
          </video>
          {/* Gradient overlays */}
          <div className="absolute inset-0" style={{ background: 'linear-gradient(180deg, rgba(26,26,46,0.7) 0%, rgba(26,26,46,0.4) 50%, rgba(26,26,46,0.9) 100%)' }} />
          <div className="absolute bottom-0 left-0 right-0 h-32" style={{ background: 'linear-gradient(to top, #1A1A2E, transparent)' }} />
        </div>

        {/* Content */}
        <div className="relative z-10 text-center px-6 max-w-5xl mx-auto">
          {/* Badge */}
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2, duration: 0.6 }} className="mb-8">
            <span className="inline-flex items-center gap-2 px-4 py-2 rounded-full text-[11px] font-medium uppercase tracking-widest"
              style={{ background: 'rgba(255,107,107,0.1)', color: '#FF6B6B', border: '1px solid rgba(255,107,107,0.2)' }}>
              <span className="w-1.5 h-1.5 rounded-full bg-[#FF6B6B] animate-pulse" />
              Now accepting clients
            </span>
          </motion.div>

          {/* Headline */}
          <motion.h1
            initial={{ opacity: 0, y: 40, filter: 'blur(8px)' }}
            animate={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
            transition={{ delay: 0.3, duration: 1, ease }}
            className="text-[clamp(3rem,10vw,7rem)] leading-[0.9] tracking-tighter font-bold text-white mb-6"
            style={{ fontFamily: "'Francy Regular', 'General Sans', sans-serif" }}
          >
            Your AI team,<br />
            <span style={{ color: '#FF6B6B' }}>reviewed &<br />guaranteed.</span>
          </motion.h1>

          {/* Subtitle */}
          <motion.p
            initial={{ opacity: 0, y: 20, filter: 'blur(4px)' }}
            animate={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
            transition={{ delay: 0.5, duration: 0.8, ease }}
            className="text-white/50 text-lg md:text-xl max-w-xl mx-auto leading-relaxed mb-10"
          >
            AI agent teams that deliver real work.<br />
            Every deliverable quality-assured.
          </motion.p>

          {/* CTAs */}
          <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.7 }} className="flex flex-wrap justify-center gap-4">
            <Link to="/auth/signup" className="group px-8 py-4 rounded-full bg-[#FF6B6B] text-white text-[15px] font-semibold flex items-center gap-2 hover:bg-[#FF5252] transition-all hover:shadow-xl hover:shadow-[#FF6B6B]/20 hover:-translate-y-0.5">
              Start free, no card needed
              <ArrowRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
            </Link>
            <a href="#how-it-works" className="px-8 py-4 rounded-full text-[15px] font-medium text-white/60 flex items-center gap-2 hover:text-white transition-colors" style={{ border: '1.5px solid rgba(255,255,255,0.15)' }}>
              <Play className="w-4 h-4" /> See how it works
            </a>
          </motion.div>

          {/* Social proof */}
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.9 }} className="mt-14 flex items-center justify-center gap-6 flex-wrap">
            <div className="flex -space-x-2">
              {['#4A7C28', '#D4451A', '#2D5016', '#E86840'].map((bg, i) => (
                <div key={i} className="w-8 h-8 rounded-full flex items-center justify-center text-[10px] font-bold text-white border-2" style={{ backgroundColor: bg, borderColor: '#1A1A2E' }}>
                  {['SJ', 'MS', 'EW', 'LD'][i]}
                </div>
              ))}
            </div>
            <div className="h-5 w-px bg-white/10" />
            <div>
              <div className="flex gap-0.5">{[...Array(5)].map((_, i) => <Star key={i} className="w-3.5 h-3.5" style={{ color: '#FF6B6B', fill: '#FF6B6B' }} />)}</div>
              <p className="text-[12px] mt-0.5 text-white/30">50+ businesses across South Africa</p>
            </div>
          </motion.div>
        </div>

        {/* Scroll hint */}
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 1.2 }} className="absolute bottom-8 left-1/2 -translate-x-1/2 text-white/20 text-xs tracking-widest uppercase">
          Scroll to explore
        </motion.div>
      </section>

      {/* ── STATS BAR ───────────────────────────────── */}
      <section className="py-16 px-6 md:px-10 bg-white border-b" style={{ borderColor: '#E5E5E5' }}>
        <div className="max-w-7xl mx-auto grid grid-cols-2 md:grid-cols-4 gap-8">
          {[
            { value: '847', label: 'Tasks completed', suffix: '+' },
            { value: '94%', label: 'QA pass rate', suffix: '' },
            { value: '4.2h', label: 'Avg turnaround', suffix: '' },
            { value: '4.7', label: 'Client rating', suffix: '★' },
          ].map((s, i) => (
            <motion.div key={s.label} initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.1 }} className="text-center">
              <p className="text-4xl md:text-5xl font-bold tracking-tight" style={{ fontFamily: "'Francy Regular', 'General Sans', sans-serif" }}>
                {s.value}<span className="text-[#FF6B6B]">{s.suffix}</span>
              </p>
              <p className="text-[13px] mt-2" style={{ color: '#8A8A8A' }}>{s.label}</p>
            </motion.div>
          ))}
        </div>
      </section>

      {/* ── HOW IT WORKS ────────────────────────────── */}
      <section id="how-it-works" className="py-24 px-6 md:px-10">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <motion.span initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} viewport={{ once: true }} className="text-[10px] font-semibold uppercase tracking-[0.3em] block mb-3" style={{ color: '#8A8A8A' }}>
              The process
            </motion.span>
            <motion.h2 initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="text-[clamp(2.5rem,6vw,4.5rem)] font-bold tracking-tighter leading-[0.95]"
              style={{ fontFamily: "'Francy Regular', 'General Sans', sans-serif" }}>
              How it <span style={{ color: '#FF6B6B' }}>works</span>
            </motion.h2>
          </div>

          <div className="grid md:grid-cols-4 gap-8">
            {[
              { step: '01', title: 'Submit', desc: 'Describe what you need. Set a deadline. Attach files.', icon: Sparkles },
              { step: '02', title: 'AI Builds', desc: 'Specialized agents research, create, and produce your deliverable.', icon: Bot },
              { step: '03', title: 'QA Review', desc: 'Automated scoring + human review. Every output quality-checked.', icon: Shield },
              { step: '04', title: 'Deliver', desc: 'Polished work delivered. Approve or request unlimited revisions.', icon: CheckCircle2 },
            ].map((s, i) => (
              <motion.div key={s.step} initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.1, duration: 0.6 }}
                className="relative group"
              >
                <div className="aspect-square rounded-3xl overflow-hidden relative mb-6" style={{ background: 'linear-gradient(145deg, #f0f0ee, #e8e8e6)' }}>
                  <div className="absolute inset-0 flex items-center justify-center">
                    <s.icon className="w-12 h-12" style={{ color: '#1A1A2E', opacity: 0.15 }} />
                  </div>
                  <div className="absolute top-5 left-5">
                    <span className="text-6xl font-bold tracking-tighter" style={{ color: '#1A1A2E', opacity: 0.06, fontFamily: "'Francy Regular', 'General Sans', sans-serif" }}>{s.step}</span>
                  </div>
                </div>
                <h3 className="text-xl font-bold mb-2" style={{ fontFamily: "'General Sans', 'Inter', sans-serif" }}>{s.title}</h3>
                <p className="text-[14px] leading-relaxed" style={{ color: '#6B6B6B' }}>{s.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ── FEATURES ────────────────────────────────── */}
      <section id="features" className="py-24 px-6 md:px-10" style={{ backgroundColor: '#1A1A2E' }}>
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <motion.span initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} viewport={{ once: true }} className="text-[10px] font-semibold uppercase tracking-[0.3em] block mb-3 text-white/30">
              The difference
            </motion.span>
            <motion.h2 initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="text-[clamp(2.5rem,6vw,4.5rem)] font-bold tracking-tighter leading-[0.95] text-white"
              style={{ fontFamily: "'Francy Regular', 'General Sans', sans-serif" }}>
              Not just AI.<br /><span style={{ color: '#FF6B6B' }}>Guaranteed quality.</span>
            </motion.h2>
          </div>

          <div className="grid md:grid-cols-3 gap-6">
            {[
              { icon: Bot, title: 'AI Agent Teams', desc: 'Specialized agents for research, analysis, code, and content. Each with deep domain expertise and custom tools.' },
              { icon: Shield, title: 'Quality Assured', desc: 'Every deliverable passes automated QA scoring. Complex tasks get human review. No raw AI output — ever.' },
              { icon: Clock, title: 'Fast & Reliable', desc: 'Most tasks done in 4-12 hours. Not days. Your AI team works around the clock, rain or shine.' },
            ].map((f, i) => (
              <motion.div key={f.title} initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.1 }}
                className="p-8 rounded-2xl border border-white/5 hover:border-white/10 transition-all group"
                style={{ background: 'linear-gradient(145deg, rgba(255,255,255,0.03), rgba(255,255,255,0.01))' }}
              >
                <div className="w-12 h-12 rounded-xl flex items-center justify-center mb-5" style={{ background: 'rgba(255,107,107,0.1)' }}>
                  <f.icon className="w-5 h-5" style={{ color: '#FF6B6B' }} />
                </div>
                <h3 className="text-lg font-bold text-white mb-2">{f.title}</h3>
                <p className="text-white/40 text-[14px] leading-relaxed">{f.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ── DASHBOARD PREVIEW ──────────────────────── */}
      <section className="py-24 px-6 md:px-10">
        <div className="max-w-7xl mx-auto">
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            <div>
              <motion.span initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} viewport={{ once: true }} className="text-[10px] font-semibold uppercase tracking-[0.3em] block mb-3" style={{ color: '#8A8A8A' }}>
                Your command center
              </motion.span>
              <motion.h2 initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}
                className="text-[clamp(2rem,5vw,3.5rem)] font-bold tracking-tighter leading-[0.95] mb-6"
                style={{ fontFamily: "'Francy Regular', 'General Sans', sans-serif" }}>
                See everything.<br />Control everything.
              </motion.h2>
              <motion.p initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} viewport={{ once: true }} transition={{ delay: 0.2 }}
                className="text-[16px] leading-relaxed mb-8" style={{ color: '#6B6B6B' }}>
                Real-time dashboard showing active tasks, agent performance, QA scores, costs, and client satisfaction. Know exactly what your AI team is doing.
              </motion.p>
              <motion.div initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} viewport={{ once: true }} transition={{ delay: 0.3 }} className="space-y-3">
                {['Live task tracking with progress bars', 'Agent performance & cost analytics', 'QA pipeline with automated scoring', 'Client feedback & satisfaction metrics'].map(item => (
                  <div key={item} className="flex items-center gap-3">
                    <CheckCircle2 className="w-4 h-4 shrink-0" style={{ color: '#4A7C28' }} />
                    <span className="text-[14px]" style={{ color: '#4A4A4A' }}>{item}</span>
                  </div>
                ))}
              </motion.div>
            </div>

            {/* Dashboard mockup */}
            <motion.div initial={{ opacity: 0, y: 40, scale: 0.96 }} whileInView={{ opacity: 1, y: 0, scale: 1 }} viewport={{ once: true }} transition={{ delay: 0.2, duration: 0.8, ease }}>
              <div className="rounded-2xl overflow-hidden shadow-2xl shadow-black/10" style={{ border: '1px solid #E5E5E5', backgroundColor: '#fff' }}>
                {/* Chrome bar */}
                <div className="flex items-center gap-2 px-4 h-10" style={{ backgroundColor: '#F7F7F5', borderBottom: '1px solid #E5E5E5' }}>
                  <div className="w-2.5 h-2.5 rounded-full" style={{ background: '#D4451A' }} />
                  <div className="w-2.5 h-2.5 rounded-full" style={{ background: '#F2CC8F' }} />
                  <div className="w-2.5 h-2.5 rounded-full" style={{ background: '#4A7C28' }} />
                  <div className="ml-3 flex-1 rounded-md h-5 flex items-center px-2.5" style={{ background: '#EEEEEC' }}>
                    <span className="text-[10px]" style={{ color: '#8A8A8A' }}>my-agentcy.vercel.app/app/dashboard</span>
                  </div>
                </div>
                <div className="p-5" style={{ background: '#0D0D12' }}>
                  <div className="grid grid-cols-3 gap-3 mb-4">
                    {[
                      { label: 'Active', value: '12', color: '#60A5FA' },
                      { label: 'QA Rate', value: '94%', color: '#4ADE80' },
                      { label: 'Revenue', value: '$847', color: '#FBBF24' },
                    ].map(c => (
                      <div key={c.label} className="rounded-xl p-3" style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.05)' }}>
                        <p className="text-[9px] uppercase tracking-wider mb-1" style={{ color: 'rgba(255,255,255,0.3)' }}>{c.label}</p>
                        <p className="text-xl font-bold text-white">{c.value}</p>
                      </div>
                    ))}
                  </div>
                  {/* Chart placeholder */}
                  <div className="rounded-xl h-20 flex items-end gap-1 px-3 pb-3" style={{ background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.05)' }}>
                    {[40, 55, 35, 70, 45, 80, 60, 90, 50, 85, 65, 95, 75, 88].map((h, i) => (
                      <div key={i} className="flex-1 rounded-sm" style={{ height: `${h}%`, background: h > 70 ? '#FF6B6B' : 'rgba(255,107,107,0.3)' }} />
                    ))}
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* ── PRICING ─────────────────────────────────── */}
      <section id="pricing" className="py-24 px-6 md:px-10" style={{ backgroundColor: '#F7F7F5' }}>
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-16">
            <motion.span initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} viewport={{ once: true }} className="text-[10px] font-semibold uppercase tracking-[0.3em] block mb-3" style={{ color: '#8A8A8A' }}>
              Simple pricing
            </motion.span>
            <motion.h2 initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}
              className="text-[clamp(2.5rem,6vw,4.5rem)] font-bold tracking-tighter leading-[0.95]"
              style={{ fontFamily: "'Francy Regular', 'General Sans', sans-serif" }}>
              Plans that <span style={{ color: '#FF6B6B' }}>scale</span>
            </motion.h2>
          </div>

          <div className="grid md:grid-cols-3 gap-6">
            {[
              { name: 'Starter', price: 'R499', period: '/month', features: ['20 tasks/month', 'Automated QA', '24-hour turnaround', 'Email support'], popular: false },
              { name: 'Pro', price: 'R7,999', period: '/month', features: ['80 tasks/month', 'Full human review', '12-hour turnaround', 'Priority queue', 'Slack & WhatsApp', 'Account manager'], popular: true },
              { name: 'Enterprise', price: 'Custom', period: '', features: ['Unlimited tasks', 'Senior review', '4-hour turnaround', 'API access', 'SSO & audit logs', 'SLA guarantee'], popular: false },
            ].map((plan, i) => (
              <motion.div key={plan.name} initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.1 }}
                className="rounded-3xl overflow-hidden" style={{
                  background: plan.popular ? '#1A1A2E' : '#fff',
                  border: plan.popular ? 'none' : '1px solid #E5E5E5',
                  color: plan.popular ? '#fff' : '#1A1A2E',
                }}
              >
                {plan.popular && <div className="px-8 pt-6 pb-0"><span className="text-[10px] uppercase tracking-widest font-semibold" style={{ color: '#FF6B6B' }}>Most popular</span></div>}
                <div className="p-8">
                  <h3 className="text-lg font-bold mb-4">{plan.name}</h3>
                  <div className="flex items-baseline gap-1 mb-6">
                    <span className="text-4xl font-bold tracking-tight" style={{ fontFamily: "'Francy Regular', 'General Sans', sans-serif" }}>{plan.price}</span>
                    <span style={{ color: plan.popular ? 'rgba(255,255,255,0.4)' : '#8A8A8A' }}>{plan.period}</span>
                  </div>
                  <ul className="space-y-3 mb-8">
                    {plan.features.map(f => (
                      <li key={f} className="flex items-center gap-2 text-[14px]" style={{ color: plan.popular ? 'rgba(255,255,255,0.6)' : '#6B6B6B' }}>
                        <CheckCircle2 className="w-4 h-4 shrink-0" style={{ color: plan.popular ? '#FF6B6B' : '#4A7C28' }} /> {f}
                      </li>
                    ))}
                  </ul>
                  <Link to="/auth/signup" className="block text-center py-3.5 rounded-full text-[14px] font-semibold transition-all"
                    style={{
                      background: plan.popular ? '#FF6B6B' : '#1A1A2E',
                      color: '#fff',
                    }}
                  >
                    {plan.price === 'Custom' ? 'Contact us' : 'Start free'}
                  </Link>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ── TESTIMONIALS ────────────────────────────── */}
      <section className="py-24 px-6 md:px-10">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <motion.h2 initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}
              className="text-[clamp(2.5rem,6vw,4.5rem)] font-bold tracking-tighter leading-[0.95]"
              style={{ fontFamily: "'Francy Regular', 'General Sans', sans-serif" }}>
              Loved by <span style={{ color: '#FF6B6B' }}>teams</span>
            </motion.h2>
          </div>

          <div className="grid md:grid-cols-3 gap-6">
            {[
              { quote: "We replaced our research analyst with My-Agentcy. Same quality, 10x faster, a fraction of the cost.", name: "Sarah J.", role: "CEO, TechFlow" },
              { quote: "The QA layer is what sold us. We tried raw AI tools before — garbage in, garbage out. My-Agentcy guarantees the output.", name: "Mike S.", role: "CTO, DataDriven" },
              { quote: "Our marketing team now produces 3x the content at half the budget. The ROI was immediate.", name: "Emma W.", role: "CMO, GrowthLabs" },
            ].map((t, i) => (
              <motion.div key={i} initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.1 }}
                className="p-8 rounded-2xl" style={{ background: '#F7F7F5', border: '1px solid #E5E5E5' }}
              >
                <div className="flex gap-0.5 mb-4">{[...Array(5)].map((_, j) => <Star key={j} className="w-4 h-4" style={{ color: '#FF6B6B', fill: '#FF6B6B' }} />)}</div>
                <p className="text-[15px] leading-relaxed mb-6" style={{ color: '#4A4A4A' }}>"{t.quote}"</p>
                <div>
                  <p className="text-sm font-semibold">{t.name}</p>
                  <p className="text-xs" style={{ color: '#8A8A8A' }}>{t.role}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ── CTA ─────────────────────────────────────── */}
      <section className="py-24 px-6 md:px-10" style={{ backgroundColor: '#1A1A2E' }}>
        <div className="max-w-3xl mx-auto text-center">
          <motion.h2 initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}
            className="text-[clamp(2.5rem,6vw,4.5rem)] font-bold tracking-tighter leading-[0.95] text-white mb-6"
            style={{ fontFamily: "'Francy Regular', 'General Sans', sans-serif" }}>
            Ready to scale?
          </motion.h2>
          <motion.p initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} viewport={{ once: true }} className="text-white/40 text-lg mb-10">
            Your AI team is waiting. Start with a free task today.
          </motion.p>
          <motion.div initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} viewport={{ once: true }}>
            <Link to="/auth/signup" className="inline-flex items-center gap-2 px-8 py-4 rounded-full bg-[#FF6B6B] text-white text-[15px] font-semibold hover:bg-[#FF5252] transition-all hover:shadow-xl hover:shadow-[#FF6B6B]/20">
              Get started free <ArrowRight className="w-4 h-4" />
            </Link>
          </motion.div>
        </div>
      </section>

      {/* ── FOOTER ──────────────────────────────────── */}
      <footer className="py-10 px-6 md:px-10" style={{ borderTop: '1px solid #E5E5E5' }}>
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <Zap className="w-4 h-4" style={{ color: '#8A8A8A' }} />
            <span className="text-sm" style={{ color: '#8A8A8A' }}>My-Agentcy by Agentcy.co.za</span>
          </div>
          <p className="text-xs" style={{ color: '#ABABAB' }}>Leaders in Software. Experts in Intelligence.</p>
        </div>
      </footer>
    </div>
  )
}


// ═══════════════════════════════════════════════════════
// AUTH PAGES — Matching the landing theme
// ═══════════════════════════════════════════════════════

function LoginPage() {
  const navigate = useNavigate()
  const [showPassword, setShowPassword] = useState(false)

  return (
    <div className="min-h-screen bg-[#FAFAF8] flex">
      {/* Left: Form */}
      <div className="flex-1 flex items-center justify-center px-6">
        <div className="w-full max-w-sm">
          <Link to="/" className="flex items-center gap-2.5 mb-10">
            <div className="w-8 h-8 rounded-lg flex items-center justify-center" style={{ background: '#1A1A2E' }}>
              <Zap className="w-4 h-4 text-[#FF6B6B]" />
            </div>
            <span className="text-lg font-bold tracking-tight">My-Agentcy</span>
          </Link>

          <h1 className="text-3xl font-bold tracking-tight mb-2" style={{ fontFamily: "'Francy Regular', 'General Sans', sans-serif" }}>Welcome back</h1>
          <p className="text-[#8A8A8A] text-sm mb-8">Sign in to your account</p>

          <div className="space-y-4">
            <div>
              <label className="text-[10px] text-[#8A8A8A] uppercase tracking-wider block mb-1.5">Email</label>
              <input type="email" className="w-full border rounded-xl px-4 py-3 text-sm focus:outline-none transition-colors" style={{ borderColor: '#E5E5E5' }} placeholder="you@company.com" />
            </div>
            <div>
              <label className="text-[10px] text-[#8A8A8A] uppercase tracking-wider block mb-1.5">Password</label>
              <div className="relative">
                <input type={showPassword ? 'text' : 'password'} className="w-full border rounded-xl px-4 py-3 text-sm pr-10 focus:outline-none transition-colors" style={{ borderColor: '#E5E5E5' }} placeholder="••••••••" />
                <button onClick={() => setShowPassword(!showPassword)} className="absolute right-3 top-1/2 -translate-y-1/2 text-[#ABABAB]">
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>
            <button onClick={() => navigate('/app/dashboard')} className="w-full py-3.5 rounded-xl bg-[#1A1A2E] text-white text-sm font-semibold hover:bg-[#2D2D44] transition-colors">
              Sign in
            </button>
          </div>

          <p className="text-center text-sm text-[#8A8A8A] mt-6">
            Don't have an account? <Link to="/auth/signup" className="text-[#1A1A2E] font-medium hover:underline">Sign up</Link>
          </p>
        </div>
      </div>

      {/* Right: Brand panel */}
      <div className="hidden lg:flex flex-1 items-center justify-center" style={{ background: '#1A1A2E' }}>
        <div className="max-w-md text-center px-10">
          <Zap className="w-12 h-12 text-[#FF6B6B] mx-auto mb-6" />
          <h2 className="text-3xl font-bold text-white mb-4" style={{ fontFamily: "'Francy Regular', 'General Sans', sans-serif" }}>
            Your AI team,<br />reviewed & guaranteed.
          </h2>
          <p className="text-white/40">AI agent teams that deliver real work. Every output quality-checked.</p>
        </div>
      </div>
    </div>
  )
}

function SignupPage() {
  const navigate = useNavigate()
  const [showPassword, setShowPassword] = useState(false)

  return (
    <div className="min-h-screen bg-[#FAFAF8] flex">
      <div className="flex-1 flex items-center justify-center px-6">
        <div className="w-full max-w-sm">
          <Link to="/" className="flex items-center gap-2.5 mb-10">
            <div className="w-8 h-8 rounded-lg flex items-center justify-center" style={{ background: '#1A1A2E' }}>
              <Zap className="w-4 h-4 text-[#FF6B6B]" />
            </div>
            <span className="text-lg font-bold tracking-tight">My-Agentcy</span>
          </Link>

          <h1 className="text-3xl font-bold tracking-tight mb-2" style={{ fontFamily: "'Francy Regular', 'General Sans', sans-serif" }}>Create your account</h1>
          <p className="text-[#8A8A8A] text-sm mb-8">Start with a free task today</p>

          <div className="space-y-4">
            <div>
              <label className="text-[10px] text-[#8A8A8A] uppercase tracking-wider block mb-1.5">Company name</label>
              <input className="w-full border rounded-xl px-4 py-3 text-sm focus:outline-none transition-colors" style={{ borderColor: '#E5E5E5' }} placeholder="Acme Corp" />
            </div>
            <div>
              <label className="text-[10px] text-[#8A8A8A] uppercase tracking-wider block mb-1.5">Email</label>
              <input type="email" className="w-full border rounded-xl px-4 py-3 text-sm focus:outline-none transition-colors" style={{ borderColor: '#E5E5E5' }} placeholder="you@company.com" />
            </div>
            <div>
              <label className="text-[10px] text-[#8A8A8A] uppercase tracking-wider block mb-1.5">Password</label>
              <div className="relative">
                <input type={showPassword ? 'text' : 'password'} className="w-full border rounded-xl px-4 py-3 text-sm pr-10 focus:outline-none transition-colors" style={{ borderColor: '#E5E5E5' }} placeholder="••••••••" />
                <button onClick={() => setShowPassword(!showPassword)} className="absolute right-3 top-1/2 -translate-y-1/2 text-[#ABABAB]">
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>
            <div>
              <label className="text-[10px] text-[#8A8A8A] uppercase tracking-wider block mb-1.5">Plan</label>
              <select className="w-full border rounded-xl px-4 py-3 text-sm focus:outline-none transition-colors" style={{ borderColor: '#E5E5E5' }}>
                <option>Starter — R499/month</option>
                <option>Pro — R7,999/month</option>
                <option>Enterprise — Custom</option>
              </select>
            </div>
            <button onClick={() => navigate('/app/dashboard')} className="w-full py-3.5 rounded-xl bg-[#1A1A2E] text-white text-sm font-semibold hover:bg-[#2D2D44] transition-colors">
              Create account
            </button>
          </div>

          <p className="text-center text-sm text-[#8A8A8A] mt-6">
            Already have an account? <Link to="/auth/login" className="text-[#1A1A2E] font-medium hover:underline">Sign in</Link>
          </p>
        </div>
      </div>

      <div className="hidden lg:flex flex-1 items-center justify-center" style={{ background: '#1A1A2E' }}>
        <div className="max-w-md text-center px-10">
          <Zap className="w-12 h-12 text-[#FF6B6B] mx-auto mb-6" />
          <h2 className="text-3xl font-bold text-white mb-4" style={{ fontFamily: "'Francy Regular', 'General Sans', sans-serif" }}>
            Join 50+ businesses<br />using AI teams.
          </h2>
          <p className="text-white/40">Reports, analysis, code, content — delivered and guaranteed.</p>
        </div>
      </div>
    </div>
  )
}


// ═══════════════════════════════════════════════════════
// MAIN ROUTER
// ═══════════════════════════════════════════════════════

export default function AppRouter() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Landing />} />
        <Route path="/auth/login" element={<LoginPage />} />
        <Route path="/auth/signup" element={<SignupPage />} />
        <Route path="/app/*" element={<AdminApp />} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  )
}
