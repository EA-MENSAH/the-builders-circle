import { useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import { PILLARS } from '../data/mockData'
import { Mark } from '../components/ui/Logo'
import Icon from '../components/ui/Icon'

export default function Onboarding() {
  const navigate = useNavigate()

  return (
    <div className="screen flex flex-col px-6 pb-8 pt-safe">
      {/* header */}
      <div className="flex items-center justify-between border-b border-line-subtle py-4">
        <Mark size={26} />
        <button onClick={() => navigate('/join')} className="text-xs font-semibold text-ink-400">
          Skip
        </button>
      </div>

      {/* step indicator */}
      <div className="mt-5 flex items-center justify-between">
        <span className="eyebrow">Step 2 of 6</span>
        <div className="flex gap-1.5">
          {[0, 1, 2, 3, 4, 5].map((i) => (
            <span
              key={i}
              className={`h-1.5 rounded-full ${i === 1 ? 'w-5 bg-gold-500' : 'w-1.5 bg-ink-200'}`}
            />
          ))}
        </div>
      </div>

      <h1 className="h-display mt-4 text-display-hero">The three pillars</h1>
      <p className="mt-2 text-body-md text-ink-600">
        Our architecture is built upon three core commitments that define the builder’s journey.
      </p>

      {/* pillar cards */}
      <div className="mt-6 flex-1 space-y-3.5">
        {PILLARS.map((p, i) => (
          <motion.div
            key={p.key}
            initial={{ opacity: 0, y: 14 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.08 * i, duration: 0.45, ease: [0.16, 1, 0.3, 1] }}
            className="card p-4"
          >
            <div className="flex items-start gap-3.5">
              <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-md bg-gold-100 text-gold-700">
                <Icon name={p.icon} size={22} />
              </span>
              <div className="min-w-0">
                <div className="eyebrow">Pillar {p.num}</div>
                <h3 className="mt-0.5 text-headline-sm text-navy">
                  {p.name} <span className="font-normal text-ink-600">“{p.sub}”</span>
                </h3>
                <p className="mt-0.5 text-sm italic text-gold-700">“{p.prompt}”</p>
              </div>
            </div>
            <p className="mt-3 text-body-sm text-ink-600">{p.body}</p>
          </motion.div>
        ))}
      </div>

      {/* nav */}
      <div className="mt-6 flex items-center gap-3">
        <button onClick={() => navigate(-1)} className="btn-ghost flex-1">
          <Icon name="arrowLeft" size={16} /> Back
        </button>
        <button onClick={() => navigate('/join')} className="btn-gold flex-[1.6]">
          Next <Icon name="arrowRight" size={18} />
        </button>
      </div>
    </div>
  )
}
