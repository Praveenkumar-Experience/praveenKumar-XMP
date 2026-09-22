import { useEffect, useLayoutEffect, useRef, useState } from 'react'
import { NavLink, useLocation, useNavigate } from 'react-router-dom'
import gsap from 'gsap'
import {
  LayoutDashboard,
  Network,
  ArrowLeftRight,
  Settings,
  Store,
  Megaphone,
  Activity,
  MessageSquare,
  Star,
  BarChart2,
  LayoutGrid,
  GraduationCap,
  ChevronDown,
  LogOut,
  Building2,
  Users2,
  UsersRound,
  ShieldAlert,
  UserCheck,
  MessageCircle,
} from 'lucide-react'
import { prefersReducedMotion } from '../hooks/use-reduced-motion.js'
import { ACCENT } from '../theme.js'
import logo from '../assets/experience-logo.png'
import './NavBar.css'

// Account menu: single-account modules (mirrors the account-scoped nav in the
// product recording — Dashboard, Hierarchy, Transactions, Settings, Apps...).
const ACCOUNT_FLAT_LINKS = [
  { to: '/dashboard', label: 'Dashboard', end: true, icon: LayoutDashboard },
  { to: '/hierarchy', label: 'Hierarchy', icon: Network },
  { to: '/settings', label: 'Settings', icon: Settings },
]

const ACCOUNT_GROUPS = [
  { id: 'transactions', label: 'Transactions', icon: ArrowLeftRight, defaultOpen: false, children: [
    { to: '/transactions', label: 'Overview', end: true },
  ] },
]

const ACCOUNT_APPS_FLAT_LINKS = [
  { to: '/listings', label: 'Listings', icon: Store },
]

const ACCOUNT_APPS_GROUPS = [
  { id: 'campaigns', label: 'Campaigns', icon: Megaphone, defaultOpen: false, children: [
    { to: '/campaigns', label: 'All Campaigns', end: true },
  ] },
]

const ACCOUNT_APPS_FLAT_LINKS_2 = [
  { to: '/transaction-monitor', label: 'Transaction Monitor', icon: Activity },
  { to: '/social-posts', label: 'Social Posts', icon: MessageSquare },
  { to: '/reviews-management', label: 'Reviews Management', icon: Star },
]

const ACCOUNT_APPS_FLAT_LINKS_3 = [
  { to: '/reports', label: 'Reports', icon: BarChart2 },
  { to: '/widgets', label: 'Widgets', icon: LayoutGrid },
  { to: '/learning-hub', label: 'Learning Hub', icon: GraduationCap },
]

// Organization menu: platform-wide, super-admin modules spanning every
// organization/account (new — not present anywhere in the account menu).
const ORGANIZATION_FLAT_LINKS = [
  { to: '/organization/accounts', label: 'Accounts', end: true, icon: Building2 },
  { to: '/organization/admins', label: 'Admins', icon: Users2 },
  { to: '/organization/groups', label: 'Groups', icon: UsersRound },
  { to: '/organization/abusive-reviews', label: 'Abusive Review Management', icon: ShieldAlert },
  { to: '/organization/individual-profiles', label: 'Individual Profiles', icon: UserCheck },
  { to: '/organization/chatbot-history', label: 'Chatbot History', icon: MessageCircle },
  { to: '/organization/reports', label: 'Reports', icon: BarChart2 },
  { to: '/organization/settings', label: 'Settings', icon: Settings },
]

function isLinkActive(link, pathname) {
  return link.end ? pathname === link.to : pathname.startsWith(link.to)
}

function FlatLink({ link }) {
  const Icon = link.icon
  return (
    <li>
      <NavLink to={link.to} end={link.end} className={({ isActive }) => `nav-link${isActive ? ' is-active' : ''}`}>
        <Icon className="nav-link-icon" size={17} strokeWidth={2} aria-hidden="true" />
        <span>{link.label}</span>
      </NavLink>
    </li>
  )
}

