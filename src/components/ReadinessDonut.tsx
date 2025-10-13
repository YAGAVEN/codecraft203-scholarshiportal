import React from 'react'

interface Props {
  value: number // 0-100
  size?: number
  stroke?: number
}

export default function ReadinessDonut({ value, size = 96, stroke = 12 }: Props) {
  const radius = (size - stroke) / 2
  const circumference = 2 * Math.PI * radius
  const offset = circumference - (value / 100) * circumference

  const getColor = (v: number) => {
    if (v >= 80) return '#16a34a' // green
    if (v >= 60) return '#2563eb' // blue
    if (v >= 40) return '#f59e0b' // amber
    return '#ef4444' // red
  }

  const color = getColor(value)

  return (
    <div className="flex items-center justify-center">
      <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`}>
        <defs>
          <filter id="shadow" x="-50%" y="-50%" width="200%" height="200%">
            <feDropShadow dx="0" dy="2" stdDeviation="4" floodColor="#000" floodOpacity="0.12" />
          </filter>
        </defs>
        <g transform={`translate(${size / 2}, ${size / 2})`}>
          <circle
            r={radius}
            fill="transparent"
            stroke="var(--color-card)"
            strokeWidth={stroke}
          />
          <circle
            r={radius}
            fill="transparent"
            stroke={color}
            strokeWidth={stroke}
            strokeLinecap="round"
            strokeDasharray={`${circumference} ${circumference}`}
            strokeDashoffset={offset}
            transform={`rotate(-90)`}
            style={{ filter: 'url(#shadow)' }}
          />
        </g>
      </svg>
      <div className="absolute text-center">
        <div className="text-lg font-bold">{value}%</div>
        <div className="text-xs text-muted-foreground">Readiness</div>
      </div>
    </div>
  )
}
