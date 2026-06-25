// Initials avatar — navy disc, white initials, optional gold founder badge.
export default function Avatar({ member, size = 44, ring = true, className = '' }) {
  const initials = member?.initials || '··'
  const isFounder = member?.founder
  return (
    <div className={`relative shrink-0 ${className}`} style={{ width: size, height: size }}>
      <div
        className="flex h-full w-full items-center justify-center rounded-full font-display font-semibold text-white"
        style={{
          fontSize: size * 0.36,
          background: 'linear-gradient(150deg, #2A3D6B 0%, #04122E 100%)',
          boxShadow: ring ? '0 0 0 1.5px rgba(184,150,12,0.35)' : 'none',
        }}
      >
        {initials}
      </div>
      {isFounder && (
        <span
          className="absolute -bottom-0.5 -right-0.5 flex items-center justify-center rounded-full border border-paper-0 bg-gold-grad text-navy"
          style={{ width: size * 0.42, height: size * 0.42, fontSize: size * 0.24 }}
          title="Founder"
        >
          ✦
        </span>
      )}
    </div>
  )
}
