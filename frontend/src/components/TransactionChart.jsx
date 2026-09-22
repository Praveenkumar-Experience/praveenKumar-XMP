import { useMemo, useState } from 'react'
import { ZoomIn, ZoomOut, Search, Hand, Home, Menu } from 'lucide-react'
import './TransactionChart.css'
import { formatCompact } from '../transactionData.js'

const CHART_W = 760
const CHART_H = 260
const PAD = { top: 14, right: 16, bottom: 30, left: 44 }

function niceMax(max) {
  if (max <= 0) return 10
  const magnitude = Math.pow(10, Math.floor(Math.log10(max)))
  const normalized = max / magnitude
  const step = normalized <= 1 ? 1 : normalized <= 2 ? 2 : normalized <= 5 ? 5 : 10
  return step * magnitude
}

export default function TransactionChart({ series, showTable }) {
  const [hoverIndex, setHoverIndex] = useState(null)

  const pointCount = series[0]?.points.length || 0
  const plotW = CHART_W - PAD.left - PAD.right
  const plotH = CHART_H - PAD.top - PAD.bottom

  const maxValue = useMemo(() => {
    const raw = Math.max(1, ...series.flatMap((s) => s.points.map((p) => p.value)))
    return niceMax(raw * 1.1)
  }, [series])

  const yTicks = [0, 0.25, 0.5, 0.75, 1].map((f) => Math.round(maxValue * f))

  function xAt(i) {
    if (pointCount <= 1) return PAD.left
    return PAD.left + (i / (pointCount - 1)) * plotW
  }
  function yAt(v) {
    return PAD.top + plotH - (v / maxValue) * plotH
  }

  const labelStep = Math.max(1, Math.ceil(pointCount / 8))

  function handleMove(e) {
    const rect = e.currentTarget.getBoundingClientRect()
    const ratio = (e.clientX - rect.left) / rect.width
    const i = Math.round(ratio * (pointCount - 1))
    setHoverIndex(Math.max(0, Math.min(pointCount - 1, i)))
  }

  if (series.length === 0) {
    return <div className="tx-chart-empty">Select at least one metric to plot it.</div>
  }

  const tooltipLeftPct = hoverIndex === null ? 0 : Math.min(92, Math.max(8, (hoverIndex / Math.max(1, pointCount - 1)) * 100))
  const baselineY = yAt(0)

  return (
    <div className="tx-chart-wrap">
      <div className="tx-chart-toolbar">
        <ZoomIn size={14} />
        <ZoomOut size={14} />
        <Search size={14} />
        <Hand size={14} />
        <Home size={14} />
        <Menu size={14} />
      </div>
      <div className="tx-chart-svg-wrap">
        <svg
          viewBox={`0 0 ${CHART_W} ${CHART_H}`}
          width="100%"
          height={CHART_H}
          preserveAspectRatio="none"
          className="tx-chart-svg"
          onMouseMove={handleMove}
          onMouseLeave={() => setHoverIndex(null)}
          role="img"
          aria-label="Transaction metrics over time"
        >
          <defs>
            {series.map(({ metric }) => (
              <linearGradient key={metric.id} id={`tx-grad-${metric.id}`} x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor={metric.color} stopOpacity="0.35" />
                <stop offset="100%" stopColor={metric.color} stopOpacity="0" />
              </linearGradient>
            ))}
          </defs>

          {yTicks.map((t) => (
            <g key={t}>
              <line
                x1={PAD.left}
                x2={CHART_W - PAD.right}
                y1={yAt(t)}
                y2={yAt(t)}
                className="tx-gridline"
              />
              <text x={PAD.left - 8} y={yAt(t)} className="tx-axis-label" textAnchor="end" dominantBaseline="middle">
                {formatCompact(t)}
              </text>
            </g>
          ))}

          {series[0].points.map((p, i) =>
            i % labelStep === 0 ? (
              <text key={i} x={xAt(i)} y={CHART_H - 8} className="tx-axis-label" textAnchor="middle">
                {p.label}
              </text>
            ) : null
          )}

          {hoverIndex !== null && (
            <line
              x1={xAt(hoverIndex)}
              x2={xAt(hoverIndex)}
              y1={PAD.top}
              y2={CHART_H - PAD.bottom}
              className="tx-crosshair"
            />
          )}

          {series.map(({ metric, points }) => {
            const path = points.map((p, i) => `${xAt(i)},${yAt(p.value)}`).join(' ')
            const areaPath = `M${xAt(0)},${baselineY} L${path} L${xAt(points.length - 1)},${baselineY} Z`
            const last = points[points.length - 1]
            return (
              <g key={metric.id}>
                <path d={areaPath} fill={`url(#tx-grad-${metric.id})`} stroke="none" />
                <polyline points={path} fill="none" stroke={metric.color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                <circle cx={xAt(points.length - 1)} cy={yAt(last.value)} r="5" fill={metric.color} stroke="#ffffff" strokeWidth="2" />
                {hoverIndex !== null && (
                  <circle
                    cx={xAt(hoverIndex)}
                    cy={yAt(points[hoverIndex].value)}
                    r="4.5"
                    fill={metric.color}
                    stroke="#ffffff"
                    strokeWidth="2"
                  />
                )}
              </g>
            )
          })}
        </svg>

        {hoverIndex !== null && (
          <div className="tx-tooltip" style={{ left: `${tooltipLeftPct}%` }}>
            <div className="tx-tooltip-date">{series[0].points[hoverIndex].label}</div>
            {series.map(({ metric, points }) => (
              <div key={metric.id} className="tx-tooltip-row">
                <span className="tx-tooltip-key" style={{ background: metric.color }} />
                <span className="tx-tooltip-name">{metric.label}</span>
                <span className="tx-tooltip-value">{points[hoverIndex].value.toLocaleString()}</span>
              </div>
            ))}
          </div>
        )}
      </div>

      {showTable && (
        <div className="tx-table-wrap">
          <table className="tx-table">
            <thead>
              <tr>
                <th>Date</th>
                {series.map(({ metric }) => (
                  <th key={metric.id}>{metric.label}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {series[0].points.map((p, i) => (
                <tr key={i}>
                  <td>{p.label}</td>
                  {series.map(({ metric, points }) => (
                    <td key={metric.id}>{points[i].value.toLocaleString()}</td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  )
}
