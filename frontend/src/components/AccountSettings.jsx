import { useState } from 'react'
import { Mail, CheckCircle2, AlertCircle, ChevronUp, ChevronDown, X, Plus } from 'lucide-react'
import './AccountSettings.css'
import { CURRENT_ACCOUNT } from '../insightsData.js'

function ToggleSwitch({ checked, onChange, label }) {
  return (
    <button
      type="button"
      role="switch"
      aria-checked={checked}
      aria-label={label}
      className={`acc-toggle${checked ? ' is-on' : ''}`}
      onClick={() => onChange(!checked)}
    >
      <span className="acc-toggle-thumb" />
    </button>
  )
}

function ToggleRow({ label, checked, onChange }) {
  return (
    <div className="acc-toggle-row">
      <span className="acc-toggle-label">{label}</span>
      <ToggleSwitch checked={checked} onChange={onChange} label={label} />
    </div>
  )
}

function Accordion({ title, open, onToggle, children }) {
  return (
    <div className="acc-accordion">
      <button type="button" className="acc-accordion-header" onClick={onToggle} aria-expanded={open}>
        <span>{title}</span>
        {open ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
      </button>
      {open && <div className="acc-accordion-body">{children}</div>}
    </div>
  )
}

const TIME_ZONES = ['Eastern Standard Time', 'Central Standard Time', 'Mountain Standard Time', 'Pacific Standard Time']
const CATEGORIES = ['Mortgage Broker', 'Real Estate Agency', 'Insurance Agency', 'Financial Advisor']

export default function AccountSettings() {
  const [name, setName] = useState(CURRENT_ACCOUNT.name)
  const [justSaved, setJustSaved] = useState(false)

  const [openSections, setOpenSections] = useState({
    general: true,
    categories: true,
    hierarchy: true,
    profile: true,
    reviews: false,
    social: false,
    listing: false,
    danger: false,
  })

  const [accountName, setAccountName] = useState(CURRENT_ACCOUNT.accountName)
  const [timeZone, setTimeZone] = useState(TIME_ZONES[0])
  const [category, setCategory] = useState(CATEGORIES[0])
  const [products, setProducts] = useState(['FHA Home Loan'])
  const [newProduct, setNewProduct] = useState('')

  const [managerEmails, setManagerEmails] = useState([])
  const [newManagerEmail, setNewManagerEmail] = useState('')

  const [hierarchyToggles, setHierarchyToggles] = useState({
    addUsers: false,
    moveUsers: true,
    recoveryEmailLogin: true,
    updateNotification: true,
  })

  const [profileToggles, setProfileToggles] = useState({
    hideAllProfiles: false,
    showPagesForTiers: false,
    showPagesForUsers: false,
    allowOptOut: true,
    allowPromotePartnerProfiles: true,
    showHierarchyOnLocationPages: false,
    showContactForm: true,
    hideBreadcrumbs: true,
  })

  const [reviewToggles, setReviewToggles] = useState({
    allowResponses: true,
    requireApproval: false,
  })

  const [socialToggles, setSocialToggles] = useState({
    enableScheduling: true,
    allowCaptionEditing: true,
  })

  const [listingToggles, setListingToggles] = useState({
    syncBusinessHours: true,
    autoPublishUpdates: false,
  })

  const [dangerNotice, setDangerNotice] = useState(null)

  function toggleSection(key) {
    setOpenSections((prev) => ({ ...prev, [key]: !prev[key] }))
  }

  function handleSave(e) {
    e.preventDefault()
    setJustSaved(true)
  }

  function addProduct(e) {
    e.preventDefault()
    const value = newProduct.trim()
    if (!value || products.includes(value)) return
    setProducts((prev) => [...prev, value])
    setNewProduct('')
  }

  function addManagerEmail(e) {
    e.preventDefault()
    const value = newManagerEmail.trim()
    if (!value || managerEmails.includes(value)) return
    setManagerEmails((prev) => [...prev, value])
    setNewManagerEmail('')
  }

  return (
    <div className="acc-page">
      <form className="acc-card" onSubmit={handleSave}>
        <div className="acc-card-header">
          <h2>Profile</h2>
          <button type="submit" className="acc-save-btn">
            {justSaved ? 'Saved' : 'Save changes'}
          </button>
        </div>

        <label className="acc-field">
          <span className="acc-field-label">Full name</span>
          <input
            type="text"
            className="acc-input"
            value={name}
            onChange={(e) => {
              setName(e.target.value)
              setJustSaved(false)
            }}
          />
        </label>

        <label className="acc-field">
          <span className="acc-field-label">Email</span>
          <div className={`acc-email-badge${CURRENT_ACCOUNT.emailVerified ? ' is-ok' : ' is-error'}`}>
            <Mail size={14} />
            {CURRENT_ACCOUNT.email}
            {CURRENT_ACCOUNT.emailVerified ? <CheckCircle2 size={14} /> : <AlertCircle size={14} />}
          </div>
          {!CURRENT_ACCOUNT.emailVerified && (
            <span className="acc-field-hint">Not verified yet. Check your inbox for a verification link.</span>
          )}
        </label>

        <div className="acc-field-row">
          <div className="acc-field">
            <span className="acc-field-label">Role</span>
            <span className="acc-static-value">{CURRENT_ACCOUNT.role}</span>
          </div>
          <div className="acc-field">
            <span className="acc-field-label">Account</span>
            <span className="acc-static-value">{CURRENT_ACCOUNT.accountName}</span>
          </div>
        </div>
      </form>

      <div className="acc-accordion-card">
        <Accordion title="General Settings" open={openSections.general} onToggle={() => toggleSection('general')}>
          <label className="acc-field">
            <span className="acc-field-label">Edit Account Name *</span>
            <input type="text" className="acc-input" value={accountName} onChange={(e) => setAccountName(e.target.value)} />
          </label>
          <div className="acc-field-row">
            <label className="acc-field">
              <span className="acc-field-label">Country</span>
              <select className="acc-input" value="USA" disabled>
                <option>USA</option>
              </select>
            </label>
            <label className="acc-field">
              <span className="acc-field-label">Time Zone</span>
              <select className="acc-input" value={timeZone} onChange={(e) => setTimeZone(e.target.value)}>
                {TIME_ZONES.map((tz) => (
                  <option key={tz} value={tz}>{tz}</option>
                ))}
              </select>
            </label>
          </div>
          <label className="acc-field">
            <span className="acc-field-label">Date Format</span>
            <select className="acc-input" value="YYYY/MM/DD" disabled>
              <option>YYYY/MM/DD</option>
            </select>
          </label>
        </Accordion>

        <Accordion title="Categories and Services" open={openSections.categories} onToggle={() => toggleSection('categories')}>
          <label className="acc-field">
            <span className="acc-field-label">Category *</span>
            <select className="acc-input" value={category} onChange={(e) => setCategory(e.target.value)}>
              {CATEGORIES.map((c) => (
                <option key={c} value={c}>{c}</option>
              ))}
            </select>
          </label>
          <div className="acc-field">
            <span className="acc-field-label">Products and Services *</span>
            <div className="acc-chip-input">
              {products.map((p) => (
                <span key={p} className="acc-chip">
                  {p}
                  <button type="button" onClick={() => setProducts((prev) => prev.filter((x) => x !== p))} aria-label={`Remove ${p}`}>
                    <X size={12} />
                  </button>
                </span>
              ))}
              <input
                type="text"
                placeholder="Add product or service"
                value={newProduct}
                onChange={(e) => setNewProduct(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter') addProduct(e)
                }}
              />
            </div>
          </div>
        </Accordion>

        <Accordion title="Hierarchy Settings" open={openSections.hierarchy} onToggle={() => toggleSection('hierarchy')}>
          <ToggleRow
            label="Allow Tier Managers to add users"
            checked={hierarchyToggles.addUsers}
            onChange={(v) => setHierarchyToggles((prev) => ({ ...prev, addUsers: v }))}
          />
          <ToggleRow
            label="Allow Tier Managers to move users"
            checked={hierarchyToggles.moveUsers}
            onChange={(v) => setHierarchyToggles((prev) => ({ ...prev, moveUsers: v }))}
          />
          <ToggleRow
            label="Allow Users to login via Recovery Email"
            checked={hierarchyToggles.recoveryEmailLogin}
            onChange={(v) => setHierarchyToggles((prev) => ({ ...prev, recoveryEmailLogin: v }))}
          />
          <ToggleRow
            label="Receive hierarchy update notification"
            checked={hierarchyToggles.updateNotification}
            onChange={(v) => setHierarchyToggles((prev) => ({ ...prev, updateNotification: v }))}
          />
          <div className="acc-subfield">
            <span className="acc-field-label">Send updates to account manager and the following:</span>
            <div className="acc-chip-input">
              {managerEmails.map((email) => (
                <span key={email} className="acc-chip">
                  {email}
                  <button type="button" onClick={() => setManagerEmails((prev) => prev.filter((x) => x !== email))} aria-label={`Remove ${email}`}>
                    <X size={12} />
                  </button>
                </span>
              ))}
            </div>
            <div className="acc-add-email-row">
              <input
                type="email"
                className="acc-input"
                placeholder="name@company.com"
                value={newManagerEmail}
                onChange={(e) => setNewManagerEmail(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter') addManagerEmail(e)
                }}
              />
              <button type="button" className="acc-add-email-btn" onClick={addManagerEmail}>
                <Plus size={13} /> Add new email
              </button>
            </div>
          </div>
        </Accordion>

        <Accordion title="Public Profile Settings" open={openSections.profile} onToggle={() => toggleSection('profile')}>
          <ToggleRow label="Hide all public profiles" checked={profileToggles.hideAllProfiles} onChange={(v) => setProfileToggles((p) => ({ ...p, hideAllProfiles: v }))} />
          <ToggleRow label="Show public pages for tiers" checked={profileToggles.showPagesForTiers} onChange={(v) => setProfileToggles((p) => ({ ...p, showPagesForTiers: v }))} />
          <ToggleRow label="Show public pages for users" checked={profileToggles.showPagesForUsers} onChange={(v) => setProfileToggles((p) => ({ ...p, showPagesForUsers: v }))} />
          <ToggleRow label="Allow users to opt out" checked={profileToggles.allowOptOut} onChange={(v) => setProfileToggles((p) => ({ ...p, allowOptOut: v }))} />
          <ToggleRow label="Allow users to promote partner profiles" checked={profileToggles.allowPromotePartnerProfiles} onChange={(v) => setProfileToggles((p) => ({ ...p, allowPromotePartnerProfiles: v }))} />
          <ToggleRow label="Show hierarchy on location pages" checked={profileToggles.showHierarchyOnLocationPages} onChange={(v) => setProfileToggles((p) => ({ ...p, showHierarchyOnLocationPages: v }))} />
          <ToggleRow label="Show contact form on public pages" checked={profileToggles.showContactForm} onChange={(v) => setProfileToggles((p) => ({ ...p, showContactForm: v }))} />
          <ToggleRow label="Hide breadcrumbs from the public pages" checked={profileToggles.hideBreadcrumbs} onChange={(v) => setProfileToggles((p) => ({ ...p, hideBreadcrumbs: v }))} />
        </Accordion>

        <Accordion title="Review Management Settings" open={openSections.reviews} onToggle={() => toggleSection('reviews')}>
          <ToggleRow label="Allow users to respond to reviews" checked={reviewToggles.allowResponses} onChange={(v) => setReviewToggles((p) => ({ ...p, allowResponses: v }))} />
          <ToggleRow label="Require approval before publishing responses" checked={reviewToggles.requireApproval} onChange={(v) => setReviewToggles((p) => ({ ...p, requireApproval: v }))} />
        </Accordion>

        <Accordion title="Social Posts Settings" open={openSections.social} onToggle={() => toggleSection('social')}>
          <ToggleRow label="Enable social post scheduling" checked={socialToggles.enableScheduling} onChange={(v) => setSocialToggles((p) => ({ ...p, enableScheduling: v }))} />
          <ToggleRow label="Allow users to edit auto-generated captions" checked={socialToggles.allowCaptionEditing} onChange={(v) => setSocialToggles((p) => ({ ...p, allowCaptionEditing: v }))} />
        </Accordion>

        <Accordion title="Listing Settings" open={openSections.listing} onToggle={() => toggleSection('listing')}>
          <ToggleRow label="Sync business hours across listings" checked={listingToggles.syncBusinessHours} onChange={(v) => setListingToggles((p) => ({ ...p, syncBusinessHours: v }))} />
          <ToggleRow label="Auto-publish listing updates" checked={listingToggles.autoPublishUpdates} onChange={(v) => setListingToggles((p) => ({ ...p, autoPublishUpdates: v }))} />
        </Accordion>

        <Accordion title="Account" open={openSections.danger} onToggle={() => toggleSection('danger')}>
          <div className="acc-danger-zone">
            <button
              type="button"
              className="acc-danger-link"
              onClick={() => setDangerNotice('This is a demo account — suspension is disabled.')}
            >
              Suspend Account
            </button>
            <button
              type="button"
              className="acc-danger-link"
              onClick={() => setDangerNotice('This is a demo account — deactivation requests are disabled.')}
            >
              Request Account Deactivation
            </button>
            {dangerNotice && <p className="acc-danger-notice">{dangerNotice}</p>}
          </div>
        </Accordion>
      </div>
    </div>
  )
}
