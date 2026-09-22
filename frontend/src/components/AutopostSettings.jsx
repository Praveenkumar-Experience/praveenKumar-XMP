import { useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { Filter, Search, X, Mail, CheckCircle2 } from 'lucide-react'
import './AutopostSettings.css'
import { CHANNELS, USERS, TEMPLATES, ROLES, STATUSES } from '../autopostData.js'
import { ORGANIZATIONS, ACCOUNTS } from '../transactionData.js'
import { useTemplates } from '../templatesContext.jsx'
import { ACCENT } from '../theme.js'

const TIERS = [
  ...ORGANIZATIONS.map((o) => ({ ...o, level: 'Organization' })),
  ...ACCOUNTS.map((a) => ({ ...a, level: 'Account' })),
]

function PlusIcon() {
  return (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
      <line x1="12" y1="5" x2="12" y2="19"></line>
      <line x1="5" y1="12" x2="19" y2="12"></line>
    </svg>
  )
}

function InfoIcon() {
  return (
    <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="#0d9488" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="12" cy="12" r="10"></circle>
      <line x1="12" y1="16" x2="12" y2="12"></line>
      <line x1="12" y1="8" x2="12.01" y2="8"></line>
    </svg>
  )
}

function CheckIcon() {
  return (
    <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="#ffffff" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
      <polyline points="20 6 9 17 4 12"></polyline>
    </svg>
  )
}

function EditIcon() {
  return (
    <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="#ffffff" strokeWidth="2.3" strokeLinecap="round" strokeLinejoin="round">
      <path d="M17 3a2.828 2.828 0 1 1 4 4L7.5 20.5 2 22l1.5-5.5L17 3Z"></path>
    </svg>
  )
}

function ToggleSwitch({ checked, onChange, label }) {
  return (
    <button
      type="button"
      role="switch"
      aria-checked={checked}
      aria-label={label}
      className={`ap-toggle${checked ? ' is-on' : ''}`}
      onClick={() => onChange(!checked)}
    >
      <span className="ap-toggle-thumb" />
    </button>
  )
}

const PAGE_TABS = [
  { id: 'hierarchy', label: 'Hierarchy' },
  { id: 'users', label: 'Users' },
  { id: 'account', label: 'Account Autopost settings' },
]

export default function AutopostSettings({ accent = ACCENT }) {
  const navigate = useNavigate()
  const { tierId, userId } = useParams()
  const { templates } = useTemplates()
  const [pageTab, setPageTab] = useState('account')
  const [channels, setChannels] = useState(CHANNELS)
  const [activeId, setActiveId] = useState(CHANNELS[0].id)
  const [justSaved, setJustSaved] = useState(false)
  const [hSearch, setHSearch] = useState('')
  const [hLevel, setHLevel] = useState('')
  const [uSearch, setUSearch] = useState('')
  const [uTier, setUTier] = useState('')
  const [uRole, setURole] = useState('')
  const [uStatuses, setUStatuses] = useState(['Activated', 'Onboarding'])

  const scopedTier = tierId ? TIERS.find((t) => t.id === tierId) : null
  const scopedUser = userId ? USERS.find((u) => u.id === userId) : null
  const scopedLabel = scopedUser ? scopedUser.name : scopedTier ? scopedTier.name : null

  const filteredTiers = TIERS.filter(
    (t) => (!hLevel || t.level === hLevel) && t.name.toLowerCase().includes(hSearch.toLowerCase())
  )

  const filteredUsers = USERS.filter(
    (u) =>
      (!uSearch || u.name.toLowerCase().includes(uSearch.toLowerCase()) || u.email.toLowerCase().includes(uSearch.toLowerCase())) &&
      (!uTier || u.accountId === uTier) &&
      (!uRole || u.role === uRole) &&
      (uStatuses.length === 0 || uStatuses.includes(u.status))
  )

  const active = channels.find((c) => c.id === activeId)

  function updateActive(patch) {
    setChannels((prev) => prev.map((c) => (c.id === activeId ? { ...c, ...patch } : c)))
    setJustSaved(false)
  }

  function toggleTemplate(templateId) {
    updateActive({
      selectedTemplateIds: active.selectedTemplateIds.includes(templateId)
        ? active.selectedTemplateIds.filter((id) => id !== templateId)
        : [...active.selectedTemplateIds, templateId],
    })
  }

  function handleSave() {
    setJustSaved(true)
  }

  return (
    <div className="ap-page" style={{ '--ing-accent': accent }}>
      {scopedLabel ? (
        <button type="button" className="ap-back-link" onClick={() => navigate('/settings/autopost')}>
          &larr; Back to Autopost Settings
        </button>
      ) : (
        <div className="ap-page-tabs">
          {PAGE_TABS.map((tab) => (
            <button
              key={tab.id}
              type="button"
              className={`ap-page-tab${tab.id === pageTab ? ' is-active' : ''}`}
              onClick={() => setPageTab(tab.id)}
            >
              {tab.label}
            </button>
          ))}
        </div>
      )}

      {!scopedLabel && (pageTab === 'hierarchy' || pageTab === 'users') && (
        <div className="ap-overview">
          <div className="ap-overview-group">
            <div className="ap-overview-stat">
              <span className="ap-overview-value">{ORGANIZATIONS.length}</span>
              <span className="ap-overview-label">Organizations</span>
            </div>
            <div className="ap-overview-stat">
              <span className="ap-overview-value">{ACCOUNTS.length}</span>
              <span className="ap-overview-label">Accounts</span>
            </div>
          </div>
          <div className="ap-overview-divider" />
          <div className="ap-overview-group">
            <div className="ap-overview-chip">
              <CheckCircle2 size={20} className="ap-overview-chip-icon" />
              <span>
                <span className="ap-overview-value">{USERS.length}</span>
                <span className="ap-overview-label">Total Users</span>
              </span>
            </div>
            <div className="ap-overview-chip">
              <CheckCircle2 size={20} className="ap-overview-chip-icon" />
              <span>
                <span className="ap-overview-value">{TEMPLATES.length}</span>
                <span className="ap-overview-label">Templates</span>
              </span>
            </div>
          </div>
        </div>
      )}

      {!scopedLabel && pageTab === 'hierarchy' && (
        <div className="ap-panel-layout">
          <aside className="ap-filter-panel">
            <div className="ap-filter-header">
              <Filter size={15} />
              <span>Filter Hierarchy</span>
              <button type="button" className="ap-filter-clear" onClick={() => { setHSearch(''); setHLevel('') }}>Clear</button>
            </div>
            <label className="ap-filter-label">Search</label>
            <div className="ap-filter-search">
              <Search size={14} />
              <input type="text" placeholder="Search" value={hSearch} onChange={(e) => setHSearch(e.target.value)} />
            </div>
            <label className="ap-filter-label">Filter by Level</label>
            <select className="ap-filter-select" value={hLevel} onChange={(e) => setHLevel(e.target.value)}>
              <option value="">Show all</option>
              <option value="Organization">Organization</option>
              <option value="Account">Account</option>
            </select>
          </aside>
          <div className="ap-table-card">
            <table className="ap-table">
              <thead>
                <tr>
                  <th>Name</th>
                  <th>Level</th>
                  <th>Users</th>
                </tr>
              </thead>
              <tbody>
                {filteredTiers.length === 0 ? (
                  <tr className="ap-table-empty-row">
                    <td colSpan={3}>
                      <div className="ap-empty-state">
                        <Mail size={28} />
                        <span>No data</span>
                      </div>
                    </td>
                  </tr>
                ) : (
                  filteredTiers.map((tier) => (
                    <tr key={tier.id} className="ap-table-row" onClick={() => navigate(`/settings/autopost/tier/${tier.id}`)}>
                      <td>
                        <span className="ap-table-user">
                          <span className="ap-badge ap-badge-sm" style={{ background: `${tier.color}22`, color: tier.color }}>{tier.initial}</span>
                          {tier.name}
                        </span>
                      </td>
                      <td>{tier.level}</td>
                      <td>{tier.level === 'Account' ? USERS.filter((u) => u.accountId === tier.id).length : '—'}</td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {!scopedLabel && pageTab === 'users' && (
        <>
          <div className="ap-panel-toolbar">
            <button type="button" className="ap-add-user-btn">+ Add New User</button>
          </div>
          <div className="ap-panel-layout">
            <aside className="ap-filter-panel">
              <div className="ap-filter-header">
                <Filter size={15} />
                <span>Filter Users</span>
                <button
                  type="button"
                  className="ap-filter-clear"
                  onClick={() => { setUSearch(''); setUTier(''); setURole(''); setUStatuses([]) }}
                >
                  Clear
                </button>
              </div>
              <label className="ap-filter-label">Search</label>
              <div className="ap-filter-search">
                <Search size={14} />
                <input type="text" placeholder="Search" value={uSearch} onChange={(e) => setUSearch(e.target.value)} />
              </div>
              <label className="ap-filter-label">Filter by Hierarchy</label>
              <select className="ap-filter-select" value={uTier} onChange={(e) => setUTier(e.target.value)}>
                <option value="">Filter By Tiers</option>
                {ACCOUNTS.map((a) => (
                  <option key={a.id} value={a.id}>{a.name}</option>
                ))}
              </select>
              <label className="ap-filter-label">Select Role</label>
              <select className="ap-filter-select" value={uRole} onChange={(e) => setURole(e.target.value)}>
                <option value="">Show all</option>
                {ROLES.map((r) => (
                  <option key={r} value={r}>{r}</option>
                ))}
              </select>
              <label className="ap-filter-label">Status</label>
              <div className="ap-filter-chips">
                {uStatuses.length === 0 && <span className="ap-filter-chips-empty">Show all</span>}
                {uStatuses.map((s) => (
                  <span key={s} className="ap-chip">
                    {s}
                    <button type="button" onClick={() => setUStatuses((prev) => prev.filter((x) => x !== s))} aria-label={`Remove ${s} filter`}>
                      <X size={11} />
                    </button>
                  </span>
                ))}
                {STATUSES.filter((s) => !uStatuses.includes(s)).map((s) => (
                  <button key={s} type="button" className="ap-chip-add" onClick={() => setUStatuses((prev) => [...prev, s])}>
                    + {s}
                  </button>
                ))}
              </div>
            </aside>
            <div className="ap-table-card">
              <table className="ap-table">
                <thead>
                  <tr>
                    <th>User Information</th>
                    <th>Account</th>
                    <th>Role</th>
                    <th>Status</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredUsers.length === 0 ? (
                    <tr className="ap-table-empty-row">
                      <td colSpan={4}>
                        <div className="ap-empty-state">
                          <Mail size={28} />
                          <span>No data</span>
                        </div>
                      </td>
                    </tr>
                  ) : (
                    filteredUsers.map((user) => (
                      <tr key={user.id} className="ap-table-row" onClick={() => navigate(`/settings/autopost/user/${user.id}`)}>
                        <td>
                          <span className="ap-table-user">
                            <span className="ap-badge ap-badge-sm" style={{ background: `${user.color}22`, color: user.color }}>{user.initial}</span>
                            <span className="ap-table-user-main">
                              <span className="ap-table-user-name">{user.name}</span>
                              <span className="ap-table-user-email">{user.email}</span>
                            </span>
                          </span>
                        </td>
                        <td>{ACCOUNTS.find((a) => a.id === user.accountId)?.name}</td>
                        <td>{user.role}</td>
                        <td><span className={`ap-status-chip ap-status-${user.status.toLowerCase()}`}>{user.status}</span></td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </>
      )}

      {(scopedLabel || pageTab === 'account') && (
        <>
          {scopedLabel && <h2 className="ap-scoped-heading">{scopedLabel} &middot; Autopost</h2>}
          <div className="ap-tabs">
            {channels.map((channel) => (
              <button
                key={channel.id}
                type="button"
                className={`ap-tab${channel.id === activeId ? ' is-active' : ''}`}
                onClick={() => setActiveId(channel.id)}
              >
                <span className="ap-tab-badge" style={{ background: channel.bg, color: channel.color }}>
                  {channel.initial}
                </span>
                {channel.name}
                <span className={`ap-tab-dot${channel.allowAutopost ? ' is-on' : ''}`} title={channel.allowAutopost ? 'Autopost enabled' : 'Autopost disabled'} />
              </button>
            ))}
          </div>

      <div className="ap-card">
        <div className="ap-card-header">
          <div className="ap-card-heading">
            <span className="ap-badge" style={{ background: active.bg, color: active.color }}>
              {active.initial}
            </span>
            <h2>{active.name} Autopost</h2>
          </div>
          <button type="button" className="ap-save-btn" onClick={handleSave}>
            {justSaved ? 'Saved' : 'Save'}
          </button>
        </div>

        <div className="ap-row">
          <span className="ap-row-label">Allow autopost</span>
          <ToggleSwitch checked={active.allowAutopost} onChange={(v) => updateActive({ allowAutopost: v })} label="Allow autopost" />
        </div>

        <div className="ap-row">
          <span className="ap-row-label">Minimum score to auto-post</span>
          <div className="ap-slider-wrap">
            <span className="ap-slider-value">{active.minScore}</span>
            <input
              type="range"
              min={0}
              max={5}
              step={1}
              value={active.minScore}
              onChange={(e) => updateActive({ minScore: Number(e.target.value) })}
              className="ap-slider"
              style={{ '--fill': `${(active.minScore / 5) * 100}%` }}
            />
          </div>
        </div>

        <div className="ap-row">
          <span className="ap-row-label">Maximum number of posts per day</span>
          <input
            type="number"
            min={1}
            max={20}
            className="ap-number-input"
            value={active.maxPostsPerDay}
            onChange={(e) => updateActive({ maxPostsPerDay: Number(e.target.value) })}
          />
        </div>

        <div className="ap-row">
          <span className="ap-row-label">Minimum gap between posts</span>
          <div className="ap-gap-inputs">
            <input
              type="number"
              min={0}
              max={23}
              className="ap-number-input ap-gap-input"
              value={active.gapHours}
              onChange={(e) => updateActive({ gapHours: Number(e.target.value) })}
            />
            <span className="ap-gap-unit">Hours</span>
            <input
              type="number"
              min={0}
              max={59}
              className="ap-number-input ap-gap-input"
              value={active.gapMinutes}
              onChange={(e) => updateActive({ gapMinutes: Number(e.target.value) })}
            />
            <span className="ap-gap-unit">Mins</span>
          </div>
        </div>

        <div className="ap-row">
          <span className="ap-row-label">Auto Post Delay</span>
          <ToggleSwitch checked={active.autoPostDelay} onChange={(v) => updateActive({ autoPostDelay: v })} label="Auto Post Delay" />
        </div>

        <div className="ap-templates">
          <div className="ap-templates-header">
            <div className="ap-templates-title">
              Select Templates <span className="ap-templates-count">({active.selectedTemplateIds.length} selected)</span>
            </div>
            <button
              type="button"
              className="ap-add-template-btn"
              onClick={() => navigate('/settings/autopost/templates/new')}
            >
              <PlusIcon />
              Create Template
            </button>
          </div>

          <div className="ap-info-banner">
            <InfoIcon />
            If you pick multiple templates, a random template will be published for each review.
          </div>

          <div className="ap-template-grid">
            {templates.map((template) => {
              const isSelected = active.selectedTemplateIds.includes(template.id)
              return (
                <div
                  key={template.id}
                  role="button"
                  tabIndex={0}
                  className={`ap-template-card${isSelected ? ' is-selected' : ''}`}
                  style={{ background: template.gradient }}
                  onClick={() => toggleTemplate(template.id)}
                  onKeyDown={(e) => {
                    if (e.key !== 'Enter' && e.key !== ' ') return
                    e.preventDefault()
                    toggleTemplate(template.id)
                  }}
                  aria-pressed={isSelected}
                >
                  <button
                    type="button"
                    className="ap-template-edit"
                    aria-label={`Edit ${template.name}`}
                    onClick={(e) => {
                      e.stopPropagation()
                      navigate(`/settings/autopost/templates/${template.id}`)
                    }}
                  >
                    <EditIcon />
                  </button>
                  {isSelected && (
                    <span className="ap-template-check">
                      <CheckIcon />
                    </span>
                  )}
                  <div className={`ap-template-preview${template.dark ? ' is-dark' : ''}`}>
                    <div className="ap-template-stars">★★★★★</div>
                    <div className="ap-template-line" />
                    <div className="ap-template-line short" />
                  </div>
                </div>
              )
            })}
          </div>
        </div>
      </div>
        </>
      )}
    </div>
  )
}
