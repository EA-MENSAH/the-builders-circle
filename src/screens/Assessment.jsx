import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { AnimatePresence, motion } from 'framer-motion'
import Icon from '../components/ui/Icon'
import { ASSESSMENT_QUESTIONS, LIKERT } from '../data/archetypes'
import { useStore } from '../store/useStore'

export default function Assessment() {
  const navigate = useNavigate()
  const saveAssessment = useStore((s) => s.saveAssessment)
  const [step, setStep] = useState(0)
  const [answers, setAnswers] = useState({})

  const total = ASSESSMENT_QUESTIONS.length
  const intro = step === 0
  const q = ASSESSMENT_QUESTIONS[step - 1]
  const progress = intro ? 0 : (step - 1) / total

  const choose = (value) => {
    const next = { ...answers, [q.id]: value }
    setAnswers(next)
    setTimeout(() => {
      if (step < total) setStep(step + 1)
      else {
        saveAssessment(next)
        navigate('/assessment/result', { replace: true })
      }
    }, 180)
  }

  return (
    <div className="screen flex flex-col px-6 pb-8 pt-safe">
      <div className="flex items-center gap-3 pt-5">
        <button
          onClick={() => (intro ? navigate(-1) : setStep(step - 1))}
          className="flex h-9 w-9 items-center justify-center rounded-full border border-line bg-paper-0 text-ink-600"
        >
          <Icon name="arrowLeft" size={18} />
        </button>
        <div className="h-1.5 flex-1 overflow-hidden rounded-full bg-paper-200">
          <motion.div
            className="h-full rounded-full bg-gold-grad"
            animate={{ width: `${Math.max(progress * 100, intro ? 0 : 6)}%` }}
            transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
          />
        </div>
        <span className="w-12 text-right text-[11px] font-semibold text-ink-400">
          {intro ? '' : `${step}/${total}`}
        </span>
      </div>

      <AnimatePresence mode="wait">
        {intro ? (
          <motion.div
            key="intro"
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -16 }}
            className="flex flex-1 flex-col justify-center"
          >
            <div className="mb-6 flex h-16 w-16 items-center justify-center rounded-md bg-navy text-gold-300">
              <Icon name="compass" size={32} />
            </div>
            <p className="eyebrow mb-3">The Builder Assessment</p>
            <h1 className="h-display text-display-xl">Discover how you build.</h1>
            <p className="mt-4 text-body-md text-ink-600">
              Twelve quick statements. There are no right answers — just be honest. We’ll reveal
              your primary and secondary archetype, your capability profile, and where you have
              the most room to grow.
            </p>
            <div className="mt-6 flex items-center gap-2 text-xs text-ink-400">
              <Icon name="clock" size={15} /> About 2 minutes
            </div>
            <button onClick={() => setStep(1)} className="btn-navy mt-8 w-full">
              Begin <Icon name="arrowRight" size={18} />
            </button>
          </motion.div>
        ) : (
          <motion.div
            key={q.id}
            initial={{ opacity: 0, x: 28 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -28 }}
            transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
            className="flex flex-1 flex-col"
          >
            <div className="flex flex-1 flex-col justify-center">
              <p className="eyebrow mb-4">Statement {step} of {total}</p>
              <h2 className="text-display-hero font-semibold leading-tight text-navy">{q.text}</h2>
            </div>

            <div className="space-y-2.5 pb-2">
              {LIKERT.map((opt) => {
                const active = answers[q.id] === opt.value
                return (
                  <button
                    key={opt.value}
                    onClick={() => choose(opt.value)}
                    className={`flex w-full items-center gap-3 rounded-md border px-4 py-3.5 text-left text-sm transition-all active:scale-[0.99] ${
                      active ? 'border-gold-500 bg-gold-100 text-navy' : 'border-line bg-paper-0 text-ink-700 hover:border-navy-600/40'
                    }`}
                  >
                    <span
                      className={`flex h-6 w-6 shrink-0 items-center justify-center rounded-full text-[11px] font-bold ${
                        active ? 'bg-gold-grad text-navy' : 'border border-ink-200 text-ink-400'
                      }`}
                    >
                      {opt.value}
                    </span>
                    {opt.label}
                  </button>
                )
              })}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
