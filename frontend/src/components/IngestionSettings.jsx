import { useEffect, useMemo, useRef, useState } from 'react'
import gsap from 'gsap'
import './IngestionSettings.css'
import ConnectionUploadModal from './ConnectionUploadModal.jsx'
import ConnectionDetailsModal from './ConnectionDetailsModal.jsx'
import { ACCENT } from '../theme.js'
import { PLATFORMS as INITIAL_PLATFORMS } from '../ingestionData.js'

function SearchIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#9aa4b2" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="11" cy="11" r="7"></circle>
      <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
    </svg>
  )
}

function PulseIcon({ color }) {
  return (
    <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M3 12h4l2 8 4-16 2 8h6"></path>
    </svg>
  )
}

function ChevronIcon() {
  return (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
      <polyline points="9 6 15 12 9 18"></polyline>
    </svg>
  )
}

function PlusIcon() {
  return (
    <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
      <line x1="12" y1="5" x2="12" y2="19"></line>
      <line x1="5" y1="12" x2="19" y2="12"></line>
    </svg>
  )
}

function ApiIcon({ color }) {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <polyline points="8 6 2 12 8 18"></polyline>
      <polyline points="16 6 22 12 16 18"></polyline>
    </svg>
  )
}

function SftpIcon({ color }) {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M12 16V4"></path>
      <polyline points="7 9 12 4 17 9"></polyline>
      <path d="M4 16v3a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2v-3"></path>
    </svg>
  )
}

function PlatformBadge({ platform }) {
  return (
    <div className="ing-badge" style={{ background: platform.bg }}>
      {platform.kind === 'letter' && (
        <span className="ing-badge-letter" style={{ color: platform.color }}>
          {platform.initial}
        </span>
      )}
      {platform.kind === 'api' && <ApiIcon color={platform.color} />}
      {platform.kind === 'sftp' && <SftpIcon color={platform.color} />}
    </div>
  )
}

function StatusPill({ status }) {
  const enabled = status === 'enabled'
  const pillBg = enabled ? '#e7f7ec' : '#eef0f2'
  const pillColor = enabled ? '#166534' : '#57606a'
  const dotColor = enabled ? '#22c55e' : '#9aa4b2'
  return (
    <span className="ing-pill" style={{ background: pillBg, color: pillColor }}>
      <span className="ing-pill-dot" style={{ background: dotColor }}></span>
      {enabled ? 'Enabled' : 'Disabled'}
    </span>
  )
}

function PlatformCard({ platform, onManage }) {
  const cardRef = useRef(null)
  const isNotConnected = platform.status === 'not_connected'

  function handleEnter() {
    const card = cardRef.current
    if (!card) return
    gsap.to(card, {
      y: -5,
      borderColor: `${platform.color}55`,
      boxShadow: `0 16px 34px ${platform.color}22`,
      duration: 0.3,
      ease: 'power2.out',
      overwrite: 'auto',
    })
    gsap.to(card.querySelector('.ing-badge'), {
      scale: 1.08,
      duration: 0.3,
      ease: 'power2.out',
      overwrite: 'auto',
    })
  }

  function handleLeave() {
    const card = cardRef.current
    if (!card) return
    gsap.to(card, {
      y: 0,
      borderColor: '#e4e7ec',
      boxShadow: '0 1px 2px rgba(15, 23, 42, 0.03)',
      duration: 0.3,
      ease: 'power2.out',
      overwrite: 'auto',
    })
    gsap.to(card.querySelector('.ing-badge'), {
      scale: 1,
      duration: 0.3,
      ease: 'power2.out',
      overwrite: 'auto',
    })
  }

  return (
    <div ref={cardRef} className="ing-card" onMouseEnter={handleEnter} onMouseLeave={handleLeave}>
      <div className="ing-card-top">
        <PlatformBadge platform={platform} />
        {!isNotConnected && <StatusPill status={platform.status} />}
      </div>
      <div>
        <div className="ing-card-name">{platform.name}</div>
        <div className="ing-card-desc">{platform.desc}</div>
      </div>
      <div className="ing-card-footer">
        {isNotConnected ? (
          <button
            type="button"
            className="ing-add-btn"
            style={{ '--ing-add-color': platform.color }}
            onClick={() => onManage?.(platform)}
          >
            <PlusIcon />
            Add New Connection
          </button>
        ) : (
          <button type="button" className="ing-manage-link" onClick={() => onManage?.(platform)}>
            Manage connection
            <ChevronIcon />
          </button>
        )}
      </div>
    </div>
  )
}

