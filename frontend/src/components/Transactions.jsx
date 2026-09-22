import { useMemo, useState } from 'react'
import { ArrowLeftRight, Search, Inbox, MoreHorizontal } from 'lucide-react'
import PageHeader from './PageHeader.jsx'
import './Transactions.css'
import { QUEUE_TABS, QUEUE_ROWS } from '../transactionsQueueData.js'

export default function Transactions() {
  const [activeTab, setActiveTab] = useState(QUEUE_TABS[0].id)
  const [query, setQuery] = useState('')

  const counts = useMemo(() => {
    const map = {}
    for (const tab of QUEUE_TABS) map[tab.id] = 0
    for (const row of QUEUE_ROWS) map[row.status] = (map[row.status] || 0) + 1
    return map
  }, [])

  const rows = useMemo(() => {
    const q = query.trim().toLowerCase()
    return QUEUE_ROWS.filter((row) => {
      if (row.status !== activeTab) return false
      if (!q) return true
      return row.name.toLowerCase().includes(q) || row.customer.toLowerCase().includes(q)
    })
  }, [activeTab, query])

  const activeLabel = QUEUE_TABS.find((t) => t.id === activeTab)?.label ?? ''

  return (
    <div className="tx-page">
      <PageHeader icon={ArrowLeftRight} title="Transactions" subtitle="Review transactions that need attention before they finish ingestion." />

      <div className="tx-toolbar">
        <div className="tx-tabs">
          {QUEUE_TABS.map((tab) => (
            <button
              key={tab.id}
              type="button"
              className={`tx-tab${activeTab === tab.id ? ' is-active' : ''}`}
              onClick={() => setActiveTab(tab.id)}
            >
              {tab.label} <span className="tx-tab-count">{counts[tab.id]}</span>
            </button>
          ))}
        </div>
        <div className="tx-search-wrap">
          <Search size={15} className="tx-search-icon" />
          <input
            className="tx-search-input"
            type="text"
            placeholder="Search transactions"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
          />
        </div>
      </div>

      <div className="tx-card">
        {rows.length > 0 ? (
          <table className="tx-table">
            <thead>
              <tr>
                <th>Name</th>
                <th>Customer Name</th>
                <th>Source Transaction ID</th>
                <th>Reason</th>
                <th>Date</th>
                <th aria-label="Action" />
              </tr>
            </thead>
            <tbody>
              {rows.map((row) => (
                <tr key={row.id}>
                  <td className="tx-cell-name">{row.name}</td>
                  <td>{row.customer}</td>
                  <td className="tx-cell-mono">{row.sourceId}</td>
                  <td className="tx-cell-reason">{row.reason}</td>
                  <td>{row.date}</td>
                  <td>
                    <button type="button" className="tx-kebab" aria-label="Row actions">
                      <MoreHorizontal size={16} />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        ) : (
          <div className="tx-empty">
            <Inbox size={28} strokeWidth={1.5} />
            <p>No {activeLabel.toLowerCase()} transactions found.</p>
          </div>
        )}
      </div>
    </div>
  )
}
