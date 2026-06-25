import { Navigate, useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import Page from '../components/layout/Page'
import ScreenHeader from '../components/layout/ScreenHeader'
import Radar from '../components/ui/Radar'
import Icon from '../components/ui/Icon'
import { useStore } from '../store/useStore'
import { ARCHETYPES, CAPABILITIES, capLabel } from '../data/archetypes'

export default function AssessmentResult() {
  const navigate = useNavigate()
  const profile = useStore((s) => s.builderProfile)
  const resetAssessment = useStore((s) => s.resetAssessment)

  if (!profile) return <Navigate to="/assessment" replace />

  const primary = ARCHETYPES[profile.primary]
  const secondary = ARCHETYPES[profile.secondary]
  const sorted = [...CAPABILITIES].sort((a, b) => profile.scores[b.key] - profile.scores[a.key])

  return (
    <Page>
      <ScreenHeader back eyebrow="Your Builder Profile" />

      {/* hero archetype — navy */}
      <motion.div
        initial={{ opacity: 0, scale: 0.97 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
        className="card-navy mb-5 overflow-hidden p-6 text-center"
      >
        <div className="mx-auto mb-3 flex h-20 w-20 items-center justify-center rounded-full bg-gold-grad text-4xl text-navy">
          {primary.glyph}
        </div>
        <p className="text-[10px] font-semibold uppercase tracking-[0.18em] text-gold-300">
          Primary archetype · {primary.pillar}
        </p>
        <h1 className="mt-1 text-display-hero font-semibold text-white">{primary.name}</h1>
        <p className="mt-2 text-sm italic text-gold-300">“{primary.tagline}”</p>
        <p className="mx-auto mt-4 max-w-[20rem] text-body-sm text-navy-200">{primary.description}</p>
      </motion.div>

      {/* radar */}
      <div className="card mb-5 flex flex-col items-center p-4">
        <div className="eyebrow mb-1 self-start">Capability profile</div>
        <Radar scores={profile.scores} size={250} />
      </div>

      {/* capability bars */}
      <div className="card mb-5 p-4">
        <div className="eyebrow mb-3">Your scores</div>
        <div className="space-y-3">
          {sorted.map((c) => (
            <div key={c.key}>
              <div className="mb-1 flex items-center justify-between text-xs">
                <span className="font-semibold text-navy">{c.label}</span>
                <span className="font-semibold text-ink-400">{profile.scores[c.key]}</span>
              </div>
              <div className="h-2 overflow-hidden rounded-full bg-paper-200">
                <motion.div
                  className="h-full rounded-full bg-gold-grad"
                  initial={{ width: 0 }}
                  animate={{ width: `${profile.scores[c.key]}%` }}
                  transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
                />
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* secondary + contribution + growth */}
      <div className="mb-5 grid gap-3">
        <InfoCard glyph={secondary.glyph} label="Secondary archetype" title={secondary.name} body={secondary.contributionStyle} />
        <InfoCard icon="heart" label="Contribution style" title={profile.contributionStyle} body="How you most naturally create value for the Circle." />
        <div className="card p-4">
          <div className="mb-2 flex items-center gap-2">
            <Icon name="target" size={15} className="text-gold-700" />
            <span className="eyebrow">Growth areas</span>
          </div>
          <p className="mb-3 text-xs text-ink-600">Where the Circle can help you level up first.</p>
          <div className="flex flex-wrap gap-2">
            {profile.growthAreas.map((g) => (<span key={g} className="chip">{capLabel(g)}</span>))}
          </div>
        </div>
      </div>

      <div className="flex flex-col gap-3 pb-6">
        <button onClick={() => navigate('/home')} className="btn-navy w-full">
          Continue <Icon name="arrowRight" size={18} />
        </button>
        <button
          onClick={() => { resetAssessment(); navigate('/assessment', { replace: true }) }}
          className="btn-ghost w-full"
        >
          Retake assessment
        </button>
      </div>
    </Page>
  )
}

function InfoCard({ glyph, icon, label, title, body }) {
  return (
    <div className="card flex items-center gap-3 p-4">
      <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-md bg-navy text-lg text-gold-300">
        {glyph || <Icon name={icon} size={20} />}
      </span>
      <div className="min-w-0">
        <div className="eyebrow">{label}</div>
        <div className="text-sm font-semibold text-navy">{title}</div>
        <div className="text-[11px] text-ink-400">{body}</div>
      </div>
    </div>
  )
}
