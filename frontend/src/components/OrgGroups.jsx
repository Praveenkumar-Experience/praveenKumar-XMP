import { useState } from 'react'
import { UsersRound } from 'lucide-react'
import PageHeader from './PageHeader.jsx'
import './Organization.css'
import { ADMIN_GROUPS, ONBOARDING_ADMINS, INCOMPLETE_PROFILES } from '../organizationData.js'

export default function OrgGroups() {
  const [tab, setTab] = useState('onboarding')

  return (
    <div className="org-page">
      <PageHeader icon={UsersRound} title="Groups" subtitle="Admin groups and onboarding coverage across the platform." />

      <div className="org-tabs">
        <button type="button" className={`org-tab${tab === 'admin' ? ' is-active' : ''}`} onClick={() => setTab('admin')}>Admin Groups</button>
        <button type="button" className={`org-tab${tab === 'onboarding' ? ' is-active' : ''}`} onClick={() => setTab('onboarding')}>Onboarding Dashboard</button>
      </div>

      {tab === 'admin' ? (
        <div className="org-card">
          <table className="org-table">
            <thead>
              <tr>
                <th>Group Name</th>
                <th>Members</th>
              </tr>
            </thead>
            <tbody>
              {ADMIN_GROUPS.map((g) => (
                <tr key={g.id}>
                  <td className="org-cell-link">{g.name}</td>
                  <td>{g.members}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : (
        <>
          <span className="org-section-title">Onboarding Admins</span>
          <div className="org-onboarding-grid">
            {ONBOARDING_ADMINS.map((a) => (
              <div key={a.id} className="org-card org-onboarding-card">
                <span className="org-onboarding-name">{a.name}</span>
                <div className="org-onboarding-stats">
                  <div><strong>{a.accounts}</strong><span>Accounts</span></div>
                  <div><strong>{a.users}</strong><span>Users</span></div>
                  <div><strong>{a.industries}</strong><span>Industries</span></div>
                </div>
              </div>
            ))}
          </div>

          <span className="org-section-title">Incomplete Profiles</span>
          <div className="org-card">
            <table className="org-table">
              <thead>
                <tr>
                  <th>Accounts</th>
                  <th>User Profiles</th>
                  <th>Location</th>
                  <th>Onboarding Admin</th>
                </tr>
              </thead>
              <tbody>
                {INCOMPLETE_PROFILES.map((p) => (
                  <tr key={p.id}>
                    <td className="org-cell-link">{p.account}</td>
                    <td>{p.userProfiles}</td>
                    <td>{p.location}</td>
                    <td>{p.admin}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </>
      )}
    </div>
  )
}
