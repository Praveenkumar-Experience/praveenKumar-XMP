import { useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import './AutopostSettings.css'
import { CHANNELS, USERS } from '../autopostData.js'
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
    <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="#2563eb" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
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

  const scopedTier = tierId ? TIERS.find((t) => t.id === tierId) : null
  const scopedUser = userId ? USERS.find((u) => u.id === userId) : null
  const scopedLabel = scopedUser ? scopedUser.name : scopedTier ? scopedTier.name : null

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
      <div className="ap-header">
        <h1 className="ap-title">Autopost Settings</h1>
        <p className="ap-subtitle">Automatically publish top-rated reviews to your connected channels.</p>
      </div>

      {scopedLabel ? (
        <button type="button" className="ap-back-link" onClick={() => navigate('/autopost-settings')}>
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

      {!scopedLabel && pageTab === 'hierarchy' && (
        <div className="ap-list">
          {TIERS.map((tier) => (
            <button key={tier.id} type="button" className="ap-list-row" onClick={() => navigate(`/autopost-settings/tier/${tier.id}`)}>
              <span className="ap-badge" style={{ background: `${tier.color}22`, color: tier.color }}>{tier.initial}</span>
              <span className="ap-list-row-main">
                <span className="ap-list-row-name">{tier.name}</span>
                <span className="ap-list-row-sub">{tier.level}</span>
              </span>
            </button>
          ))}
        </div>
      )}

      {!scopedLabel && pageTab === 'users' && (
        <div className="ap-list">
          {USERS.map((user) => (
            <button key={user.id} type="button" className="ap-list-row" onClick={() => navigate(`/autopost-settings/user/${user.id}`)}>
              <span className="ap-badge" style={{ background: `${user.color}22`, color: user.color }}>{user.initial}</span>
              <span className="ap-list-row-main">
                <span className="ap-list-row-name">{user.name}</span>
                <span className="ap-list-row-sub">{user.email}</span>
              </span>
            </button>
          ))}
        </div>
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
              onClick={() => navigate('/autopost-settings/templates/new')}
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
                      navigate(`/autopost-settings/templates/${template.id}`)
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
