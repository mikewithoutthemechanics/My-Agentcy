import { useEffect, useState, useRef, useMemo } from 'react'
import { motion, useScroll, useTransform, useInView, AnimatePresence } from 'framer-motion'
import { Link } from 'react-router-dom'
import { Zap, ArrowRight, Shield, Bot, Clock, CheckCircle2, Play, Star, Sparkles, ChevronLeft, ChevronRight, Quote, TrendingUp, BarChart3, Globe, Mail } from 'lucide-react'

const ease = [0.16, 1, 0.3, 1] as const

// ── CSS keyframes injected once ─────────────────────
const globalStyles = `
@keyframes particleFloat {
  0% { transform: translateY(0) translateX(0); opacity: 0; }
  10% { opacity: 1; }
  90% { opacity: 1; }
  100% { transform: translateY(-100vh) translateX(40px); opacity: 0; }
}
@keyframes morphGradient {
  0% { background-position: 0% 50%; }
  50% { background-position: 100% 50%; }
  100% { background-position: 0% 50%; }
}
@keyframes shimmer {
  0% { background-position: -200% center; }
  100% { background-position: 200% center; }
}
.hero-cta-glow:hover {
  box-shadow: 0 8px 40px rgba(255,107,107,0.5), 0 0 60px rgba(255,107,107,0.15);
  transform: translateY(-2px);
}
.hero-cta-outline:hover {
  background: rgba(255,255,255,0.08);
  border-color: rgba(255,255,255,0.5);
}
@keyframes bounce3 {
  0%, 80%, 100% { transform: translateY(0); }
  40% { transform: translateY(-6px); }
}
@keyframes scrollWheel {
  0% { transform: translateY(0); opacity: 1; }
  50% { transform: translateY(6px); opacity: 0.3; }
  100% { transform: translateY(0); opacity: 1; }
}
@keyframes floatBadge {
  0%, 100% { transform: translateY(0); }
  50% { transform: translateY(-6px); }
}
@keyframes pulseGlow {
  0%, 100% { box-shadow: 0 0 4px currentColor; }
  50% { box-shadow: 0 0 12px currentColor, 0 0 20px currentColor; }
}
@keyframes underlineGrow {
  from { transform: scaleX(0); }
  to { transform: scaleX(1); }
}
.nav-link-hover { position: relative; }
.nav-link-hover::after {
  content: '';
  position: absolute;
  bottom: -2px;
  left: 0;
  right: 0;
  height: 1.5px;
  background: currentColor;
  transform: scaleX(0);
  transform-origin: center;
  transition: transform 0.3s ease;
}
.nav-link-hover:hover::after { transform: scaleX(1); }
.btn-press:active { transform: scale(0.97); }
.shimmer-btn {
  background-size: 200% auto;
  background-image: linear-gradient(90deg, transparent 0%, rgba(255,255,255,0.15) 50%, transparent 100%);
  transition: background-position 0.5s ease;
}
.shimmer-btn:hover {
  animation: shimmer 1.5s ease infinite;
}
`
function InjectStyles() {
  useEffect(() => {
    const el = document.createElement('style')
    el.textContent = globalStyles
    document.head.appendChild(el)
    return () => { el.removeChild(el) }
  }, [])
  return null
}

// ── Particles ───────────────────────────────────────
function Particles({ count = 30 }: { count?: number }) {
  const particles = useMemo(() => Array.from({ length: count }, (_, i) => ({
    id: i,
    left: `${Math.random() * 100}%`,
    size: 2 + Math.random() * 3,
    duration: 12 + Math.random() * 20,
    delay: Math.random() * 15,
    opacity: 0.08 + Math.random() * 0.2,
  })), [count])

  return (
    <div style={{ position: 'absolute', inset: 0, zIndex: 1, overflow: 'hidden', pointerEvents: 'none' }}>
      {particles.map(p => (
        <div key={p.id} style={{
          position: 'absolute', bottom: '-5%', left: p.left,
          width: p.size, height: p.size, borderRadius: '50%',
          background: '#fff', opacity: p.opacity,
          animation: `particleFloat ${p.duration}s linear ${p.delay}s infinite`,
        }} />
      ))}
    </div>
  )
}

// ── Scroll Indicator ────────────────────────────────
function ScrollIndicator() {
  return (
    <motion.div animate={{ opacity: [0.3, 0.6, 0.3] }} transition={{ duration: 3, repeat: Infinity }}
      style={{ position: 'absolute', bottom: 32, left: '50%', transform: 'translateX(-50%)', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 8 }}>
      <div style={{ width: 22, height: 36, borderRadius: 11, border: '2px solid rgba(255,255,255,0.2)', display: 'flex', justifyContent: 'center', paddingTop: 6 }}>
        <motion.div animate={{ y: [0, 8, 0] }} transition={{ duration: 1.5, repeat: Infinity }}
          style={{ width: 3, height: 8, borderRadius: 2, background: 'rgba(255,255,255,0.5)' }} />
      </div>
      <span style={{ fontSize: 10, letterSpacing: '0.15em', textTransform: 'uppercase', color: 'rgba(255,255,255,0.2)' }}>Scroll</span>
    </motion.div>
  )
}

// ── Animated Counter ────────────────────────────────
function AnimatedCounter({ target, suffix = '', duration = 2 }: { target: number; suffix?: string; duration?: number }) {
  const ref = useRef<HTMLSpanElement>(null)
  const isInView = useInView(ref, { once: true, margin: '-50px' })
  const [count, setCount] = useState(0)

  useEffect(() => {
    if (!isInView) return
    const start = performance.now()
    const tick = (now: number) => {
      const p = Math.min((now - start) / (duration * 1000), 1)
      const eased = 1 - Math.pow(1 - p, 3)
      setCount(Math.round(target * eased))
      if (p < 1) requestAnimationFrame(tick)
    }
    requestAnimationFrame(tick)
  }, [isInView, target, duration])

  return <span ref={ref}>{count}{suffix}</span>
}

