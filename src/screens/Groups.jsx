import { useNavigate } from 'react-router-dom'
import Page from '../components/layout/Page'
import ScreenHeader from '../components/layout/ScreenHeader'
import Icon from '../components/ui/Icon'
import { useStore } from '../store/useStore'
import { DISCUSSION_GROUPS } from '../data/mockData'

export default function Groups() {
  const navigate = useNavigate()
  const joinedGroups = useStore((s) => s.joinedGroups)

  return (
    <Page>
      <ScreenHeader back eyebrow="Link Up · Belong" title="Discussion Groups" />
      <p className="-mt-1 mb-4 text-body-md text-ink-600">
        Interest-based communities within the Circle. Join the conversations that matter to you.
      </p>

      <div className="space-y-3 pb-6">
        {DISCUSSION_GROUPS.map((g) => {
          const joined = !!joinedGroups[g.id]
          const count = g.memberIds.length + (joined ? 1 : 0)
          return (
            <button
              key={g.id}
              onClick={() => navigate(`/group/${g.id}`)}
              className="card flex w-full items-center gap-3.5 p-4 text-left active:scale-[0.99]"
            >
              <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-md bg-navy text-gold-300">
                <Icon name={g.icon} size={22} />
              </span>
              <div className="min-w-0 flex-1">
                <div className="flex items-center gap-2">
                  <span className="truncate text-sm font-semibold text-navy">{g.name}</span>
                  {joined && <span className="chip-gold !px-2 !py-0.5 text-[10px]">Joined</span>}
                </div>
                <p className="mt-0.5 line-clamp-2 text-xs text-ink-600">{g.desc}</p>
                <div className="mt-1 text-[11px] text-ink-400">{count} members · {g.threads.length} threads</div>
              </div>
              <Icon name="chevronRight" size={18} className="text-ink-200" />
            </button>
          )
        })}
      </div>
    </Page>
  )
}
