import { useState } from 'react'
import Page from '../components/layout/Page'
import ScreenHeader from '../components/layout/ScreenHeader'
import { EventCard } from '../components/cards'
import { useStore } from '../store/useStore'

const FILTERS = ['All', 'Build', 'Belong', 'Bridge']

export default function Events() {
  const events = useStore((s) => s.events)
  const rsvps = useStore((s) => s.rsvps)
  const [filter, setFilter] = useState('All')

  const sorted = [...events].sort((a, b) => a.date.localeCompare(b.date))
  const list = filter === 'All' ? sorted : sorted.filter((e) => e.pillar === filter)
  const goingCount = Object.values(rsvps).filter(Boolean).length

  return (
    <Page>
      <ScreenHeader eyebrow="Community Rhythm" title="Events" />

      <div className="card mb-4 flex items-center justify-between p-4">
        <div>
          <div className="text-display-hero font-bold text-gold-700">{goingCount}</div>
          <div className="text-xs text-ink-600">events you’re attending</div>
        </div>
        <div className="text-right">
          <div className="text-display-hero font-bold text-navy">{events.length}</div>
          <div className="text-xs text-ink-400">upcoming this season</div>
        </div>
      </div>

      <div className="no-scrollbar -mx-5 mb-4 flex gap-2 overflow-x-auto px-5">
        {FILTERS.map((f) => (
          <button key={f} onClick={() => setFilter(f)} className={`shrink-0 ${filter === f ? 'chip-gold' : 'chip'}`}>
            {f}
          </button>
        ))}
      </div>

      <div className="space-y-3 pb-6">
        {list.map((e) => (
          <EventCard key={e.id} event={e} />
        ))}
      </div>
    </Page>
  )
}
