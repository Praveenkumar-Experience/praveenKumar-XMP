import { Star, MessageSquare, Paperclip, Calendar, ArrowRight, ArrowUpDown, MoreHorizontal, Mail } from 'lucide-react'
import PageHeader from './PageHeader.jsx'
import './ReviewsManagement.css'
import { STAGES, REVIEWS, NEW_REVIEWS_TREND } from '../reviewsData.js'
import { CHANNELS } from '../autopostData.js'

function StarRating({ rating }) {
  return (
    <span className="rm-stars" aria-label={`${rating} out of 5 stars`}>
      {Array.from({ length: 5 }, (_, i) => (
        <Star key={i} size={12} fill={i < rating ? '#f5a524' : 'none'} stroke={i < rating ? '#f5a524' : '#d1d5db'} />
      ))}
    </span>
  )
}

function TrendBars({ points }) {
  const max = Math.max(...points.map((p) => p.value), 1)
  return (
    <div className="rm-bars">
      {points.map((p) => (
        <div key={p.label} className="rm-bar-col">
          <div className="rm-bar-track">
            <div className="rm-bar-fill" style={{ height: `${(p.value / max) * 100}%` }} />
          </div>
          <span className="rm-bar-label">{p.label}</span>
        </div>
      ))}
    </div>
  )
}

function Gauge({ percent, label }) {
  const r = 60
  const circumference = Math.PI * r
  const offset = circumference * (1 - percent / 100)
  return (
    <div className="rm-gauge">
      <svg viewBox="0 0 140 78" width="150" height="84">
        <path d="M10,74 A60,60 0 0 1 130,74" fill="none" stroke="#e4e7ec" strokeWidth="10" strokeLinecap="round" />
        <path
          d="M10,74 A60,60 0 0 1 130,74"
          fill="none"
          stroke="#0d9488"
          strokeWidth="10"
          strokeLinecap="round"
          strokeDasharray={circumference}
          strokeDashoffset={offset}
        />
      </svg>
      <div className="rm-gauge-text">
        <span className="rm-gauge-value">{percent}%</span>
        <span className="rm-gauge-label">{label}</span>
      </div>
    </div>
  )
}

function ReviewCard({ review }) {
  const channel = CHANNELS.find((c) => c.id === review.channel)
  if (review.featured) {
    return (
      <div className="rm-card rm-card-featured">
        <div className="rm-card-top">
          <span className="rm-card-name">{review.customer}</span>
          <MoreHorizontal size={16} />
        </div>
        <StarRating rating={review.rating} />
        <p className="rm-card-snippet">{review.snippet}</p>
        {channel && (
          <span className="rm-card-channel" style={{ background: `${channel.color}33`, color: '#fff' }}>
            {channel.initial} {channel.name}
          </span>
        )}
        {review.email && (
          <span className="rm-card-meta">
            <Mail size={13} /> {review.email}
          </span>
        )}
        {review.manager && (
          <span className="rm-card-manager">
            <span className="rm-card-manager-avatar">{review.manager.split(' ').map((n) => n[0]).join('')}</span>
            {review.manager}
          </span>
        )}
        <div className="rm-card-footer">
          <span className="rm-card-due">
            <Calendar size={12} /> {review.due}
          </span>
          <span className="rm-card-counts">
            <Paperclip size={12} /> {review.attachments}
            <MessageSquare size={12} /> {review.comments}
          </span>
        </div>
      </div>
    )
  }

  return (
    <div className="rm-card">
      <div className="rm-card-top">
        <span className="rm-card-name">{review.customer}</span>
        <MoreHorizontal size={16} className="rm-card-kebab" />
      </div>
      <StarRating rating={review.rating} />
      <p className="rm-card-snippet">{review.snippet}</p>
      {channel && (
        <span className="rm-card-channel" style={{ background: channel.bg, color: channel.color }}>
          {channel.initial} {channel.name}
        </span>
      )}
      <div className="rm-card-footer">
        <span className="rm-card-due">
          <Calendar size={12} /> {review.due}
        </span>
        <span className="rm-card-counts">
          <Paperclip size={12} /> {review.attachments}
          <MessageSquare size={12} /> {review.comments}
        </span>
      </div>
    </div>
  )
}

export default function ReviewsManagement() {
  const total = REVIEWS.length
  const awaitingResponse = REVIEWS.filter((r) => r.stage === 'needs_response').length
  const resolvedLike = REVIEWS.filter((r) => r.stage === 'responded' || r.stage === 'resolved').length
  const responseRate = Math.round((resolvedLike / total) * 100)
  const avgRating = (REVIEWS.reduce((sum, r) => sum + r.rating, 0) / total).toFixed(1)

  return (
    <div className="rm-page">
      <PageHeader icon={Star} title="Reviews Management" subtitle="Read, respond to, and moderate incoming reviews across every channel." />

      <div className="rm-overview">
        <div className="rm-overview-chart">
          <span className="rm-overview-title">New reviews</span>
          <TrendBars points={NEW_REVIEWS_TREND} />
        </div>
        <Gauge percent={responseRate} label="Response rate" />
        <div className="rm-overview-stat">
          <span className="rm-overview-stat-value">{awaitingResponse}</span>
          <span className="rm-overview-stat-label">Awaiting response</span>
          <ArrowRight size={16} className="rm-overview-arrow" />
        </div>
        <div className="rm-overview-stat">
          <span className="rm-overview-stat-value">{avgRating}<Star size={16} fill="#f5a524" stroke="#f5a524" /></span>
          <span className="rm-overview-stat-label">Average rating</span>
          <ArrowRight size={16} className="rm-overview-arrow" />
        </div>
      </div>

      <div className="rm-board">
        {STAGES.map((stage) => {
          const stageReviews = REVIEWS.filter((r) => r.stage === stage.id)
          return (
            <div key={stage.id} className="rm-column">
              <div className="rm-column-header">
                <span className="rm-column-title">{stage.label}</span>
                <span className="rm-column-count">{stageReviews.length}</span>
                <ArrowUpDown size={13} className="rm-column-sort" />
              </div>
              <div className="rm-column-cards">
                {stageReviews.map((review) => (
                  <ReviewCard key={review.id} review={review} />
                ))}
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}
