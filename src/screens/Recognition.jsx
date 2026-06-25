import { useState } from 'react'
import Page from '../components/layout/Page'
import ScreenHeader from '../components/layout/ScreenHeader'
import Sheet from '../components/ui/Sheet'
import Avatar from '../components/ui/Avatar'
import Icon from '../components/ui/Icon'
import { useStore } from '../store/useStore'
import { toast } from '../store/useToast'
import { MEMBERS, memberById, RECOGNITION_TYPES } from '../data/mockData'

export default function Recognition() {
  const recognitions = useStore((s) => s.recognitions)
  const giveRecognition = useStore((s) => s.giveRecognition)
  const [open, setOpen] = useState(false)
  const [toId, setToId] = useState(MEMBERS[0].id)
  const [type, setType] = useState('contribution')
  const [note, setNote] = useState('')

  const submit = () => {
    if (!note.trim()) return
    giveRecognition({ toId, type, note: note.trim() })
    setNote('')
    setOpen(false)
    toast(`Recognised ${memberById(toId)?.name.split(' ')[0]}`, { icon: 'heart' })
  }

  return (
    <Page>
      <ScreenHeader back eyebrow="Lift Up · Celebrate" title="Recognition" />
      <p className="-mt-1 mb-4 text-body-md text-ink-600">
        Celebrate the builders who contribute, lead, mentor, and create impact for the Circle.
      </p>

      <button onClick={() => setOpen(true)} className="btn-navy mb-5 w-full">
        <Icon name="heart" size={18} /> Recognise a builder
      </button>

      <div className="space-y-3 pb-6">
        {recognitions.map((r) => {
          const from = memberById(r.fromId)
          const to = memberById(r.toId)
          const meta = RECOGNITION_TYPES[r.type]
          return (
            <div key={r.id} className="card p-4">
              <div className="mb-3 flex items-center gap-2">
                <span className="chip-gold"><Icon name={meta.icon} size={12} /> {meta.label}</span>
                <span className="ml-auto text-[11px] text-ink-400">{r.time} ago</span>
              </div>
              <div className="flex items-center gap-2.5">
                <Avatar member={from} size={32} ring={false} />
                <Icon name="arrowRight" size={16} className="text-ink-300" />
                <Avatar member={to} size={40} />
                <div className="min-w-0">
                  <div className="truncate text-sm font-semibold text-navy">{to?.name}</div>
                  <div className="truncate text-[11px] text-ink-400">from {from?.name}</div>
                </div>
              </div>
              <p className="mt-3 border-l-2 border-gold-300 pl-3 text-body-sm italic text-ink-700">“{r.note}”</p>
            </div>
          )
        })}
      </div>

      <Sheet open={open} onClose={() => setOpen(false)} eyebrow="Lift as you climb" title="Recognise a builder">
        <div className="space-y-4 pt-1">
          <div>
            <label className="eyebrow mb-2 block">Builder</label>
            <select value={toId} onChange={(e) => setToId(e.target.value)} className="input">
              {MEMBERS.map((m) => (<option key={m.id} value={m.id}>{m.name}</option>))}
            </select>
          </div>
          <div>
            <label className="eyebrow mb-2 block">For</label>
            <div className="flex flex-wrap gap-2">
              {Object.entries(RECOGNITION_TYPES).map(([k, v]) => (
                <button key={k} onClick={() => setType(k)} className={type === k ? 'chip-gold' : 'chip'}>
                  <Icon name={v.icon} size={12} /> {v.label}
                </button>
              ))}
            </div>
          </div>
          <div>
            <label className="eyebrow mb-2 block">Note</label>
            <textarea rows={3} value={note} onChange={(e) => setNote(e.target.value)} placeholder="What did they do that mattered?" className="input resize-none" />
          </div>
          <button onClick={submit} disabled={!note.trim()} className="btn-navy w-full">Give recognition</button>
        </div>
      </Sheet>
    </Page>
  )
}
