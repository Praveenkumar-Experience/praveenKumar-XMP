import { useState } from 'react'
import './ConnectionUploadModal.css'
import './ConnectionDetailsModal.css'
import { BACKEND_HTTP_URL } from '../config.js'
import { parseCredentialsFile, maskCredentialValue } from '../credentialFileParser.js'

function getManualCredentials(manualFields) {
  return Object.fromEntries(
    manualFields.filter((f) => f.key.trim() !== '' && String(f.value).trim() !== '').map((f) => [f.key.trim(), f.value])
  )
}

export default function ConnectionUploadModal({ platform, onClose, onSuccess }) {
  const [mode, setMode] = useState('file') // 'file' | 'manual'
  const [fileName, setFileName] = useState(null)
  const [parsedFields, setParsedFields] = useState(null)
  const [manualFields, setManualFields] = useState([{ key: '', value: '' }])
  const [error, setError] = useState(null)
  const [submitting, setSubmitting] = useState(false)
  const [isDragOver, setIsDragOver] = useState(false)

  const activeCredentials = mode === 'file' ? parsedFields : getManualCredentials(manualFields)
  const canSubmit = Boolean(activeCredentials && Object.keys(activeCredentials).length > 0)

  function handleFile(file) {
    setError(null)
    setParsedFields(null)
    setFileName(file.name)

    const reader = new FileReader()
    reader.onload = () => {
      try {
        setParsedFields(parseCredentialsFile(String(reader.result), file.name))
      } catch (err) {
        setError(err.message)
      }
    }
    reader.onerror = () => setError('Could not read this file.')
    reader.readAsText(file)
  }

  function updateManualField(index, key, value) {
    setManualFields((prev) => prev.map((f, i) => (i === index ? { ...f, [key]: value } : f)))
  }

  function addManualField() {
    setManualFields((prev) => [...prev, { key: '', value: '' }])
  }

  function removeManualField(index) {
    setManualFields((prev) => (prev.length > 1 ? prev.filter((_, i) => i !== index) : prev))
  }

  async function handleCreate() {
    if (!canSubmit) return
    setSubmitting(true)
    setError(null)
    try {
      const res = await fetch(`${BACKEND_HTTP_URL}/connections`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ platformId: platform.id, credentials: activeCredentials }),
      })
      if (!res.ok) {
        const body = await res.json().catch(() => ({}))
        throw new Error(body.error || 'The backend rejected these credentials.')
      }
      onSuccess(platform.id, activeCredentials)
    } catch (err) {
      setError(err.message || 'Could not create the connection. Is the backend running?')
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <div className="cm-backdrop" onClick={onClose}>
      <div className="cm-modal" onClick={(e) => e.stopPropagation()}>
        <div className="cm-header">
          <h2 className="cm-title">Connect {platform.name}</h2>
          <button type="button" className="cm-close" onClick={onClose} aria-label="Close">
            ×
          </button>
        </div>

        <div className="cm-mode-toggle">
          <button
            type="button"
            className={`cm-mode-btn${mode === 'file' ? ' is-active' : ''}`}
            onClick={() => setMode('file')}
          >
            Upload a file
          </button>
          <button
            type="button"
            className={`cm-mode-btn${mode === 'manual' ? ' is-active' : ''}`}
            onClick={() => setMode('manual')}
          >
            Enter manually
          </button>
        </div>

        {mode === 'file' ? (
          <>
            <p className="cm-desc">
              Upload a credentials file — <code>.csv</code>, <code>.json</code>, or <code>.env</code>-style{' '}
              <code>key=value</code> — and we'll read the fields to set up the connection.
            </p>

            <label
              className={`cm-dropzone${isDragOver ? ' is-dragover' : ''}${fileName ? ' has-file' : ''}`}
              onDragOver={(e) => {
                e.preventDefault()
                setIsDragOver(true)
              }}
              onDragLeave={() => setIsDragOver(false)}
              onDrop={(e) => {
                e.preventDefault()
                setIsDragOver(false)
                const file = e.dataTransfer.files?.[0]
                if (file) handleFile(file)
              }}
            >
              <input
                type="file"
                accept=".csv,.json,.txt,.env"
                hidden
                onChange={(e) => {
                  const file = e.target.files?.[0]
                  if (file) handleFile(file)
                }}
              />
              {fileName ? (
                <span className="cm-dropzone-filename">{fileName}</span>
              ) : (
                <span>Click to choose a file, or drag one here</span>
              )}
            </label>

            {error && <div className="cm-error">{error}</div>}

            {parsedFields && !error && (
              <div className="cm-preview">
                <div className="cm-preview-title">Detected fields ({Object.keys(parsedFields).length})</div>
                <ul className="cm-preview-list">
                  {Object.entries(parsedFields).map(([key, value]) => (
                    <li key={key} className="cm-preview-row">
                      <span className="cm-preview-key">{key}</span>
                      <span className="cm-preview-value">{maskCredentialValue(value)}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </>
        ) : (
          <>
            <p className="cm-desc">Add each credential field as a key/value pair.</p>

            <div className="cd-fields-editing">
              <ul className="cd-edit-list">
                {manualFields.map((f, i) => (
                  <li key={i} className="cd-edit-row">
                    <input
                      className="cd-edit-input cd-add-key"
                      type="text"
                      placeholder="Field name"
                      value={f.key}
                      onChange={(e) => updateManualField(i, 'key', e.target.value)}
                    />
                    <input
                      className="cd-edit-input"
                      type="text"
                      placeholder="Value"
                      value={f.value}
                      onChange={(e) => updateManualField(i, 'value', e.target.value)}
                    />
                    <button
                      type="button"
                      className="cd-edit-remove"
                      onClick={() => removeManualField(i)}
                      aria-label="Remove field"
                      disabled={manualFields.length === 1}
                    >
                      ×
                    </button>
                  </li>
                ))}
              </ul>

              <button type="button" className="cd-add-field-btn" onClick={addManualField}>
                + Add field
              </button>
            </div>

            {error && <div className="cm-error">{error}</div>}
          </>
        )}

        <div className="cm-actions">
          <button type="button" className="cm-cancel-btn" onClick={onClose}>
            Cancel
          </button>
          <button type="button" className="cm-submit-btn" disabled={!canSubmit || submitting} onClick={handleCreate}>
            {submitting ? 'Creating…' : 'Create Connection'}
          </button>
        </div>
      </div>
    </div>
  )
}
