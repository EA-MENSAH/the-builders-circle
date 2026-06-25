import { motion } from 'framer-motion'

// Segmented control with a sliding navy pill.
export default function Segmented({ value, onChange, options }) {
  return (
    <div className="mb-4 flex rounded-full border border-line-subtle bg-paper-100 p-1">
      {options.map((opt) => {
        const active = opt.value === value
        return (
          <button
            key={opt.value}
            onClick={() => onChange(opt.value)}
            className="relative flex-1 rounded-full px-4 py-2 text-sm font-semibold"
          >
            {active && (
              <motion.span
                layoutId="seg-pill"
                transition={{ type: 'spring', stiffness: 420, damping: 34 }}
                className="absolute inset-0 rounded-full bg-navy shadow-navy"
              />
            )}
            <span className={`relative z-10 ${active ? 'text-white' : 'text-ink-600'}`}>
              {opt.label}
            </span>
          </button>
        )
      })}
    </div>
  )
}
