import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import Avatar from './ui/Avatar'
import Icon from './ui/Icon'
import { CommentsSheet } from './sheets'
import { memberById, FEED_TYPES, RESOURCE_FORMATS } from '../data/mockData'
import { ARCHETYPES } from '../data/archetypes'
import { useStore } from '../store/useStore'
import { toast } from '../store/useToast'

// ---- Feed post -------------------------------------------------------------
export function FeedCard({ post }) {
  const author = memberById(post.authorId)
  const meta = FEED_TYPES[post.type]
  const cheered = useStore((s) => s.cheered[post.id])
  const toggleCheer = useStore((s) => s.toggleCheer)
  const navigate = useNavigate()
  const [showComments, setShowComments] = useState(false)

  const onCheer = () => {
    toggleCheer(post.id)
    if (!cheered) toast('You cheered this', { icon: 'heart' })
  }

  return (
    <motion.article layout className="card p-4">
      <div className="mb-3 flex items-center gap-3">
        <button onClick={() => navigate(`/member/${author.id}`)}>
          <Avatar member={author} size={42} />
        </button>
        <div className="min-w-0 flex-1">
          <span className="block truncate text-sm font-semibold text-navy">{author.name}</span>
          <span className="block truncate text-xs text-ink-400">{author.role} · {post.time}</span>
        </div>
        <span className={meta.tone === 'gold' ? 'chip-gold' : 'chip'}>
          <span>{meta.glyph}</span>
          {meta.label}
        </span>
      </div>
      <p className="text-body-md text-ink-700">{post.body}</p>
      <div className="mt-4 flex items-center gap-5 text-ink-400">
        <button
          onClick={onCheer}
          className={`flex items-center gap-1.5 text-xs font-medium transition-colors active:scale-95 ${
            cheered ? 'text-gold-600' : 'hover:text-ink-600'
          }`}
          aria-pressed={cheered}
          aria-label="Cheer this post"
        >
          <Icon name="heart" size={17} strokeWidth={cheered ? 2.2 : 1.7} />
          {post.cheers}
        </button>
        <button
          onClick={() => setShowComments(true)}
          className="flex items-center gap-1.5 text-xs font-medium hover:text-ink-600 active:scale-95"
          aria-label="View comments"
        >
          <Icon name="comment" size={17} /> {post.comments}
        </button>
        <button
          onClick={() => toast('Link copied', { icon: 'share' })}
          className="ml-auto hover:text-ink-600"
          aria-label="Share"
        >
          <Icon name="share" size={16} />
        </button>
      </div>

      <CommentsSheet postId={post.id} open={showComments} onClose={() => setShowComments(false)} />
    </motion.article>
  )
}

// ---- date helper -----------------------------------------------------------
export function formatDate(iso) {
  const [y, m, d] = iso.split('-').map(Number)
  const date = new Date(y, m - 1, d)
  return {
    day: date.toLocaleDateString('en-GB', { day: '2-digit' }),
    mon: date.toLocaleDateString('en-GB', { month: 'short' }).toUpperCase(),
    weekday: date.toLocaleDateString('en-GB', { weekday: 'short' }),
  }
}

// ---- Event card ------------------------------------------------------------
export function EventCard({ event, compact = false }) {
  const navigate = useNavigate()
  const going = useStore((s) => !!s.rsvps[event.id])
  const d = formatDate(event.date)

  return (
    <button
      onClick={() => navigate(`/event/${event.id}`)}
      className="card flex w-full items-stretch gap-4 p-4 text-left transition-shadow active:scale-[0.99] hover:shadow-card-hover"
    >
      <div className="flex w-14 shrink-0 flex-col items-center justify-center rounded-md bg-navy py-2 text-white">
        <span className="font-display text-2xl font-bold leading-none">{d.day}</span>
        <span className="mt-1 text-[9px] font-semibold tracking-widest2 text-gold-300">{d.mon}</span>
      </div>
      <div className="min-w-0 flex-1">
        <span className="eyebrow">{event.kind}</span>
        <h3 className="mt-0.5 truncate text-sm font-semibold leading-snug text-navy">{event.title}</h3>
        <div className="mt-1.5 flex items-center gap-3 text-[11px] text-ink-400">
          <span className="flex items-center gap-1"><Icon name="clock" size={13} /> {event.time}</span>
          <span className="flex items-center gap-1"><Icon name="pin" size={13} /> {event.mode}</span>
        </div>
        {!compact && (
          <div className="mt-2.5">
            <Going going={going} count={event.going.length + (going ? 1 : 0)} />
          </div>
        )}
      </div>
      <Icon name="chevronRight" size={18} className="self-center text-ink-200" />
    </button>
  )
}

