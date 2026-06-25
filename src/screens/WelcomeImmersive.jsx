import { useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import ImmersiveHero from '../components/ImmersiveHero'
import { Mark } from '../components/ui/Logo'
import Icon from '../components/ui/Icon'

const PILLS = ['Level Up', 'Link Up', 'Lift Up']

export default function WelcomeImmersive() {
  const navigate = useNavigate()

  return (
    <div className="screen relative flex flex-col bg-navy text-white">
      {/* full-bleed 3D scene */}
      <div className="absolute inset-0 z-0">
        <ImmersiveHero className="h-full w-full" />
        {/* legibility gradients */}
        <div className="absolute inset-x-0 top-0 h-64 bg-gradient-to-b from-navy via-navy/70 to-transparent" />
        <div className="absolute inset-x-0 bottom-0 h-72 bg-gradient-to-t from-navy via-navy/80 to-transparent" />
      </div>

      <div className="relative z-10 flex flex-1 flex-col px-7 pb-9 pt-safe">
        {/* top bar */}
        <div className="flex items-center justify-between border-b border-white/10 py-4">
          <button className="text-white/70" aria-label="Menu"><Icon name="menu" size={22} /></button>
          <span className="font-display text-[13px] font-semibold uppercase tracking-[0.14em] text-gold-300">
            The Builders Circle
          </span>
          <button onClick={() => navigate('/join')} className="h-7 w-7 rounded-full bg-gold-grad active:scale-95" aria-label="Sign in" />
        </div>

        {/* heading near top */}
        <motion.div
          initial={{ opacity: 0, y: 14 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="pt-10 text-center"
        >
          <div className="mx-auto mb-6 w-min rounded-[1.25rem] shadow-[0_0_50px_rgba(254,215,82,0.25)]">
            <Mark size={64} />
          </div>
          <h1 className="text-display-hero font-semibold text-white">Welcome, Builder.</h1>
          <p className="mx-auto mt-3 max-w-[19rem] text-body-md text-navy-200">
            You’ve been invited to join a community of purpose-driven builders committed to
            growth, meaningful relationships, and lasting impact.
          </p>
          <div className="mt-6 flex flex-wrap items-center justify-center gap-2.5">
            {PILLS.map((p) => (
              <span key={p} className="inline-flex items-center gap-1.5 rounded-full border border-gold-300/40 bg-white/5 px-3 py-1 text-xs font-semibold text-gold-300">
                <span className="h-1.5 w-1.5 rounded-full bg-gold-300" />
                {p}
              </span>
            ))}
          </div>
        </motion.div>

        {/* 3D scene breathes in the middle */}
        <div className="flex-1" />

        {/* CTA */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.25, duration: 0.5 }}
          className="space-y-4"
        >
          <button onClick={() => navigate('/onboarding')} className="btn-gold w-full py-4">
            Begin your journey <Icon name="arrowRight" size={18} />
          </button>
          <button onClick={() => navigate('/welcome')} className="w-full text-center text-xs font-medium text-navy-200">
            Prefer it simple? <span className="font-semibold text-gold-300">Classic intro</span>
          </button>
          <p className="text-center text-[11px] uppercase tracking-[0.12em] text-white/40">
            Phase 0 · June – August 2026
          </p>
        </motion.div>
      </div>
    </div>
  )
}
