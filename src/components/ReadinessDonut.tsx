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
    if (v >= 80) return { primary: '#16a34a', secondary: '#22c55e', label: 'Excellent' } // green
    if (v >= 60) return { primary: '#2563eb', secondary: '#3b82f6', label: 'Good' } // blue
    if (v >= 40) return { primary: '#f59e0b', secondary: '#fbbf24', label: 'Fair' } // amber
    return { primary: '#ef4444', secondary: '#f87171', label: 'Needs Work' } // red
  }

  const colorScheme = getColor(value)

  return (
    <div className="relative flex items-center justify-center">
      <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`}>
        <defs>
          {/* Gradient for the progress ring */}
          <linearGradient id={`gradient-${size}`} x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor={colorScheme.primary} />
            <stop offset="100%" stopColor={colorScheme.secondary} />
          </linearGradient>
          {/* Shadow effect */}
          <filter id={`shadow-${size}`} x="-50%" y="-50%" width="200%" height="200%">
            <feDropShadow dx="0" dy="2" stdDeviation="4" floodColor={colorScheme.primary} floodOpacity="0.3" />
          </filter>
          {/* Glow effect */}
          <filter id={`glow-${size}`}>
            <feGaussianBlur stdDeviation="3" result="coloredBlur"/>
            <feMerge>
              <feMergeNode in="coloredBlur"/>
              <feMergeNode in="SourceGraphic"/>
            </feMerge>
          </filter>
        </defs>
        <g transform={`translate(${size / 2}, ${size / 2})`}>
          {/* Background circle (track) */}
          <circle
            r={radius}
            fill="transparent"
            stroke="currentColor"
            strokeWidth={stroke}
            className="text-muted/20"
          />
          {/* Progress circle */}
          <circle
            r={radius}
            fill="transparent"
            stroke={`url(#gradient-${size})`}
            strokeWidth={stroke}
            strokeLinecap="round"
            strokeDasharray={`${circumference} ${circumference}`}
            strokeDashoffset={offset}
            transform={`rotate(-90)`}
            style={{ 
              filter: `url(#glow-${size})`,
              transition: 'stroke-dashoffset 0.8s ease-in-out'
            }}
          />
        </g>
      </svg>
      <div className="absolute text-center">
        <div className="text-2xl font-bold" style={{ color: colorScheme.primary }}>
          {value}%
        </div>
        <div className="text-xs text-muted-foreground mt-0.5">
          {colorScheme.label}
        </div>
      </div>
    </div>
  )
}
