import { useState } from 'react'
import { Activity } from 'lucide-react'
import TransactionChart from './TransactionChart.jsx'
import PageHeader from './PageHeader.jsx'
import './TransactionMonitor.css'
import { METRICS, RANGE_KEYS, ORGANIZATIONS, ACCOUNTS, generateSeries } from '../transactionData.js'

export default function TransactionMonitor() {
  const [range, setRange] = useState('1M')
  const [scope, setScope] = useState('')
  const [selected, setSelected] = useState(METRICS.filter((m) => m.defaultChecked).map((m) => m.id))

  const now = new Date()
  const series = METRICS.filter((m) => selected.includes(m.id)).map((metric) => ({
    metric,
    points: generateSeries(metric, range, now, scope || undefined),
  }))

  function toggleMetric(id) {
    setSelected((prev) => (prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]))
  }

  return (
    <div className="tm-page">
      <PageHeader icon={Activity} title="Transaction Monitor" subtitle="Track ingestion and survey activity across your organizations and accounts." />

      <div className="tm-scope-field">
        <label htmlFor="tm-scope-select">Scope</label>
        <select id="tm-scope-select" className="tm-scope-select" value={scope} onChange={(e) => setScope(e.target.value)}>
          <option value="">All Organizations</option>
          <optgroup label="Organizations">
            {ORGANIZATIONS.map((o) => (
              <option key={o.id} value={o.id}>{o.name}</option>
            ))}
          </optgroup>
          <optgroup label="Accounts">
            {ACCOUNTS.map((a) => (
              <option key={a.id} value={a.id}>{a.name}</option>
            ))}
          </optgroup>
        </select>
      </div>

      <div className="tm-card">
        <div className="tm-card-header">
          <h2>Metrics</h2>
          <div className="tm-range-tabs">
            {RANGE_KEYS.map((key) => (
              <button
                key={key}
                type="button"
                className={`tm-range-tab${range === key ? ' is-active' : ''}`}
                onClick={() => setRange(key)}
              >
                {key}
              </button>
            ))}
          </div>
        </div>

        <div className="tm-metric-chips">
          {METRICS.map((metric) => (
            <button
              key={metric.id}
              type="button"
              className={`tm-metric-chip${selected.includes(metric.id) ? ' is-active' : ''}`}
              style={selected.includes(metric.id) ? { borderColor: metric.color, color: metric.color, background: `${metric.color}14` } : undefined}
              onClick={() => toggleMetric(metric.id)}
            >
              <span className="tm-metric-dot" style={{ background: metric.color }} />
              {metric.label}
            </button>
          ))}
        </div>

        <TransactionChart series={series} showTable />
      </div>
    </div>
  )
}
