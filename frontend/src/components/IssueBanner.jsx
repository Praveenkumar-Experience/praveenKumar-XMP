import { useState } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import { AlertTriangle, ArrowRight, X } from 'lucide-react'
import './IssueBanner.css'
import { CURRENT_ACCOUNT, KNOWN_ISSUES, INTEGRATION_ISSUE } from '../insightsData.js'

const SEVERITY_RANK = { error: 0, warning: 1, info: 2 }

export default function IssueBanner() {
  const location = useLocation()
  const navigate = useNavigate()
  const [dismissed, setDismissed] = useState(false)

  const issues = [
    ...(CURRENT_ACCOUNT.emailVerified ? [] : [{ severity: 'error', title: 'Your email is not verified' }]),
    ...KNOWN_ISSUES.map((issue) => ({ severity: issue.severity, title: issue.title })),
    ...(INTEGRATION_ISSUE ? [{ severity: INTEGRATION_ISSUE.severity, title: INTEGRATION_ISSUE.title }] : []),
  ].sort((a, b) => SEVERITY_RANK[a.severity] - SEVERITY_RANK[b.severity])

  if (dismissed || issues.length === 0 || location.pathname.startsWith('/settings/analytics')) return null

  const [top, ...rest] = issues

  return (
    <div className={`ib-banner ib-severity-${top.severity}`}>
      <AlertTriangle size={16} className="ib-icon" aria-hidden="true" />
      <span className="ib-text">
        {top.title}
        {rest.length > 0 && ` — plus ${rest.length} more issue${rest.length > 1 ? 's' : ''}`}
      </span>
      <button type="button" className="ib-resolve" onClick={() => navigate('/settings/analytics')}>
        Resolve in Analytics Dashboard <ArrowRight size={14} />
      </button>
      <button type="button" className="ib-dismiss" onClick={() => setDismissed(true)} aria-label="Dismiss">
        <X size={15} />
      </button>
    </div>
  )
}
