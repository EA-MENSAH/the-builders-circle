import { useParams, useNavigate } from 'react-router-dom'
import Page from '../components/layout/Page'
import ScreenHeader from '../components/layout/ScreenHeader'
import Avatar from '../components/ui/Avatar'
import Icon from '../components/ui/Icon'
import { useStore } from '../store/useStore'
import { toast } from '../store/useToast'
import { memberById, PROJECT_STATUS_TONE } from '../data/mockData'

export default function SpaceDetail() {
  const { id } = useParams()
  const navigate = useNavigate()
  const spaces = useStore((s) => s.projectSpaces)
  const joined = useStore((s) => !!s.joinedSpaces[id])
  const toggleSpace = useStore((s) => s.toggleSpace)
  const sp = spaces.find((x) => x.id === id)
  if (!sp) return <Page><ScreenHeader back title="Not found" /></Page>

  const owner = memberById(sp.ownerId)
  const members = sp.memberIds.map(memberById).filter(Boolean)
  const tone = PROJECT_STATUS_TONE[sp.status] || 'muted'
  const toneCls = tone === 'gold' ? 'bg-gold-100 text-gold-700' : tone === 'navy' ? 'bg-navy text-white' : 'bg-paper-200 text-ink-500'

  return (
    <Page>
      <ScreenHeader back eyebrow="Project Space" />
      <div className="flex items-start justify-between gap-3 pb-1">
        <h1 className="h-display text-display-hero">{sp.name}</h1>
        <span className={`mt-1 shrink-0 rounded-full px-2.5 py-1 text-[10px] font-semibold ${toneCls}`}>{sp.status}</span>
      </div>
      <p className="mt-2 text-body-md text-ink-600">{sp.desc}</p>
      <div className="mt-2 text-xs text-ink-400">Led by {owner?.name || 'you'}</div>

      <button
        onClick={() => { toggleSpace(id); toast(joined ? 'Left the space' : 'Joined the space', { icon: joined ? 'plus' : 'check' }) }}
        className={joined ? 'btn-ghost mt-4 w-full' : 'btn-navy mt-4 w-full'}
      >
        {joined ? <><Icon name="check" size={18} strokeWidth={2.2} /> Collaborating — tap to leave</> : 'Join this space'}
      </button>

      <div className="card mt-5 p-4">
        <div className="mb-3 eyebrow">Collaborators</div>
        <div className="flex flex-wrap gap-3">
          {members.map((m) => (
            <button key={m.id} onClick={() => navigate(`/member/${m.id}`)} className="flex w-14 flex-col items-center gap-1">
              <Avatar member={m} size={40} ring={false} />
              <span className="w-full truncate text-center text-[10px] text-ink-400">{m.name.split(' ')[0]}</span>
            </button>
          ))}
        </div>
      </div>

      <div className="mt-5 mb-3 flex items-center justify-between">
        <h2 className="h-display text-headline-sm">Updates</h2>
        <button onClick={() => toast('Update posted', { icon: 'send' })} className="text-xs font-semibold text-gold-700">Post update</button>
      </div>
      <div className="space-y-3 pb-6">
        {sp.updates.length === 0 && <p className="py-6 text-center text-sm text-ink-400">No updates yet — share the first milestone.</p>}
        {sp.updates.map((u) => {
          const author = memberById(u.authorId)
          return (
            <div key={u.id} className="card p-4">
              <div className="flex items-center gap-2.5">
                <Avatar member={author} size={32} ring={false} />
                <div className="truncate text-xs text-ink-400">{author?.name} · {u.time}</div>
              </div>
              <p className="mt-2 text-body-sm text-ink-700">{u.body}</p>
            </div>
          )
        })}
      </div>
    </Page>
  )
}
