import { useState } from 'react'
import Page from '../components/layout/Page'
import ScreenHeader from '../components/layout/ScreenHeader'
import Avatar from '../components/ui/Avatar'
import Icon from '../components/ui/Icon'
import { useStore } from '../store/useStore'
import { toast } from '../store/useToast'
import { memberById } from '../data/mockData'

const ROWS = [
  { key: 'building', label: 'I’m building', icon: 'trendingUp' },
  { key: 'need', label: 'I need', icon: 'target' },
  { key: 'offer', label: 'I can offer', icon: 'handshake' },
]

export default function Marketplace() {
  const marketplace = useStore((s) => s.marketplace)
  const addMarketplacePost = useStore((s) => s.addMarketplacePost)
  const [open, setOpen] = useState(false)
  const [form, setForm] = useState({ building: '', need: '', offer: '' })

  const post = () => {
    if (!form.building.trim()) return
    addMarketplacePost(form)
    setForm({ building: '', need: '', offer: '' })
    setOpen(false)
    toast('Posted to the Marketplace')
  }

  return (
    <Page>
      <ScreenHeader back eyebrow="Lift Up · Collaborate" title="Marketplace" />
      <p className="-mt-1 mb-4 text-body-md text-ink-600">
        What members are building, what they need, and what they can offer. Find your next collaboration.
      </p>

      {open ? (
        <div className="card mb-4 p-4">
          {ROWS.map((r) => (
            <div key={r.key} className="mb-3">
              <label className="eyebrow mb-1.5 block">{r.label}</label>
              <textarea
                rows={2}
                value={form[r.key]}
                onChange={(e) => setForm((f) => ({ ...f, [r.key]: e.target.value }))}
                placeholder={`${r.label}…`}
                className="input resize-none"
              />
            </div>
          ))}
          <div className="flex justify-end gap-2">
            <button onClick={() => setOpen(false)} className="btn-ghost px-4 py-2 text-xs">Cancel</button>
            <button onClick={post} className="btn-navy px-5 py-2 text-xs">Post</button>
          </div>
        </div>
      ) : (
        <button onClick={() => setOpen(true)} className="btn-navy mb-5 w-full">
          <Icon name="plus" size={18} strokeWidth={2.2} /> Share what you’re building
        </button>
      )}

      <div className="space-y-3 pb-6">
        {marketplace.map((p) => {
          const author = memberById(p.authorId)
          return (
            <div key={p.id} className="card p-4">
              <div className="mb-3 flex items-center gap-3">
                <Avatar member={author} size={40} />
                <div className="min-w-0 flex-1">
                  <div className="truncate text-sm font-semibold text-navy">{author?.name}</div>
                  <div className="truncate text-xs text-ink-400">{author?.profession} · {p.time}</div>
                </div>
              </div>
              <div className="space-y-2.5">
                {ROWS.map((r) =>
                  p[r.key] ? (
                    <div key={r.key} className="flex gap-2.5">
                      <span className="mt-0.5 flex h-6 w-6 shrink-0 items-center justify-center rounded-md bg-gold-100 text-gold-700">
                        <Icon name={r.icon} size={13} />
                      </span>
                      <div className="min-w-0">
                        <div className="text-[10px] font-semibold uppercase tracking-wider text-ink-400">{r.label}</div>
                        <div className="text-body-sm text-ink-700">{p[r.key]}</div>
                      </div>
                    </div>
                  ) : null
                )}
              </div>
              <button
                onClick={() => toast(`Connected with ${author?.name.split(' ')[0]} on this`, { icon: 'handshake' })}
                className="btn-ghost mt-3 w-full py-2.5 text-xs"
              >
                Offer to help <Icon name="arrowRight" size={14} />
              </button>
            </div>
          )
        })}
      </div>
    </Page>
  )
}
