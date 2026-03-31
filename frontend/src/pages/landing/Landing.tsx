import { useEffect, useState } from 'react'
import { motion } from 'framer-motion'
import { Link } from 'react-router-dom'
import { Zap, ArrowRight, Shield, Bot, Clock, CheckCircle2, Play, Star, Sparkles } from 'lucide-react'

const ease = [0.16, 1, 0.3, 1] as const

export default function Landing() {
  const [scroll, setScroll] = useState(0)

  useEffect(() => {
    const fn = () => setScroll(window.scrollY)
    window.addEventListener('scroll', fn, { passive: true })
    return () => window.removeEventListener('scroll', fn)
  }, [])

  const onHero = scroll < 80

  return (
    <div className="landing">

      {/* ━━ NAV ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ */}
      <nav
        className="landing-nav"
        style={{
          position: 'fixed', top: 0, left: 0, right: 0, zIndex: 50,
          height: 72,
          display: 'flex', alignItems: 'center', justifyContent: 'space-between',
          padding: '0 clamp(24px,4vw,40px)',
          maxWidth: 1200, margin: '0 auto',
          background: onHero ? 'transparent' : 'rgba(250,250,248,0.95)',
          backdropFilter: onHero ? 'none' : 'blur(20px)',
          borderBottom: onHero ? '1px solid transparent' : '1px solid rgba(0,0,0,0.06)',
          transition: 'all 0.3s ease',
        }}
      >
        <Link to="/" style={{ display: 'flex', alignItems: 'center', gap: 10, textDecoration: 'none' }}>
          <div style={{
            width: 32, height: 32, borderRadius: 8,
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            background: onHero ? 'rgba(255,255,255,0.1)' : '#1A1A2E',
            transition: 'background 0.3s',
          }}>
            <Zap size={16} color="#FF6B6B" />
          </div>
          <span style={{
            fontSize: 17, fontWeight: 700, letterSpacing: '-0.02em',
            color: onHero ? '#fff' : '#1A1A2E',
            transition: 'color 0.3s',
            fontFamily: "'Inter', system-ui, sans-serif",
          }}>My-Agentcy</span>
        </Link>

        <div style={{ display: 'flex', alignItems: 'center', gap: 28 }} className="nav-links-desktop">
          {['How it works', 'Features', 'Pricing'].map(t => (
            <a key={t} href={`#${t.toLowerCase().replace(/ /g, '-')}`} style={{
              fontSize: 14, textDecoration: 'none',
              color: onHero ? 'rgba(255,255,255,0.7)' : '#6B6B6B',
              transition: 'color 0.3s',
            }}>{t}</a>
          ))}
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
          <Link to="/auth/login" style={{
            fontSize: 14, textDecoration: 'none',
            color: onHero ? 'rgba(255,255,255,0.7)' : '#6B6B6B',
            transition: 'color 0.3s',
          }} className="nav-links-desktop">Sign in</Link>
          <Link to="/auth/signup" style={{
            padding: '10px 20px', borderRadius: 100,
            fontSize: 13, fontWeight: 600, textDecoration: 'none',
            color: '#fff',
            background: onHero ? '#FF6B6B' : '#1A1A2E',
            boxShadow: onHero ? '0 4px 20px rgba(255,107,107,0.3)' : 'none',
            transition: 'all 0.3s',
          }}>Start free →</Link>
        </div>
      </nav>

      {/* ━━ HERO ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ */}
      <section style={{
        position: 'relative', minHeight: '100vh',
        display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
        overflow: 'hidden', background: '#1A1A2E',
      }}>
        {/* Video */}
        <div style={{ position: 'absolute', inset: 0, zIndex: 0 }}>
          <video
            autoPlay muted loop playsInline
            style={{
              position: 'absolute', inset: 0, width: '100%', height: '100%',
              objectFit: 'cover', objectPosition: 'center 40%',
              filter: 'brightness(0.35) contrast(1.1)',
            }}
          >
            <source src="https://videos.pexels.com/video-files/8468477/8468477-uhd_2560_1440_25fps.mp4" type="video/mp4" />
          </video>
          <div style={{
            position: 'absolute', inset: 0,
            background: 'linear-gradient(180deg, rgba(26,26,46,0.85) 0%, rgba(26,26,46,0.5) 40%, rgba(26,26,46,0.9) 100%)',
          }} />
          <div style={{
            position: 'absolute', bottom: 0, left: 0, right: 0, height: 120,
            background: 'linear-gradient(to top, #1A1A2E, transparent)',
          }} />
        </div>

        {/* Content */}
        <div style={{ position: 'relative', zIndex: 10, textAlign: 'center', padding: '0 24px', maxWidth: 900, margin: '0 auto' }}>
          {/* Badge */}
          <motion.div
            initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2, duration: 0.6 }}
            style={{ marginBottom: 32 }}
          >
            <span style={{
              display: 'inline-flex', alignItems: 'center', gap: 8,
              padding: '8px 16px', borderRadius: 100,
              fontSize: 11, fontWeight: 600, letterSpacing: '0.1em', textTransform: 'uppercase',
              background: 'rgba(255,107,107,0.1)', color: '#FF6B6B',
              border: '1px solid rgba(255,107,107,0.2)',
            }}>
              <span style={{ width: 6, height: 6, borderRadius: '50%', background: '#FF6B6B', animation: 'pulse 2s infinite' }} />
              Now accepting clients
            </span>
          </motion.div>

          {/* Headline */}
          <motion.h1
            initial={{ opacity: 0, y: 50, filter: 'blur(12px)' }}
            animate={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
            transition={{ delay: 0.3, duration: 1, ease }}
            style={{
              fontSize: 'clamp(48px, 10vw, 112px)',
              lineHeight: 0.9, letterSpacing: '-0.04em',
              fontWeight: 900, color: '#fff', marginBottom: 24,
              textShadow: '0 2px 60px rgba(0,0,0,0.5)',
              fontFamily: "'Inter', system-ui, sans-serif",
            }}
          >
            Your AI team,<br />
            <span style={{
              color: '#FF6B6B',
              textShadow: '0 0 80px rgba(255,107,107,0.25), 0 2px 40px rgba(0,0,0,0.3)',
            }}>reviewed &<br />guaranteed.</span>
          </motion.h1>

          {/* Subtitle */}
          <motion.p
            initial={{ opacity: 0, y: 20, filter: 'blur(4px)' }}
            animate={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
            transition={{ delay: 0.5, duration: 0.8, ease }}
            style={{
              fontSize: 'clamp(16px, 2vw, 20px)', lineHeight: 1.6,
              color: 'rgba(255,255,255,0.6)', maxWidth: 520, margin: '0 auto 40px',
            }}
          >
            AI agent teams that deliver real work — reports, analysis, code, content.
            Every deliverable quality-checked. Every client satisfied.
          </motion.p>

          {/* CTAs */}
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.7 }}
            style={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'center', gap: 16 }}
          >
            <Link to="/auth/signup" style={{
              display: 'inline-flex', alignItems: 'center', gap: 8,
              padding: '16px 32px', borderRadius: 100,
              background: '#FF6B6B', color: '#fff',
              fontSize: 15, fontWeight: 600, textDecoration: 'none',
              boxShadow: '0 8px 30px rgba(255,107,107,0.3)',
              transition: 'all 0.2s',
            }}>
              Start free, no card needed <ArrowRight size={16} />
            </Link>
            <a href="#how-it-works" style={{
              display: 'inline-flex', alignItems: 'center', gap: 8,
              padding: '16px 32px', borderRadius: 100,
              background: 'transparent', color: 'rgba(255,255,255,0.8)',
              fontSize: 15, fontWeight: 500, textDecoration: 'none',
              border: '1.5px solid rgba(255,255,255,0.25)',
              transition: 'all 0.2s',
            }}>
              <Play size={16} /> See how it works
            </a>
          </motion.div>

          {/* Social proof */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.9 }}
            style={{
              marginTop: 56, display: 'flex', alignItems: 'center',
              justifyContent: 'center', gap: 24, flexWrap: 'wrap',
            }}
          >
            <div style={{ display: 'flex' }}>
              {['#4A7C28', '#D4451A', '#2D5016', '#E86840'].map((bg, i) => (
                <div key={i} style={{
                  width: 32, height: 32, borderRadius: '50%', marginLeft: i > 0 ? -8 : 0,
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  fontSize: 10, fontWeight: 700, color: '#fff',
                  background: bg, border: '2px solid #1A1A2E',
                }}>
                  {['SJ', 'MS', 'EW', 'LD'][i]}
                </div>
              ))}
            </div>
            <div style={{ width: 1, height: 20, background: 'rgba(255,255,255,0.1)' }} />
            <div>
              <div style={{ display: 'flex', gap: 2 }}>
                {[...Array(5)].map((_, i) => <Star key={i} size={14} color="#FF6B6B" fill="#FF6B6B" />)}
              </div>
              <p style={{ fontSize: 12, color: 'rgba(255,255,255,0.3)', marginTop: 2 }}>
                50+ businesses across South Africa
              </p>
            </div>
          </motion.div>
        </div>

        {/* Scroll hint */}
        <motion.div
          initial={{ opacity: 0 }} animate={{ opacity: 1 }}
          transition={{ delay: 1.2 }}
          style={{
            position: 'absolute', bottom: 32, left: '50%', transform: 'translateX(-50%)',
            color: 'rgba(255,255,255,0.15)', fontSize: 11, letterSpacing: '0.15em', textTransform: 'uppercase',
          }}
        >
          Scroll to explore
        </motion.div>
      </section>

      {/* ━━ STATS BAR ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ */}
      <section style={{ padding: '64px 24px', background: '#fff', borderBottom: '1px solid #E5E5E5' }}>
        <div style={{ maxWidth: 1200, margin: '0 auto', display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(150px, 1fr))', gap: 32, textAlign: 'center' }}>
          {[
            { value: '847', suffix: '+', label: 'Tasks completed' },
            { value: '94', suffix: '%', label: 'QA pass rate' },
            { value: '4.2', suffix: 'h', label: 'Avg turnaround' },
            { value: '4.7', suffix: '★', label: 'Client rating' },
          ].map((s, i) => (
            <motion.div key={s.label} initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.1 }}>
              <p style={{ fontSize: 'clamp(36px, 5vw, 56px)', fontWeight: 800, letterSpacing: '-0.03em', lineHeight: 1, fontFamily: "'Inter', sans-serif" }}>
                {s.value}<span style={{ color: '#FF6B6B' }}>{s.suffix}</span>
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
            <motion.span initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} viewport={{ once: true }}
              style={{ display: 'block', fontSize: 11, fontWeight: 600, letterSpacing: '0.15em', textTransform: 'uppercase', color: '#8A8A8A', marginBottom: 12 }}>
              The process
            </motion.span>
            <motion.h2 initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}
              style={{ fontSize: 'clamp(36px, 6vw, 64px)', fontWeight: 800, letterSpacing: '-0.03em', lineHeight: 0.95, fontFamily: "'Inter', sans-serif" }}>
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
              <motion.div key={s.step} initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.1 }}>
                <div style={{
                  aspectRatio: '1', borderRadius: 24, overflow: 'hidden', position: 'relative',
                  background: 'linear-gradient(145deg, #f0f0ee, #e8e8e6)', marginBottom: 24,
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                }}>
                  <s.icon size={48} color="#1A1A2E" style={{ opacity: 0.12 }} />
                  <span style={{
                    position: 'absolute', top: 20, left: 20,
                    fontSize: 72, fontWeight: 900, color: '#1A1A2E', opacity: 0.04,
                    letterSpacing: '-0.04em', fontFamily: "'Inter', sans-serif",
                  }}>{s.step}</span>
                </div>
                <h3 style={{ fontSize: 20, fontWeight: 700, marginBottom: 8, fontFamily: "'Inter', sans-serif" }}>{s.title}</h3>
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
            <motion.span initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} viewport={{ once: true }}
              style={{ display: 'block', fontSize: 11, fontWeight: 600, letterSpacing: '0.15em', textTransform: 'uppercase', color: 'rgba(255,255,255,0.3)', marginBottom: 12 }}>
              The difference
            </motion.span>
            <motion.h2 initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}
              style={{ fontSize: 'clamp(36px, 6vw, 64px)', fontWeight: 800, letterSpacing: '-0.03em', lineHeight: 0.95, color: '#fff', fontFamily: "'Inter', sans-serif" }}>
              Not just AI.<br /><span style={{ color: '#FF6B6B' }}>Guaranteed quality.</span>
            </motion.h2>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: 24 }}>
            {[
              { icon: Bot, title: 'AI Agent Teams', desc: 'Specialized agents for research, analysis, code, and content. Each with deep domain expertise.' },
              { icon: Shield, title: 'Quality Assured', desc: 'Every deliverable passes automated QA scoring. Complex tasks get human review. No raw AI output.' },
              { icon: Clock, title: 'Fast & Reliable', desc: 'Most tasks done in 4-12 hours. Your AI team works around the clock, rain or shine.' },
            ].map((f, i) => (
              <motion.div key={f.title} initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.1 }}
                style={{
                  padding: 32, borderRadius: 16,
                  background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.06)',
                }}
              >
                <div style={{
                  width: 48, height: 48, borderRadius: 12, marginBottom: 20,
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  background: 'rgba(255,107,107,0.1)',
                }}>
                  <f.icon size={20} color="#FF6B6B" />
                </div>
                <h3 style={{ fontSize: 18, fontWeight: 700, color: '#fff', marginBottom: 8 }}>{f.title}</h3>
                <p style={{ fontSize: 14, lineHeight: 1.6, color: 'rgba(255,255,255,0.4)' }}>{f.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ━━ PRICING ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ */}
      <section id="pricing" style={{ padding: '96px 24px', background: '#F7F7F5' }}>
        <div style={{ maxWidth: 1000, margin: '0 auto' }}>
          <div style={{ textAlign: 'center', marginBottom: 64 }}>
            <motion.span initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} viewport={{ once: true }}
              style={{ display: 'block', fontSize: 11, fontWeight: 600, letterSpacing: '0.15em', textTransform: 'uppercase', color: '#8A8A8A', marginBottom: 12 }}>
              Simple pricing
            </motion.span>
            <motion.h2 initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}
              style={{ fontSize: 'clamp(36px, 6vw, 64px)', fontWeight: 800, letterSpacing: '-0.03em', lineHeight: 0.95, fontFamily: "'Inter', sans-serif" }}>
              Plans that <span style={{ color: '#FF6B6B' }}>scale</span>
            </motion.h2>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: 24 }}>
            {[
              { name: 'Starter', price: 'R499', period: '/month', features: ['20 tasks/month', 'Automated QA', '24-hour turnaround', 'Email support'], popular: false },
              { name: 'Pro', price: 'R7,999', period: '/month', features: ['80 tasks/month', 'Full human review', '12-hour turnaround', 'Priority queue', 'Slack & WhatsApp', 'Account manager'], popular: true },
              { name: 'Enterprise', price: 'Custom', period: '', features: ['Unlimited tasks', 'Senior review', '4-hour turnaround', 'API access', 'SSO & audit logs', 'SLA guarantee'], popular: false },
            ].map((plan, i) => (
              <motion.div key={plan.name} initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.1 }}
                style={{
                  borderRadius: 24, overflow: 'hidden',
                  background: plan.popular ? '#1A1A2E' : '#fff',
                  border: plan.popular ? 'none' : '1px solid #E5E5E5',
                  color: plan.popular ? '#fff' : '#1A1A2E',
                }}
              >
                <div style={{ padding: 32 }}>
                  {plan.popular && <span style={{ fontSize: 10, letterSpacing: '0.1em', textTransform: 'uppercase', fontWeight: 600, color: '#FF6B6B', display: 'block', marginBottom: 16 }}>Most popular</span>}
                  <h3 style={{ fontSize: 18, fontWeight: 700, marginBottom: 16 }}>{plan.name}</h3>
                  <div style={{ display: 'flex', alignItems: 'baseline', gap: 4, marginBottom: 24 }}>
                    <span style={{ fontSize: 40, fontWeight: 800, letterSpacing: '-0.02em', fontFamily: "'Inter', sans-serif" }}>{plan.price}</span>
                    <span style={{ color: plan.popular ? 'rgba(255,255,255,0.4)' : '#8A8A8A' }}>{plan.period}</span>
                  </div>
                  <ul style={{ listStyle: 'none', padding: 0, margin: 0, marginBottom: 32 }}>
                    {plan.features.map(f => (
                      <li key={f} style={{ display: 'flex', alignItems: 'center', gap: 8, fontSize: 14, marginBottom: 12, color: plan.popular ? 'rgba(255,255,255,0.6)' : '#6B6B6B' }}>
                        <CheckCircle2 size={16} color={plan.popular ? '#FF6B6B' : '#4A7C28'} style={{ flexShrink: 0 }} /> {f}
                      </li>
                    ))}
                  </ul>
                  <Link to="/auth/signup" style={{
                    display: 'block', textAlign: 'center', padding: '14px 0', borderRadius: 100,
                    fontSize: 14, fontWeight: 600, textDecoration: 'none',
                    background: plan.popular ? '#FF6B6B' : '#1A1A2E', color: '#fff',
                  }}>
                    {plan.price === 'Custom' ? 'Contact us' : 'Start free'}
                  </Link>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ━━ TESTIMONIALS ━━━━━━━━━━━━━━━━━━━━━━━━━━━ */}
      <section style={{ padding: '96px 24px' }}>
        <div style={{ maxWidth: 1200, margin: '0 auto' }}>
          <div style={{ textAlign: 'center', marginBottom: 64 }}>
            <motion.h2 initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}
              style={{ fontSize: 'clamp(36px, 6vw, 64px)', fontWeight: 800, letterSpacing: '-0.03em', lineHeight: 0.95, fontFamily: "'Inter', sans-serif" }}>
              Loved by <span style={{ color: '#FF6B6B' }}>teams</span>
            </motion.h2>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: 24 }}>
            {[
              { quote: "We replaced our research analyst with My-Agentcy. Same quality, 10x faster, a fraction of the cost.", name: "Sarah J.", role: "CEO, TechFlow" },
              { quote: "The QA layer is what sold us. We tried raw AI before — garbage in, garbage out. My-Agentcy guarantees the output.", name: "Mike S.", role: "CTO, DataDriven" },
              { quote: "Our marketing team now produces 3x the content at half the budget. The ROI was immediate.", name: "Emma W.", role: "CMO, GrowthLabs" },
            ].map((t, i) => (
              <motion.div key={i} initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.1 }}
                style={{ padding: 32, borderRadius: 24, background: '#F7F7F5', border: '1px solid #E5E5E5' }}
              >
                <div style={{ display: 'flex', gap: 2, marginBottom: 16 }}>
                  {[...Array(5)].map((_, j) => <Star key={j} size={16} color="#FF6B6B" fill="#FF6B6B" />)}
                </div>
                <p style={{ fontSize: 15, lineHeight: 1.6, color: '#4A4A4A', marginBottom: 24 }}>"{t.quote}"</p>
                <p style={{ fontSize: 14, fontWeight: 600 }}>{t.name}</p>
                <p style={{ fontSize: 12, color: '#8A8A8A' }}>{t.role}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ━━ CTA ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ */}
      <section style={{ padding: '96px 24px', background: '#1A1A2E' }}>
        <div style={{ maxWidth: 700, margin: '0 auto', textAlign: 'center' }}>
          <motion.h2 initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}
            style={{ fontSize: 'clamp(36px, 6vw, 64px)', fontWeight: 800, letterSpacing: '-0.03em', lineHeight: 0.95, color: '#fff', marginBottom: 24, fontFamily: "'Inter', sans-serif" }}>
            Ready to scale?
          </motion.h2>
          <motion.p initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} viewport={{ once: true }}
            style={{ fontSize: 18, color: 'rgba(255,255,255,0.4)', marginBottom: 40 }}>
            Your AI team is waiting. Start with a free task today.
          </motion.p>
          <motion.div initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} viewport={{ once: true }}>
            <Link to="/auth/signup" style={{
              display: 'inline-flex', alignItems: 'center', gap: 8,
              padding: '16px 32px', borderRadius: 100,
              background: '#FF6B6B', color: '#fff',
              fontSize: 15, fontWeight: 600, textDecoration: 'none',
              boxShadow: '0 8px 30px rgba(255,107,107,0.3)',
            }}>
              Get started free <ArrowRight size={16} />
            </Link>
          </motion.div>
        </div>
      </section>

      {/* ━━ FOOTER ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ */}
      <footer style={{ padding: '40px 24px', borderTop: '1px solid #E5E5E5' }}>
        <div style={{ maxWidth: 1200, margin: '0 auto', display: 'flex', flexWrap: 'wrap', alignItems: 'center', justifyContent: 'space-between', gap: 16 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            <Zap size={16} color="#8A8A8A" />
            <span style={{ fontSize: 14, color: '#8A8A8A' }}>My-Agentcy by Agentcy.co.za</span>
          </div>
          <p style={{ fontSize: 12, color: '#ABABAB' }}>Leaders in Software. Experts in Intelligence.</p>
        </div>
      </footer>

    </div>
  )
}
