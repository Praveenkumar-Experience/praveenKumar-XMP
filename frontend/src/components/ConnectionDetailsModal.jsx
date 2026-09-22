import { useState } from 'react'
import './ConnectionUploadModal.css'
import './ConnectionDetailsModal.css'
import { BACKEND_HTTP_URL } from '../config.js'
import { maskCredentialValue, parseCredentialsFile } from '../credentialFileParser.js'
import { getMockConnectionDetails } from '../connectionDetailsData.js'

const STATUS_DOT_COLOR = {
  Success: '#0ca30c',
  Pending: '#eda100',
  Failed: '#d03b3b',
}

export default function ConnectionDetailsModal({ platform, uploadedConnection, onClose, onDisconnect, onFieldsUpdated }) {
  const mock = getMockConnectionDetails(platform)
  const fields = uploadedConnection ? uploadedConnection.fields : mock.fields
  const connectedSince = uploadedConnection ? uploadedConnection.connectedAt : mock.connectedSince

  const [isEditing, setIsEditing] = useState(false)
  const [draftFields, setDraftFields] = useState([])
  const [newKey, setNewKey] = useState('')
  const [newValue, setNewValue] = useState('')
  const [importMode, setImportMode] = useState(null) // null | 'file' | 'paste'
  const [pasteText, setPasteText] = useState('')
  const [importError, setImportError] = useState(null)
  const [saving, setSaving] = useState(false)
  const [saveError, setSaveError] = useState(null)

  function startEdit() {
    setDraftFields(fields.map((f) => ({ ...f })))
    setIsEditing(true)
    setSaveError(null)
  }

  function cancelEdit() {
    setIsEditing(false)
    setImportMode(null)
    setPasteText('')
    setImportError(null)
    setSaveError(null)
  }

  function updateDraftValue(index, value) {
    setDraftFields((prev) => prev.map((f, i) => (i === index ? { ...f, value } : f)))
  }

  function removeDraftField(index) {
    setDraftFields((prev) => prev.filter((_, i) => i !== index))
  }

  function addCustomField() {
    const key = newKey.trim()
    if (!key) return
    setDraftFields((prev) => [...prev, { key, value: newValue }])
    setNewKey('')
    setNewValue('')
  }

  function handleReplaceFile(file) {
    setImportError(null)
    const reader = new FileReader()
    reader.onload = () => {
      try {
        const parsed = parseCredentialsFile(String(reader.result), file.name)
        setDraftFields(Object.entries(parsed).map(([key, value]) => ({ key, value })))
        setImportMode(null)
      } catch (err) {
        setImportError(err.message)
      }
    }
    reader.onerror = () => setImportError('Could not read this file.')
    reader.readAsText(file)
  }

  function handlePasteApply() {
    setImportError(null)
    try {
      const parsed = parseCredentialsFile(pasteText, '')
      setDraftFields(Object.entries(parsed).map(([key, value]) => ({ key, value })))
      setImportMode(null)
      setPasteText('')
    } catch (err) {
      setImportError(err.message)
    }
  }

  async function handleSave() {
    const cleaned = draftFields.filter((f) => f.key.trim() !== '' && String(f.value).trim() !== '')
    if (cleaned.length === 0) {
      setSaveError('A connection needs at least one non-empty field.')
      return
    }
    setSaving(true)
    setSaveError(null)
    try {
      const credentials = Object.fromEntries(cleaned.map((f) => [f.key, f.value]))
      const res = await fetch(`${BACKEND_HTTP_URL}/connections`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ platformId: platform.id, credentials }),
      })
      if (!res.ok) {
        const body = await res.json().catch(() => ({}))
        throw new Error(body.error || 'The backend rejected these credentials.')
      }
      onFieldsUpdated(platform.id, cleaned)
      setIsEditing(false)
    } catch (err) {
      setSaveError(err.message || 'Could not save changes. Is the backend running?')
    } finally {
      setSaving(false)
    }
  }

  return (
    <div className="cm-backdrop" onClick={onClose}>
      <div className="cm-modal cd-modal" onClick={(e) => e.stopPropagation()}>
        <div className="cm-header">
          <h2 className="cm-title">Manage {platform.name}</h2>
          <button type="button" className="cm-close" onClick={onClose} aria-label="Close">
            ×
          </button>
        </div>

        <div className="cd-meta-row">
          <span className={`cd-status-pill cd-status-${platform.status}`}>
            {platform.status === 'enabled' ? 'Enabled' : 'Disabled'}
          </span>
          <span className="cd-connected-since">
            Connected since{' '}
            {connectedSince.toLocaleDateString('en-US', { day: 'numeric', month: 'short', year: 'numeric' })}
          </span>
        </div>

        {!isEditing ? (
          <div className="cm-preview cd-fields">
            <div className="cm-preview-title">Connection fields ({fields.length})</div>
            <ul className="cm-preview-list">
              {fields.map((f) => (
                <li key={f.key} className="cm-preview-row">
                  <span className="cm-preview-key">{f.key}</span>
                  <span className="cm-preview-value">{maskCredentialValue(f.value)}</span>
                </li>
              ))}
            </ul>
          </div>
        ) : (
          <div className="cm-preview cd-fields cd-fields-editing">
            <div className="cm-preview-title">Edit connection fields</div>
            <ul className="cd-edit-list">
              {draftFields.map((f, i) => (
                <li key={i} className="cd-edit-row">
                  <span className="cd-edit-key">{f.key}</span>
                  <input
                    className="cd-edit-input"
                    type="text"
                    value={f.value}
                    onChange={(e) => updateDraftValue(i, e.target.value)}
                  />
                  <button type="button" className="cd-edit-remove" onClick={() => removeDraftField(i)} aria-label={`Remove ${f.key}`}>
                    ×
                  </button>
                </li>
              ))}
            </ul>

            <div className="cd-add-field-row">
              <input
                className="cd-edit-input cd-add-key"
                type="text"
                placeholder="Field name"
                value={newKey}
                onChange={(e) => setNewKey(e.target.value)}
              />
              <input
                className="cd-edit-input"
                type="text"
                placeholder="Value"
                value={newValue}
                onChange={(e) => setNewValue(e.target.value)}
              />
              <button type="button" className="cd-add-field-btn" onClick={addCustomField} disabled={!newKey.trim()}>
                Add field
              </button>
            </div>

            {importMode === null && (
              <div className="cd-import-toggles">
                <button type="button" className="cd-replace-toggle" onClick={() => setImportMode('file')}>
                  Replace all fields from a file…
                </button>
                <button type="button" className="cd-replace-toggle" onClick={() => setImportMode('paste')}>
                  Upload plain text…
                </button>
              </div>
            )}

            {importMode === 'file' && (
              <div className="cd-replace-panel">
                <label className="cm-dropzone cd-replace-dropzone">
                  <input
                    type="file"
                    accept=".csv,.json,.txt,.env"
                    hidden
                    onChange={(e) => {
                      const file = e.target.files?.[0]
                      if (file) handleReplaceFile(file)
                    }}
                  />
                  <span>Click to choose a replacement file</span>
                </label>
                {importError && <div className="cm-error">{importError}</div>}
                <button type="button" className="cd-replace-toggle" onClick={() => setImportMode(null)}>
                  Cancel
                </button>
              </div>
            )}

            {importMode === 'paste' && (
              <div className="cd-replace-panel">
                <textarea
                  className="cd-paste-textarea"
                  placeholder={'Paste a JSON object, an array of objects, or plain "key=value" / "key,value" lines…'}
                  rows={4}
                  value={pasteText}
                  onChange={(e) => setPasteText(e.target.value)}
                />
                {importError && <div className="cm-error">{importError}</div>}
                <div className="cd-paste-actions">
                  <button type="button" className="cd-replace-toggle" onClick={() => setImportMode(null)}>
                    Cancel
                  </button>
                  <button type="button" className="cd-add-field-btn" onClick={handlePasteApply} disabled={!pasteText.trim()}>
                    Parse &amp; apply
                  </button>
                </div>
              </div>
            )}

            {saveError && <div className="cm-error">{saveError}</div>}
          </div>
        )}

        <div className="cd-transactions">
          <div className="cm-preview-title">Recent transactions</div>
          <div className="cd-tx-table-wrap">
            <table className="cd-tx-table">
              <thead>
                <tr>
                  <th>Transaction ID</th>
                  <th>Date</th>
                  <th>Status</th>
                </tr>
              </thead>
              <tbody>
                {mock.transactions.map((tx) => (
                  <tr key={tx.id}>
                    <td className="cd-tx-id">{tx.id}</td>
                    <td>{tx.date.toLocaleString('en-US', { day: 'numeric', month: 'short', hour: 'numeric', minute: '2-digit' })}</td>
                    <td>
                      <span className="cd-tx-status">
                        <span className="cd-tx-dot" style={{ background: STATUS_DOT_COLOR[tx.status] }} />
                        {tx.status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        <div className="cm-actions">
          {!isEditing ? (
            <>
              <button type="button" className="cd-disconnect-btn" onClick={() => onDisconnect(platform.id)}>
                Disconnect
              </button>
              <button type="button" className="cd-edit-btn" onClick={startEdit}>
                Edit
              </button>
              <button type="button" className="cm-submit-btn" onClick={onClose}>
                Close
              </button>
            </>
          ) : (
            <>
              <button type="button" className="cm-cancel-btn" onClick={cancelEdit} disabled={saving}>
                Cancel
              </button>
              <button type="button" className="cm-submit-btn" onClick={handleSave} disabled={saving}>
                {saving ? 'Saving…' : 'Save changes'}
              </button>
            </>
          )}
        </div>
      </div>
    </div>
  )
}
