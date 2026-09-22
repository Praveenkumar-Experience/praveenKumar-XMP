import { Store, ShieldAlert, RefreshCcw, ChevronRight, Inbox } from 'lucide-react'
import PageHeader from './PageHeader.jsx'
import './Listings.css'
import { LISTINGS_SUMMARY, LISTINGS_ACTIVITY } from '../listingsData.js'

function DonutRing({ segments, size = 84, thickness = 9 }) {
  const r = (size - thickness) / 2
  const c = 2 * Math.PI * r
  const total = segments.reduce((sum, s) => sum + s.value, 0) || 1
  let offset = 0
  return (
    <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`}>
      <circle cx={size / 2} cy={size / 2} r={r} fill="none" stroke="#eef0f3" strokeWidth={thickness} />
      {segments.map((s) => {
        const dash = (s.value / total) * c
        const circle = (
          <circle
            key={s.label}
            cx={size / 2}
            cy={size / 2}
            r={r}
            fill="none"
            stroke={s.color}
            strokeWidth={thickness}
            strokeDasharray={`${dash} ${c - dash}`}
            strokeDashoffset={-offset}
            strokeLinecap="round"
            transform={`rotate(-90 ${size / 2} ${size / 2})`}
          />
        )
        offset += dash
        return circle
      })}
    </svg>
  )
}

function Legend({ segments }) {
  return (
    <ul className="ls-legend">
      {segments.map((s) => (
        <li key={s.label}>
          <span className="ls-legend-dot" style={{ background: s.color }} />
          {s.value} {s.label}
        </li>
      ))}
    </ul>
  )
}

export default function Listings() {
  const s = LISTINGS_SUMMARY
  const usersSegments = [
    { label: 'Paid users', value: s.paidUsers, color: '#0d9488' },
    { label: 'Unpaid users', value: s.unpaidUsers, color: '#cbf3ec' },
  ]
  const publishSegments = [
    { label: 'Published', value: s.published, color: '#22c55e' },
    { label: 'Not Yet Published', value: s.notYetPublished, color: '#f5a524' },
  ]

  return (
    <div className="ls-page">
      <PageHeader icon={Store} title="Listings" subtitle="Manage your business listings across directories." />

      <div className="ls-stats">
        <div className="ls-stat-card">
          <span className="ls-stat-value">{s.locations}</span>
          <span className="ls-stat-label">Locations</span>
        </div>
        <div className="ls-stat-card">
          <span className="ls-stat-value">{s.region}</span>
          <span className="ls-stat-label">Region</span>
        </div>
        <div className="ls-stat-card">
          <span className="ls-stat-value">{s.users}</span>
          <span className="ls-stat-label">Users</span>
        </div>
      </div>

      <div className="ls-grid">
        <div className="ls-card ls-locations-card">
          <span className="ls-card-title">Locations</span>
          <div className="ls-locations-rings">
            <DonutRing segments={[{ label: 'a', value: 1, color: '#bfdbfe' }]} size={72} />
            <DonutRing segments={[{ label: 'b', value: 1, color: '#fed7aa' }]} size={52} />
          </div>
          <p className="ls-locations-msg">Locations profile view in listings was disabled.</p>
          <span className="ls-locations-sub">Enable it to view the dashboard and take actions.</span>
          <button type="button" className="ls-enable-btn">Enable</button>
        </div>

        <div className="ls-card ls-users-card">
          <div className="ls-users-top">
            <div className="ls-users-chart">
              <DonutRing segments={usersSegments} />
              <div className="ls-donut-center">
                <span>{s.users}</span>
                <small>Total Users</small>
              </div>
            </div>
            <Legend segments={usersSegments} />
            <div className="ls-users-chart">
              <DonutRing segments={publishSegments} />
              <div className="ls-donut-center">
                <span>{s.published + s.notYetPublished}</span>
                <small>Publish Status</small>
              </div>
            </div>
            <Legend segments={publishSegments} />
          </div>
          <div className="ls-notifications">
            <span className="ls-card-subtitle">Notifications</span>
            <button type="button" className="ls-notification-row">
              <ShieldAlert size={15} className="ls-notification-icon" />
              <span>
                <strong>{s.authorizationRequired}</strong> Authorization Required
              </span>
              <ChevronRight size={14} />
            </button>
            <button type="button" className="ls-notification-row">
              <RefreshCcw size={15} className="ls-notification-icon" />
              <span>
                <strong>{s.pendingSite}</strong> Pending Site
              </span>
              <ChevronRight size={14} />
            </button>
          </div>
        </div>

        <div className="ls-card ls-publish-card">
          <span className="ls-card-title">Publish Info</span>
          <span className="ls-publish-value">{s.publishedLast7Days}</span>
          <span className="ls-publish-pct">{s.publishedLast7DaysPct.toFixed(1)}%</span>
          <div className="ls-publish-track" />
          <span className="ls-publish-caption">In Last 7 days</span>
        </div>

        <div className="ls-card ls-activity-card">
          <div className="ls-card-header">
            <span className="ls-card-title">Activity Feeds</span>
            <button type="button" className="ls-view-all">View All Activity</button>
          </div>
          <ul className="ls-activity-list">
            {LISTINGS_ACTIVITY.map((item) => (
              <li key={item.id}>
                <span className="ls-activity-dot" />
                <div>
                  <p>
                    <strong>{item.title}</strong>
                  </p>
                  <span className="ls-activity-desc">{item.desc}</span>
                  <span className="ls-activity-time">{item.time}</span>
                </div>
              </li>
            ))}
          </ul>
        </div>
      </div>

      <div className="ls-issue-grid">
        <div className="ls-card ls-issue-card">
          <div className="ls-card-header">
            <span className="ls-card-title">Location Data Issues</span>
            <span className="ls-issue-count">0</span>
          </div>
          <div className="ls-issue-table-head">
            <span>Data Issue</span>
            <span>Locations</span>
          </div>
          <div className="ls-empty">
            <Inbox size={22} strokeWidth={1.5} />
            <p>No Location Data Issues found.</p>
          </div>
        </div>

        <div className="ls-card ls-issue-card">
          <div className="ls-card-header">
            <span className="ls-card-title">Users Data Issues</span>
            <span className="ls-issue-count">0</span>
          </div>
          <div className="ls-issue-table-head">
            <span>Data Issue</span>
            <span>Locations</span>
          </div>
          <div className="ls-empty">
            <Inbox size={22} strokeWidth={1.5} />
            <p>No user data issues found.</p>
          </div>
        </div>
      </div>
    </div>
  )
}
