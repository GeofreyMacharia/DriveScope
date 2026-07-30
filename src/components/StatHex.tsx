"use client"

interface Stat {
  label: string
  value: number
  display: string
}

interface StatHexProps {
  stats: Stat[]
  activeIndex: number | null
}

export default function StatHex({ stats, activeIndex }: StatHexProps) {
  const size = 340
  const cx = size / 2
  const cy = size / 2
  const radius = 108
  const levels = 4

  function pointAt(index: number, r: number): [number, number] {
    const angle = (Math.PI / 3) * index - Math.PI / 2
    return [cx + r * Math.cos(angle), cy + r * Math.sin(angle)]
  }

  const rings = Array.from({ length: levels }, (_, l) => {
    const r = (radius * (l + 1)) / levels
    return Array.from({ length: 6 }, (_, i) => pointAt(i, r).join(",")).join(" ")
  })

  const six = stats.slice(0, 6)

  const dataPts = six
    .map((s, i) => pointAt(i, (radius * Math.max(4, s.value)) / 100).join(","))
    .join(" ")

  // Wedge for the focused stat: centre, its own node, and half way to each neighbour
  function wedgeFor(i: number): string {
    const [px, py] = pointAt(i, (radius * Math.max(4, six[i].value)) / 100)
    const prev = (i + 5) % 6
    const next = (i + 1) % 6
    const [ax, ay] = pointAt(prev, (radius * Math.max(4, six[prev].value)) / 100)
    const [bx, by] = pointAt(next, (radius * Math.max(4, six[next].value)) / 100)
    const midA = [(cx + ax) / 2 + (px - cx) / 2, (cy + ay) / 2 + (py - cy) / 2]
    const midB = [(cx + bx) / 2 + (px - cx) / 2, (cy + by) / 2 + (py - cy) / 2]
    return `${cx},${cy} ${midA.join(",")} ${px},${py} ${midB.join(",")}`
  }

  return (
    <svg viewBox={`0 0 ${size} ${size}`} className="stat-hex">
      <defs>
        <linearGradient id="hexFill" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="var(--accent)" stopOpacity="0.32" />
          <stop offset="100%" stopColor="var(--accent)" stopOpacity="0.06" />
        </linearGradient>
        <linearGradient id="wedgeFill" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="var(--accent)" stopOpacity="0.75" />
          <stop offset="100%" stopColor="var(--accent)" stopOpacity="0.35" />
        </linearGradient>
      </defs>

      {rings.map((pts, i) => (
        <polygon key={`r${i}`} points={pts} fill="none" stroke="var(--line)" strokeWidth="1" />
      ))}

      {six.map((_, i) => {
        const [x, y] = pointAt(i, radius)
        const isActive = activeIndex === i
        return (
          <line
            key={`s${i}`}
            x1={cx} y1={cy} x2={x} y2={y}
            stroke={isActive ? "var(--accent)" : "var(--line)"}
            strokeWidth={isActive ? 1.6 : 1}
            className="hex-spoke"
          />
        )
      })}

      <polygon
        points={dataPts}
        fill="url(#hexFill)"
        stroke="var(--accent)"
        strokeWidth="2"
        className="hex-shape"
        opacity={activeIndex === null ? 1 : 0.28}
      />

      {activeIndex !== null && (
        <polygon
          points={wedgeFor(activeIndex)}
          fill="url(#wedgeFill)"
          stroke="var(--accent)"
          strokeWidth="2"
          className="hex-wedge"
        />
      )}

      {six.map((s, i) => {
        const r = (radius * Math.max(4, s.value)) / 100
        const [x, y] = pointAt(i, r)
        const [lx, ly] = pointAt(i, radius + 26)
        const isActive = activeIndex === i
        return (
          <g key={`n${i}`}>
            <text
              x={lx}
              y={ly}
              textAnchor="middle"
              dominantBaseline="middle"
              className={`hex-node-label ${isActive ? "active" : ""}`}
            >
              {s.value}
            </text>
            <circle
              cx={x} cy={y}
              r={isActive ? 6.5 : 4}
              fill="var(--accent)"
              className="hex-node"
            />
          </g>
        )
      })}
    </svg>
  )
}
