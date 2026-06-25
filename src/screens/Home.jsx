import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import Page from '../components/layout/Page'
import Icon from '../components/ui/Icon'
import Avatar from '../components/ui/Avatar'
import { Mark } from '../components/ui/Logo'
import { FeedCard, EventCard } from '../components/cards'
import { NotificationsSheet } from '../components/sheets'
import { useStore } from '../store/useStore'
import { toast } from '../store/useToast'
import { ARCHETYPES } from '../data/archetypes'
import { ONBOARDING_CHECKLIST, MEMBERS, memberById } from '../data/mockData'

const QUICK = [
  { to: '/circle', icon: 'users', label: 'Directory' },
  { to: '/grow?tab=opportunities', icon: 'briefcase', label: 'Opportunities' },
  { to: '/grow', icon: 'book', label: 'Learning' },
]

const TOOLS = [
  { to: '/marketplace', icon: 'handshake', label: 'Marketplace' },
  { to: '/goals', icon: 'target', label: 'Goals' },
  { to: '/mentorship', icon: 'groups', label: 'Mentorship' },
  { to: '/recognition', icon: 'heart', label: 'Recognition' },
  { to: '/groups', icon: 'comment', label: 'Discussion' },
  { to: '/spaces', icon: 'briefcase', label: 'Project Spaces' },
]

