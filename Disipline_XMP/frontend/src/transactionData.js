// Mock transaction-monitor data. Deterministic per (metric, range) pair so the
// series doesn't reshuffle on every re-render — only when the range changes.

// Fixed categorical order (validated: node validate_palette.js ... --mode light
// passes lightness/chroma/CVD/normal-vision checks for this ordering) — never
// reassign a metric's slot or cycle the hues.
export const METRICS = [
  { id: 'processed', label: 'Processed Transactions', color: '#2a78d6', defaultChecked: true, base: 4200, volatility: 0.07, trend: -0.4, goodDirection: 'up', description: 'Total number of transactions that completed the full ingestion pipeline successfully.' },
  { id: 'surveys_sent', label: 'Surveys Sent', color: '#eb6834', defaultChecked: true, base: 3100, volatility: 0.09, trend: -0.3, goodDirection: 'up', description: 'Total number of post-transaction surveys dispatched to verified users.' },
  { id: 'mismatched', label: 'Mismatched Transactions', color: '#1baf7a', defaultChecked: false, base: 180, volatility: 0.28, trend: 0.5, goodDirection: 'down', description: 'Total number of transactions whose fields did not match the expected schema for their account.' },
  { id: 'reminders_sent', label: 'Reminders Sent', color: '#eda100', defaultChecked: false, base: 950, volatility: 0.12, trend: -0.2, goodDirection: 'up', description: 'Total number of follow-up reminders sent to users who have not yet completed a survey.' },
  { id: 'surveys_completed', label: 'Surveys Completed', color: '#e87ba4', defaultChecked: true, base: 1450, volatility: 0.1, trend: -0.35, goodDirection: 'up', description: 'Total number of surveys a user finished and submitted.' },
  { id: 'uncategorized', label: 'Uncategorized Transactions', color: '#008300', defaultChecked: false, base: 95, volatility: 0.32, trend: 0.4, goodDirection: 'down', description: 'Total number of transactions that could not be assigned to a known category during processing.' },
  { id: 'uncollected', label: 'Uncollected Transactions', color: '#4a3aa7', defaultChecked: false, base: 60, volatility: 0.36, trend: 0.3, goodDirection: 'down', description: 'Total number of transactions that were not collected due to failure in fulfilling the criteria to match a campaign associated with an account.' },
  { id: 'unprocessed', label: 'Unprocessed Transactions', color: '#e34948', defaultChecked: false, base: 40, volatility: 0.4, trend: 0.45, goodDirection: 'down', description: 'Total number of transactions still queued and waiting to be processed.' },
]

export const RANGE_KEYS = ['Today', '7D', '15D', '1M', '6M', '1Y']

const RANGE_CONFIG = {
  Today: { points: 8, stepMs: 3 * 60 * 60 * 1000, format: (d) => d.toLocaleTimeString('en-US', { hour: 'numeric' }) },
  '7D': { points: 7, stepMs: 24 * 60 * 60 * 1000, format: (d) => d.toLocaleDateString('en-US', { day: 'numeric', month: 'short' }) },
  '15D': { points: 15, stepMs: 24 * 60 * 60 * 1000, format: (d) => d.toLocaleDateString('en-US', { day: 'numeric', month: 'short' }) },
  '1M': { points: 30, stepMs: 24 * 60 * 60 * 1000, format: (d) => d.toLocaleDateString('en-US', { day: 'numeric', month: 'short' }) },
  '6M': { points: 26, stepMs: 7 * 24 * 60 * 60 * 1000, format: (d) => d.toLocaleDateString('en-US', { day: 'numeric', month: 'short' }) },
  '1Y': { points: 12, stepMs: 30 * 24 * 60 * 60 * 1000, format: (d) => d.toLocaleDateString('en-US', { month: 'short' }) },
}

function hashString(str) {
  let hash = 0
  for (let i = 0; i < str.length; i++) {
    hash = (hash * 31 + str.charCodeAt(i)) | 0
  }
  return Math.abs(hash) || 1
}

function seededRandom(seed) {
  let s = seed % 2147483647
  if (s <= 0) s += 2147483646
  return function next() {
    s = (s * 16807) % 2147483647
    return (s - 1) / 2147483646
  }
}

export function generateSeries(metric, rangeKey, now, scopeId, scaleFactor = 1) {
  const config = RANGE_CONFIG[rangeKey]
  const rand = seededRandom(hashString(`${scopeId ? `${scopeId}:` : ''}${metric.id}:${rangeKey}`))
  const base = metric.base * scaleFactor
  const points = []
  let value = base
  for (let i = config.points - 1; i >= 0; i--) {
    const date = new Date(now.getTime() - i * config.stepMs)
    const drift = metric.trend * base * 0.01
    const noise = (rand() - 0.5) * metric.volatility * base
    value = Math.max(0, value + drift + noise)
    points.push({ date, label: config.format(date), value: Math.round(value) })
  }
  return points
}

export function formatCompact(n) {
  if (n >= 1000) return `${(n / 1000).toFixed(n >= 10000 ? 0 : 1)}K`
  return String(n)
}

export const ORGANIZATIONS = [
  { id: 'academy-mortgage', name: 'Academy Mortgage', initial: 'A', color: '#2a78d6', accounts: 445, verifiedUsers: 1659, trend: 'down' },
  { id: 'summit-lending', name: 'Summit Lending Group', initial: 'S', color: '#1baf7a', accounts: 212, verifiedUsers: 803, trend: 'up' },
  { id: 'harbor-financial', name: 'Harbor Financial', initial: 'H', color: '#4a3aa7', accounts: 98, verifiedUsers: 341, trend: 'up' },
]

export const ACCOUNTS = [
  { id: 'acct-4471', name: 'Academy Mortgage — Denver', initial: 'D', color: '#2a78d6', verifiedUsers: 214, trend: 'down' },
  { id: 'acct-2290', name: 'Summit Lending — Austin', initial: 'A', color: '#1baf7a', verifiedUsers: 156, trend: 'up' },
  { id: 'acct-6603', name: 'Harbor Financial — Boise', initial: 'B', color: '#4a3aa7', verifiedUsers: 88, trend: 'up' },
]
