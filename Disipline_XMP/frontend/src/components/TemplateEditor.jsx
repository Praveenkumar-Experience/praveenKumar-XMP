import { useEffect, useLayoutEffect, useRef, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import gsap from 'gsap'
import './TemplateEditor.css'
import { useTemplates } from '../templatesContext.jsx'
import { prefersReducedMotion } from '../hooks/use-reduced-motion.js'
import { ACCENT } from '../theme.js'

const DEFAULT_HTML = `<div style="font-family: 'Segoe UI', sans-serif; max-width: 320px; padding: 24px; border-radius: 16px; background: linear-gradient(135deg, #396afc, #2948ff); color: #ffffff;">
  <div style="font-size: 18px; letter-spacing: 3px; color: #ffd166;">&#9733;&#9733;&#9733;&#9733;&#9733;</div>
  <p style="margin: 14px 0 6px; font-size: 14px; line-height: 1.6;">"Absolutely loved the service! Highly recommend to anyone looking for quality and care."</p>
  <div style="margin-top: 12px; font-weight: 600; font-size: 13px;">&mdash; Jordan M.</div>
</div>`

function BackIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
      <line x1="19" y1="12" x2="5" y2="12"></line>
      <polyline points="12 19 5 12 12 5"></polyline>
    </svg>
  )
}

export default function TemplateEditor({ accent = ACCENT }) {
  const { templateId } = useParams()
  const navigate = useNavigate()
  const { getTemplate, addTemplate, updateTemplate } = useTemplates()

  const isEditing = Boolean(templateId)
  const existing = isEditing ? getTemplate(templateId) : null
  const notFound = isEditing && !existing

  const [name, setName] = useState(existing?.name ?? 'Untitled Template')
  const [html, setHtml] = useState(existing?.html ?? DEFAULT_HTML)

  const headerRef = useRef(null)
  const codeColRef = useRef(null)
  const previewColRef = useRef(null)

  useEffect(() => {
    if (notFound) navigate('/autopost-settings', { replace: true })
  }, [notFound, navigate])

  // Create and edit read very differently: creating converges two fresh
  // panels into place (something appearing), editing slides the panels in
  // from where the code/preview conceptually already "live" (something
  // being opened). The mode badge carries the same distinction for anyone
  // who has motion turned off.
  useLayoutEffect(() => {
    if (notFound || prefersReducedMotion()) return
    const header = headerRef.current
    const codeCol = codeColRef.current
    const previewCol = previewColRef.current
    if (!header || !codeCol || !previewCol) return

    const tl = gsap.timeline()
    tl.from(header, { opacity: 0, y: -14, duration: 0.35, ease: 'power2.out' })

    if (isEditing) {
      tl.from(codeCol, { opacity: 0, x: -32, duration: 0.4, ease: 'power2.out' }, '-=0.15')
        .from(previewCol, { opacity: 0, x: 32, duration: 0.4, ease: 'power2.out' }, '<')
    } else {
      tl.from([codeCol, previewCol], {
        opacity: 0,
        scale: 0.92,
        duration: 0.45,
        ease: 'back.out(1.6)',
        stagger: 0.08,
      }, '-=0.1')
    }

    return () => tl.kill()
  }, [isEditing, notFound])

  if (notFound) return null

  function handleSave() {
    if (isEditing) {
      updateTemplate(existing.id, { name, html })
    } else {
      addTemplate({ name, html })
    }
    navigate('/autopost-settings')
  }

  return (
    <div className="tpl-page" style={{ '--ing-accent': accent }}>
      <div className="tpl-header" ref={headerRef}>
        <button type="button" className="tpl-back-btn" onClick={() => navigate('/autopost-settings')}>
          <BackIcon />
          Back
        </button>
        <span className={`tpl-mode-badge${isEditing ? ' is-edit' : ' is-create'}`}>
          {isEditing ? 'Editing' : 'New'}
        </span>
        <input
          className="tpl-name-input"
          value={name}
          onChange={(e) => setName(e.target.value)}
          aria-label="Template name"
        />
        <button type="button" className="tpl-save-btn" onClick={handleSave}>
          {isEditing ? 'Save Changes' : 'Create Template'}
        </button>
      </div>

      <div className="tpl-editor-body">
        <div className="tpl-col" ref={codeColRef}>
          <div className="tpl-col-label">HTML</div>
          <textarea
            className="tpl-code-textarea"
            value={html}
            onChange={(e) => setHtml(e.target.value)}
            spellCheck={false}
            aria-label="Template HTML"
          />
        </div>
        <div className="tpl-col" ref={previewColRef}>
          <div className="tpl-col-label">Live Preview</div>
          <div className="tpl-preview-frame-wrap">
            <iframe title="Template preview" className="tpl-preview-frame" srcDoc={html} sandbox="allow-same-origin" />
          </div>
        </div>
      </div>
    </div>
  )
}
