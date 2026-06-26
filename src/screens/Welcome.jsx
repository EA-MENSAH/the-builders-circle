import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import { Mark } from '../components/ui/Logo'
import Icon from '../components/ui/Icon'
import WelcomeMenu from '../components/WelcomeMenu'

const PILLS = ['Level Up', 'Link Up', 'Lift Up']

export default function Welcome() {
  const navigate = useNavigate()
  const [menu, setMenu] = useState(false)

  return (
    <div className="screen flex flex-col px-7 pb-9 pt-safe">
      {/* top bar */}
      <div className="flex items-center justify-between border-b border-line-subtle py-4">
        <button onClick={() => setMenu(true)} className="text-ink-600 active:scale-95" aria-label="Menu">
          <Icon name="menu" size={22} />
        </button>
        <span className="font-display text-[13px] font-semibold uppercase tracking-[0.14em] text-navy">
          The Builders Circle
        </span>
        <button onClick={() => navigate('/join')} className="h-7 w-7 rounded-full bg-navy-grad active:scale-95" aria-label="Sign in" />
      </div>

      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.55, ease: [0.16, 1, 0.3, 1] }}
        className="flex flex-1 flex-col items-center justify-center text-center"
      >
        {/* logo tile */}
        <div className="mb-8 shadow-navy" style={{ borderRadius: 20 }}>
          <Mark size={72} />
        </div>

        <h1 className="h-display text-display-hero">Welcome, Builder.</h1>
        <p className="mx-auto mt-3 max-w-[19rem] text-body-md text-ink-600">
          You’ve been invited to join a community of purpose-driven builders committed to
          growth, meaningful relationships, and lasting impact.
        </p>

        {/* pillars as gold pills */}
        <div className="mt-7 flex flex-wrap items-center justify-center gap-2.5">
          {PILLS.map((p) => (
            <span key={p} className="chip-gold gap-1.5">
              <span className="h-1.5 w-1.5 rounded-full bg-gold-600" />
              {p}
            </span>
          ))}
        </div>
      </motion.div>

      {/* CTA */}
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2, duration: 0.5 }}
        className="space-y-4"
      >
        <button onClick={() => navigate('/code')} className="btn-navy w-full py-4">
          Begin your journey
          <Icon name="arrowRight" size={18} />
        </button>
        <button
          onClick={() => navigate('/join')}
          className="w-full text-center text-sm text-ink-600"
        >
          Already a member? <span className="font-semibold text-gold-700">Sign in</span>
        </button>
        <button
          onClick={() => navigate('/welcome/immersive')}
          className="flex w-full items-center justify-center gap-1.5 text-center text-xs font-medium text-ink-400"
        >
          <Icon name="sparkle" size={13} className="text-gold-600" /> View the immersive intro
        </button>
        <p className="pt-1 text-center text-[11px] uppercase tracking-[0.12em] text-ink-400">
          Phase 0 · June – August 2026
        </p>
      </motion.div>

      <WelcomeMenu open={menu} onClose={() => setMenu(false)} variant="classic" />
    </div>
  )
}
