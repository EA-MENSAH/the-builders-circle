import { useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import Page from '../components/layout/Page'
import ScreenHeader from '../components/layout/ScreenHeader'
import Segmented from '../components/ui/Segmented'
import Icon from '../components/ui/Icon'
import { FeedCard, MemberRow } from '../components/cards'
import { useStore } from '../store/useStore'
import { toast } from '../store/useToast'
import { MEMBERS } from '../data/mockData'

export default function Circle() {
  const [tab, setTab] = useState('feed')
  return (
    <Page>
      <ScreenHeader eyebrow="Link Up · Belong" title="The Circle" />
      <Segmented
        value={tab}
        onChange={setTab}
        options={[
          { value: 'feed', label: 'Feed' },
          { value: 'directory', label: 'Directory' },
        ]}
      />
      <AnimatePresence mode="wait">
        {tab === 'feed' ? (
          <motion.div key="feed" {...fade}><Feed /></motion.div>
        ) : (
          <motion.div key="dir" {...fade}><Directory /></motion.div>
        )}
      </AnimatePresence>
    </Page>
  )
}

const fade = {
  initial: { opacity: 0, y: 8 },
  animate: { opacity: 1, y: 0 },
  exit: { opacity: 0, y: -8 },
  transition: { duration: 0.25 },
}

const POST_TYPES = [
  { type: 'win', label: 'Win', glyph: '◆' },
  { type: 'opportunity', label: 'Opportunity', glyph: '⟡' },
  { type: 'resource', label: 'Resource', glyph: '❖' },
  { type: 'update', label: 'Update', glyph: '◈' },
]

function Feed() {
  const feed = useStore((s) => s.feed)
  const addPost = useStore((s) => s.addPost)
  const [open, setOpen] = useState(false)
  const [type, setType] = useState('win')
  const [body, setBody] = useState('')

  const share = () => {
    if (!body.trim()) return
    addPost(type, body.trim())
    setBody('')
    setOpen(false)
    toast('Shared with the Circle')
  }

  return (
    <div className="space-y-3 pb-6 pt-1">
      {open ? (
        <div className="card p-4">
          <div className="mb-3 flex flex-wrap gap-2">
            {POST_TYPES.map((p) => (
              <button key={p.type} onClick={() => setType(p.type)} className={type === p.type ? 'chip-gold' : 'chip'}>
                <span>{p.glyph}</span> {p.label}
              </button>
            ))}
          </div>
          <textarea
            autoFocus
            value={body}
            onChange={(e) => setBody(e.target.value)}
            placeholder="Share a win, opportunity, resource, or update…"
            rows={3}
            className="input resize-none"
          />
          <div className="mt-3 flex justify-end gap-2">
            <button onClick={() => setOpen(false)} className="btn-ghost px-4 py-2 text-xs">Cancel</button>
            <button onClick={share} className="btn-navy px-5 py-2 text-xs">Share</button>
          </div>
        </div>
      ) : (
        <button
          onClick={() => setOpen(true)}
          className="card flex w-full items-center gap-3 p-4 text-left active:scale-[0.99]"
        >
          <span className="flex h-9 w-9 items-center justify-center rounded-full bg-navy text-white">
            <Icon name="plus" size={18} strokeWidth={2.4} />
          </span>
          <span className="text-sm text-ink-400">Share something with the Circle…</span>
        </button>
      )}

      {feed.map((p) => (
        <FeedCard key={p.id} post={p} />
      ))}
    </div>
  )
}

function Directory() {
  const [q, setQ] = useState('')
  const [foundersOnly, setFoundersOnly] = useState(false)
  const query = q.trim().toLowerCase()

  const results = MEMBERS.filter((m) => {
    if (foundersOnly && !m.founder) return false
    if (!query) return true
    return (
      m.name.toLowerCase().includes(query) ||
      m.profession.toLowerCase().includes(query) ||
      m.location.toLowerCase().includes(query) ||
      m.expertise.some((e) => e.toLowerCase().includes(query))
    )
  })

  return (
    <div className="pb-6 pt-1">
      <div className="relative mb-3">
        <Icon name="search" size={17} className="absolute left-4 top-1/2 -translate-y-1/2 text-ink-400" />
        <input
          value={q}
          onChange={(e) => setQ(e.target.value)}
          placeholder="Search name, skill, or city…"
          className="input pl-11"
        />
      </div>
      <div className="mb-4 flex items-center justify-between">
        <span className="text-xs text-ink-400">{results.length} builders</span>
        <button onClick={() => setFoundersOnly((v) => !v)} className={foundersOnly ? 'chip-gold' : 'chip'}>
          ✦ Founders
        </button>
      </div>
      <div className="space-y-3">
        {results.map((m) => (
          <MemberRow key={m.id} member={m} />
        ))}
        {results.length === 0 && (
          <p className="py-10 text-center text-sm text-ink-400">No builders match that search.</p>
        )}
      </div>
    </div>
  )
}
