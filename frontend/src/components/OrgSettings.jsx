import { useState } from 'react'
import { Settings, Send, Ban, Zap, Mail, Server, ArrowLeft } from 'lucide-react'
import PageHeader from './PageHeader.jsx'
import './Organization.css'
import { PROMO_CODES, ENGAGEMENT_TILES, SMTP_USERS } from '../organizationData.js'

const TILE_ICONS = {
  'Senders Info': Send,
  'Unsubscribed Domains': Ban,
  Triggers: Zap,
  'Email Service Provider': Mail,
  'SMTP Users': Server,
}

export default function OrgSettings() {
  const [tab, setTab] = useState('promo')
  const [smtpOpen, setSmtpOpen] = useState(false)

  return (
    <div className="org-page">
      <PageHeader icon={Settings} title="Settings" subtitle="Platform-wide promo codes and engagement configuration." />

      <div className="org-tabs">
        <button type="button" className={`org-tab${tab === 'promo' ? ' is-active' : ''}`} onClick={() => setTab('promo')}>Promo Codes</button>
        <button type="button" className={`org-tab${tab === 'engagement' ? ' is-active' : ''}`} onClick={() => { setTab('engagement'); setSmtpOpen(false) }}>Manage Engagement</button>
      </div>

      {tab === 'promo' && (
        <div className="org-card">
          <table className="org-table">
            <thead>
              <tr>
                <th>Promo Code</th>
                <th>Assigned To</th>
                <th>Subscription Pack</th>
                <th>No. Of Users</th>
                <th>Applicable To</th>
                <th>Discount</th>
                <th>Expiry Date</th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody>
              {PROMO_CODES.map((p) => (
                <tr key={p.id}>
                  <td className="org-cell-mono org-cell-link">{p.code}</td>
                  <td>{p.assignedTo}</td>
                  <td>{p.pack}</td>
                  <td>{p.users}</td>
                  <td>{p.applicableTo}</td>
                  <td>${p.discount}</td>
                  <td>{p.expiry}</td>
                  <td>
                    <span className="org-status org-status-active">{p.status}</span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {tab === 'engagement' && !smtpOpen && (
        <div className="org-engagement-grid">
          {ENGAGEMENT_TILES.map((label) => {
            const Icon = TILE_ICONS[label]
            const clickable = label === 'SMTP Users'
            return (
              <button
                key={label}
                type="button"
                className="org-engagement-tile"
                onClick={() => clickable && setSmtpOpen(true)}
                disabled={!clickable}
              >
                <span className="org-engagement-icon"><Icon size={20} /></span>
                {label}
              </button>
            )
          })}
        </div>
      )}

      {tab === 'engagement' && smtpOpen && (
        <div>
          <button type="button" className="org-back-link" onClick={() => setSmtpOpen(false)}>
            <ArrowLeft size={14} /> Manage Engagement
          </button>
          <div className="org-card">
            <table className="org-table">
              <thead>
                <tr>
                  <th>Domain Name</th>
                  <th>User Name</th>
                  <th>Domain Address</th>
                  <th>Authentication Type</th>
                  <th>TLS</th>
                  <th>Status</th>
                </tr>
              </thead>
              <tbody>
                {SMTP_USERS.map((s) => (
                  <tr key={s.id}>
                    <td>{s.domain}</td>
                    <td className="org-cell-mono">{s.user}</td>
                    <td>{s.address}</td>
                    <td>{s.auth}</td>
                    <td>{s.tls ? 'true' : 'false'}</td>
                    <td>
                      <span className="org-status org-status-active">{s.status}</span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  )
}