export default function Home() {
  const navigate = useNavigate()
  const user = useStore((s) => s.user)
  const profile = useStore((s) => s.builderProfile)
  const events = useStore((s) => s.events)
  const feed = useStore((s) => s.feed)
  const rsvps = useStore((s) => s.rsvps)
  const checklist = useStore((s) => s.checklist)
  const toggleChecklistItem = useStore((s) => s.toggleChecklistItem)
  const arch = user.archetype ? ARCHETYPES[user.archetype] : null
  const [showNotifs, setShowNotifs] = useState(false)

  const nextEvent = [...events].sort((a, b) => a.date.localeCompare(b.date))[0]
  const isFounder = ['m-angel', 'm-henry', 'm-elisha', 'm-deborah'].includes(user.id) || /found(er|ing)/i.test(user.role)

  // checklist completion (mix real signals + manual checks)
  const anyRsvp = Object.values(rsvps).some(Boolean)
  const hasPosted = feed.some((p) => p.authorId === user.id)
  const auto = {
    assessment: !!profile,
    welcome: anyRsvp,
    rsvp: anyRsvp,
    introduce: hasPosted,
  }
  const baseItems = ONBOARDING_CHECKLIST.filter((i) => !i.locked)
  const isDone = (i) => auto[i.id] || !!checklist[i.id]
  const doneCount = baseItems.filter(isDone).length
  const allBaseDone = doneCount === baseItems.length
  const items = ONBOARDING_CHECKLIST.map((i) =>
    i.locked ? { ...i, locked: !allBaseDone } : i
  )
  const total = ONBOARDING_CHECKLIST.length
  const fullDone = doneCount + (allBaseDone && isDone({ id: 'review' }) ? 1 : 0)
  const pct = Math.round((fullDone / total) * 100)
  const nextItem = items.find((i) => !i.locked && !isDone(i))

  // a suggested connection (shared expertise, else a founder)
  const suggestion =
    MEMBERS.find((m) => m.id !== user.id && m.expertise.some((e) => user.expertise.includes(e))) ||
    MEMBERS.find((m) => m.founder)

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
        <button onClick={() => setShowNotifs(true)} className="relative pt-3 text-ink-600" aria-label="Notifications">
          <Icon name="bell" size={21} />
          <span className="absolute right-0 top-3 h-2 w-2 rounded-full bg-gold-500" />
        </button>
      </header>

      {/* greeting */}
      <div className="mb-5 mt-2">
        <p className="eyebrow mb-1">{greeting()} · {user.location}</p>
        <h1 className="h-display text-display-hero">{firstName(user.name)}.</h1>
      </div>

      {/* milestone header */}
      <div className="mb-3 flex items-center justify-between">
        <div>
          <div className="eyebrow">Current milestone</div>
          <h2 className="h-display text-headline-sm">Your First 90 Days</h2>
        </div>
        <span className="text-[10px] font-semibold uppercase tracking-[0.14em] text-ink-400">Phase 0 of 6</span>
      </div>

      {/* stat cards */}
      <div className="mb-3 grid grid-cols-2 gap-3">
        <div className="card p-4">
          <div className="text-display-hero font-bold leading-none text-navy">{fullDone}</div>
          <div className="mt-1 text-[11px] font-semibold uppercase tracking-wider text-ink-400">Completed</div>
        </div>
        <div className="card p-4">
          <div className="text-display-hero font-bold leading-none text-navy">{total}</div>
          <div className="mt-1 text-[11px] font-semibold uppercase tracking-wider text-ink-400">Total steps</div>
        </div>
      </div>

      {/* journey progress (navy) */}
      <div className="card-navy mb-4 p-5">
        <div className="flex items-center justify-between">
          <span className="text-[10px] font-semibold uppercase tracking-[0.18em] text-gold-300">Journey progress</span>
          <span className="text-headline-sm font-bold text-white">{pct}%</span>
        </div>
        <div className="mt-3 h-1.5 overflow-hidden rounded-full bg-white/15">
          <motion.div
            className="h-full rounded-full bg-gold-grad"
            animate={{ width: `${pct}%` }}
            transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
          />
        </div>
        <div className="mt-2.5 text-xs text-navy-200">
          {nextItem ? <>Next: <span className="font-semibold text-white">{nextItem.label}</span></> : 'All steps complete — welcome, builder. 🤍'}
        </div>
      </div>

      {/* onboarding checklist */}
      <div className="card mb-6 p-4">
        <div className="mb-3 flex items-center justify-between">
          <span className="eyebrow">Onboarding Checklist</span>
          <Icon name="tune" size={16} className="text-ink-400" />
        </div>
        <div className="space-y-1.5">
          {items.map((i) => {
            const done = !i.locked && isDone(i)
            return (
              <div
                key={i.id}
                className={`flex items-center gap-1 rounded-md transition-colors ${
                  i.locked ? 'opacity-50' : 'hover:bg-paper-100'
                }`}
              >
                <button
                  disabled={i.locked}
                  onClick={() => {
                    if (i.locked) return
                    toggleChecklistItem(i.id)
                    if (!done) toast('Step complete')
                  }}
                  className="flex min-w-0 flex-1 items-center gap-3 px-2 py-2.5 text-left active:scale-[0.99]"
                  aria-pressed={done}
                >
                  <span
                    className={`flex h-6 w-6 shrink-0 items-center justify-center rounded-full border transition-colors ${
                      done ? 'border-navy bg-navy text-white' : 'border-ink-200 text-transparent'
                    }`}
                  >
                    {i.locked ? <Icon name="lock" size={12} className="text-ink-400" /> : <Icon name="check" size={13} strokeWidth={3} />}
                  </span>
                  <span className="min-w-0 flex-1">
                    <span className={`block text-sm font-medium ${done ? 'text-ink-400 line-through' : 'text-navy'}`}>{i.label}</span>
                    <span className="block text-[11px] text-ink-400">{i.meta}</span>
                  </span>
                </button>
                {!i.locked && i.action && (
                  <button
                    onClick={() => navigate(i.action)}
                    className="shrink-0 px-2 py-2.5 text-ink-300 hover:text-gold-700"
                    aria-label={`Go to ${i.label}`}
                  >
                    <Icon name="chevronRight" size={18} />
                  </button>
                )}
              </div>
            )
          })}
        </div>
      </div>

      {/* network access — dark card */}
      <button
        onClick={() => navigate('/events')}
        className="relative mb-6 w-full overflow-hidden rounded-md bg-navy-grad p-5 text-left shadow-navy active:scale-[0.99]"
      >
        <div
          className="pointer-events-none absolute inset-0 opacity-40"
          style={{ background: 'radial-gradient(120% 80% at 85% 10%, rgba(254,215,82,0.35) 0%, rgba(4,18,46,0) 55%)' }}
        />
        <div className="relative">
          <span className="text-[10px] font-semibold uppercase tracking-[0.18em] text-gold-300">Network access</span>
          <h3 className="mt-1.5 text-headline-sm font-semibold text-white">Join the Next Round Table</h3>
          <p className="mt-1 max-w-[16rem] text-xs text-navy-200">
            The heart of the Circle — good food, deep conversation, no agenda.
          </p>
          <span className="mt-3 inline-flex items-center gap-1.5 text-xs font-semibold text-gold-300">
            See upcoming gatherings <Icon name="arrowRight" size={14} />
          </span>
        </div>
      </button>

      {/* archetype / assessment CTA */}
      {arch ? (
        <button onClick={() => navigate('/assessment/result')} className="card mb-4 flex w-full items-center gap-4 p-4 text-left active:scale-[0.99]">
          <div className="flex h-14 w-14 items-center justify-center rounded-md bg-navy text-2xl text-gold-300">{arch.glyph}</div>
          <div className="min-w-0 flex-1">
            <div className="eyebrow">Your Builder Archetype</div>
            <div className="text-headline-sm text-navy">{arch.name}</div>
            <div className="truncate text-xs text-ink-600">{arch.tagline}</div>
          </div>
          <Icon name="chevronRight" size={18} className="text-ink-200" />
        </button>
      ) : (
        <button onClick={() => navigate('/assessment')} className="mb-4 flex w-full items-center gap-4 rounded-md border border-gold-300 bg-gold-100 p-4 text-left active:scale-[0.99]">
          <div className="flex h-14 w-14 items-center justify-center rounded-md bg-gold-grad text-navy"><Icon name="sparkle" size={26} /></div>
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
          <button key={q.label} onClick={() => navigate(q.to)} className="card-flat flex flex-col items-center gap-2 py-4 active:scale-[0.97]">
            <Icon name={q.icon} size={22} className="text-gold-700" />
            <span className="text-[11px] font-semibold text-ink-600">{q.label}</span>
          </button>
        ))}
      </div>

      {/* builder tools (Phase 2) */}
      <SectionTitle title="Builder tools" navigate={navigate} />
      <div className="mb-6 grid grid-cols-2 gap-3">
        {TOOLS.map((t) => (
          <button
            key={t.to}
            onClick={() => navigate(t.to)}
            className="card flex items-center gap-3 p-3.5 text-left active:scale-[0.99]"
          >
            <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-md bg-navy text-gold-300">
              <Icon name={t.icon} size={19} />
            </span>
            <span className="min-w-0 flex-1 text-sm font-semibold leading-tight text-navy">{t.label}</span>
          </button>
        ))}
      </div>

      {/* builder introduction (Phase 2 taste) */}
      {suggestion && (
        <>
          <SectionTitle title="Builder introduction" navigate={navigate} />
          <div className="card mb-6 p-4">
            <div className="flex items-center gap-3.5">
              <Avatar member={suggestion} size={50} />
              <div className="min-w-0 flex-1">
                <div className="text-sm font-semibold text-navy">You should meet {suggestion.name.split(' ')[0]}</div>
                <div className="truncate text-xs text-ink-600">
                  Shared interest · {suggestion.expertise.find((e) => user.expertise.includes(e)) || suggestion.expertise[0]}
                </div>
              </div>
            </div>
            <div className="mt-3 grid grid-cols-2 gap-2.5">
              <button onClick={() => navigate(`/member/${suggestion.id}`)} className="btn-ghost py-2.5 text-xs">View profile</button>
              <button onClick={() => toast(`Intro requested with ${suggestion.name.split(' ')[0]}`, { icon: 'handshake' })} className="btn-navy py-2.5 text-xs">Request intro</button>
            </div>
          </div>
        </>
      )}

      {/* founder dashboard */}
      {isFounder && (
        <button onClick={() => navigate('/founder')} className="mb-6 flex w-full items-center gap-3 rounded-md border border-line-subtle bg-paper-0 p-4 shadow-card active:scale-[0.99]">
          <span className="flex h-10 w-10 items-center justify-center rounded-md bg-gold-100 text-gold-700"><Icon name="gauge" size={20} /></span>
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

      <NotificationsSheet open={showNotifs} onClose={() => setShowNotifs(false)} />
    </Page>
  )
}

function SectionTitle({ title, to, navigate }) {
  return (
    <div className="mb-3 flex items-center justify-between">
      <h2 className="h-display text-headline-sm">{title}</h2>
      {to && <button onClick={() => navigate(to)} className="text-xs font-semibold text-gold-700">See all</button>}
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
