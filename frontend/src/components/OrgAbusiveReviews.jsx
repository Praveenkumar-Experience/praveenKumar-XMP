import { useState } from 'react'
import { ShieldAlert, Search, Star, BadgeCheck, Flag } from 'lucide-react'
import PageHeader from './PageHeader.jsx'
import './Organization.css'
import { ABUSIVE_STATS, FLAGGED_REVIEWS } from '../organizationData.js'

export default function OrgAbusiveReviews() {
  const [search, setSearch] = useState('')
  const [minRating, setMinRating] = useState(0)

  const reviews = FLAGGED_REVIEWS.filter((r) => {
    const q = search.trim().toLowerCase()
    if (q && !r.name.toLowerCase().includes(q)) return false
    return r.rating >= minRating
  })

  return (
    <div className="org-page">
      <PageHeader icon={ShieldAlert} title="Abusive Review Management" subtitle="Review and moderate flagged reviews across every organization." />

      <div className="org-stats">
        <div className="org-stat-card">
          <span className="org-stat-value">{ABUSIVE_STATS.totalReviews}</span>
          <span className="org-stat-label">Total Reviews</span>
        </div>
        <div className="org-stat-card">
          <span className="org-stat-value">{ABUSIVE_STATS.totalEdited}</span>
          <span className="org-stat-label">Total Reviews Edited</span>
        </div>
        <div className="org-stat-card">
          <span className="org-stat-value">{ABUSIVE_STATS.totalRestored}</span>
          <span className="org-stat-label">Total Reviews Restored</span>
        </div>
      </div>

      <div className="org-with-filters">
        <aside className="org-filters-card">
          <span className="org-filters-title">Filters</span>
          <label className="org-filter-field">
            <span>Search</span>
            <div className="org-search-wrap">
              <Search size={14} className="org-search-icon" />
              <input className="org-search-input" type="text" placeholder="Reviewer name" value={search} onChange={(e) => setSearch(e.target.value)} />
            </div>
          </label>
          <label className="org-filter-field">
            <span>Minimum rating</span>
            <input type="range" min={0} max={5} step={1} value={minRating} onChange={(e) => setMinRating(Number(e.target.value))} />
          </label>
          <label className="org-filter-field">
            <span>Organization</span>
            <select defaultValue="">
              <option value="">Please select any organization</option>
            </select>
          </label>
          <label className="org-checkbox-field">
            <input type="checkbox" defaultChecked /> Show archived reviews
          </label>
        </aside>

        <div className="org-flagged-list">
          {reviews.map((r) => (
            <div key={r.id} className="org-card org-flagged-card">
              <div className="org-flagged-top">
                <span className="org-flagged-name">{r.name}</span>
                <span className="org-flagged-tag">{r.tag}</span>
                <span className="org-badge" style={{ background: '#fdecec', color: '#b91c1c' }}>{r.badge}</span>
                <span className="org-flagged-score">
                  <Star size={12} fill="#f5a524" stroke="#f5a524" /> {r.rating.toFixed(1)}
                </span>
              </div>
              <p className="org-flagged-text">{r.text}</p>
              <div className="org-flagged-footer">
                <span className="org-flagged-reviewer">
                  <BadgeCheck size={13} /> {r.reviewer} &middot; {r.location}
                </span>
                <span className="org-flagged-date">{r.date}</span>
                <button type="button" className="org-flag-btn">
                  <Flag size={13} /> Review removal policy
                </button>
              </div>
            </div>
          ))}
          {reviews.length === 0 && <p className="org-empty-inline">No flagged reviews match these filters.</p>}
        </div>
      </div>
    </div>
  )
}
