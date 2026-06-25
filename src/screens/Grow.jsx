import { useState } from 'react'
import { useSearchParams } from 'react-router-dom'
import { AnimatePresence, motion } from 'framer-motion'
import Page from '../components/layout/Page'
import ScreenHeader from '../components/layout/ScreenHeader'
import Segmented from '../components/ui/Segmented'
import { ResourceCard, OpportunityCard } from '../components/cards'
import { RESOURCES, OPPORTUNITIES, OPPORTUNITY_KINDS } from '../data/mockData'

const fade = {
  initial: { opacity: 0, y: 8 },
  animate: { opacity: 1, y: 0 },
  exit: { opacity: 0, y: -8 },
  transition: { duration: 0.25 },
}

export default function Grow() {
  const [params] = useSearchParams()
  const [tab, setTab] = useState(params.get('tab') === 'opportunities' ? 'opps' : 'learn')

  return (
    <Page>
      <ScreenHeader eyebrow="Lift Up · Bridge" title="Grow" />
      <Segmented
        value={tab}
        onChange={setTab}
        options={[
          { value: 'learn', label: 'Learning Hub' },
          { value: 'opps', label: 'Opportunities' },
        ]}
      />
      <AnimatePresence mode="wait">
        {tab === 'learn' ? (
          <motion.div key="learn" {...fade}><Learning /></motion.div>
        ) : (
          <motion.div key="opps" {...fade}><Opportunities /></motion.div>
        )}
      </AnimatePresence>
    </Page>
  )
}

function Learning() {
  const topics = [...new Set(RESOURCES.map((r) => r.topic))]
  return (
    <div className="pb-6 pt-1">
      <p className="mb-4 text-body-md text-ink-600">
        Short-form learning for each monthly cycle — articles, talks, and podcasts. 20–40 minutes, then we discuss.
      </p>
      {topics.map((topic) => (
        <div key={topic} className="mb-6">
          <div className="mb-3 flex items-center gap-2">
            <span className="h-1.5 w-1.5 rounded-full bg-gold-500" />
            <h2 className="h-display text-headline-sm">{topic}</h2>
          </div>
          <div className="space-y-3">
            {RESOURCES.filter((r) => r.topic === topic).map((r) => (
              <ResourceCard key={r.id} res={r} />
            ))}
          </div>
        </div>
      ))}
    </div>
  )
}

function Opportunities() {
  const [kind, setKind] = useState('All')
  const list = kind === 'All' ? OPPORTUNITIES : OPPORTUNITIES.filter((o) => o.kind === kind)
  return (
    <div className="pb-6 pt-1">
      <div className="no-scrollbar -mx-5 mb-4 flex gap-2 overflow-x-auto px-5">
        {OPPORTUNITY_KINDS.map((k) => (
          <button key={k} onClick={() => setKind(k)} className={`shrink-0 ${kind === k ? 'chip-gold' : 'chip'}`}>
            {k}
          </button>
        ))}
      </div>
      <div className="space-y-3">
        {list.map((o) => (
          <OpportunityCard key={o.id} opp={o} />
        ))}
        {list.length === 0 && (
          <p className="py-10 text-center text-sm text-ink-400">Nothing here yet — check back soon.</p>
        )}
      </div>
    </div>
  )
}