function Going({ going, count }) {
  return (
    <span
      className={`inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-[10px] font-semibold ${
        going ? 'bg-gold-100 text-gold-700' : 'bg-paper-200 text-ink-400'
      }`}
    >
      {going && <Icon name="check" size={11} strokeWidth={2.6} />}
      {going ? 'You’re going · ' : ''}
      {count} attending
    </span>
  )
}

// ---- Member row ------------------------------------------------------------
export function MemberRow({ member }) {
  const navigate = useNavigate()
  const arch = member.archetype ? ARCHETYPES[member.archetype] : null
  return (
    <button
      onClick={() => navigate(`/member/${member.id}`)}
      className="card flex w-full items-center gap-3.5 p-3.5 text-left transition-shadow active:scale-[0.99] hover:shadow-card-hover"
    >
      <Avatar member={member} size={50} />
      <div className="min-w-0 flex-1">
        <div className="flex items-center gap-2">
          <span className="truncate text-sm font-semibold text-navy">{member.name}</span>
          {arch && <span className="text-gold-600" title={arch.name}>{arch.glyph}</span>}
        </div>
        <div className="truncate text-xs text-ink-600">{member.profession}</div>
        <div className="mt-1 flex items-center gap-1 text-[11px] text-ink-400">
          <Icon name="pin" size={12} /> {member.location}
        </div>
      </div>
      <Icon name="chevronRight" size={18} className="text-ink-200" />
    </button>
  )
}

// ---- Opportunity card ------------------------------------------------------
export function OpportunityCard({ opp }) {
  const poster = memberById(opp.posterId)
  return (
    <div className="card p-4">
      <div className="mb-2 flex items-center justify-between">
        <span className="chip-gold">{opp.kind}</span>
        <span className="text-[11px] text-ink-400">{opp.posted} ago</span>
      </div>
      <h3 className="text-[15px] font-semibold leading-snug text-navy">{opp.title}</h3>
      <p className="mt-1 text-xs text-ink-600">{opp.org}</p>
      <p className="mt-2.5 text-body-sm text-ink-700">{opp.detail}</p>
      <div className="mt-3 flex flex-wrap gap-1.5">
        {opp.tags.map((t) => (
          <span key={t} className="chip">{t}</span>
        ))}
      </div>
      <div className="mt-3 flex items-center gap-2 border-t border-line-subtle pt-3">
        <Avatar member={poster} size={26} ring={false} />
        <span className="text-[11px] text-ink-400">Shared by {poster?.name}</span>
        <button
          onClick={() => toast(`Reached out about “${opp.title}”`, { icon: 'send' })}
          className="ml-auto flex items-center gap-1 text-[11px] font-semibold text-gold-700 active:scale-95"
        >
          Reach out <Icon name="arrowRight" size={13} />
        </button>
      </div>
    </div>
  )
}

// ---- Resource card ---------------------------------------------------------
export function ResourceCard({ res }) {
  return (
    <div className="card flex items-center gap-3.5 p-3.5">
      <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-md bg-gold-100 text-lg text-gold-700">
        {RESOURCE_FORMATS[res.format] || '◈'}
      </div>
      <div className="min-w-0 flex-1">
        <h3 className="truncate text-sm font-semibold text-navy">{res.title}</h3>
        <div className="truncate text-xs text-ink-600">{res.author} · {res.format}</div>
        <div className="mt-0.5 text-[11px] text-ink-400">{res.minutes} min · {res.topic}</div>
      </div>
      <Icon name="arrowRight" size={17} className="text-ink-200" />
    </div>
  )
}
