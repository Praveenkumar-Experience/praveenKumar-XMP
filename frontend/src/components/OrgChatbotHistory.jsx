import { useMemo, useState } from 'react'
import { MessageCircle, Search } from 'lucide-react'
import PageHeader from './PageHeader.jsx'
import './Organization.css'
import { CHATBOT_TABS, CHATBOT_HISTORY, UNANSWERED_QUESTIONS } from '../organizationData.js'

export default function OrgChatbotHistory() {
  const [tab, setTab] = useState(CHATBOT_TABS[0])
  const [search, setSearch] = useState('')

  const source = tab === CHATBOT_TABS[0] ? CHATBOT_HISTORY : UNANSWERED_QUESTIONS
  const rows = useMemo(() => {
    const q = search.trim().toLowerCase()
    return source.filter((r) => r.user.toLowerCase().includes(q) || r.ticket.toLowerCase().includes(q))
  }, [source, search])

  return (
    <div className="org-page">
      <PageHeader icon={MessageCircle} title="Chatbot History" subtitle="Conversation logs and unanswered questions from the AI assistant." />

      <div className="org-toolbar">
        <div className="org-search-wrap">
          <Search size={14} className="org-search-icon" />
          <input className="org-search-input" type="text" placeholder="Search by name or ticket number" value={search} onChange={(e) => setSearch(e.target.value)} />
        </div>
        <div className="org-tabs">
          {CHATBOT_TABS.map((t) => (
            <button key={t} type="button" className={`org-tab${tab === t ? ' is-active' : ''}`} onClick={() => setTab(t)}>
              {t}
            </button>
          ))}
        </div>
      </div>

      <div className="org-card">
        <table className="org-table">
          <thead>
            <tr>
              <th>User Name</th>
              <th>User Type</th>
              <th>Question</th>
              <th>Account Name</th>
              <th>Last Chat</th>
              <th>Salesforce Ticket No.</th>
              <th>Contact Number</th>
              <th>Feedback</th>
            </tr>
          </thead>
          <tbody>
            {rows.map((r) => (
              <tr key={r.id}>
                <td className="org-cell-link">{r.user}</td>
                <td>{r.userType}</td>
                <td className="org-cell-wide">{r.question}</td>
                <td>{r.account}</td>
                <td>{r.lastChat}</td>
                <td className="org-cell-mono">{r.ticket}</td>
                <td>{r.contact}</td>
                <td>{r.feedback}</td>
              </tr>
            ))}
          </tbody>
        </table>
        {rows.length === 0 && <p className="org-empty-inline">No results found.</p>}
      </div>
    </div>
  )
}
