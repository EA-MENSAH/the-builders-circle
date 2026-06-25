import { useState } from 'react'
import Sheet from './ui/Sheet'
import Avatar from './ui/Avatar'
import Icon from './ui/Icon'
import { useStore } from '../store/useStore'
import { toast } from '../store/useToast'
import { memberById } from '../data/mockData'

// ---- Edit Profile ----------------------------------------------------------
export function EditProfileSheet({ open, onClose }) {
  const user = useStore((s) => s.user)
  const updateUser = useStore((s) => s.updateUser)
  const [form, setForm] = useState(user)

  const field = (k) => ({
    value: form[k] || '',
    onChange: (e) => setForm((f) => ({ ...f, [k]: e.target.value })),
  })

  const save = () => {
    updateUser({
      ...form,
      expertise: String(form.expertise)
        .split(',')
        .map((s) => s.trim())
        .filter(Boolean),
    })
    toast('Profile updated')
    onClose()
  }

  return (
    <Sheet open={open} onClose={onClose} eyebrow="Your Builder profile" title="Edit profile">
      <div className="space-y-4 pt-1">
        <Labeled label="Full name"><input className="input" {...field('name')} /></Labeled>
        <Labeled label="Profession"><input className="input" {...field('profession')} /></Labeled>
        <Labeled label="Location"><input className="input" {...field('location')} /></Labeled>
        <Labeled label="What are you building?">
          <textarea rows={2} className="input resize-none" {...field('building')} />
        </Labeled>
        <Labeled label="How can you help others?">
          <textarea rows={2} className="input resize-none" {...field('canHelp')} />
        </Labeled>
        <Labeled label="Areas of expertise (comma-separated)">
          <input
            className="input"
            value={Array.isArray(form.expertise) ? form.expertise.join(', ') : form.expertise}
            onChange={(e) => setForm((f) => ({ ...f, expertise: e.target.value }))}
          />
        </Labeled>
        <button onClick={save} className="btn-navy w-full">Save changes</button>
      </div>
    </Sheet>
  )
}

function Labeled({ label, children }) {
  return (
    <div>
      <label className="eyebrow mb-2 block">{label}</label>
      {children}
    </div>
  )
}

// ---- Comments --------------------------------------------------------------
export function CommentsSheet({ postId, open, onClose }) {
  const comments = useStore((s) => (postId ? s.comments[postId] : null)) || []
  const addComment = useStore((s) => s.addComment)
  const user = useStore((s) => s.user)
  const [text, setText] = useState('')

  const send = () => {
    if (!text.trim()) return
    addComment(postId, text.trim())
    setText('')
    toast('Comment added', { icon: 'comment' })
  }

  return (
    <Sheet open={open} onClose={onClose} title="Comments" maxHeight="80%">
      <div className="space-y-4 pt-1">
        {comments.length === 0 && (
          <p className="py-6 text-center text-sm text-ink-400">
            No comments yet — be the first to encourage this builder.
          </p>
        )}
        {comments.map((c) => {
          const author = memberById(c.authorId)
          return (
            <div key={c.id} className="flex gap-3">
              <Avatar member={author} size={36} ring={false} />
              <div className="min-w-0 flex-1">
                <div className="flex items-center gap-2">
                  <span className="text-sm font-semibold text-navy">{author?.name}</span>
                  <span className="text-[11px] text-ink-400">{c.time}</span>
                </div>
                <p className="text-body-sm text-ink-700">{c.body}</p>
              </div>
            </div>
          )
        })}

        <div className="flex items-center gap-2 border-t border-line-subtle pt-3">
          <Avatar member={user} size={34} ring={false} />
          <input
            value={text}
            onChange={(e) => setText(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && send()}
            placeholder="Add a comment…"
            className="input flex-1 py-2.5"
          />
          <button
            onClick={send}
            disabled={!text.trim()}
            className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-navy text-white disabled:opacity-40"
            aria-label="Send comment"
          >
            <Icon name="send" size={17} />
          </button>
        </div>
      </div>
    </Sheet>
  )
}

// ---- Notifications ---------------------------------------------------------
const NOTIFS = [
  { id: 'n1', icon: 'heart', who: 'Kwame Adjei', text: 'cheered your introduction post.', time: '12m' },
  { id: 'n2', icon: 'calendar', who: 'Builder’s Table', text: 'is in 3 days — don’t forget to RSVP.', time: '1h' },
  { id: 'n3', icon: 'groups', who: 'Ama Serwaa', text: 'wants to connect with you.', time: '3h' },
  { id: 'n4', icon: 'sparkle', who: 'New introduction', text: 'You should meet Tunde Bello.', time: '5h' },
  { id: 'n5', icon: 'briefcase', who: 'Opportunity', text: 'A new analyst role matches your profile.', time: '1d' },
]

export function NotificationsSheet({ open, onClose }) {
  return (
    <Sheet open={open} onClose={onClose} eyebrow="The Circle" title="Notifications">
      <div className="space-y-2.5 pt-1">
        {NOTIFS.map((n) => (
          <div key={n.id} className="flex items-start gap-3 rounded-md border border-line-subtle bg-paper-0 p-3.5">
            <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-gold-100 text-gold-700">
              <Icon name={n.icon} size={17} />
            </span>
            <div className="min-w-0 flex-1">
              <p className="text-body-sm text-ink-700">
                <span className="font-semibold text-navy">{n.who}</span> {n.text}
              </p>
              <span className="text-[11px] text-ink-400">{n.time} ago</span>
            </div>
          </div>
        ))}
      </div>
    </Sheet>
  )
}
