import { useMemo, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Building2, AlertTriangle, X, Search } from 'lucide-react'
import PageHeader from './PageHeader.jsx'
import './Organization.css'
import { ACCOUNTS_PENDING_DEACTIVATION, ACCOUNT_TABS, ORG_ACCOUNTS } from '../organizationData.js'

export default function OrgAccounts() {
  const navigate = useNavigate()
  const [tab, setTab] = useState('All Accounts')
  const [bannerOpen, setBannerOpen] = useState(true)
  const [search, setSearch] = useState('')
  const [status, setStatus] = useState('')

  const rows = useMemo(() => {
    const q = search.trim().toLowerCase()
    return ORG_ACCOUNTS.filter((a) => {
      if (q && !a.name.toLowerCase().includes(q)) return false
      if (status && a.status !== status) return false
      return true
    })
  }, [search, status])

  return (
    <div className="org-page">
      <PageHeader icon={Building2} title="Accounts" subtitle="All accounts across every organization on the platform." />

      {bannerOpen && (
        <div className="org-banner">
          <AlertTriangle size={16} />
          <span>Action Required: {ACCOUNTS_PENDING_DEACTIVATION} accounts have requested deactivation.</span>
          <button type="button" onClick={() => setBannerOpen(false)} aria-label="Dismiss">
            <X size={15} />
          </button>
        </div>
      )}

      <div className="org-tabs">
        {ACCOUNT_TABS.map((t) => (
          <button key={t} type="button" className={`org-tab${tab === t ? ' is-active' : ''}`} onClick={() => setTab(t)}>
            {t}
          </button>
        ))}
      </div>

      <div className="org-with-filters">
        <aside className="org-filters-card">
          <span className="org-filters-title">Filter Accounts</span>
          <label className="org-filter-field">
            <span>Search</span>
            <div className="org-search-wrap">
              <Search size={14} className="org-search-icon" />
              <input className="org-search-input" type="text" placeholder="e.g. Account name" value={search} onChange={(e) => setSearch(e.target.value)} />
            </div>
          </label>
          <label className="org-filter-field">
            <span>Status</span>
            <select value={status} onChange={(e) => setStatus(e.target.value)}>
              <option value="">Select Status</option>
              <option value="Active">Active</option>
              <option value="Onboarding">Onboarding</option>
            </select>
          </label>
          <label className="org-filter-field">
            <span>Username</span>
            <input type="text" placeholder="Search by username" />
          </label>
        </aside>

        <div className="org-card">
          <table className="org-table">
            <thead>
              <tr>
                <th>Accounts</th>
                <th>Tiers</th>
                <th>Users</th>
                <th>Info</th>
                <th>Activated On</th>
                <th>Status</th>
                <th aria-label="Action" />
              </tr>
            </thead>
            <tbody>
              {rows.map((a) => (
                <tr key={a.id}>
                  <td>
                    <button type="button" className="org-cell-link org-cell-link-btn" onClick={() => navigate('/dashboard')}>
                      {a.name}
                    </button>
                  </td>
                  <td>{a.tiers}</td>
                  <td>{a.users}</td>
                  <td>{a.info ? <span className="org-badge" style={{ background: '#fef3e2', color: '#b45309' }}>{a.info}</span> : '–'}</td>
                  <td>{a.activatedOn ?? '–'}</td>
                  <td>
                    <span className={`org-status org-status-${a.status.toLowerCase()}`}>{a.status}</span>
                  </td>
                  <td>
                    <button type="button" className="org-view-btn">View</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}
