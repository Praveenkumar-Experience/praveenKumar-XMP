import { useState } from 'react'
import { Network, Building2, Landmark, ChevronRight, ChevronLeft } from 'lucide-react'
import PageHeader from './PageHeader.jsx'
import './Hierarchy.css'
import { ORGANIZATIONS, ACCOUNTS } from '../transactionData.js'
import { USERS } from '../autopostData.js'

export default function Hierarchy() {
  const [orgId, setOrgId] = useState(null)
  const [accountId, setAccountId] = useState(null)

  const org = orgId ? ORGANIZATIONS.find((o) => o.id === orgId) : null
  const account = accountId ? ACCOUNTS.find((a) => a.id === accountId) : null

  const accountsInOrg = org ? ACCOUNTS.filter((a) => a.orgId === org.id) : []
  const usersInAccount = account ? USERS.filter((u) => u.accountId === account.id) : []

  return (
    <div className="hi-page">
      <PageHeader icon={Network} title="Hierarchy" subtitle="Drill into an organization to see its accounts, then its users." />

      <div className="hi-breadcrumb">
        <button type="button" className="hi-crumb" onClick={() => { setOrgId(null); setAccountId(null) }}>
          Organizations
        </button>
        {org && (
          <>
            <ChevronRight size={14} className="hi-crumb-sep" />
            <button type="button" className="hi-crumb" onClick={() => setAccountId(null)}>{org.name}</button>
          </>
        )}
        {account && (
          <>
            <ChevronRight size={14} className="hi-crumb-sep" />
            <span className="hi-crumb is-current">{account.name}</span>
          </>
        )}
      </div>

      <div className="hi-card">
        {!org && (
          <ul className="hi-list">
            {ORGANIZATIONS.map((o) => (
              <li key={o.id}>
                <button type="button" className="hi-row" onClick={() => setOrgId(o.id)}>
                  <span className="hi-badge" style={{ background: `${o.color}22`, color: o.color }}>
                    <Building2 size={16} />
                  </span>
                  <span className="hi-row-main">
                    <span className="hi-row-name">{o.name}</span>
                    <span className="hi-row-sub">{ACCOUNTS.filter((a) => a.orgId === o.id).length} accounts · {o.verifiedUsers.toLocaleString()} verified users</span>
                  </span>
                  <ChevronRight size={16} className="hi-row-chevron" />
                </button>
              </li>
            ))}
          </ul>
        )}

        {org && !account && (
          <>
            <button type="button" className="hi-back" onClick={() => setOrgId(null)}>
              <ChevronLeft size={14} /> Back to Organizations
            </button>
            {accountsInOrg.length === 0 ? (
              <div className="hi-empty">No accounts under this organization.</div>
            ) : (
              <ul className="hi-list">
                {accountsInOrg.map((a) => (
                  <li key={a.id}>
                    <button type="button" className="hi-row" onClick={() => setAccountId(a.id)}>
                      <span className="hi-badge" style={{ background: `${a.color}22`, color: a.color }}>
                        <Landmark size={16} />
                      </span>
                      <span className="hi-row-main">
                        <span className="hi-row-name">{a.name}</span>
                        <span className="hi-row-sub">{USERS.filter((u) => u.accountId === a.id).length} users · {a.verifiedUsers.toLocaleString()} verified users</span>
                      </span>
                      <ChevronRight size={16} className="hi-row-chevron" />
                    </button>
                  </li>
                ))}
              </ul>
            )}
          </>
        )}

        {account && (
          <>
            <button type="button" className="hi-back" onClick={() => setAccountId(null)}>
              <ChevronLeft size={14} /> Back to {org.name}
            </button>
            {usersInAccount.length === 0 ? (
              <div className="hi-empty">No users under this account.</div>
            ) : (
              <ul className="hi-list">
                {usersInAccount.map((u) => (
                  <li key={u.id}>
                    <div className="hi-row hi-row-static">
                      <span className="hi-badge" style={{ background: `${u.color}22`, color: u.color }}>
                        {u.initial}
                      </span>
                      <span className="hi-row-main">
                        <span className="hi-row-name">{u.name}</span>
                        <span className="hi-row-sub">{u.email}</span>
                      </span>
                      <span className="hi-role-badge">{u.role}</span>
                    </div>
                  </li>
                ))}
              </ul>
            )}
          </>
        )}
      </div>
    </div>
  )
}