// ── Parallax Layer ──────────────────────────────────
function ParallaxOrb({ style, speed }: { style: React.CSSProperties; speed: number }) {
  const { scrollY } = useScroll()
  const y = useTransform(scrollY, [0, 800], [0, speed * 200])
  const scale = useTransform(scrollY, [0, 600], [1, 1.2])

  return <motion.div style={{ ...style, y, scale }} />
}

// ── Tilt Card ───────────────────────────────────────
function TiltCard({ children, className = '' }: { children: React.ReactNode; className?: string }) {
  const [tilt, setTilt] = useState({ x: 0, y: 0 })
  const ref = useRef<HTMLDivElement>(null)

  const handleMove = (e: React.MouseEvent) => {
    if (!ref.current) return
    const rect = ref.current.getBoundingClientRect()
    const x = (e.clientX - rect.left) / rect.width - 0.5
    const y = (e.clientY - rect.top) / rect.height - 0.5
    setTilt({ x: y * -10, y: x * 10 })
  }

  return (
    <motion.div
      ref={ref}
      className={className}
      onMouseMove={handleMove}
      onMouseLeave={() => setTilt({ x: 0, y: 0 })}
      style={{
        transform: `perspective(1000px) rotateX(${tilt.x}deg) rotateY(${tilt.y}deg)`,
        transition: 'transform 0.15s ease-out',
      }}
    >
      {children}
    </motion.div>
  )
}

// ── Testimonial Carousel ────────────────────────────
function TestimonialCarousel() {
  const [current, setCurrent] = useState(0)
  const testimonials = [
    { quote: "We replaced our research analyst with My-Agentcy. Same quality, 10x faster, a fraction of the cost.", name: "Sarah J.", role: "CEO, TechFlow", company: "TechFlow" },
    { quote: "The QA layer is what sold us. We tried raw AI before — garbage in, garbage out. My-Agentcy guarantees the output.", name: "Mike S.", role: "CTO, DataDriven", company: "DataDriven" },
    { quote: "Our marketing team now produces 3x the content at half the budget. The ROI was immediate.", name: "Emma W.", role: "CMO, GrowthLabs", company: "GrowthLabs" },
    { quote: "Finally, AI that actually delivers usable work. Not impressive demos — real, polished deliverables.", name: "James K.", role: "VP Ops, ScaleUp", company: "ScaleUp" },
  ]

  useEffect(() => {
    const timer = setInterval(() => setCurrent(c => (c + 1) % testimonials.length), 5000)
    return () => clearInterval(timer)
  }, [])

  return (
    <div style={{ position: 'relative', overflow: 'hidden' }}>
      <AnimatePresence mode="wait">
        <motion.div
          key={current}
          initial={{ opacity: 0, x: 60 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: -60 }}
          transition={{ duration: 0.5, ease }}
          style={{ padding: 40, borderRadius: 24, background: '#F7F7F5', border: '1px solid #E5E5E5', maxWidth: 700, margin: '0 auto' }}
        >
          <Quote size={32} color="#FF6B6B" style={{ opacity: 0.3, marginBottom: 16 }} />
          <p style={{ fontSize: 18, lineHeight: 1.7, color: '#4A4A4A', marginBottom: 24, fontStyle: 'italic' }}>
            "{testimonials[current].quote}"
          </p>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <div>
              <p style={{ fontSize: 15, fontWeight: 600 }}>{testimonials[current].name}</p>
              <p style={{ fontSize: 13, color: '#8A8A8A' }}>{testimonials[current].role}</p>
            </div>
            <div style={{ display: 'flex', gap: 2 }}>
              {[...Array(5)].map((_, i) => <Star key={i} size={16} color="#FF6B6B" fill="#FF6B6B" />)}
            </div>
          </div>
        </motion.div>
      </AnimatePresence>

      {/* Dots */}
      <div style={{ display: 'flex', justifyContent: 'center', gap: 8, marginTop: 24 }}>
        {testimonials.map((_, i) => (
          <button key={i} onClick={() => setCurrent(i)} style={{
            width: i === current ? 24 : 8, height: 8, borderRadius: 4,
            background: i === current ? '#FF6B6B' : '#E5E5E5', border: 'none', cursor: 'pointer',
            transition: 'all 0.3s ease',
          }} />
        ))}
      </div>

      {/* Nav arrows */}
      <button onClick={() => setCurrent((current - 1 + testimonials.length) % testimonials.length)} style={{
        position: 'absolute', left: 0, top: '50%', transform: 'translateY(-50%)',
        background: '#fff', border: '1px solid #E5E5E5', borderRadius: '50%',
        width: 40, height: 40, display: 'flex', alignItems: 'center', justifyContent: 'center',
        cursor: 'pointer', boxShadow: '0 2px 8px rgba(0,0,0,0.06)',
      }}>
        <ChevronLeft size={16} />
      </button>
      <button onClick={() => setCurrent((current + 1) % testimonials.length)} style={{
        position: 'absolute', right: 0, top: '50%', transform: 'translateY(-50%)',
        background: '#fff', border: '1px solid #E5E5E5', borderRadius: '50%',
        width: 40, height: 40, display: 'flex', alignItems: 'center', justifyContent: 'center',
        cursor: 'pointer', boxShadow: '0 2px 8px rgba(0,0,0,0.06)',
      }}>
        <ChevronRight size={16} />
      </button>
    </div>
  )
}

