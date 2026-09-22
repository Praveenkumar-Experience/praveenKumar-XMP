import './PageHeader.css'

export default function PageHeader({ icon: Icon, title, subtitle, actions }) {
  return (
    <div className="page-header">
      <div className="page-header-main">
        {Icon && (
          <span className="page-header-icon">
            <Icon size={20} strokeWidth={2} aria-hidden="true" />
          </span>
        )}
        <div className="page-header-text">
          <h1 className="page-header-title">{title}</h1>
          {subtitle && <p className="page-header-subtitle">{subtitle}</p>}
        </div>
      </div>
      {actions && <div className="page-header-actions">{actions}</div>}
    </div>
  )
}
