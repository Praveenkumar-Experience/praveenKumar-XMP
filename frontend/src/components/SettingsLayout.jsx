import { NavLink, Outlet } from 'react-router-dom'
import { Settings } from 'lucide-react'
import PageHeader from './PageHeader.jsx'
import './SettingsLayout.css'

const TABS = [
  { to: '/settings/account', label: 'Account settings' },
  { to: '/settings/autopost', label: 'Autopost settings' },
  { to: '/settings/ingestion', label: 'Ingestion settings' },
  { to: '/settings/analytics', label: 'Analytics Dashboard' },
]

export default function SettingsLayout() {
  return (
    <div className="set-page">
      <div className="set-top">
        <PageHeader icon={Settings} title="Settings" subtitle="Manage your account, autopost, ingestion, and analytics configuration." />
        <div className="set-tabs">
          {TABS.map((tab) => (
            <NavLink key={tab.to} to={tab.to} className={({ isActive }) => `set-tab${isActive ? ' is-active' : ''}`}>
              {tab.label}
            </NavLink>
          ))}
        </div>
      </div>
      <Outlet />
    </div>
  )
}
