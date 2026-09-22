import { useState } from 'react'
import { UserCheck, Check, X } from 'lucide-react'
import PageHeader from './PageHeader.jsx'
import './Organization.css'
import { EMAIL_VERIFICATION_TABS, EMAIL_VERIFICATIONS } from '../organizationData.js'

export default function OrgIndividualProfiles() {
  const [tab, setTab] = useState('Unverified')
  const [rows, setRows] = useState(EMAIL_VERIFICATIONS)

  function setStatus(id, status) {
    setRows((prev) => prev.map((r) => (r.id === id ? { ...r, status } : r)))
  }

  const visible = rows.filter((r) => r.status === tab)

  return (
    <div className="org-page">
      <PageHeader icon={UserCheck} title="Individual Profiles" subtitle="Email verification requests for claimed professional profiles." />

      <div className="org-tabs">
        {EMAIL_VERIFICATION_TABS.map((t) => (
          <button key={t} type="button" className={`org-tab${tab === t ? ' is-active' : ''}`} onClick={() => setTab(t)}>
            {t} <span className="org-tab-count">{rows.filter((r) => r.status === t).length}</span>
          </button>
        ))}
      </div>

      <div className="org-card">
        {visible.length > 0 ? (
          <table className="org-table">
            <thead>
              <tr>
                <th>User Information</th>
                <th>Email used to claim profile</th>
                <th>Days since profile was claimed</th>
                <th>Comments</th>
                {tab === 'Unverified' && <th aria-label="Actions" />}
              </tr>
            </thead>
            <tbody>
              {visible.map((r) => (
                <tr key={r.id}>
                  <td className="org-cell-link">{r.user}</td>
                  <td>{r.email}</td>
                  <td>{r.daysSinceClaimed}</td>
                  <td>{r.comments}</td>
                  {tab === 'Unverified' && (
                    <td>
                      <div className="org-row-actions">
                        <button type="button" className="org-icon-btn org-icon-btn-approve" onClick={() => setStatus(r.id, 'Approved')} aria-label="Approve">
                          <Check size={14} />
                        </button>
                        <button type="button" className="org-icon-btn org-icon-btn-reject" onClick={() => setStatus(r.id, 'Rejected')} aria-label="Reject">
                          <X size={14} />
                        </button>
                      </div>
                    </td>
                  )}
                </tr>
              ))}
            </tbody>
          </table>
        ) : (
          <p className="org-empty-inline">No {tab.toLowerCase()} profiles.</p>
        )}
      </div>
    </div>
  )
}
