import { useState } from 'react'
import { useNavigate, useLocation } from 'react-router-dom'
import { Mail, Lock } from 'lucide-react'
import { ACCENT } from '../theme.js'
import logo from '../assets/experience-logo.png'
import './SignIn.css'

export default function SignIn() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const navigate = useNavigate()
  const location = useLocation()

  function handleSubmit(e) {
    e.preventDefault()
    if (!email || !password) return
    localStorage.setItem('exp_authed', 'true')
    navigate(location.state?.from ?? '/', { replace: true })
  }

  return (
    <div className="signin-page" style={{ '--signin-accent': ACCENT }}>
      <div className="signin-card">
        <img src={logo} alt="Experience.com" className="signin-brand" />
        <h1 className="signin-title">Sign in</h1>
        <p className="signin-subtitle">Welcome back. Enter any email and password to continue.</p>

        <form className="signin-form" onSubmit={handleSubmit}>
          <label className="signin-field">
            <span>Email</span>
            <div className="signin-input">
              <Mail size={16} strokeWidth={2} aria-hidden="true" />
              <input
                type="email"
                autoComplete="email"
                placeholder="you@company.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>
          </label>

          <label className="signin-field">
            <span>Password</span>
            <div className="signin-input">
              <Lock size={16} strokeWidth={2} aria-hidden="true" />
              <input
                type="password"
                autoComplete="current-password"
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>
          </label>

          <button type="submit" className="signin-submit">Sign in</button>
        </form>
      </div>
    </div>
  )
}
