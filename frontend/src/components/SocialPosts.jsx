import { useState } from 'react'
import { MessageSquare, Search, Sparkles, SearchX } from 'lucide-react'
import PageHeader from './PageHeader.jsx'
import './SocialPosts.css'

const TABS = ['Published', 'Scheduled', 'Autopost reviews']
const EMPTY_COPY = {
  Published: 'There are no posts to show for this account yet.',
  Scheduled: 'There are no scheduled posts for this account yet.',
  'Autopost reviews': 'There are no autopost reviews for this account yet.',
}

export default function SocialPosts() {
  const [tab, setTab] = useState(TABS[0])
  const [query, setQuery] = useState('')
  const [platform, setPlatform] = useState('')
  const [location, setLocation] = useState('')
  const [user, setUser] = useState('')

  const dirty = query || platform || location || user

  function clearFilters() {
    setQuery('')
    setPlatform('')
    setLocation('')
    setUser('')
  }

  return (
    <div className="sp-page">
      <PageHeader
        icon={MessageSquare}
        title="Social posts"
        subtitle="Manage your social media content"
        actions={(
          <button type="button" className="sp-how-it-works">
            <Sparkles size={14} /> How it works
          </button>
        )}
      />

      <div className="sp-tabs">
        {TABS.map((t) => (
          <button key={t} type="button" className={`sp-tab${tab === t ? ' is-active' : ''}`} onClick={() => setTab(t)}>
            {t}
          </button>
        ))}
      </div>

      <div className="sp-filters">
        <span className="sp-filters-label">Filters</span>
        <div className="sp-search-wrap">
          <Search size={14} className="sp-search-icon" />
          <input className="sp-search-input" type="text" placeholder="Search posts" value={query} onChange={(e) => setQuery(e.target.value)} />
        </div>
        <select className="sp-select" value={platform} onChange={(e) => setPlatform(e.target.value)}>
          <option value="">Select Platform</option>
          <option value="facebook">Facebook</option>
          <option value="instagram">Instagram</option>
          <option value="x">X</option>
          <option value="google">Google</option>
        </select>
        <select className="sp-select" value={location} onChange={(e) => setLocation(e.target.value)}>
          <option value="">Select Locations</option>
          <option value="all">All Locations</option>
        </select>
        <select className="sp-select" value={user} onChange={(e) => setUser(e.target.value)}>
          <option value="">Select Users</option>
          <option value="all">All Users</option>
        </select>
        <button type="button" className="sp-apply-btn" disabled={!dirty}>Apply</button>
        {dirty && (
          <button type="button" className="sp-clear-btn" onClick={clearFilters}>
            <span aria-hidden="true">&times;</span> Clear filters
          </button>
        )}
      </div>

      <div className="sp-empty">
        <span className="sp-empty-icon">
          <SearchX size={22} strokeWidth={1.5} />
        </span>
        <p className="sp-empty-title">No posts found</p>
        <span className="sp-empty-desc">{EMPTY_COPY[tab]}</span>
      </div>
    </div>
  )
}
