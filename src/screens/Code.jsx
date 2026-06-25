import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import ShaderBackground from '../components/ShaderBackground'
import Icon from '../components/ui/Icon'
import { BUILDER_CODE } from '../data/mockData'

export default function Code() {
  const navigate = useNavigate()
  const [acked, setAcked] = useState({})
  const count = Object.values(acked).filter(Boolean).length
  const total = BUILDER_CODE.length
  const allDone = count === total

  const toggle = (i) => setAcked((a) => ({ ...a, [i]: !a[i] }))
  const ackAll = () => setAcked(Object.fromEntries(BUILDER_CODE.map((_, i) => [i, true])))

  return (
    <div className="screen flex flex-col">
      {/* shader header */}
      <div className="relative shrink-0 overflow-hidden">
        <ShaderBackground className="absolute inset-0 h-full w-full" />
        <div className="absolute inset-0 bg-navy/30" />
        <div className="relative px-7 pb-6 pt-safe text-white">
          <div className="flex items-center justify-between py-4">
            <button onClick={() => navigate(-1)} className="flex h-9 w-9 items-center justify-center rounded-full bg-white/15 text-white backdrop-blur" aria-label="Back">
              <Icon name="arrowLeft" size={18} />
            </button>
            <span className="font-display text-[11px] font-semibold uppercase tracking-[0.18em] text-white/90">Onboarding Phase</span>
            <span className="h-9 w-9" />
          </div>
          <h1 className="mt-6 text-display-hero font-semibold">The Builder Code</h1>
          <p className="mt-2 max-w-[20rem] text-body-sm text-white/85">
            To join the Circle, commit to the principles that define our community.
          </p>
          <div className="mt-5 flex items-center gap-3">
            <div className="h-1.5 flex-1 overflow-hidden rounded-full bg-white/20">
              <motion.div className="h-full rounded-full bg-gold-grad" animate={{ width: `${(count / total) * 100}%` }} transition={{ duration: 0.3 }} />
            </div>
            <span className="text-xs font-semibold text-white/90">{count} of {total}</span>
          </div>
        </div>
      </div>

      {/* the code */}
      <div className="flex-1 overflow-y-auto px-5 pb-28 pt-4 no-scrollbar">
        <div className="mb-3 flex items-center justify-between">
          <span className="eyebrow">Acknowledge each</span>
          {!allDone && (
            <button onClick={ackAll} className="text-xs font-semibold text-gold-700">Acknowledge all</button>
          )}
        </div>
        <div className="space-y-2.5">
          {BUILDER_CODE.map((c, i) => {
            const on = !!acked[i]
            return (
              <button
                key={c.title}
                onClick={() => toggle(i)}
                className={`flex w-full items-center gap-3 rounded-md border p-3.5 text-left transition-colors active:scale-[0.99] ${
                  on ? 'border-navy/30 bg-navy/[0.04]' : 'border-line-subtle bg-paper-0'
                }`}
              >
                <span className={`flex h-6 w-6 shrink-0 items-center justify-center rounded-full border transition-colors ${on ? 'border-navy bg-navy text-white' : 'border-ink-200 text-transparent'}`}>
                  <Icon name="check" size={13} strokeWidth={3} />
                </span>
                <span className="min-w-0 flex-1">
                  <span className={`block text-sm font-semibold ${on ? 'text-navy' : 'text-ink-900'}`}>{c.title}</span>
                  <span className="block text-[11px] text-ink-500">{c.why}</span>
                </span>
              </button>
            )
          })}
        </div>
      </div>

      {/* sticky continue */}
      <div className="absolute inset-x-0 bottom-0 z-20 border-t border-line-subtle bg-paper-0/95 px-5 py-4 pb-safe backdrop-blur-xl">
        <button onClick={() => navigate('/onboarding')} disabled={!allDone} className="btn-navy w-full py-4">
          {allDone ? <>Continue to the Pillars <Icon name="arrowRight" size={18} /></> : `Acknowledge all ${total} to continue`}
        </button>
      </div>
    </div>
  )
}
