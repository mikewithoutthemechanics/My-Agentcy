import { Routes, Route, Navigate, BrowserRouter } from 'react-router-dom'
import Landing from './pages/landing/Landing'
import AdminApp from './AdminApp'
import './index.css'

// Auth pages — simple inline
import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { Zap, Eye, EyeOff } from 'lucide-react'

function LoginPage() {
  const nav = useNavigate()
  const [show, setShow] = useState(false)
  return (
    <div style={{ minHeight: '100vh', background: '#FAFAF8', display: 'flex' }}>
      <div style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 24 }}>
        <div style={{ width: '100%', maxWidth: 380 }}>
          <Link to="/" style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 40, textDecoration: 'none' }}>
            <div style={{ width: 32, height: 32, borderRadius: 8, background: '#1A1A2E', display: 'flex', alignItems: 'center', justifyContent: 'center' }}><Zap size={16} color="#FF6B6B" /></div>
            <span style={{ fontSize: 17, fontWeight: 700, color: '#1A1A2E', fontFamily: "'Inter', sans-serif" }}>My-Agentcy</span>
          </Link>
          <h1 style={{ fontSize: 32, fontWeight: 800, letterSpacing: '-0.02em', marginBottom: 8, fontFamily: "'Inter', sans-serif" }}>Welcome back</h1>
          <p style={{ color: '#8A8A8A', fontSize: 14, marginBottom: 32 }}>Sign in to your account</p>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
            <div>
              <label style={{ display: 'block', fontSize: 10, color: '#8A8A8A', letterSpacing: '0.08em', textTransform: 'uppercase', marginBottom: 6 }}>Email</label>
              <input type="email" style={{ width: '100%', border: '1px solid #E5E5E5', borderRadius: 12, padding: '12px 16px', fontSize: 14, boxSizing: 'border-box' }} placeholder="you@company.com" />
            </div>
            <div>
              <label style={{ display: 'block', fontSize: 10, color: '#8A8A8A', letterSpacing: '0.08em', textTransform: 'uppercase', marginBottom: 6 }}>Password</label>
              <div style={{ position: 'relative' }}>
                <input type={show ? 'text' : 'password'} style={{ width: '100%', border: '1px solid #E5E5E5', borderRadius: 12, padding: '12px 16px', fontSize: 14, boxSizing: 'border-box', paddingRight: 40 }} placeholder="••••••••" />
                <button onClick={() => setShow(!show)} style={{ position: 'absolute', right: 12, top: '50%', transform: 'translateY(-50%)', background: 'none', border: 'none', cursor: 'pointer', color: '#ABABAB' }}>
                  {show ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
            </div>
            <button onClick={() => nav('/app/dashboard')} style={{ width: '100%', padding: '14px 0', borderRadius: 12, background: '#1A1A2E', color: '#fff', border: 'none', fontSize: 14, fontWeight: 600, cursor: 'pointer' }}>Sign in</button>
          </div>
          <p style={{ textAlign: 'center', fontSize: 14, color: '#8A8A8A', marginTop: 24 }}>Don't have an account? <Link to="/auth/signup" style={{ color: '#1A1A2E', fontWeight: 500 }}>Sign up</Link></p>
        </div>
      </div>
      <div style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', background: '#1A1A2E' }} className="auth-panel-desktop">
        <div style={{ maxWidth: 360, textAlign: 'center', padding: 40 }}>
          <Zap size={48} color="#FF6B6B" style={{ margin: '0 auto 24px' }} />
          <h2 style={{ fontSize: 28, fontWeight: 800, color: '#fff', marginBottom: 16, lineHeight: 1.1, fontFamily: "'Inter', sans-serif" }}>Your AI team,<br />reviewed & guaranteed.</h2>
          <p style={{ color: 'rgba(255,255,255,0.4)', fontSize: 14 }}>AI agent teams that deliver real work.</p>
        </div>
      </div>
    </div>
  )
}