function NavGroup({ group }) {
  const location = useLocation()
  const isGroupRoute = group.children.some((link) => isLinkActive(link, location.pathname))
  const [open, setOpen] = useState(group.defaultOpen || isGroupRoute)
  const pillRef = useRef(null)
  const linkRefs = useRef({})
  const pillReady = useRef(false)

  useLayoutEffect(() => {
    if (!open) return
    const active = group.children.find((link) => isLinkActive(link, location.pathname))
    const el = active && linkRefs.current[active.to]
    const pill = pillRef.current
    if (!el || !pill) return

    // Animate position via `y` (GPU-accelerated transform) instead of `top`;
    // height rarely changes between same-sized nav rows, so it's set instantly.
    gsap.set(pill, { height: el.offsetHeight })
    if (!pillReady.current || prefersReducedMotion()) {
      gsap.set(pill, { y: el.offsetTop, opacity: 1 })
      pillReady.current = true
      return
    }
    gsap.to(pill, { y: el.offsetTop, opacity: 1, duration: 0.4, ease: 'power3.out' })
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [location.pathname, open])

  const Icon = group.icon

  return (
    <li className="nav-group">
      <button
        type="button"
        className={`nav-group-header${isGroupRoute ? ' is-active' : ''}`}
        onClick={() => setOpen((v) => !v)}
        aria-expanded={open}
      >
        <Icon className="nav-link-icon" size={17} strokeWidth={2} aria-hidden="true" />
        <span>{group.label}</span>
        <ChevronDown className={`nav-chevron${open ? ' is-open' : ''}`} size={14} strokeWidth={2} aria-hidden="true" />
      </button>
      {open && (
        <ul className="nav-sublinks">
          <li ref={pillRef} className="nav-pill" aria-hidden="true" />
          {group.children.map((link) => {
            const ChildIcon = link.icon
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
                  {ChildIcon && <ChildIcon className="nav-link-icon" size={17} strokeWidth={2} aria-hidden="true" />}
                  <span>{link.label}</span>
                </NavLink>
              </li>
            )
          })}
        </ul>
      )}
    </li>
  )
}

export default function NavBar({ accent = ACCENT }) {
  const navigate = useNavigate()
  const location = useLocation()
  const isOrganization = location.pathname.startsWith('/organization')

  useEffect(() => {
    if (prefersReducedMotion()) return
    const targets = '.nav-link, .nav-group-header, .nav-section-label'
    const tween = gsap.fromTo(
      targets,
      { opacity: 0, x: -10 },
      { opacity: 1, x: 0, stagger: 0.04, duration: 0.35, ease: 'power2.out', delay: 0.05, overwrite: true }
    )
    // StrictMode double-invokes this effect in dev, which can interrupt the
    // tween mid-flight and leave nav items stuck at opacity 0 — force the
    // resolved visible state on cleanup so re-mounts never strand them.
    return () => {
      tween.kill()
      gsap.set(targets, { opacity: 1, x: 0 })
    }
  }, [isOrganization])

  return (
    <nav className="nav-bar" style={{ '--nav-accent': accent }}>
      <img src={logo} alt="Experience.com" className="nav-brand" />

      <div className="nav-menu-switch" role="tablist" aria-label="Menu scope">
        <button
          type="button"
          role="tab"
          aria-selected={!isOrganization}
          className={`nav-menu-switch-btn${!isOrganization ? ' is-active' : ''}`}
          onClick={() => navigate('/dashboard')}
        >
          Account
        </button>
        <button
          type="button"
          role="tab"
          aria-selected={isOrganization}
          className={`nav-menu-switch-btn${isOrganization ? ' is-active' : ''}`}
          onClick={() => navigate('/organization/accounts')}
        >
          Organization
        </button>
      </div>

      <ul className="nav-links">
        {isOrganization ? (
          ORGANIZATION_FLAT_LINKS.map((link) => <FlatLink key={link.to} link={link} />)
        ) : (
          <>
            {ACCOUNT_FLAT_LINKS.map((link) => <FlatLink key={link.to} link={link} />)}
            {ACCOUNT_GROUPS.map((group) => <NavGroup key={group.id} group={group} />)}
            <li className="nav-section-label">Apps</li>
            {ACCOUNT_APPS_FLAT_LINKS.map((link) => <FlatLink key={link.to} link={link} />)}
            {ACCOUNT_APPS_GROUPS.map((group) => <NavGroup key={group.id} group={group} />)}
            {ACCOUNT_APPS_FLAT_LINKS_2.map((link) => <FlatLink key={link.to} link={link} />)}
            {ACCOUNT_APPS_FLAT_LINKS_3.map((link) => <FlatLink key={link.to} link={link} />)}
          </>
        )}
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
