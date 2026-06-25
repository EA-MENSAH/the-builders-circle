// The Builders Circle mark — a navy squircle holding a gold "speech bubble +",
// matching the Stitch Welcome screen.
export function Mark({ size = 40, className = '' }) {
  const r = size * 0.26
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 64 64"
      fill="none"
      className={className}
      aria-label="The Builders Circle"
    >
      <rect x="2" y="2" width="60" height="60" rx={r * 64 / size} fill="#04122E" />
      {/* speech bubble */}
      <path
        d="M18 20.5a4 4 0 0 1 4-4h20a4 4 0 0 1 4 4v13a4 4 0 0 1-4 4h-12l-7 6v-6h-1a4 4 0 0 1-4-4Z"
        fill="none"
        stroke="#FED752"
        strokeWidth="2.4"
        strokeLinejoin="round"
      />
      {/* plus */}
      <path d="M32 23v8M28 27h8" stroke="#FED752" strokeWidth="2.6" strokeLinecap="round" />
    </svg>
  )
}

export function Wordmark({ className = '' }) {
  return (
    <div className={`flex items-center gap-2.5 ${className}`}>
      <Mark size={30} />
      <div className="font-display text-[15px] font-semibold uppercase tracking-[0.12em] text-navy">
        The Builders Circle
      </div>
    </div>
  )
}
