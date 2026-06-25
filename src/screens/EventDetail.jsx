import { useParams } from 'react-router-dom'
import Page from '../components/layout/Page'
import ScreenHeader from '../components/layout/ScreenHeader'
import Avatar from '../components/ui/Avatar'
import Icon from '../components/ui/Icon'
import { formatDate } from '../components/cards'
import { useStore } from '../store/useStore'
import { memberById } from '../data/mockData'

export default function EventDetail() {
  const { id } = useParams()
  const events = useStore((s) => s.events)
  const going = useStore((s) => !!s.rsvps[id])
  const toggleRsvp = useStore((s) => s.toggleRsvp)
  const e = events.find((x) => x.id === id)
  if (!e) return <Page><ScreenHeader back title="Not found" /></Page>

  const d = formatDate(e.date)
  const host = memberById(e.host)
  const attendees = e.going.map(memberById).filter(Boolean)
  const total = attendees.length + (going ? 1 : 0)

  return (
    <Page noPad>
      {/* navy hero band */}
      <div className="relative overflow-hidden bg-navy-grad px-5 pb-6 pt-safe text-white">
        <div className="relative">
          <ScreenHeader back sticky={false} />
          <span className="mt-2 inline-flex items-center gap-1.5 rounded-full border border-gold-300/40 bg-white/10 px-3 py-1 text-[11px] font-semibold text-gold-300">
            {e.pillar} · {e.kind}
          </span>
          <h1 className="mt-3 text-display-hero font-semibold leading-tight">{e.title}</h1>
          <p className="mt-2 text-[11px] uppercase tracking-[0.14em] text-navy-200">{e.blurb}</p>
        </div>
      </div>

      <div className="px-5 pb-6 pt-5">
        <div className="card mb-4 grid grid-cols-2 gap-px overflow-hidden bg-line-subtle">
          <Fact icon="calendar" label="Date" value={`${d.weekday}, ${d.day} ${d.mon}`} />
          <Fact icon="clock" label="Time" value={`${e.time} · ${e.duration}`} />
          <Fact icon="pin" label="Where" value={e.location} />
          <Fact icon="globe" label="Mode" value={e.mode} />
        </div>

        <div className="card mb-4 p-4">
          <div className="eyebrow mb-2">About this gathering</div>
          <p className="text-body-md text-ink-700">{e.description}</p>
        </div>

        <div className="card mb-4 flex items-center gap-3 p-4">
          <Avatar member={host} size={42} />
          <div>
            <div className="text-[11px] text-ink-400">Hosted by</div>
            <div className="text-sm font-semibold text-navy">{host?.name}</div>
          </div>
        </div>

        <div className="card mb-24 p-4">
          <div className="mb-3 flex items-center justify-between">
            <span className="eyebrow">Who’s coming</span>
            <span className="text-xs font-semibold text-gold-700">{total} attending</span>
          </div>
          <div className="flex flex-wrap gap-3">
            {attendees.map((m) => (
              <div key={m.id} className="flex w-14 flex-col items-center gap-1">
                <Avatar member={m} size={40} ring={false} />
                <span className="w-full truncate text-center text-[10px] text-ink-400">
                  {m.name.split(' ')[0]}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* sticky RSVP */}
      <div className="absolute inset-x-0 bottom-0 z-20 border-t border-line-subtle bg-paper-0/95 px-5 py-4 pb-safe backdrop-blur-xl">
        <button onClick={() => toggleRsvp(id)} className={going ? 'btn-ghost w-full' : 'btn-navy w-full'}>
          {going ? (
            <><Icon name="check" size={18} strokeWidth={2.4} /> You’re going — tap to cancel</>
          ) : (
            <>RSVP — Reserve my seat</>
          )}
        </button>
      </div>
    </Page>
  )
}

function Fact({ icon, label, value }) {
  return (
    <div className="bg-paper-0 p-4">
      <div className="mb-1.5 flex items-center gap-1.5 text-ink-400">
        <Icon name={icon} size={14} className="text-gold-700" />
        <span className="text-[10px] font-semibold uppercase tracking-wider">{label}</span>
      </div>
      <div className="text-sm font-semibold text-navy">{value}</div>
    </div>
  )
}