function SignupPage() {
  const nav = useNavigate()
  const [show, setShow] = useState(false)
  return (
    <div style={{ minHeight: '100vh', background: '#FAFAF8', display: 'flex' }}>
      <div style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 24 }}>
        <div style={{ width: '100%', maxWidth: 380 }}>
          <Link to="/" style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 40, textDecoration: 'none' }}>
            <div style={{ width: 32, height: 32, borderRadius: 8, background: '#1A1A2E', display: 'flex', alignItems: 'center', justifyContent: 'center' }}><Zap size={16} color="#FF6B6B" /></div>
            <span style={{ fontSize: 17, fontWeight: 700, color: '#1A1A2E', fontFamily: "'Inter', sans-serif" }}>My-Agentcy</span>
          </Link>
          <h1 style={{ fontSize: 32, fontWeight: 800, letterSpacing: '-0.02em', marginBottom: 8, fontFamily: "'Inter', sans-serif" }}>Create your account</h1>
          <p style={{ color: '#8A8A8A', fontSize: 14, marginBottom: 32 }}>Start with a free task today</p>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
            <div>
              <label style={{ display: 'block', fontSize: 10, color: '#8A8A8A', letterSpacing: '0.08em', textTransform: 'uppercase', marginBottom: 6 }}>Company</label>
              <input style={{ width: '100%', border: '1px solid #E5E5E5', borderRadius: 12, padding: '12px 16px', fontSize: 14, boxSizing: 'border-box' }} placeholder="Acme Corp" />
            </div>
            <div>
              <label style={{ display: 'block', fontSize: 10, color: '#8A8A8A', letterSpacing: '0.08em', textTransform: 'uppercase', marginBottom: 6 }}>Email</label>
              <input type="email" style={{ width: '100%', border: '1px solid #E5E5E5', borderRadius: 12, padding: '12px 16px', fontSize: 14, boxSizing: 'border-box' }} placeholder="you@company.com" />
            </div>
            <div>
              <label style={{ display: 'block', fontSize: 10, color: '#8A8A8A', letterSpacing: '0.08em', textTransform: 'uppercase', marginBottom: 6 }}>Password</label>
              <div style={{ position: 'relative' }}>
                <input type={show ? 'text' : 'password'} style={{ width: '100%', border: '1px solid #E5E5E5', borderRadius: 12, padding: '12px 16px', fontSize: 14, boxSizing: 'border-box', paddingRight: 40 }} placeholder="••••••••" />
                <button onClick={() => setShow(!show)} style={{ position: 'absolute', right: 12, top: '50%', transform: 'translateY(-50%)', background: 'none', border: 'none', cursor: 'pointer', color: '#ABABAB' }}>
                  {show ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
            </div>
            <div>
              <label style={{ display: 'block', fontSize: 10, color: '#8A8A8A', letterSpacing: '0.08em', textTransform: 'uppercase', marginBottom: 6 }}>Plan</label>
              <select style={{ width: '100%', border: '1px solid #E5E5E5', borderRadius: 12, padding: '12px 16px', fontSize: 14, boxSizing: 'border-box', background: '#fff' }}>
                <option>Starter — R499/month</option>
                <option>Pro — R7,999/month</option>
                <option>Enterprise — Custom</option>
              </select>
            </div>
            <button onClick={() => nav('/app/dashboard')} style={{ width: '100%', padding: '14px 0', borderRadius: 12, background: '#1A1A2E', color: '#fff', border: 'none', fontSize: 14, fontWeight: 600, cursor: 'pointer' }}>Create account</button>
          </div>
          <p style={{ textAlign: 'center', fontSize: 14, color: '#8A8A8A', marginTop: 24 }}>Already have an account? <Link to="/auth/login" style={{ color: '#1A1A2E', fontWeight: 500 }}>Sign in</Link></p>
        </div>
      </div>
      <div style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', background: '#1A1A2E' }} className="auth-panel-desktop">
        <div style={{ maxWidth: 360, textAlign: 'center', padding: 40 }}>
          <Zap size={48} color="#FF6B6B" style={{ margin: '0 auto 24px' }} />
          <h2 style={{ fontSize: 28, fontWeight: 800, color: '#fff', marginBottom: 16, lineHeight: 1.1, fontFamily: "'Inter', sans-serif" }}>Join 50+ businesses<br />using AI teams.</h2>
          <p style={{ color: 'rgba(255,255,255,0.4)', fontSize: 14 }}>Reports, analysis, code, content — delivered and guaranteed.</p>
        </div>
      </div>
    </div>
  )
}

export default function App() {
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
