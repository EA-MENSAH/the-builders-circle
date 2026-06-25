import { useNavigate } from 'react-router-dom'
import Page from '../components/layout/Page'
import Icon from '../components/ui/Icon'
import { Mark } from '../components/ui/Logo'
import { FeedCard, EventCard } from '../components/cards'
import { useStore } from '../store/useStore'
import { ARCHETYPES } from '../data/archetypes'
import { BUILDER_JOURNEY } from '../data/mockData'

const QUICK = [
  { to: '/circle', icon: 'users', label: 'Directory' },
  { to: '/grow?tab=opportunities', icon: 'briefcase', label: 'Opportunities' },
  { to: '/grow', icon: 'book', label: 'Learning' },
]

export default function Home() {
  const navigate = useNavigate()
  const user = useStore((s) => s.user)
  const profile = useStore((s) => s.builderProfile)
  const events = useStore((s) => s.events)
  const feed = useStore((s) => s.feed)
  const arch = user.archetype ? ARCHETYPES[user.archetype] : null

  const nextEvent = [...events].sort((a, b) => a.date.localeCompare(b.date))[0]
  const isFounder = ['m-angel', 'm-henry', 'm-elisha', 'm-deborah'].includes(user.id) || /found(er|ing)/i.test(user.role)
  const stageIndex = BUILDER_JOURNEY.indexOf(user.joinedStage)
  const stagePct = Math.round(((stageIndex + 1) / BUILDER_JOURNEY.length) * 100)

  return (
    <Page>
      {/* top bar */}
      <header className="sticky top-0 z-20 -mx-5 mb-1 flex items-center justify-between border-b border-line-subtle bg-paper/85 px-5 pb-2 pt-safe backdrop-blur-xl">
        <div className="flex items-center gap-2.5 pt-3">
          <Mark size={26} />
          <span className="font-display text-sm font-semibold uppercase tracking-[0.1em] text-navy">
            Builders Circle
          </span>
        </div>
        <button className="relative pt-3 text-ink-600" aria-label="Notifications">
          <Icon name="bell" size={21} />
          <span className="absolute right-0 top-3 h-2 w-2 rounded-full bg-gold-500" />
        </button>
      </header>

      {/* greeting */}
      <div className="mb-5 mt-2">
        <p className="eyebrow mb-1">{greeting()} · {user.location}</p>
        <h1 className="h-display text-display-hero">{firstName(user.name)}.</h1>
      </div>

      {/* journey progress (navy) */}
      <button
        onClick={() => navigate('/profile')}
        className="card-navy mb-4 w-full p-5 text-left active:scale-[0.99]"
      >
        <div className="flex items-center justify-between">
          <span className="text-[10px] font-semibold uppercase tracking-[0.18em] text-gold-300">
            Your First 90 Days
          </span>
          <span className="text-headline-sm font-bold text-white">{stagePct}%</span>
        </div>
        <div className="mt-3 h-1.5 overflow-hidden rounded-full bg-white/15">
          <div className="h-full rounded-full bg-gold-grad" style={{ width: `${stagePct}%` }} />
        </div>
        <div className="mt-2.5 text-xs text-navy-200">
          Stage {stageIndex + 1} of {BUILDER_JOURNEY.length} ·{' '}
          <span className="font-semibold text-white">{user.joinedStage}</span>
        </div>
      </button>

      {/* archetype / assessment CTA */}
      {arch ? (
        <button
          onClick={() => navigate('/assessment/result')}
          className="card mb-4 flex w-full items-center gap-4 p-4 text-left active:scale-[0.99]"
        >
          <div className="flex h-14 w-14 items-center justify-center rounded-md bg-navy text-2xl text-gold-300">
            {arch.glyph}
          </div>
          <div className="min-w-0 flex-1">
            <div className="eyebrow">Your Builder Archetype</div>
            <div className="text-headline-sm text-navy">{arch.name}</div>
            <div className="truncate text-xs text-ink-600">{arch.tagline}</div>
          </div>
          <Icon name="chevronRight" size={18} className="text-ink-200" />
        </button>
      ) : (
        <button
          onClick={() => navigate('/assessment')}
          className="mb-4 flex w-full items-center gap-4 rounded-md border border-gold-300 bg-gold-100 p-4 text-left active:scale-[0.99]"
        >
          <div className="flex h-14 w-14 items-center justify-center rounded-md bg-gold-grad text-navy">
            <Icon name="spark" size={26} />
          </div>
          <div className="min-w-0 flex-1">
            <div className="eyebrow">Start here</div>
            <div className="text-[15px] font-semibold text-navy">Discover your Builder Archetype</div>
            <div className="text-xs text-gold-700">A 2-minute assessment unlocks your profile.</div>
          </div>
          <Icon name="arrowRight" size={18} className="text-gold-700" />
        </button>
      )}

      {/* quick actions */}
      <div className="mb-6 grid grid-cols-3 gap-3">
        {QUICK.map((q) => (
          <button
            key={q.label}
            onClick={() => navigate(q.to)}
            className="card-flat flex flex-col items-center gap-2 py-4 active:scale-[0.97]"
          >
            <Icon name={q.icon} size={22} className="text-gold-700" />
            <span className="text-[11px] font-semibold text-ink-600">{q.label}</span>
          </button>
        ))}
      </div>

      {/* next on calendar */}
      <SectionTitle title="Next on the calendar" to="/events" navigate={navigate} />
      <div className="mb-6">
        <EventCard event={nextEvent} />
      </div>

      {/* founder dashboard */}
      {isFounder && (
        <button
          onClick={() => navigate('/founder')}
          className="mb-6 flex w-full items-center gap-3 rounded-md border border-line-subtle bg-paper-0 p-4 shadow-card active:scale-[0.99]"
        >
          <span className="flex h-10 w-10 items-center justify-center rounded-md bg-gold-100 text-gold-700">
            <Icon name="gauge" size={20} />
          </span>
          <div className="flex-1 text-left">
            <div className="text-sm font-semibold text-navy">Founder Dashboard</div>
            <div className="text-[11px] text-ink-400">Community health & engagement</div>
          </div>
          <Icon name="chevronRight" size={18} className="text-ink-200" />
        </button>
      )}

      {/* from the circle */}
      <SectionTitle title="From the Circle" to="/circle" navigate={navigate} />
      <div className="space-y-3 pb-6">
        {feed.slice(0, 2).map((p) => (
          <FeedCard key={p.id} post={p} />
        ))}
        <button onClick={() => navigate('/circle')} className="btn-ghost w-full">
          See the full feed <Icon name="arrowRight" size={16} />
        </button>
      </div>
    </Page>
  )
}

function SectionTitle({ title, to, navigate }) {
  return (
    <div className="mb-3 flex items-center justify-between">
      <h2 className="h-display text-headline-sm">{title}</h2>
      {to && (
        <button onClick={() => navigate(to)} className="text-xs font-semibold text-gold-700">
          See all
        </button>
      )}
    </div>
  )
}

function firstName(n) {
  return n.split(' ')[0]
}
function greeting() {
  const h = new Date().getHours()
  if (h < 12) return 'Good morning'
  if (h < 17) return 'Good afternoon'
  return 'Good evening'
}
