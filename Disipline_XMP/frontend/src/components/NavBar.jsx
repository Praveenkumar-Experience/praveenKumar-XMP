import { useEffect, useLayoutEffect, useRef } from 'react'
import { NavLink, useLocation, useNavigate } from 'react-router-dom'
import gsap from 'gsap'
import { Database, Send, LogOut } from 'lucide-react'
import { prefersReducedMotion } from '../hooks/use-reduced-motion.js'
import { ACCENT } from '../theme.js'
import './NavBar.css'

const LINKS = [
  { to: '/ingestion-settings', label: 'Ingestion Settings', end: true, icon: Database },
  { to: '/autopost-settings', label: 'Autopost Settings', icon: Send },
]

export default function NavBar({ accent = ACCENT }) {
  const location = useLocation()
  const navigate = useNavigate()
  const pillRef = useRef(null)
  const linkRefs = useRef({})
  const pillReady = useRef(false)

  useLayoutEffect(() => {
    const active = LINKS.find((link) => (link.end ? location.pathname === link.to : location.pathname.startsWith(link.to)))
    const el = active && linkRefs.current[active.to]
    const pill = pillRef.current
    if (!el || !pill) return

    const target = { top: el.offsetTop, height: el.offsetHeight, opacity: 1 }
    if (!pillReady.current || prefersReducedMotion()) {
      gsap.set(pill, target)
      pillReady.current = true
      return
    }
    gsap.to(pill, { ...target, duration: 0.4, ease: 'power3.out' })
  }, [location.pathname])

  useEffect(() => {
    if (prefersReducedMotion()) return
    gsap.from('.nav-link', { opacity: 0, x: -10, stagger: 0.05, duration: 0.35, ease: 'power2.out', delay: 0.05 })
  }, [])

  return (
    <nav className="nav-bar" style={{ '--nav-accent': accent }}>
      <span className="nav-brand">Experience.com</span>
      <ul className="nav-links">
        <li ref={pillRef} className="nav-pill" aria-hidden="true" />
        {LINKS.map((link) => {
          const Icon = link.icon
          return (
            <li key={link.to}>
              <NavLink
                ref={(el) => {
                  linkRefs.current[link.to] = el
                }}
                to={link.to}
                end={link.end}
                className={({ isActive }) => `nav-link${isActive ? ' is-active' : ''}`}
              >
                <Icon className="nav-link-icon" size={17} strokeWidth={2} aria-hidden="true" />
                <span>{link.label}</span>
              </NavLink>
            </li>
          )
        })}
      </ul>
      <button
        type="button"
        className="nav-link nav-logout"
        onClick={() => {
          localStorage.removeItem('exp_authed')
          navigate('/signin', { replace: true })
        }}
      >
        <LogOut className="nav-link-icon" size={17} strokeWidth={2} aria-hidden="true" />
        <span>Log out</span>
      </button>
    </nav>
  )
}
