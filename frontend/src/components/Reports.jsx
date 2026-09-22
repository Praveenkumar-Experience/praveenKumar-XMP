import { useState } from 'react'
import { BarChart2, Download, CheckCircle2 } from 'lucide-react'
import PageHeader from './PageHeader.jsx'
import './Reports.css'
import { REPORT_TYPES, REPORT_FORMATS, ACTIVITY_FEED } from '../reportsData.js'

export default function Reports({
  title = 'Reports',
  subtitle = 'Generate and download exportable performance reports.',
  reportTypes = REPORT_TYPES,
  activityFeed = ACTIVITY_FEED,
}) {
  const [reportType, setReportType] = useState('')
  const [format, setFormat] = useState(REPORT_FORMATS[0])
  const [feed, setFeed] = useState(activityFeed)
  const [justExported, setJustExported] = useState(false)

  function handleExport() {
    if (!reportType) return
    setFeed((prev) => [
      { id: `af-${Date.now()}`, actor: 'You', report: reportType, range: 'for All Time', time: 'Just now' },
      ...prev,
    ])
    setJustExported(true)
    setTimeout(() => setJustExported(false), 2200)
  }

  return (
    <div className="rp-page">
      <PageHeader icon={BarChart2} title={title} subtitle={subtitle} />

      <div className="rp-layout">
        <div className="rp-card rp-form-card">
          <BarChart2 size={40} strokeWidth={1.5} className="rp-illustration" />
          <p className="rp-instructions">Select your required report and format, then click &ldquo;Export Report&rdquo; to generate.</p>

          <div className="rp-fields">
            <label className="rp-field">
              <span>Select Report</span>
              <select value={reportType} onChange={(e) => setReportType(e.target.value)}>
                <option value="">Choose a report&hellip;</option>
                {reportTypes.map((type) => (
                  <option key={type} value={type}>{type}</option>
                ))}
              </select>
            </label>
            <label className="rp-field">
              <span>Report Format</span>
              <select value={format} onChange={(e) => setFormat(e.target.value)}>
                {REPORT_FORMATS.map((f) => (
                  <option key={f} value={f}>{f}</option>
                ))}
              </select>
            </label>
          </div>

          <button type="button" className="rp-export-btn" disabled={!reportType} onClick={handleExport}>
            <Download size={15} /> Export Report
          </button>

          {justExported && (
            <div className="rp-toast">
              <CheckCircle2 size={15} /> Report queued &mdash; check Activity Feed.
            </div>
          )}
        </div>

        <div className="rp-card rp-feed-card">
          <div className="rp-feed-header">
            <h2>Activity Feed</h2>
          </div>
          {feed.length > 0 ? (
            <ul className="rp-feed-list">
              {feed.map((item) => (
                <li key={item.id} className="rp-feed-item">
                  <span className="rp-feed-avatar">{item.actor.split(' ').map((n) => n[0]).join('').slice(0, 2)}</span>
                  <div className="rp-feed-body">
                    <p>
                      <strong>{item.actor}</strong> downloaded <strong>{item.report}</strong>
                    </p>
                    <span className="rp-feed-meta">{item.range} &middot; {item.time}</span>
                  </div>
                </li>
              ))}
            </ul>
          ) : (
            <p className="rp-feed-empty">No recent activity found yet.</p>
          )}
        </div>
      </div>
    </div>
  )
}
