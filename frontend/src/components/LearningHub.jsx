import { useRef, useState } from 'react'
import { GraduationCap, Search, FileText, MessageCircle, PlayCircle, Eye, Clock, CheckCircle2, Circle, BookOpen } from 'lucide-react'
import PageHeader from './PageHeader.jsx'
import './LearningHub.css'
import { FEATURED_ARTICLE, ARTICLES, GETTING_STARTED } from '../learningHubData.js'

export default function LearningHub() {
  const [query, setQuery] = useState('')
  const [completed, setCompleted] = useState(() => new Set())
  const articlesRef = useRef(null)
  const gettingStartedRef = useRef(null)

  const articles = ARTICLES.filter((a) => a.title.toLowerCase().includes(query.trim().toLowerCase()))

  function toggleComplete(id) {
    setCompleted((prev) => {
      const next = new Set(prev)
      next.has(id) ? next.delete(id) : next.add(id)
      return next
    })
  }

  return (
    <div className="lh-page">
      <PageHeader icon={GraduationCap} title="Learning Hub" subtitle="Guides and best practices for getting the most out of the platform." />

      <div className="lh-top">
        <div className="lh-whats-new">
          <span className="lh-section-label">What&rsquo;s New?</span>
          <div className="lh-featured-card">
            <div className="lh-featured-thumb">
              <span className="lh-featured-tag">{FEATURED_ARTICLE.tag}</span>
              <BookOpen size={26} />
            </div>
            <div>
              <p className="lh-featured-title">{FEATURED_ARTICLE.title}</p>
              <span className="lh-featured-desc">{FEATURED_ARTICLE.desc}</span>
            </div>
          </div>
        </div>

        <div className="lh-search-wrap">
          <Search size={15} className="lh-search-icon" />
          <input
            className="lh-search-input"
            type="text"
            placeholder="Search"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
          />
        </div>
      </div>

      <div className="lh-actions">
        <button type="button" className="lh-action-btn" onClick={() => articlesRef.current?.scrollIntoView({ behavior: 'smooth' })}>
          <FileText size={18} />
          View Articles
        </button>
        <button type="button" className="lh-action-btn">
          <MessageCircle size={18} />
          Get Help
        </button>
        <button type="button" className="lh-action-btn" onClick={() => gettingStartedRef.current?.scrollIntoView({ behavior: 'smooth' })}>
          <PlayCircle size={18} />
          View Videos
        </button>
      </div>

      <div ref={articlesRef}>
        <h2 className="lh-section-title">Articles</h2>
        <div className="lh-articles-grid">
          {articles.map((a) => (
            <div key={a.id} className="lh-article-card">
              <div className="lh-article-thumb">
                <BookOpen size={22} />
              </div>
              <p className="lh-article-title">{a.title}</p>
              <button type="button" className="lh-article-view" aria-label={`View ${a.title}`}>
                <Eye size={14} />
              </button>
            </div>
          ))}
          {articles.length === 0 && <p className="lh-empty">No articles match &ldquo;{query}&rdquo;.</p>}
        </div>
      </div>

      <div ref={gettingStartedRef}>
        <div className="lh-section-header">
          <h2 className="lh-section-title">Getting Started</h2>
          <span className="lh-progress">{completed.size} of {GETTING_STARTED.length} complete</span>
        </div>
        <ul className="lh-getting-started">
          {GETTING_STARTED.map((item) => {
            const done = completed.has(item.id)
            return (
              <li key={item.id}>
                <button type="button" className="lh-gs-row" onClick={() => toggleComplete(item.id)}>
                  {done ? <CheckCircle2 size={18} className="lh-gs-check is-done" /> : <Circle size={18} className="lh-gs-check" />}
                  <div className="lh-gs-text">
                    <strong>{item.title}</strong>
                    <span>Get started with this {item.minutes} minute{item.minutes > 1 ? 's' : ''} training</span>
                  </div>
                  <span className="lh-gs-time">
                    <Clock size={12} /> About {item.minutes} minute{item.minutes > 1 ? 's' : ''}
                  </span>
                </button>
              </li>
            )
          })}
        </ul>
      </div>
    </div>
  )
}
