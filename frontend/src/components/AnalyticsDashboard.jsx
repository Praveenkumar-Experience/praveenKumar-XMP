import { useEffect, useRef, useState } from 'react'
import { Send, CheckCircle2, AlertTriangle, AlertCircle, Mail, Loader2 } from 'lucide-react'
import './AnalyticsDashboard.css'
import { CURRENT_ACCOUNT, KNOWN_ISSUES, INTEGRATION_ISSUE, SUGGESTED_PROMPTS, runAgent, isIngestionQuery } from '../insightsData.js'
import { PLATFORMS } from '../ingestionData.js'
import { BACKEND_HTTP_URL } from '../config.js'

const SIDEBAR_ISSUES = [...KNOWN_ISSUES, INTEGRATION_ISSUE].filter(Boolean)

const SEVERITY_ICON = { ok: CheckCircle2, warning: AlertTriangle, error: AlertCircle, info: AlertTriangle }
const STEP_DELAY = 450

function uid() {
  return Math.random().toString(36).slice(2)
}

function Bubble({ message }) {
  if (message.role === 'user') {
    return <div className="ad-bubble ad-bubble-user">{message.text}</div>
  }
  if (message.severity) {
    const Icon = SEVERITY_ICON[message.severity] || AlertTriangle
    return (
      <div className={`ad-bubble ad-bubble-agent ad-finding ad-severity-${message.severity}`}>
        <Icon size={16} className="ad-finding-icon" />
        <div>
          <div className="ad-finding-title">{message.title}</div>
          <div className="ad-finding-text">{message.text}</div>
        </div>
      </div>
    )
  }
  return (
    <div className="ad-bubble ad-bubble-agent">
      {message.stub && <span className="ad-stub-badge">Stub — no API key configured</span>}
      {message.text}
    </div>
  )
}

export default function AnalyticsDashboard() {
  const [messages, setMessages] = useState([
    { id: 'greet', role: 'agent', text: `Hi ${CURRENT_ACCOUNT.name.split(' ')[0]}, ask me about your account — email verification, today's transactions, your ingestion integrations, or known issues with this release.` },
  ])
  const [input, setInput] = useState('')
  const [thinkingSteps, setThinkingSteps] = useState([])
  const [isThinking, setIsThinking] = useState(false)
  const listRef = useRef(null)
  const timeoutsRef = useRef([])

  useEffect(() => {
    const el = listRef.current
    if (el) el.scrollTop = el.scrollHeight
  }, [messages, thinkingSteps])

  useEffect(() => () => timeoutsRef.current.forEach(clearTimeout), [])

  function ask(query) {
    const trimmed = query.trim()
    if (!trimmed || isThinking) return

    setMessages((prev) => [...prev, { id: uid(), role: 'user', text: trimmed }])
    setInput('')

    if (isIngestionQuery(trimmed)) {
      askBackend(trimmed)
    } else {
      askLocal(trimmed)
    }
  }

  function askLocal(trimmed) {
    const { steps, findings, fallback } = runAgent(trimmed)
    setIsThinking(true)
    setThinkingSteps([])

    steps.forEach((step, i) => {
      const t = setTimeout(() => setThinkingSteps((prev) => [...prev, step]), (i + 1) * STEP_DELAY)
      timeoutsRef.current.push(t)
    })

    const finalTimeout = setTimeout(() => {
      setIsThinking(false)
      setThinkingSteps([])
      const agentMessages = fallback
        ? [{ id: uid(), role: 'agent', text: fallback }]
        : findings.map((f) => ({ id: uid(), role: 'agent', severity: f.severity, title: f.title, text: f.message }))
      setMessages((prev) => [...prev, ...agentMessages])
    }, steps.length * STEP_DELAY + 350)
    timeoutsRef.current.push(finalTimeout)
  }

  async function askBackend(trimmed) {
    setIsThinking(true)
    setThinkingSteps(['Asking the ingestion assistant…'])

    try {
      const res = await fetch(`${BACKEND_HTTP_URL}/assistant/ingestion`, {
        method: 'POST',
        headers: { 'content-type': 'application/json' },
        body: JSON.stringify({ query: trimmed, platforms: PLATFORMS }),
      })
      const data = await res.json()
      setIsThinking(false)
      setThinkingSteps([])
      if (!res.ok) {
        setMessages((prev) => [...prev, { id: uid(), role: 'agent', text: data.error || "The ingestion assistant couldn't answer that." }])
        return
      }
      setMessages((prev) => [...prev, { id: uid(), role: 'agent', text: data.reply, stub: data.stub }])
    } catch {
      setIsThinking(false)
      setThinkingSteps([])
      setMessages((prev) => [...prev, { id: uid(), role: 'agent', text: "Couldn't reach the backend to ask the ingestion assistant. Is it running?" }])
    }
  }

  function handleSubmit(e) {
    e.preventDefault()
    ask(input)
  }

  return (
    <div className="ad-page">
      <div className="ad-layout">
        <aside className="ad-side">
          <div className="ad-account-card">
            <span className="ad-account-name">{CURRENT_ACCOUNT.name}</span>
            <span className="ad-account-sub">{CURRENT_ACCOUNT.role} · {CURRENT_ACCOUNT.accountName}</span>
            <button
              type="button"
              className={`ad-email-badge${CURRENT_ACCOUNT.emailVerified ? ' is-ok' : ' is-error'}`}
              onClick={() => ask('Is my email verified?')}
            >
              <Mail size={13} />
              {CURRENT_ACCOUNT.email}
              {CURRENT_ACCOUNT.emailVerified ? <CheckCircle2 size={13} /> : <AlertCircle size={13} />}
            </button>
          </div>

          <div className="ad-issues-card">
            <span className="ad-issues-title">Detected issues</span>
            <div className="ad-issues-list">
              {SIDEBAR_ISSUES.map((issue) => {
                const Icon = SEVERITY_ICON[issue.severity] || AlertTriangle
                return (
                  <button key={issue.id} type="button" className={`ad-issue-row ad-severity-${issue.severity}`} onClick={() => ask(issue.title)}>
                    <Icon size={15} className="ad-finding-icon" />
                    <span>{issue.title}</span>
                  </button>
                )
              })}
            </div>
          </div>
        </aside>

        <div className="ad-chat-card">
          <div className="ad-chat-list" ref={listRef}>
            {messages.map((m) => <Bubble key={m.id} message={m} />)}
            {isThinking && (
              <div className="ad-bubble ad-bubble-agent ad-thinking">
                {thinkingSteps.map((step) => (
                  <div key={step} className="ad-thinking-step">
                    <CheckCircle2 size={13} /> {step}
                  </div>
                ))}
                <div className="ad-thinking-step ad-thinking-active">
                  <Loader2 size={13} className="ad-spin" /> Thinking…
                </div>
              </div>
            )}
          </div>

          <div className="ad-prompts">
            {SUGGESTED_PROMPTS.map((prompt) => (
              <button key={prompt} type="button" className="ad-prompt-chip" onClick={() => ask(prompt)} disabled={isThinking}>
                {prompt}
              </button>
            ))}
          </div>

          <form className="ad-input-row" onSubmit={handleSubmit}>
            <input
              type="text"
              placeholder="Ask about your account…"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              disabled={isThinking}
            />
            <button type="submit" disabled={isThinking || !input.trim()}>
              <Send size={16} />
            </button>
          </form>
        </div>
      </div>
    </div>
  )
}
