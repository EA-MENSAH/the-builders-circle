import Page from '../components/layout/Page'
import ScreenHeader from '../components/layout/ScreenHeader'
import Icon from '../components/ui/Icon'
import { useStore } from '../store/useStore'
import { MEMBERS } from '../data/mockData'
import { ARCHETYPE_LIST } from '../data/archetypes'

export default function FounderDashboard() {
  const events = useStore((s) => s.events)
  const feed = useStore((s) => s.feed)
  const rsvps = useStore((s) => s.rsvps)
  const profile = useStore((s) => s.builderProfile)

  const totalMembers = MEMBERS.length + 1
  const founders = MEMBERS.filter((m) => m.founder).length
  const withArchetype = MEMBERS.filter((m) => m.archetype).length + (profile ? 1 : 0)
  const completion = Math.round((withArchetype / totalMembers) * 100)
  const totalRsvp = events.reduce((n, e) => n + e.going.length, 0) + Object.values(rsvps).filter(Boolean).length
  const totalCheers = feed.reduce((n, p) => n + p.cheers, 0)

  const dist = ARCHETYPE_LIST.map((a) => ({
    ...a,
    count: MEMBERS.filter((m) => m.archetype === a.key).length + (profile?.primary === a.key ? 1 : 0),
  }))
  const maxDist = Math.max(...dist.map((d) => d.count), 1)
  const maxAttend = Math.max(...events.map((e) => e.going.length), 1)

  return (
    <Page>
      <ScreenHeader back eyebrow="Founders only" title="Dashboard" />
      <p className="-mt-1 mb-5 text-body-md text-ink-600">
        A pulse on community health — growth, engagement, and contribution.
      </p>

      <div className="mb-5 grid grid-cols-2 gap-3">
        <Metric icon="users" value={totalMembers} label="Total members" sub={`${founders} founders`} />
        <Metric icon="compass" value={`${completion}%`} label="Assessment done" sub={`${withArchetype}/${totalMembers} profiled`} />
        <Metric icon="calendar" value={totalRsvp} label="Event RSVPs" sub={`${events.length} events`} />
        <Metric icon="heart" value={totalCheers} label="Engagement" sub={`${feed.length} posts`} />
      </div>

      <div className="card mb-5 p-4">
        <div className="eyebrow mb-4">Event attendance</div>
        <div className="space-y-3">
          {events.map((e) => (
            <div key={e.id}>
              <div className="mb-1 flex items-center justify-between text-[11px]">
                <span className="truncate pr-2 text-ink-600">{e.kind}</span>
                <span className="font-semibold text-ink-400">{e.going.length}</span>
              </div>
              <div className="h-2 overflow-hidden rounded-full bg-paper-200">
                <div className="h-full rounded-full bg-gold-grad" style={{ width: `${(e.going.length / maxAttend) * 100}%` }} />
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="card mb-5 p-4">
        <div className="eyebrow mb-4">Archetype mix</div>
        <div className="space-y-3">
          {dist.map((d) => (
            <div key={d.key} className="flex items-center gap-3">
              <span className="w-5 text-center text-gold-700">{d.glyph}</span>
              <span className="w-24 shrink-0 truncate text-xs text-ink-600">{d.name.replace('The ', '')}</span>
              <div className="h-2 flex-1 overflow-hidden rounded-full bg-paper-200">
                <div className="h-full rounded-full bg-navy" style={{ width: `${(d.count / maxDist) * 100}%` }} />
              </div>
              <span className="w-4 text-right text-[11px] font-semibold text-ink-400">{d.count}</span>
            </div>
          ))}
        </div>
      </div>

      <div className="card mb-6 p-4">
        <div className="eyebrow mb-3">What success looks like</div>
        <div className="space-y-3">
          {SUCCESS.map((s) => (
            <div key={s.k} className="flex items-start gap-3">
              <Icon name="check" size={15} strokeWidth={2.2} className="mt-0.5 text-gold-600" />
              <div>
                <div className="text-sm font-semibold text-navy">{s.k}</div>
                <div className="text-[11px] text-ink-400">{s.v}</div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </Page>
  )
}

const SUCCESS = [
  { k: 'Growth', v: 'Are members becoming better builders?' },
  { k: 'Relationships', v: 'Are meaningful connections being formed?' },
  { k: 'Contribution', v: 'Are members helping one another succeed?' },
  { k: 'Impact', v: 'Are opportunities being created?' },
  { k: 'Sustainability', v: 'Can the Circle grow without losing its culture?' },
]

function Metric({ icon, value, label, sub }) {
  return (
    <div className="card p-4">
      <span className="mb-2 inline-flex h-9 w-9 items-center justify-center rounded-md bg-gold-100 text-gold-700">
        <Icon name={icon} size={18} />
      </span>
      <div className="text-display-hero font-bold leading-none text-navy">{value}</div>
      <div className="mt-1.5 text-xs font-semibold text-ink-600">{label}</div>
      <div className="text-[10px] text-ink-400">{sub}</div>
    </div>
  )
}
