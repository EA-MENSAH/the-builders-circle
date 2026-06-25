import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import Page from '../components/layout/Page'
import ScreenHeader from '../components/layout/ScreenHeader'
import Sheet from '../components/ui/Sheet'
import Icon from '../components/ui/Icon'
import { useStore } from '../store/useStore'
import { toast } from '../store/useToast'
import { memberById, PROJECT_STATUS_TONE } from '../data/mockData'

function StatusChip({ status }) {
  const tone = PROJECT_STATUS_TONE[status] || 'muted'
  const cls = tone === 'gold' ? 'bg-gold-100 text-gold-700' : tone === 'navy' ? 'bg-navy text-white' : 'bg-paper-200 text-ink-500'
  return <span className={`rounded-full px-2 py-0.5 text-[10px] font-semibold ${cls}`}>{status}</span>
}

export default function Spaces() {
  const navigate = useNavigate()
  const spaces = useStore((s) => s.projectSpaces)
  const joinedSpaces = useStore((s) => s.joinedSpaces)
  const addProjectSpace = useStore((s) => s.addProjectSpace)
  const [open, setOpen] = useState(false)
  const [name, setName] = useState('')
  const [desc, setDesc] = useState('')

  const create = () => {
    if (!name.trim()) return
    addProjectSpace({ name: name.trim(), desc: desc.trim() })
    setName(''); setDesc(''); setOpen(false)
    toast('Project space created')
  }

  return (
    <Page>
      <ScreenHeader back eyebrow="Lift Up · Collaborate" title="Project Spaces" />
      <p className="-mt-1 mb-4 text-body-md text-ink-600">
        Dedicated spaces for member-led initiatives. Build together, in the open.
      </p>

      <button onClick={() => setOpen(true)} className="btn-navy mb-5 w-full">
        <Icon name="plus" size={18} strokeWidth={2.2} /> Start a project space
      </button>

      <div className="space-y-3 pb-6">
        {spaces.map((sp) => {
          const owner = memberById(sp.ownerId)
          const joined = !!joinedSpaces[sp.id]
          const count = sp.memberIds.length + (joined && !sp.memberIds.includes('m-you') ? 1 : 0)
          return (
            <button key={sp.id} onClick={() => navigate(`/space/${sp.id}`)} className="card w-full p-4 text-left active:scale-[0.99]">
              <div className="flex items-center gap-2">
                <h3 className="text-sm font-semibold text-navy">{sp.name}</h3>
                <StatusChip status={sp.status} />
                <Icon name="chevronRight" size={18} className="ml-auto text-ink-200" />
              </div>
              <p className="mt-1.5 line-clamp-2 text-xs text-ink-600">{sp.desc}</p>
              <div className="mt-2 text-[11px] text-ink-400">Led by {owner?.name?.split(' ')[0] || 'you'} · {count} collaborators</div>
            </button>
          )
        })}
      </div>

      <Sheet open={open} onClose={() => setOpen(false)} eyebrow="What I’m building" title="Start a project space">
        <div className="space-y-4 pt-1">
          <div>
            <label className="eyebrow mb-2 block">Name</label>
            <input value={name} onChange={(e) => setName(e.target.value)} placeholder="e.g. Builder Scholarships" className="input" />
          </div>
          <div>
            <label className="eyebrow mb-2 block">What is it?</label>
            <textarea rows={3} value={desc} onChange={(e) => setDesc(e.target.value)} placeholder="A short description of the initiative…" className="input resize-none" />
          </div>
          <button onClick={create} disabled={!name.trim()} className="btn-navy w-full">Create space</button>
        </div>
      </Sheet>
    </Page>
  )
}
