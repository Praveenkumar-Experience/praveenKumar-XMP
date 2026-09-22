import PageHeader from './PageHeader.jsx'
import './ComingSoon.css'

export default function ComingSoon({ icon: Icon, title, description }) {
  return (
    <div className="cs-page">
      <PageHeader icon={Icon} title={title} subtitle={description} />
      <div className="cs-card">
        <span className="cs-badge">Coming soon</span>
      </div>
    </div>
  )
}
