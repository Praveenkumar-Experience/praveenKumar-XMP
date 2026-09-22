import { useMemo, useState } from 'react'
import { Megaphone, Search, ChevronDown, MoreHorizontal, Star, Users, MessageSquare } from 'lucide-react'
import PageHeader from './PageHeader.jsx'
import './Campaigns.css'
import { CAMPAIGN_STATS, CAMPAIGN_TYPES, CAMPAIGNS } from '../campaignsData.js'

export default function Campaigns() {
  const [query, setQuery] = useState('')
  const [createOpen, setCreateOpen] = useState(false)

  const rows = useMemo(() => {
    const q = query.trim().toLowerCase()
    if (!q) return CAMPAIGNS
    return CAMPAIGNS.filter((c) => c.name.toLowerCase().includes(q))
  }, [query])

  return (
    <div className="cm-page">
      <PageHeader icon={Megaphone} title="Campaigns" subtitle="Build and track review-request campaigns." />

      <div className="cm-stats">
        <div className="cm-stat">
          <span className="cm-stat-value">{CAMPAIGN_STATS.totalSurveysSent}</span>
          <span className="cm-stat-label">Total Surveys Sent</span>
        </div>
        <div className="cm-stat">
          <span className="cm-stat-value">{CAMPAIGN_STATS.totalResponses}</span>
          <span className="cm-stat-label">Total Responses</span>
        </div>
        <div className="cm-stat">
          <span className="cm-stat-value">{CAMPAIGN_STATS.avgCompletionRate}</span>
          <span className="cm-stat-label">Average Completion Rate</span>
        </div>
        <div className="cm-stat">
          <span className="cm-stat-value">{CAMPAIGN_STATS.incompleteSurveys}</span>
          <span className="cm-stat-label">Incomplete Surveys</span>
        </div>
        <div className="cm-stat">
          <span className="cm-stat-value">{CAMPAIGN_STATS.accountLevelNps}</span>
          <span className="cm-stat-label">Account level NPS</span>
        </div>
      </div>

      <div className="cm-toolbar">
        <div className="cm-search-wrap">
          <Search size={15} className="cm-search-icon" />
          <input
            className="cm-search-input"
            type="text"
            placeholder="Search campaigns"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
          />
        </div>
        <div className="cm-create-wrap">
          <button type="button" className="cm-create-btn" onClick={() => setCreateOpen((o) => !o)}>
            Create new <ChevronDown size={14} />
          </button>
          {createOpen && (
            <div className="cm-create-menu" onMouseLeave={() => setCreateOpen(false)}>
              {CAMPAIGN_TYPES.map((type) => (
                <button key={type} type="button" className="cm-create-item" onClick={() => setCreateOpen(false)}>
                  {type}
                </button>
              ))}
            </div>
          )}
        </div>
      </div>

      <div className="cm-card">
        <table className="cm-table">
          <thead>
            <tr>
              <th>Name</th>
              <th>Completion Rate</th>
              <th>Average Score</th>
              <th>Status</th>
              <th>Last Modified</th>
              <th>Last Activated</th>
              <th aria-label="Actions" />
            </tr>
          </thead>
          <tbody>
            {rows.map((c) => (
              <tr key={c.id}>
                <td>
                  <div className="cm-name-cell">
                    <span className="cm-name">
                      {c.name}
                      {c.badge && <span className="cm-badge">{c.badge}</span>}
                    </span>
                    <span className="cm-recipients">
                      <Users size={11} /> {c.recipients ?? '–'}
                      <MessageSquare size={11} /> {c.responses ?? '–'}
                    </span>
                  </div>
                </td>
                <td>
                  {c.completionRate != null ? (
                    <div className="cm-completion">
                      <div className="cm-completion-track">
                        <div className="cm-completion-fill" style={{ width: `${c.completionRate}%` }} />
                      </div>
                      <span>{c.completionRate}%</span>
                    </div>
                  ) : c.noSurvey ? (
                    <span className="cm-muted">No survey</span>
                  ) : (
                    <span className="cm-muted">N/A</span>
                  )}
                </td>
                <td>
                  {c.avgScore != null ? (
                    <span className="cm-score">
                      <Star size={12} fill="#f5a524" stroke="#f5a524" /> {c.avgScore}
                    </span>
                  ) : (
                    <span className="cm-muted">{c.noSurvey ? 'No survey' : '–'}</span>
                  )}
                </td>
                <td>
                  <span className={`cm-status cm-status-${c.status.toLowerCase()}`}>{c.status}</span>
                </td>
                <td>{c.lastModified ?? '–'}</td>
                <td>{c.lastActivated ?? '–'}</td>
                <td>
                  <button type="button" className="cm-kebab" aria-label="Row actions">
                    <MoreHorizontal size={16} />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}
