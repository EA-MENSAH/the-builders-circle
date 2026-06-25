import { useState } from 'react'
import Page from '../components/layout/Page'
import ScreenHeader from '../components/layout/ScreenHeader'
import Icon from '../components/ui/Icon'
import { useStore } from '../store/useStore'
import { toast } from '../store/useToast'
import { GOAL_CATEGORIES } from '../data/mockData'

export default function Goals() {
  const goals = useStore((s) => s.goals)
  const addGoal = useStore((s) => s.addGoal)
  const setGoalProgress = useStore((s) => s.setGoalProgress)
  const removeGoal = useStore((s) => s.removeGoal)

  const [open, setOpen] = useState(false)
  const [category, setCategory] = useState('Professional')
  const [title, setTitle] = useState('')

  const create = () => {
    if (!title.trim()) return
    addGoal(category, title.trim())
    setTitle('')
    setOpen(false)
    toast('Goal added')
  }

  const completed = goals.filter((g) => g.progress >= 100).length

  return (
    <Page>
      <ScreenHeader back eyebrow="Level Up · Build" title="Goals" />

      <div className="card mb-4 flex items-center justify-between p-4">
        <div>
          <div className="text-display-hero font-bold text-gold-700">{completed}</div>
          <div className="text-xs text-ink-600">goals achieved</div>
        </div>
        <div className="text-right">
          <div className="text-display-hero font-bold text-navy">{goals.length}</div>
          <div className="text-xs text-ink-400">in progress</div>
        </div>
      </div>

      {open ? (
        <div className="card mb-5 p-4">
          <label className="eyebrow mb-2 block">Category</label>
          <div className="mb-3 flex gap-2">
            {GOAL_CATEGORIES.map((c) => (
              <button key={c} onClick={() => setCategory(c)} className={category === c ? 'chip-gold' : 'chip'}>{c}</button>
            ))}
          </div>
          <label className="eyebrow mb-2 block">Goal</label>
          <input
            autoFocus
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && create()}
            placeholder="What are you working toward?"
            className="input"
          />
          <div className="mt-3 flex justify-end gap-2">
            <button onClick={() => setOpen(false)} className="btn-ghost px-4 py-2 text-xs">Cancel</button>
            <button onClick={create} className="btn-navy px-5 py-2 text-xs">Add goal</button>
          </div>
        </div>
      ) : (
        <button onClick={() => setOpen(true)} className="btn-navy mb-5 w-full">
          <Icon name="plus" size={18} strokeWidth={2.2} /> Set a new goal
        </button>
      )}

      <div className="space-y-5 pb-6">
        {GOAL_CATEGORIES.map((cat) => {
          const list = goals.filter((g) => g.category === cat)
          if (!list.length) return null
          return (
            <div key={cat}>
              <div className="mb-3 flex items-center gap-2">
                <span className="h-1.5 w-1.5 rounded-full bg-gold-500" />
                <h2 className="h-display text-headline-sm">{cat}</h2>
              </div>
              <div className="space-y-3">
                {list.map((g) => (
                  <div key={g.id} className="card p-4">
                    <div className="flex items-start justify-between gap-2">
                      <h3 className={`text-sm font-semibold ${g.progress >= 100 ? 'text-ink-400 line-through' : 'text-navy'}`}>{g.title}</h3>
                      <button onClick={() => { removeGoal(g.id); toast('Goal removed', { icon: 'plus' }) }} className="shrink-0 text-ink-300 hover:text-ink-600" aria-label="Remove goal">
                        <Icon name="plus" size={16} className="rotate-45" />
                      </button>
                    </div>
                    <div className="mt-3 flex items-center gap-3">
                      <div className="h-2 flex-1 overflow-hidden rounded-full bg-paper-200">
                        <div className="h-full rounded-full bg-gold-grad transition-all" style={{ width: `${g.progress}%` }} />
                      </div>
                      <span className="w-9 text-right text-xs font-semibold text-ink-600">{g.progress}%</span>
                    </div>
                    <div className="mt-3 flex items-center gap-2">
                      <button onClick={() => setGoalProgress(g.id, g.progress - 25)} disabled={g.progress <= 0} className="flex h-8 w-8 items-center justify-center rounded-md border border-line bg-paper-0 text-ink-600 disabled:opacity-40" aria-label="Decrease progress">
                        <Icon name="minus" size={15} strokeWidth={2.4} />
                      </button>
                      <button onClick={() => { const n = g.progress + 25; setGoalProgress(g.id, n); if (n >= 100) toast('Goal achieved 🎉', { icon: 'trophy' }) }} disabled={g.progress >= 100} className="flex h-8 flex-1 items-center justify-center gap-1.5 rounded-md bg-navy text-xs font-semibold text-white disabled:opacity-40">
                        <Icon name="plus" size={14} strokeWidth={2.4} /> Log progress
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )
        })}
      </div>
    </Page>
  )
}