// ── Typing Indicator ────────────────────────────────
function TypingIndicator() {
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: 4, padding: '8px 14px', borderRadius: 12, background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.08)', width: 'fit-content' }}>
      {[0, 1, 2].map(i => (
        <motion.div key={i}
          animate={{ y: [0, -5, 0] }}
          transition={{ duration: 0.6, repeat: Infinity, delay: i * 0.15 }}
          style={{ width: 6, height: 6, borderRadius: '50%', background: 'rgba(255,255,255,0.3)' }} />
      ))}
    </div>
  )
}

// ── Dashboard Mockup ────────────────────────────────
function DashboardMockup() {
  const ref = useRef(null)
  const isInView = useInView(ref, { once: true, margin: '-100px' })
  const barHeights = [40, 55, 35, 70, 45, 80, 60, 90, 50, 85, 65, 95, 75, 88]

  return (
    <div ref={ref} style={{
      borderRadius: 16, overflow: 'hidden', boxShadow: '0 25px 80px rgba(0,0,0,0.12)',
      border: '1px solid #E5E5E5', background: '#fff',
    }}>
      {/* Chrome bar */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 8, padding: '0 16px', height: 40, background: '#F7F7F5', borderBottom: '1px solid #E5E5E5' }}>
        <div style={{ width: 10, height: 10, borderRadius: '50%', background: '#D4451A' }} />
        <div style={{ width: 10, height: 10, borderRadius: '50%', background: '#F2CC8F' }} />
        <div style={{ width: 10, height: 10, borderRadius: '50%', background: '#4A7C28' }} />
        <div style={{ marginLeft: 12, flex: 1, borderRadius: 6, height: 20, display: 'flex', alignItems: 'center', padding: '0 10px', background: '#EEEEEC' }}>
          <span style={{ fontSize: 10, color: '#8A8A8A' }}>my-agentcy.vercel.app/app</span>
        </div>
      </div>
      {/* Content */}
      <div style={{ padding: 20, background: '#0D0D12' }}>
        {/* Stats row */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 12, marginBottom: 16 }}>
          {[
            { label: 'Active', value: '12', icon: BarChart3, color: '#60A5FA' },
            { label: 'QA Rate', value: '94%', icon: Shield, color: '#4ADE80' },
            { label: 'Revenue', value: '$847', icon: TrendingUp, color: '#FBBF24' },
            { label: 'Agents', value: '4', icon: Bot, color: '#A78BFA' },
          ].map((s, i) => (
            <motion.div key={s.label}
              initial={{ opacity: 0, y: 10 }} animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ delay: 0.2 + i * 0.1 }}
              style={{ borderRadius: 12, padding: 12, background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.05)' }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginBottom: 6 }}>
                <motion.div animate={{ opacity: [0.5, 1, 0.5] }} transition={{ duration: 2, repeat: Infinity, delay: i * 0.3 }}
                  style={{ width: 6, height: 6, borderRadius: '50%', background: s.color, boxShadow: `0 0 8px ${s.color}` }} />
                <s.icon size={12} color={s.color} />
                <span style={{ fontSize: 9, color: 'rgba(255,255,255,0.3)', textTransform: 'uppercase', letterSpacing: '0.08em' }}>{s.label}</span>
              </div>
              <p style={{ fontSize: 20, fontWeight: 700, color: '#fff' }}>{s.value}</p>
            </motion.div>
          ))}
        </div>
        {/* Chart */}
        <div style={{ borderRadius: 12, padding: 12, height: 80, display: 'flex', alignItems: 'flex-end', gap: 3, background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.05)' }}>
          {barHeights.map((h, i) => (
            <motion.div key={i}
              initial={{ height: 0 }}
              animate={isInView ? { height: `${h}%` } : {}}
              transition={{ delay: 0.4 + i * 0.03, duration: 0.5, ease }}
              style={{ flex: 1, borderRadius: 2, background: h > 70 ? '#FF6B6B' : 'rgba(255,107,107,0.25)' }}
            />
          ))}
        </div>
        {/* Typing indicator */}
        <div style={{ marginTop: 12, display: 'flex', alignItems: 'center', gap: 8 }}>
          <TypingIndicator />
          <span style={{ fontSize: 10, color: 'rgba(255,255,255,0.2)' }}>Analyst agent is working...</span>
        </div>
      </div>
    </div>
  )
}

// ── Client Logo Marquee ─────────────────────────────
function LogoMarquee() {
  const logos = ['TechFlow', 'DataDriven', 'GrowthLabs', 'ScaleUp', 'NexGen', 'PrimeOps', 'ByteForge', 'CloudPeak']

  return (
    <div style={{ overflow: 'hidden', padding: '24px 0', borderTop: '1px solid #E5E5E5', borderBottom: '1px solid #E5E5E5' }}>
      <motion.div
        animate={{ x: [0, -1200] }}
        transition={{ duration: 30, repeat: Infinity, ease: 'linear' }}
        style={{ display: 'flex', gap: 80, whiteSpace: 'nowrap' }}
      >
        {[...logos, ...logos].map((name, i) => (
          <span key={i} style={{ fontSize: 18, fontWeight: 700, color: '#D4D4D4', letterSpacing: '-0.02em', fontFamily: "'Inter', sans-serif" }}>{name}</span>
        ))}
      </motion.div>
    </div>
  )
}

