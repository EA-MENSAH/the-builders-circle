import { CAPABILITIES } from '../../data/archetypes'

// Hexagonal radar chart for the six capability scores (0–100) — light theme.
export default function Radar({ scores, size = 260 }) {
  const cx = size / 2
  const cy = size / 2
  const R = size / 2 - 34
  const n = CAPABILITIES.length

  const pt = (i, r) => {
    const a = (Math.PI * 2 * i) / n - Math.PI / 2
    return [cx + Math.cos(a) * r, cy + Math.sin(a) * r]
  }

  const rings = [0.25, 0.5, 0.75, 1]
  const ringPath = (f) => CAPABILITIES.map((_, i) => pt(i, R * f).join(',')).join(' ')
  const dataPath = CAPABILITIES.map((c, i) =>
    pt(i, R * ((scores[c.key] || 0) / 100)).join(',')
  ).join(' ')

  return (
    <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`} className="overflow-visible">
      <defs>
        <linearGradient id="radar-fill" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0" stopColor="#2A3D6B" stopOpacity="0.30" />
          <stop offset="1" stopColor="#04122E" stopOpacity="0.18" />
        </linearGradient>
      </defs>

      {rings.map((f) => (
        <polygon key={f} points={ringPath(f)} fill="none" stroke="rgba(0,0,0,0.08)" strokeWidth="1" />
      ))}
      {CAPABILITIES.map((_, i) => {
        const [x, y] = pt(i, R)
        return <line key={i} x1={cx} y1={cy} x2={x} y2={y} stroke="rgba(0,0,0,0.06)" />
      })}

      <polygon points={dataPath} fill="url(#radar-fill)" stroke="#04122E" strokeWidth="1.8" />
      {CAPABILITIES.map((c, i) => {
        const [x, y] = pt(i, R * ((scores[c.key] || 0) / 100))
        return <circle key={c.key} cx={x} cy={y} r="3.2" fill="#B8960C" stroke="#fff" strokeWidth="1.2" />
      })}

      {CAPABILITIES.map((c, i) => {
        const [x, y] = pt(i, R + 20)
        return (
          <text
            key={c.key}
            x={x}
            y={y}
            textAnchor="middle"
            dominantBaseline="middle"
            className="fill-ink-600"
            style={{ fontSize: 10, fontWeight: 600 }}
          >
            {c.label}
          </text>
        )
      })}
    </svg>
  )
}
