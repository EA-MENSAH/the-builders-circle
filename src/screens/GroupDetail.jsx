import { useParams, useNavigate } from 'react-router-dom'
import Page from '../components/layout/Page'
import ScreenHeader from '../components/layout/ScreenHeader'
import Avatar from '../components/ui/Avatar'
import Icon from '../components/ui/Icon'
import { useStore } from '../store/useStore'
import { toast } from '../store/useToast'
import { DISCUSSION_GROUPS, memberById } from '../data/mockData'

export default function GroupDetail() {
  const { id } = useParams()
  const navigate = useNavigate()
  const joined = useStore((s) => !!s.joinedGroups[id])
  const toggleGroup = useStore((s) => s.toggleGroup)
  const g = DISCUSSION_GROUPS.find((x) => x.id === id)
  if (!g) return <Page><ScreenHeader back title="Not found" /></Page>

  const members = g.memberIds.map(memberById).filter(Boolean)
  const count = members.length + (joined ? 1 : 0)

  return (
    <Page>
      <ScreenHeader back eyebrow="Discussion Group" />
      <div className="flex items-center gap-3.5 pb-1">
        <span className="flex h-14 w-14 shrink-0 items-center justify-center rounded-md bg-navy text-gold-300">
          <Icon name={g.icon} size={26} />
        </span>
        <div className="min-w-0">
          <h1 className="h-display text-headline-sm">{g.name}</h1>
          <div className="text-xs text-ink-400">{count} members</div>
        </div>
      </div>
      <p className="mt-3 text-body-md text-ink-600">{g.desc}</p>

      <button
        onClick={() => { toggleGroup(id); toast(joined ? `Left ${g.name}` : `Joined ${g.name}`, { icon: joined ? 'plus' : 'check' }) }}
        className={joined ? 'btn-ghost mt-4 w-full' : 'btn-navy mt-4 w-full'}
      >
        {joined ? <><Icon name="check" size={18} strokeWidth={2.2} /> Joined — tap to leave</> : 'Join this group'}
      </button>

      {/* members */}
      <div className="card mt-5 p-4">
        <div className="mb-3 eyebrow">Members</div>
        <div className="flex flex-wrap gap-3">
          {members.map((m) => (
            <button key={m.id} onClick={() => navigate(`/member/${m.id}`)} className="flex w-14 flex-col items-center gap-1">
              <Avatar member={m} size={40} ring={false} />
              <span className="w-full truncate text-center text-[10px] text-ink-400">{m.name.split(' ')[0]}</span>
            </button>
          ))}
        </div>
      </div>

      {/* threads */}
      <div className="mt-5 mb-3 flex items-center justify-between">
        <h2 className="h-display text-headline-sm">Discussions</h2>
        <button onClick={() => toast('Discussion started', { icon: 'comment' })} className="text-xs font-semibold text-gold-700">Start one</button>
      </div>
      <div className="space-y-3 pb-6">
        {g.threads.map((t) => {
          const author = memberById(t.authorId)
          return (
            <div key={t.id} className="card p-4">
              <div className="flex items-center gap-2.5">
                <Avatar member={author} size={32} ring={false} />
                <div className="min-w-0 flex-1">
                  <div className="truncate text-xs text-ink-400">{author?.name} · {t.time}</div>
                </div>
              </div>
              <h3 className="mt-2 text-sm font-semibold text-navy">{t.title}</h3>
              <div className="mt-2 flex items-center gap-1.5 text-[11px] text-ink-400">
                <Icon name="comment" size={13} /> {t.replies} replies
              </div>
            </div>
          )
        })}
      </div>
    </Page>
  )
}
