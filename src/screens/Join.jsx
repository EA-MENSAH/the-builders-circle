import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import { useStore } from '../store/useStore'
import { Mark } from '../components/ui/Logo'
import Icon from '../components/ui/Icon'
import BuilderCodeSheet from '../components/BuilderCodeSheet'
import { toast } from '../store/useToast'

export default function Join() {
  const navigate = useNavigate()
  const signIn = useStore((s) => s.signIn)
  const user = useStore((s) => s.user)
  const [name, setName] = useState(user.name)
  const [agreed, setAgreed] = useState(true)
  const [showCode, setShowCode] = useState(false)

  const enter = () => {
    if (name.trim()) useStore.getState().updateUser({ name: name.trim() })
    signIn()
    navigate('/home', { replace: true })
    toast(`Welcome to the Circle, ${name.trim().split(' ')[0]}`, { icon: 'sparkle' })
  }

  return (
    <div className="screen flex flex-col px-7 pb-9 pt-safe">
      <button
        onClick={() => navigate(-1)}
        className="mt-6 flex h-9 w-9 items-center justify-center rounded-full border border-line bg-paper-0 text-ink-600"
        aria-label="Back"
      >
        <Icon name="arrowLeft" size={18} />
      </button>

      <motion.div
        initial={{ opacity: 0, y: 14 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="flex flex-1 flex-col justify-center"
      >
        <Mark size={48} />
        <h1 className="h-display mt-6 text-display-hero">Take your seat at the table.</h1>
        <p className="mt-2 text-body-md text-ink-600">
          Membership is earned through alignment, not purchased. Welcome, builder.
        </p>

        <div className="mt-8 space-y-4">
          <div>
            <label className="eyebrow mb-2 block">Full name</label>
            <input
              className="input"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="e.g. Marcus Aurelius"
            />
          </div>
          <div>
            <label className="eyebrow mb-2 block">Email</label>
            <input className="input" type="email" placeholder="you@example.com" defaultValue="" />
          </div>
        </div>

        <div className="mt-6 flex items-start gap-3">
          <button
            onClick={() => setAgreed((v) => !v)}
            aria-pressed={agreed}
            aria-label="I commit to the Builder Code"
            className={`mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full border transition-colors ${
              agreed ? 'border-navy bg-navy text-white' : 'border-ink-200'
            }`}
          >
            {agreed && <Icon name="check" size={12} strokeWidth={3} />}
          </button>
          <p className="text-xs leading-relaxed text-ink-600">
            I commit to the{' '}
            <button
              type="button"
              onClick={() => setShowCode(true)}
              className="font-semibold text-gold-700 underline decoration-gold-300 underline-offset-2 hover:text-gold-600"
            >
              Builder Code
            </button>{' '}
            — radical transparency, architectural integrity, and collective growth.
          </p>
        </div>
      </motion.div>

      <button onClick={enter} disabled={!agreed || !name.trim()} className="btn-navy w-full py-4">
        Enter the Circle
        <Icon name="arrowRight" size={18} />
      </button>

      <BuilderCodeSheet
        open={showCode}
        onClose={() => setShowCode(false)}
        onCommit={() => {
          setAgreed(true)
          setShowCode(false)
        }}
      />
    </div>
  )
}
