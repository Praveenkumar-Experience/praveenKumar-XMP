import { useState } from 'react'
import { LayoutDashboard, AlertTriangle, TrendingUp, TrendingDown, Trophy } from 'lucide-react'
import PageHeader from './PageHeader.jsx'
import './Dashboard.css'
import { METRICS, RANGE_KEYS, ORGANIZATIONS, generateSeries, formatCompact } from '../transactionData.js'

const KPI_METRIC_IDS = ['processed', 'surveys_sent', 'surveys_completed', 'mismatched']

function pctChange(points) {
  const first = points[0]?.value ?? 0
  const last = points[points.length - 1]?.value ?? 0
  if (first === 0) return 0
  return ((last - first) / first) * 100
}

function Sparkline({ points, color }) {
  const values = points.map((p) => p.value)
  const max = Math.max(...values, 1)
  const min = Math.min(...values, 0)
  const range = max - min || 1
  const w = 108
  const h = 32
  const path = points
    .map((p, i) => `${(i / Math.max(1, points.length - 1)) * w},${h - ((p.value - min) / range) * h}`)
    .join(' ')
  return (
    <svg width={w} height={h} viewBox={`0 0 ${w} ${h}`} className="dash-spark" aria-hidden="true">
      <polyline points={path} fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  )
}

function KpiCard({ metric, points }) {
  const last = points[points.length - 1]?.value ?? 0
  const change = pctChange(points)
  const isGood = metric.goodDirection === 'up' ? change >= 0 : change <= 0
  return (
    <div className="dash-kpi-card">
      <span className="dash-kpi-label">{metric.label}</span>
      <span className="dash-kpi-value">{formatCompact(last)}</span>
      <div className="dash-kpi-footer">
        <span className={`dash-kpi-delta${isGood ? ' is-good' : ' is-bad'}`}>
          {change >= 0 ? <TrendingUp size={13} /> : <TrendingDown size={13} />}
          {Math.abs(change).toFixed(1)}%
        </span>
        <Sparkline points={points} color={metric.color} />
      </div>
    </div>
  )
}

export default function Dashboard() {
  const [range, setRange] = useState('6M')
  const now = new Date()
  const kpiMetrics = METRICS.filter((m) => KPI_METRIC_IDS.includes(m.id))
  const leaderboard = [...ORGANIZATIONS].sort((a, b) => b.verifiedUsers - a.verifiedUsers)

  return (
    <div className="dash-page">
      <PageHeader icon={LayoutDashboard} title="Dashboard" subtitle="An overview of activity across your organizations." />

      <div className="dash-layout">
        <div className="dash-main">
          <div className="dash-alert-card">
            <div className="dash-alert-icon">
              <AlertTriangle size={18} />
            </div>
            <div>
              <span className="dash-alert-count">3 Alerts</span>
              <span className="dash-alert-desc">Channels with autopost disabled or unreviewed templates.</span>
            </div>
          </div>

          <div className="dash-card">
            <div className="dash-card-header">
              <h2>Key Metrics</h2>
              <div className="dash-range-tabs">
                {RANGE_KEYS.map((key) => (
                  <button
                    key={key}
                    type="button"
                    className={`dash-range-tab${range === key ? ' is-active' : ''}`}
                    onClick={() => setRange(key)}
                  >
                    {key}
                  </button>
                ))}
              </div>
            </div>

            <div className="dash-kpi-grid">
              {kpiMetrics.map((metric) => (
                <KpiCard key={metric.id} metric={metric} points={generateSeries(metric, range, now)} />
              ))}
            </div>
          </div>
        </div>

        <div className="dash-side">
          <div className="dash-card">
            <h2>Active Campaigns</h2>
            <p className="dash-empty">No active campaigns yet.</p>
          </div>

          <div className="dash-card">
            <div className="dash-card-header">
              <h2>Leaderboard</h2>
              <Trophy size={16} className="dash-trophy" />
            </div>
            <ul className="dash-leaderboard">
              {leaderboard.map((org, i) => (
                <li key={org.id} className="dash-leaderboard-row">
                  <span className="dash-leaderboard-rank">{i + 1}</span>
                  <span className="dash-badge" style={{ background: `${org.color}22`, color: org.color }}>{org.initial}</span>
                  <span className="dash-leaderboard-main">
                    <span className="dash-leaderboard-name">{org.name}</span>
                    <span className="dash-leaderboard-sub">{org.verifiedUsers.toLocaleString()} verified users</span>
                  </span>
                  {org.trend === 'up' ? (
                    <TrendingUp size={16} className="dash-trend-up" />
                  ) : (
                    <TrendingDown size={16} className="dash-trend-down" />
                  )}
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </div>
  )
}
