import { useMemo, useState } from 'react'
import { Users2, Search } from 'lucide-react'
import PageHeader from './PageHeader.jsx'
import './Organization.css'
import { ADMINS, ADMIN_GROUP_LABELS } from '../organizationData.js'

export default function OrgAdmins() {
  const [search, setSearch] = useState('')

  const rows = useMemo(() => {
    const q = search.trim().toLowerCase()
    return ADMINS.filter((a) => a.name.toLowerCase().includes(q))
  }, [search])

  return (
    <div className="org-page">
      <PageHeader icon={Users2} title="Admins" subtitle="Every admin account with platform access, and the groups they belong to." />

      <div className="org-search-wrap org-search-standalone">
        <Search size={14} className="org-search-icon" />
        <input className="org-search-input" type="text" placeholder="Search admins" value={search} onChange={(e) => setSearch(e.target.value)} />
      </div>

      <div className="org-card">
        <table className="org-table">
          <thead>
            <tr>
              <th>Name</th>
              <th>Groups</th>
              <th>No.</th>
              <th>Status</th>
            </tr>
          </thead>
          <tbody>
            {rows.map((a) => (
              <tr key={a.id}>
                <td className="org-cell-link">{a.name}</td>
                <td>
                  <div className="org-badge-row">
                    {a.groups.map((g) => {
                      const meta = ADMIN_GROUP_LABELS[g]
                      return (
                        <span key={g} className="org-badge" style={{ background: `${meta.color}1a`, color: meta.color }}>
                          {meta.label}
                        </span>
                      )
                    })}
                  </div>
                </td>
                <td>{a.orgCount}</td>
                <td>
                  <span className={`org-status org-status-${a.status.toLowerCase()}`}>{a.status}</span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        <div className="org-pagination">
          <span>Page 1 of 34</span>
          <div>
            <button type="button" disabled>Prev</button>
            <button type="button">Next</button>
          </div>
        </div>
      </div>
    </div>
  )
}