// ── Pricing Toggle ──────────────────────────────────
function PricingToggle({ isAnnual, onToggle }: { isAnnual: boolean; onToggle: () => void }) {
  return (
    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 12, marginBottom: 48 }}>
      <span style={{ fontSize: 14, fontWeight: 500, color: !isAnnual ? '#1A1A2E' : '#8A8A8A', transition: 'color 0.3s' }}>Monthly</span>
      <button onClick={onToggle} style={{
        width: 52, height: 28, borderRadius: 14, border: 'none', cursor: 'pointer', position: 'relative',
        background: isAnnual ? '#FF6B6B' : '#E5E5E5', transition: 'background 0.3s',
      }}>
        <motion.div animate={{ x: isAnnual ? 24 : 2 }} transition={{ type: 'spring', stiffness: 500, damping: 30 }}
          style={{ position: 'absolute', top: 2, width: 24, height: 24, borderRadius: '50%', background: '#fff', boxShadow: '0 2px 4px rgba(0,0,0,0.15)' }} />
      </button>
      <span style={{ fontSize: 14, fontWeight: 500, color: isAnnual ? '#1A1A2E' : '#8A8A8A', transition: 'color 0.3s' }}>
        Annual <span style={{ fontSize: 11, color: '#FF6B6B', fontWeight: 600 }}>Save 20%</span>
      </span>
    </div>
  )
}

// ═════════════════════════════════════════════════════
// MAIN LANDING
// ═════════════════════════════════════════════════════