export default function IngestionSettings({ accent = ACCENT, onManageConnection }) {
  const [allPlatforms, setAllPlatforms] = useState(INITIAL_PLATFORMS)
  const [filter, setFilter] = useState('all')
  const [query, setQuery] = useState('')
  const [uploadTarget, setUploadTarget] = useState(null)
  const [manageTarget, setManageTarget] = useState(null)
  const [connectionCredentials, setConnectionCredentials] = useState({})
  const gridRef = useRef(null)

  const enabledCount = useMemo(() => allPlatforms.filter((p) => p.status === 'enabled').length, [allPlatforms])
  const disabledCount = useMemo(() => allPlatforms.filter((p) => p.status === 'disabled').length, [allPlatforms])
  const notConnectedCount = useMemo(
    () => allPlatforms.filter((p) => p.status === 'not_connected').length,
    [allPlatforms]
  )

  const platforms = useMemo(() => {
    const q = query.trim().toLowerCase()
    return allPlatforms.filter((p) => {
      const matchesQuery = !q || p.name.toLowerCase().includes(q)
      const matchesFilter = filter === 'all' || p.status === filter
      return matchesQuery && matchesFilter
    })
  }, [allPlatforms, filter, query])

  useEffect(() => {
    const cards = gridRef.current?.querySelectorAll('.ing-card')
    if (!cards || cards.length === 0) return
    gsap.fromTo(
      cards,
      { opacity: 0, y: 12 },
      { opacity: 1, y: 0, duration: 0.35, ease: 'power2.out', stagger: 0.035, overwrite: 'auto' }
    )
  }, [platforms])

  function handleManage(platform) {
    if (platform.status === 'not_connected') {
      setUploadTarget(platform)
    } else {
      setManageTarget(platform)
      onManageConnection?.(platform)
    }
  }

  function handleConnectionCreated(platformId, credentials) {
    const fields = Object.entries(credentials).map(([key, value]) => ({ key, value }))
    let updatedPlatform = null
    setAllPlatforms((prev) =>
      prev.map((p) => {
        if (p.id !== platformId) return p
        updatedPlatform = { ...p, status: 'enabled', desc: `Connected to ${p.name} profile` }
        return updatedPlatform
      })
    )
    setConnectionCredentials((prev) => ({ ...prev, [platformId]: { fields, connectedAt: new Date() } }))
    setUploadTarget(null)
    // Redirect straight into "Manage connection" so the newly uploaded fields
    // (and the Edit option) are immediately visible, instead of just closing.
    setManageTarget(updatedPlatform)
  }

  function handleFieldsUpdated(platformId, fields) {
    setConnectionCredentials((prev) => ({
      ...prev,
      [platformId]: { ...prev[platformId], fields, connectedAt: prev[platformId]?.connectedAt || new Date() },
    }))
  }

  function handleDisconnect(platformId) {
    setAllPlatforms((prev) =>
      prev.map((p) =>
        p.id === platformId ? { ...p, status: 'not_connected', desc: `Connect to ${p.name} profile` } : p
      )
    )
    setConnectionCredentials((prev) => {
      const next = { ...prev }
      delete next[platformId]
      return next
    })
    setManageTarget(null)
  }

  return (
    <div className="ing-page" style={{ '--ing-accent': accent }}>
      <div className="ing-toolbar-top">
        <div className="ing-search-wrap">
          <span className="ing-search-icon">
            <SearchIcon />
          </span>
          <input
            className="ing-search-input"
            type="text"
            placeholder="Search platforms"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
          />
        </div>
        <button type="button" className="ing-action-btn" title="Sync activity">
          <PulseIcon color={accent} />
        </button>
      </div>

      <div className="ing-toolbar">
        <div className="ing-tabs">
          <button
            type="button"
            className={`ing-tab${filter === 'all' ? ' is-active' : ''}`}
            onClick={() => setFilter('all')}
          >
            All &middot; {allPlatforms.length}
          </button>
          <button
            type="button"
            className={`ing-tab${filter === 'enabled' ? ' is-active' : ''}`}
            onClick={() => setFilter('enabled')}
          >
            Connected &middot; {enabledCount}
          </button>
          <button
            type="button"
            className={`ing-tab${filter === 'disabled' ? ' is-active' : ''}`}
            onClick={() => setFilter('disabled')}
          >
            Disabled &middot; {disabledCount}
          </button>
          <button
            type="button"
            className={`ing-tab${filter === 'not_connected' ? ' is-active' : ''}`}
            onClick={() => setFilter('not_connected')}
          >
            Not Connected &middot; {notConnectedCount}
          </button>
        </div>
      </div>

      {platforms.length > 0 ? (
        <div ref={gridRef} className="ing-grid">
          {platforms.map((platform) => (
            <PlatformCard key={platform.id} platform={platform} onManage={handleManage} />
          ))}
        </div>
      ) : (
        <div className="ing-empty">No platforms match &ldquo;{query}&rdquo;.</div>
      )}

      {uploadTarget && (
        <ConnectionUploadModal
          platform={uploadTarget}
          onClose={() => setUploadTarget(null)}
          onSuccess={handleConnectionCreated}
        />
      )}

      {manageTarget && (
        <ConnectionDetailsModal
          platform={manageTarget}
          uploadedConnection={connectionCredentials[manageTarget.id]}
          onClose={() => setManageTarget(null)}
          onDisconnect={handleDisconnect}
          onFieldsUpdated={handleFieldsUpdated}
        />
      )}
    </div>
  )
}
