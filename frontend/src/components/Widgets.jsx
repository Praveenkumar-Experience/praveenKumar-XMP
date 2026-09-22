import { useMemo, useState } from 'react'
import {
  LayoutGrid, ChevronLeft, Code2, Send, Monitor, Smartphone, Star,
  ArrowUpDown, Copy, Check, ChevronDown,
} from 'lucide-react'
import PageHeader from './PageHeader.jsx'
import './Widgets.css'
import { REVIEWS } from '../reviewsData.js'

const STAR_COUNTS = [5, 4, 3, 2, 1]

function StarRow({ rating, size = 12 }) {
  return (
    <span className="wd-stars" aria-label={`${rating} out of 5 stars`}>
      {Array.from({ length: 5 }, (_, i) => (
        <Star key={i} size={size} fill={i < rating ? '#f5a524' : 'none'} stroke={i < rating ? '#f5a524' : '#d1d5db'} />
      ))}
    </span>
  )
}

function Accordion({ title, children }) {
  const [open, setOpen] = useState(false)
  return (
    <div className="wd-accordion">
      <button type="button" className="wd-accordion-head" onClick={() => setOpen((o) => !o)}>
        {title}
        <ChevronDown size={14} className={`wd-accordion-chevron${open ? ' is-open' : ''}`} />
      </button>
      {open && <div className="wd-accordion-body">{children}</div>}
    </div>
  )
}