export default function Landing() {
  const [scroll, setScroll] = useState(0)
  const [isAnnual, setIsAnnual] = useState(false)
  const heroRef = useRef(null)
  const { scrollYProgress } = useScroll({ target: heroRef, offset: ['start start', 'end start'] })
  const heroY = useTransform(scrollYProgress, [0, 1], [0, 200])
  const heroOpacity = useTransform(scrollYProgress, [0, 0.5], [1, 0])
  const heroScale = useTransform(scrollYProgress, [0, 0.5], [1, 0.95])

  useEffect(() => {
    const fn = () => setScroll(window.scrollY)
    window.addEventListener('scroll', fn, { passive: true })
    return () => window.removeEventListener('scroll', fn)
  }, [])

  const onHero = scroll < 80

  return (
    <div className="landing">
      <InjectStyles />

      {/* ━━ NAV ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ */}
      <nav style={{
        position: 'fixed', top: 0, left: 0, right: 0, zIndex: 50, height: 72,
        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
        padding: '0 clamp(24px,4vw,40px)', maxWidth: 1200, margin: '0 auto',
        background: onHero ? 'transparent' : 'rgba(250,250,248,0.95)',
        backdropFilter: onHero ? 'none' : 'blur(20px)',
        borderBottom: onHero ? '1px solid transparent' : '1px solid rgba(0,0,0,0.06)',
        transition: 'all 0.3s ease',
      }}>
        <Link to="/" style={{ display: 'flex', alignItems: 'center', gap: 10, textDecoration: 'none' }}>
          <div style={{
            width: 32, height: 32, borderRadius: 8, display: 'flex', alignItems: 'center', justifyContent: 'center',
            background: onHero ? 'rgba(255,255,255,0.1)' : '#1A1A2E', transition: 'background 0.3s',
          }}><Zap size={16} color="#FF6B6B" /></div>
          <span style={{ fontSize: 17, fontWeight: 700, letterSpacing: '-0.02em', color: onHero ? '#fff' : '#1A1A2E', transition: 'color 0.3s' }}>My-Agentcy</span>
        </Link>
        <div style={{ display: 'flex', alignItems: 'center', gap: 28 }} className="nav-links-desktop">
          {['How it works', 'Features', 'Pricing'].map(t => (
            <a key={t} href={`#${t.toLowerCase().replace(/ /g, '-')}`} className="nav-link-hover" style={{ fontSize: 14, textDecoration: 'none', color: onHero ? 'rgba(255,255,255,0.7)' : '#6B6B6B', transition: 'color 0.3s' }}>{t}</a>
          ))}
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
          <Link to="/auth/login" style={{ fontSize: 14, textDecoration: 'none', color: onHero ? 'rgba(255,255,255,0.7)' : '#6B6B6B', transition: 'color 0.3s' }} className="nav-links-desktop nav-link-hover">Sign in</Link>
          <Link to="/auth/signup" style={{ padding: '10px 20px', borderRadius: 100, fontSize: 13, fontWeight: 600, textDecoration: 'none', color: '#fff', background: onHero ? '#FF6B6B' : '#1A1A2E', boxShadow: onHero ? '0 4px 20px rgba(255,107,107,0.3)' : 'none', transition: 'all 0.3s' }}>Start free →</Link>
        </div>
      </nav>

      {/* ━━ HERO ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ */}
      <section ref={heroRef} style={{ position: 'relative', minHeight: '100vh', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', overflow: 'hidden', background: '#1A1A2E' }}>
        {/* Animated BG */}
        <div style={{ position: 'absolute', inset: 0, zIndex: 0, overflow: 'hidden' }}>
          <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(135deg, #1A1A2E 0%, #16213E 30%, #0F3460 60%, #1A1A2E 100%)' }} />
          <ParallaxOrb speed={-0.5} style={{ position: 'absolute', top: '-20%', left: '-10%', width: '60%', height: '60%', borderRadius: '50%', filter: 'blur(120px)', opacity: 0.15, background: 'radial-gradient(circle, #FF6B6B, transparent)' }} />
          <ParallaxOrb speed={0.3} style={{ position: 'absolute', bottom: '-20%', right: '-10%', width: '50%', height: '50%', borderRadius: '50%', filter: 'blur(100px)', opacity: 0.1, background: 'radial-gradient(circle, #C0C0C0, transparent)' }} />
          <ParallaxOrb speed={-0.8} style={{ position: 'absolute', top: '30%', right: '20%', width: '30%', height: '30%', borderRadius: '50%', filter: 'blur(80px)', opacity: 0.08, background: 'radial-gradient(circle, #FF6B6B, transparent)' }} />
          <div style={{ position: 'absolute', inset: 0, opacity: 0.03, backgroundImage: 'linear-gradient(rgba(255,255,255,0.1) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.1) 1px, transparent 1px)', backgroundSize: '60px 60px' }} />
          <div style={{ position: 'absolute', bottom: 0, left: 0, right: 0, height: 200, background: 'linear-gradient(to top, #1A1A2E, transparent)' }} />
        </div>
        <Particles count={35} />

        {/* Content with parallax */}
        <motion.div style={{ position: 'relative', zIndex: 10, textAlign: 'center', padding: '0 24px', maxWidth: 900, margin: '0 auto', y: heroY, opacity: heroOpacity, scale: heroScale }}>
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2, duration: 0.6 }} style={{ marginBottom: 32 }}>
            <motion.span
              animate={{
                boxShadow: ['0 0 0 0 rgba(255,107,107,0.3)', '0 0 0 8px rgba(255,107,107,0)', '0 0 0 0 rgba(255,107,107,0.3)'],
                y: [0, -4, 0],
              }}
              transition={{ boxShadow: { duration: 2, repeat: Infinity }, y: { duration: 3, repeat: Infinity, ease: 'easeInOut' } }}
              style={{ display: 'inline-flex', alignItems: 'center', gap: 8, padding: '8px 16px', borderRadius: 100, fontSize: 11, fontWeight: 600, letterSpacing: '0.1em', textTransform: 'uppercase', background: 'rgba(255,107,107,0.1)', color: '#FF6B6B', border: '1px solid rgba(255,107,107,0.2)' }}>
              <span style={{ width: 6, height: 6, borderRadius: '50%', background: '#FF6B6B', animation: 'pulse 2s infinite' }} />
              Now accepting clients
            </motion.span>
          </motion.div>

          <motion.h1 initial={{ opacity: 0, y: 50, filter: 'blur(12px)' }} animate={{ opacity: 1, y: 0, filter: 'blur(0px)' }} transition={{ delay: 0.3, duration: 1, ease }}
            style={{ fontSize: 'clamp(48px, 10vw, 112px)', lineHeight: 0.9, letterSpacing: '-0.04em', fontFamily: "'Space Grotesk', 'Inter', sans-serif", fontWeight: 900, color: '#fff', marginBottom: 24, textShadow: '0 2px 60px rgba(0,0,0,0.5)' }}>
            Your AI team,<br />
            <span style={{ color: '#FF6B6B', textShadow: '0 0 80px rgba(255,107,107,0.25)' }}>
              {'reviewed &'.split('').map((char, i) => (
                <motion.span key={i} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.6 + i * 0.03, duration: 0.4 }} style={{ display: 'inline-block' }}>
                  {char === ' ' ? '\u00A0' : char}
                </motion.span>
              ))}
              <br />
              {'guaranteed.'.split('').map((char, i) => (
                <motion.span key={i} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 1.0 + i * 0.03, duration: 0.4 }} style={{ display: 'inline-block' }}>
                  {char === ' ' ? '\u00A0' : char}
                </motion.span>
              ))}
            </span>
          </motion.h1>

          <motion.p initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.5, duration: 0.8 }}
            style={{ fontSize: 'clamp(16px, 2vw, 20px)', lineHeight: 1.6, color: 'rgba(255,255,255,0.6)', maxWidth: 520, margin: '0 auto 40px' }}>
            AI agent teams that deliver real work. Every deliverable quality-checked.
          </motion.p>

          <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.7 }} style={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'center', gap: 16 }}>
            <Link to="/auth/signup" className="btn-press hero-cta-glow" style={{ display: 'inline-flex', alignItems: 'center', gap: 8, padding: '16px 32px', borderRadius: 100, background: '#FF6B6B', color: '#fff', fontSize: 15, fontWeight: 600, textDecoration: 'none', boxShadow: '0 8px 30px rgba(255,107,107,0.3)', transition: 'transform 0.15s, box-shadow 0.3s' }}>
              Start free, no card needed <ArrowRight size={16} />
            </Link>
            <a href="#how-it-works" className="btn-press hero-cta-outline" style={{ display: 'inline-flex', alignItems: 'center', gap: 8, padding: '16px 32px', borderRadius: 100, background: 'transparent', color: 'rgba(255,255,255,0.8)', fontSize: 15, fontWeight: 500, textDecoration: 'none', border: '1.5px solid rgba(255,255,255,0.25)', transition: 'transform 0.15s, border-color 0.3s, background 0.3s' }}>
              <Play size={16} /> See how it works
            </a>
          </motion.div>

          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.9 }} style={{ marginTop: 56, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 24, flexWrap: 'wrap' }}>
            <div style={{ display: 'flex' }}>
              {['#4A7C28', '#D4451A', '#2D5016', '#E86840'].map((bg, i) => (
                <div key={i} style={{ width: 32, height: 32, borderRadius: '50%', marginLeft: i > 0 ? -8 : 0, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 10, fontWeight: 700, color: '#fff', background: bg, border: '2px solid #1A1A2E' }}>
                  {['SJ', 'MS', 'EW', 'LD'][i]}
                </div>
              ))}
            </div>
            <div style={{ width: 1, height: 20, background: 'rgba(255,255,255,0.1)' }} />
            <div>
              <div style={{ display: 'flex', gap: 2 }}>{[...Array(5)].map((_, i) => <Star key={i} size={14} color="#FF6B6B" fill="#FF6B6B" />)}</div>
              <p style={{ fontSize: 12, color: 'rgba(255,255,255,0.3)', marginTop: 2 }}>50+ businesses across South Africa</p>
            </div>
          </motion.div>
        </motion.div>

        <ScrollIndicator />
      </section>

      {/* ━━ STATS ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ */}
      <section style={{ padding: '80px 24px', background: '#fff', position: 'relative' }}>
        <div style={{ position: 'absolute', top: 0, left: '10%', right: '10%', height: 1, background: 'linear-gradient(90deg, transparent, #E5E5E5, transparent)' }} />
        <div style={{ maxWidth: 1200, margin: '0 auto', display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(150px, 1fr))', gap: 32, textAlign: 'center' }}>
          {[
            { value: 847, suffix: '+', label: 'Tasks completed' },
            { value: 94, suffix: '%', label: 'QA pass rate' },
            { value: 4, suffix: '.2h', label: 'Avg turnaround' },
            { value: 47, suffix: '/50', label: 'Client rating' },
          ].map((s, i) => (
            <motion.div key={s.label} initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.1, duration: 0.5 }}>
              <p style={{ fontSize: 'clamp(36px, 5vw, 56px)', fontFamily: "'Space Grotesk', 'Inter', sans-serif", fontWeight: 800, letterSpacing: '-0.03em', lineHeight: 1 }}>
                <AnimatedCounter target={s.value} suffix={s.suffix} />
              </p>
              <p style={{ fontSize: 13, color: '#8A8A8A', marginTop: 8 }}>{s.label}</p>
            </motion.div>
          ))}
        </div>
      </section>

      {/* ━━ HOW IT WORKS ━━━━━━━━━━━━━━━━━━━━━━━━━━━ */}
      <section id="how-it-works" style={{ padding: '96px 24px' }}>
        <div style={{ maxWidth: 1200, margin: '0 auto' }}>
          <div style={{ textAlign: 'center', marginBottom: 64 }}>
            <motion.span initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} viewport={{ once: true }} style={{ display: 'block', fontSize: 11, fontWeight: 600, letterSpacing: '0.15em', textTransform: 'uppercase', color: '#8A8A8A', marginBottom: 12 }}>The process</motion.span>
            <motion.h2 initial={{ opacity: 0, clipPath: 'inset(100% 0 0 0)' }} whileInView={{ opacity: 1, clipPath: 'inset(0% 0 0 0)' }} viewport={{ once: true }} transition={{ duration: 0.8, ease }}
              style={{ fontSize: 'clamp(36px, 6vw, 64px)', fontFamily: "'Space Grotesk', 'Inter', sans-serif", fontWeight: 800, letterSpacing: '-0.03em', lineHeight: 0.95 }}>
              How it <span style={{ color: '#FF6B6B' }}>works</span>
            </motion.h2>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: 32 }}>
            {[
              { step: '01', title: 'Submit', desc: 'Describe what you need. Attach files. Set a deadline.', icon: Sparkles },
              { step: '02', title: 'AI Builds', desc: 'Specialized agents research, create, and produce your deliverable.', icon: Bot },
              { step: '03', title: 'QA Review', desc: 'Automated scoring + human review. Every output quality-checked.', icon: Shield },
              { step: '04', title: 'Deliver', desc: 'Polished work delivered. Approve or request unlimited revisions.', icon: CheckCircle2 },
            ].map((s, i) => (
              <motion.div key={s.step} initial={{ opacity: 0, y: 40 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.12, duration: 0.6 }}
                whileHover={{ y: -8 }} style={{ transition: 'transform 0.3s' }}>
                <TiltCard>
                  <div style={{ aspectRatio: '1', borderRadius: 24, overflow: 'hidden', position: 'relative', background: 'linear-gradient(145deg, #f5f5f3, #ebebe9)', marginBottom: 24, display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', transition: 'box-shadow 0.3s' }}>
                    <s.icon size={48} color="#1A1A2E" style={{ opacity: 0.1, transition: 'opacity 0.3s, transform 0.3s' }} />
                    <span style={{ position: 'absolute', top: 20, left: 20, fontSize: 72, fontWeight: 900, color: '#1A1A2E', opacity: 0.04, letterSpacing: '-0.04em' }}>{s.step}</span>
                  </div>
                </TiltCard>
                <h3 style={{ fontSize: 20, fontWeight: 700, marginBottom: 8 }}>{s.title}</h3>
                <p style={{ fontSize: 14, lineHeight: 1.6, color: '#6B6B6B' }}>{s.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ━━ FEATURES ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ */}
      <section id="features" style={{ padding: '96px 24px', background: '#1A1A2E' }}>
        <div style={{ maxWidth: 1200, margin: '0 auto' }}>
          <div style={{ textAlign: 'center', marginBottom: 64 }}>
            <motion.span initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} viewport={{ once: true }} style={{ display: 'block', fontSize: 11, fontWeight: 600, letterSpacing: '0.15em', textTransform: 'uppercase', color: 'rgba(255,255,255,0.3)', marginBottom: 12 }}>The difference</motion.span>
            <motion.h2 initial={{ opacity: 0, clipPath: 'inset(100% 0 0 0)' }} whileInView={{ opacity: 1, clipPath: 'inset(0% 0 0 0)' }} viewport={{ once: true }} transition={{ duration: 0.8, ease }}
              style={{ fontSize: 'clamp(36px, 6vw, 64px)', fontFamily: "'Space Grotesk', 'Inter', sans-serif", fontWeight: 800, letterSpacing: '-0.03em', lineHeight: 0.95, color: '#fff' }}>
              Not just AI.<br /><span style={{ color: '#FF6B6B' }}>Guaranteed quality.</span>
            </motion.h2>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: 24 }}>
            {[
              { icon: Bot, title: 'AI Agent Teams', desc: 'Specialized agents for research, analysis, code, and content. Each with deep domain expertise.' },
              { icon: Shield, title: 'Quality Assured', desc: 'Every deliverable passes automated QA scoring. Complex tasks get human review. No raw AI output.' },
              { icon: Clock, title: 'Fast & Reliable', desc: 'Most tasks done in 4-12 hours. Your AI team works around the clock, rain or shine.' },
            ].map((f, i) => (
              <motion.div key={f.title} initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.15, duration: 0.6 }}
                style={{ padding: 32, borderRadius: 16, background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.06)', cursor: 'default', transition: 'box-shadow 0.3s, transform 0.3s' }}
                whileHover={{ background: 'rgba(255,255,255,0.06)', borderColor: 'rgba(255,107,107,0.3)', y: -4, boxShadow: '0 0 30px rgba(255,107,107,0.08)' }}
              >
                <div style={{ width: 48, height: 48, borderRadius: 12, marginBottom: 20, display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'rgba(255,107,107,0.1)' }}>
                  <f.icon size={20} color="#FF6B6B" />
                </div>
                <h3 style={{ fontSize: 18, fontWeight: 700, color: '#fff', marginBottom: 8 }}>{f.title}</h3>
                <p style={{ fontSize: 14, lineHeight: 1.6, color: 'rgba(255,255,255,0.4)' }}>{f.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ━━ DASHBOARD PREVIEW ━━━━━━━━━━━━━━━━━━━━━━ */}
      <section style={{ padding: '96px 24px' }}>
        <div style={{ maxWidth: 1100, margin: '0 auto' }}>
          <div style={{ textAlign: 'center', marginBottom: 48 }}>
            <motion.span initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} viewport={{ once: true }} style={{ display: 'block', fontSize: 11, fontWeight: 600, letterSpacing: '0.15em', textTransform: 'uppercase', color: '#8A8A8A', marginBottom: 12 }}>Your command center</motion.span>
            <motion.h2 initial={{ opacity: 0, clipPath: 'inset(100% 0 0 0)' }} whileInView={{ opacity: 1, clipPath: 'inset(0% 0 0 0)' }} viewport={{ once: true }} transition={{ duration: 0.8, ease }}
              style={{ fontSize: 'clamp(28px, 5vw, 48px)', fontFamily: "'Space Grotesk', 'Inter', sans-serif", fontWeight: 800, letterSpacing: '-0.03em', lineHeight: 1.05 }}>
              See everything. Control everything.
            </motion.h2>
          </div>
          <motion.div initial={{ opacity: 0, y: 40 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.8 }}>
            <DashboardMockup />
          </motion.div>
        </div>
      </section>

      {/* ━━ PRICING ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ */}
      <section id="pricing" style={{ padding: '96px 24px', background: '#F7F7F5' }}>
        <div style={{ maxWidth: 1000, margin: '0 auto' }}>
          <div style={{ textAlign: 'center', marginBottom: 64 }}>
            <motion.span initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} viewport={{ once: true }} style={{ display: 'block', fontSize: 11, fontWeight: 600, letterSpacing: '0.15em', textTransform: 'uppercase', color: '#8A8A8A', marginBottom: 12 }}>Simple pricing</motion.span>
            <motion.h2 initial={{ opacity: 0, clipPath: 'inset(100% 0 0 0)' }} whileInView={{ opacity: 1, clipPath: 'inset(0% 0 0 0)' }} viewport={{ once: true }} transition={{ duration: 0.8, ease }}
              style={{ fontSize: 'clamp(36px, 6vw, 64px)', fontFamily: "'Space Grotesk', 'Inter', sans-serif", fontWeight: 800, letterSpacing: '-0.03em', lineHeight: 0.95 }}>
              Plans that <span style={{ color: '#FF6B6B' }}>scale</span>
            </motion.h2>
          </div>
          <PricingToggle isAnnual={isAnnual} onToggle={() => setIsAnnual(a => !a)} />
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: 24 }}>
            {[
              { name: 'Starter', monthly: 'R499', annual: 'R399', period: '/month', features: ['20 tasks/month', 'Automated QA', '24-hour turnaround', 'Email support'], popular: false },
              { name: 'Pro', monthly: 'R7,999', annual: 'R6,399', period: '/month', features: ['80 tasks/month', 'Full human review', '12-hour turnaround', 'Priority queue', 'Slack & WhatsApp', 'Account manager'], popular: true },
              { name: 'Enterprise', monthly: 'Custom', annual: 'Custom', period: '', features: ['Unlimited tasks', 'Senior review', '4-hour turnaround', 'API access', 'SSO & audit logs', 'SLA guarantee'], popular: false },
            ].map((plan, i) => (
              <motion.div key={plan.name} initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.15, duration: 0.6 }}
                whileHover={{ y: -6, boxShadow: plan.popular ? '0 20px 60px rgba(255,107,107,0.2)' : '0 20px 60px rgba(0,0,0,0.08)' }}
                style={{ borderRadius: 24, overflow: 'hidden', background: plan.popular ? '#1A1A2E' : '#fff', border: plan.popular ? 'none' : '1px solid #E5E5E5', color: plan.popular ? '#fff' : '#1A1A2E', cursor: 'default', transition: 'box-shadow 0.3s' }}
              >
                <div style={{ padding: 32 }}>
                  {plan.popular && <span style={{ fontSize: 10, letterSpacing: '0.1em', textTransform: 'uppercase', fontWeight: 600, color: '#FF6B6B', display: 'block', marginBottom: 16 }}>Most popular</span>}
                  <h3 style={{ fontSize: 18, fontWeight: 700, marginBottom: 16 }}>{plan.name}</h3>
                  <div style={{ display: 'flex', alignItems: 'baseline', gap: 4, marginBottom: 24 }}>
                    <AnimatePresence mode="wait">
                      <motion.span key={isAnnual ? 'a' : 'm'} initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: 10 }} transition={{ duration: 0.2 }}
                        style={{ fontSize: 40, fontWeight: 800, letterSpacing: '-0.02em' }}>
                        {isAnnual ? plan.annual : plan.monthly}
                      </motion.span>
                    </AnimatePresence>
                    <span style={{ color: plan.popular ? 'rgba(255,255,255,0.4)' : '#8A8A8A' }}>{plan.period}</span>
                  </div>
                  <ul style={{ listStyle: 'none', padding: 0, margin: 0, marginBottom: 32 }}>
                    {plan.features.map(f => (
                      <li key={f} style={{ display: 'flex', alignItems: 'center', gap: 8, fontSize: 14, marginBottom: 12, color: plan.popular ? 'rgba(255,255,255,0.6)' : '#6B6B6B' }}>
                        <CheckCircle2 size={16} color={plan.popular ? '#FF6B6B' : '#4A7C28'} style={{ flexShrink: 0 }} /> {f}
                      </li>
                    ))}
                  </ul>
                  <Link to="/auth/signup" className="btn-press shimmer-btn" style={{ display: 'block', textAlign: 'center', padding: '14px 0', borderRadius: 100, fontSize: 14, fontWeight: 600, textDecoration: 'none', background: plan.popular ? '#FF6B6B' : '#1A1A2E', color: '#fff', transition: 'transform 0.15s' }}>
                    {plan.monthly === 'Custom' ? 'Contact us' : 'Start free'}
                  </Link>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ━━ TESTIMONIALS ━━━━━━━━━━━━━━━━━━━━━━━━━━━ */}
      <section style={{ padding: '96px 24px' }}>
        <div style={{ maxWidth: 800, margin: '0 auto' }}>
          <div style={{ textAlign: 'center', marginBottom: 48 }}>
            <motion.h2 initial={{ opacity: 0, clipPath: 'inset(100% 0 0 0)' }} whileInView={{ opacity: 1, clipPath: 'inset(0% 0 0 0)' }} viewport={{ once: true }} transition={{ duration: 0.8, ease }}
              style={{ fontSize: 'clamp(36px, 6vw, 64px)', fontFamily: "'Space Grotesk', 'Inter', sans-serif", fontWeight: 800, letterSpacing: '-0.03em', lineHeight: 0.95 }}>
              Loved by <span style={{ color: '#FF6B6B' }}>teams</span>
            </motion.h2>
          </div>
          <TestimonialCarousel />
        </div>
      </section>

      {/* ━━ CTA ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ */}
      <section style={{ padding: '96px 24px', background: 'linear-gradient(-45deg, #1A1A2E, #16213E, #0F3460, #1A1A2E)', backgroundSize: '400% 400%', animation: 'morphGradient 12s ease infinite', position: 'relative', overflow: 'hidden' }}>
        <div style={{ position: 'absolute', top: '-50%', left: '-20%', width: '60%', height: '100%', borderRadius: '50%', filter: 'blur(150px)', opacity: 0.15, background: '#FF6B6B' }} />
        <div style={{ position: 'absolute', bottom: '-30%', right: '-10%', width: '40%', height: '80%', borderRadius: '50%', filter: 'blur(120px)', opacity: 0.08, background: '#C0C0C0' }} />
        <div style={{ maxWidth: 700, margin: '0 auto', textAlign: 'center', position: 'relative', zIndex: 1 }}>
          <motion.h2 initial={{ opacity: 0, clipPath: 'inset(100% 0 0 0)' }} whileInView={{ opacity: 1, clipPath: 'inset(0% 0 0 0)' }} viewport={{ once: true }} transition={{ duration: 0.8, ease }}
            style={{ fontSize: 'clamp(36px, 6vw, 64px)', fontFamily: "'Space Grotesk', 'Inter', sans-serif", fontWeight: 800, letterSpacing: '-0.03em', lineHeight: 0.95, color: '#fff', marginBottom: 24 }}>
            Ready to scale?
          </motion.h2>
          <motion.p initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} viewport={{ once: true }} style={{ fontSize: 18, color: 'rgba(255,255,255,0.4)', marginBottom: 40 }}>
            Your AI team is waiting. Start with a free task today.
          </motion.p>
          <motion.div initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} viewport={{ once: true }}>
            <Link to="/auth/signup" className="btn-press hero-cta-glow" style={{ display: 'inline-flex', alignItems: 'center', gap: 8, padding: '16px 32px', borderRadius: 100, background: '#FF6B6B', color: '#fff', fontSize: 15, fontWeight: 600, textDecoration: 'none', boxShadow: '0 8px 30px rgba(255,107,107,0.3)', transition: 'box-shadow 0.3s, transform 0.15s' }}>
              Get started free <ArrowRight size={16} />
            </Link>
          </motion.div>
        </div>
      </section>

      {/* ━━ FOOTER ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ */}
      <LogoMarquee />
      <footer style={{ padding: '40px 24px', borderTop: '1px solid #E5E5E5' }}>
        <div style={{ maxWidth: 1200, margin: '0 auto', display: 'flex', flexWrap: 'wrap', alignItems: 'center', justifyContent: 'space-between', gap: 16 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            <Zap size={16} color="#8A8A8A" />
            <span style={{ fontSize: 14, color: '#8A8A8A' }}>My-Agentcy by Agentcy.co.za</span>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
            {[Globe, Mail, Zap].map((Icon, i) => (
              <motion.a key={i} href="#" whileHover={{ y: -3, rotate: 5 }} whileTap={{ scale: 0.9 }}
                style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', width: 32, height: 32, borderRadius: '50%', background: '#F7F7F5', color: '#8A8A8A', transition: 'color 0.2s' }}>
                <Icon size={14} />
              </motion.a>
            ))}
          </div>
          <p style={{ fontSize: 12, color: '#ABABAB' }}>Leaders in Software. Experts in Intelligence.</p>
        </div>
      </footer>

    </div>
  )
}