export default function Widgets() {
  const [view, setView] = useState('list')
  const [tab, setTab] = useState('basic')
  const [reviewsPerPage, setReviewsPerPage] = useState(40)
  const [filterBy, setFilterBy] = useState('tier')
  const [selectedTier, setSelectedTier] = useState('')
  const [minRating, setMinRating] = useState(0)
  const [sortOrder, setSortOrder] = useState('newest')
  const [showContactUs, setShowContactUs] = useState(true)
  const [showWriteReview, setShowWriteReview] = useState(true)
  const [device, setDevice] = useState('desktop')
  const [codeVisible, setCodeVisible] = useState(false)
  const [copied, setCopied] = useState(false)
  const [emailSent, setEmailSent] = useState(false)

  const total = REVIEWS.length
  const avgRating = (REVIEWS.reduce((sum, r) => sum + r.rating, 0) / total).toFixed(2)
  const distribution = useMemo(
    () => STAR_COUNTS.map((star) => {
      const count = REVIEWS.filter((r) => r.rating === star).length
      return { star, pct: Math.round((count / total) * 100) }
    }),
    [total]
  )

  const previewReviews = useMemo(() => {
    const filtered = REVIEWS.filter((r) => r.rating >= minRating)
    const sorted = [...filtered].sort((a, b) => (sortOrder === 'highest' ? b.rating - a.rating : b.id.localeCompare(a.id)))
    return sorted.slice(0, 3)
  }, [minRating, sortOrder])

  const embedSnippet = `<script src="https://cdn.experience.com/widgets/reviews.js"\n  data-per-page="${reviewsPerPage}"\n  data-filter="${filterBy}"${selectedTier ? `\n  data-tier="${selectedTier}"` : ''}></script>`

  function handleGetCode() {
    setCodeVisible((v) => !v)
  }

  async function handleCopy() {
    try {
      await navigator.clipboard.writeText(embedSnippet)
      setCopied(true)
      setTimeout(() => setCopied(false), 1800)
    } catch {
      // clipboard unavailable — the snippet is still visible to copy manually
    }
  }

  function handleSendEmail() {
    setEmailSent(true)
    setTimeout(() => setEmailSent(false), 2200)
  }

  if (view === 'list') {
    return (
      <div className="wd-page">
        <PageHeader icon={LayoutGrid} title="Widgets" subtitle="Embeddable review widgets you can drop straight onto your website." />
        <button type="button" className="wd-launch-card" onClick={() => setView('builder')}>
          <span className="wd-launch-icon">
            <Star size={22} />
          </span>
          <span className="wd-launch-label">Review Widget</span>
        </button>
      </div>
    )
  }

  return (
    <div className="wd-page">
      <div className="wd-breadcrumb">
        <button type="button" className="wd-back-btn" onClick={() => setView('list')}>
          <ChevronLeft size={16} /> Widgets
        </button>
        <span className="wd-breadcrumb-sep">/</span>
        <span>Review Widget</span>
      </div>

      <div className="wd-builder">
        <div className="wd-config">
          <div className="wd-tabs">
            <button type="button" className={`wd-tab${tab === 'basic' ? ' is-active' : ''}`} onClick={() => setTab('basic')}>
              Basic Review
            </button>
            <button type="button" className={`wd-tab${tab === 'customize' ? ' is-active' : ''}`} onClick={() => setTab('customize')}>
              Customize Review
            </button>
          </div>

          {tab === 'customize' && (
            <div className="wd-accordions">
              <Accordion title="Filters">
                <label className="wd-inline-field">
                  <span>Minimum rating shown</span>
                  <select value={minRating} onChange={(e) => setMinRating(Number(e.target.value))}>
                    <option value={0}>Any rating</option>
                    <option value={3}>3 stars &amp; up</option>
                    <option value={4}>4 stars &amp; up</option>
                    <option value={5}>5 stars only</option>
                  </select>
                </label>
              </Accordion>
              <Accordion title="Sort">
                <label className="wd-inline-field">
                  <span>Order</span>
                  <select value={sortOrder} onChange={(e) => setSortOrder(e.target.value)}>
                    <option value="newest">Newest first</option>
                    <option value="highest">Highest rated first</option>
                  </select>
                </label>
              </Accordion>
              <Accordion title="Buttons &amp; Links">
                <label className="wd-checkbox-field">
                  <input type="checkbox" checked={showContactUs} onChange={(e) => setShowContactUs(e.target.checked)} />
                  Show &ldquo;Contact Us&rdquo; button
                </label>
                <label className="wd-checkbox-field">
                  <input type="checkbox" checked={showWriteReview} onChange={(e) => setShowWriteReview(e.target.checked)} />
                  Show &ldquo;Write a Review&rdquo; button
                </label>
              </Accordion>
            </div>
          )}

          <label className="wd-field">
            <span>No. of reviews per page</span>
            <select value={reviewsPerPage} onChange={(e) => setReviewsPerPage(Number(e.target.value))}>
              {[10, 20, 40, 100].map((n) => (
                <option key={n} value={n}>{n}</option>
              ))}
            </select>
          </label>

          <div className="wd-field">
            <span>Filter By</span>
            <div className="wd-radio-row">
              <label>
                <input type="radio" name="filterBy" checked={filterBy === 'tier'} onChange={() => setFilterBy('tier')} /> Tier
              </label>
              <label>
                <input type="radio" name="filterBy" checked={filterBy === 'user'} onChange={() => setFilterBy('user')} /> User
              </label>
            </div>
          </div>

          {filterBy === 'tier' && (
            <label className="wd-field">
              <span>Select Tier</span>
              <select value={selectedTier} onChange={(e) => setSelectedTier(e.target.value)}>
                <option value="">Please select</option>
                <option value="gold">Gold</option>
                <option value="silver">Silver</option>
                <option value="bronze">Bronze</option>
              </select>
            </label>
          )}

          <button type="button" className="wd-get-code-btn" onClick={handleGetCode}>
            <Code2 size={15} /> Get Code
          </button>

          {codeVisible && (
            <div className="wd-code-block">
              <pre>{embedSnippet}</pre>
              <button type="button" className="wd-copy-btn" onClick={handleCopy}>
                {copied ? <Check size={13} /> : <Copy size={13} />} {copied ? 'Copied' : 'Copy'}
              </button>
            </div>
          )}

          <div className="wd-divider">or</div>

          <span className="wd-field-label">Email code to entire hierarchy</span>
          <button type="button" className="wd-send-email-btn" onClick={handleSendEmail}>
            <Send size={14} /> Send Email
          </button>
          {emailSent && <div className="wd-email-toast"><Check size={13} /> Email sent to entire hierarchy.</div>}
        </div>

        <div className="wd-preview-panel">
          <div className="wd-preview-header">
            <span>Widget Preview</span>
            <div className="wd-device-toggle">
              <button type="button" className={device === 'desktop' ? 'is-active' : ''} onClick={() => setDevice('desktop')} aria-label="Desktop preview">
                <Monitor size={15} />
              </button>
              <button type="button" className={device === 'mobile' ? 'is-active' : ''} onClick={() => setDevice('mobile')} aria-label="Mobile preview">
                <Smartphone size={15} />
              </button>
            </div>
          </div>

          <div className={`wd-preview-frame${device === 'mobile' ? ' is-mobile' : ''}`}>
            <div className="wd-widget-card">
              <div className="wd-widget-top">
                <div>
                  <h3>Reviews</h3>
                  <span className="wd-widget-powered">powered by experience.com</span>
                </div>
                <div className="wd-widget-actions">
                  {showContactUs && <button type="button" className="wd-btn-ghost">Contact Us</button>}
                  {showWriteReview && <button type="button" className="wd-btn-solid">Write a Review</button>}
                </div>
              </div>

              <div className="wd-widget-summary">
                <div className="wd-widget-avg">
                  <span className="wd-widget-avg-value">{avgRating}</span>
                  <StarRow rating={Math.round(avgRating)} size={14} />
                  <span className="wd-widget-avg-label">Ratings</span>
                </div>
                <div className="wd-widget-total">
                  <span className="wd-widget-total-value">{total}</span>
                  <span className="wd-widget-avg-label">Total Reviews</span>
                </div>
              </div>

              <div className="wd-widget-dist">
                {distribution.map(({ star, pct }) => (
                  <div key={star} className="wd-dist-row">
                    <span className="wd-dist-star">{star} <Star size={10} fill="#f5a524" stroke="#f5a524" /></span>
                    <div className="wd-dist-track">
                      <div className="wd-dist-fill" style={{ width: `${pct}%` }} />
                    </div>
                    <span className="wd-dist-pct">{pct}%</span>
                  </div>
                ))}
              </div>

              <div className="wd-widget-sort">
                <ArrowUpDown size={12} /> {sortOrder === 'highest' ? 'Highest rated' : 'Newest'}
              </div>

              <div className="wd-widget-reviews">
                {previewReviews.map((r) => (
                  <div key={r.id} className="wd-widget-review">
                    <div className="wd-widget-review-top">
                      <span className="wd-widget-review-avatar">{r.initial}</span>
                      <span className="wd-widget-review-name">{r.customer}</span>
                    </div>
                    <StarRow rating={r.rating} />
                    <p>{r.snippet}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
