import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import Page from '../components/layout/Page'
import Avatar from '../components/ui/Avatar'
import Icon from '../components/ui/Icon'
import BuilderCodeSheet from '../components/BuilderCodeSheet'
import { EditProfileSheet } from '../components/sheets'
import { useStore } from '../store/useStore'
import { ARCHETYPES } from '../data/archetypes'
import { BUILDER_JOURNEY, BUILDER_CODE } from '../data/mockData'

export default function Profile() {
  const navigate = useNavigate()
  const [showCode, setShowCode] = useState(false)
  const [showEdit, setShowEdit] = useState(false)
  const user = useStore((s) => s.user)
  const signOut = useStore((s) => s.signOut)
  const arch = user.archetype ? ARCHETYPES[user.archetype] : null
  const stageIndex = BUILDER_JOURNEY.indexOf(user.joinedStage)

  return (
    <Page>
      <header className="sticky top-0 z-20 -mx-5 mb-2 flex items-center justify-between border-b border-line-subtle bg-paper/85 px-5 pb-2 pt-safe backdrop-blur-xl">
        <h1 className="h-display pt-3 text-headline-sm">Profile</h1>
        <button onClick={() => setShowEdit(true)} className="pt-3 text-ink-600 active:scale-95" aria-label="Edit profile">
          <Icon name="settings" size={21} />
        </button>
      </header>

      {/* identity */}
      <div className="flex flex-col items-center pb-2 pt-2 text-center">
        <Avatar member={user} size={92} />
        <h2 className="h-display mt-4 text-display-hero">{user.name}</h2>
        <p className="mt-1 text-sm font-medium text-gold-700">{user.role}</p>
        <div className="mt-2 flex items-center gap-3 text-xs text-ink-400">
          <span className="flex items-center gap-1"><Icon name="briefcase" size={13} /> {user.profession}</span>
          <span className="flex items-center gap-1"><Icon name="pin" size={13} /> {user.location}</span>
        </div>
        <button onClick={() => setShowEdit(true)} className="mt-4 flex items-center gap-1.5 rounded-full border border-line bg-paper-0 px-4 py-2 text-xs font-semibold text-ink-600 active:scale-95">
          <Icon name="edit" size={14} /> Edit profile
        </button>
      </div>

      {/* archetype */}
      {arch ? (
        <button onClick={() => navigate('/assessment/result')} className="card my-5 flex w-full items-center gap-4 p-4 text-left active:scale-[0.99]">
          <div className="flex h-14 w-14 items-center justify-center rounded-md bg-navy text-2xl text-gold-300">{arch.glyph}</div>
          <div className="min-w-0 flex-1">
            <div className="eyebrow">Builder Archetype</div>
            <div className="text-headline-sm text-navy">{arch.name}</div>
            <div className="truncate text-xs text-ink-600">View full Builder Profile</div>
          </div>
          <Icon name="chevronRight" size={18} className="text-ink-200" />
        </button>
      ) : (
        <button onClick={() => navigate('/assessment')} className="my-5 flex w-full items-center gap-4 rounded-md border border-gold-300 bg-gold-100 p-4 text-left">
          <div className="flex h-14 w-14 items-center justify-center rounded-md bg-gold-grad text-navy"><Icon name="spark" size={26} /></div>
          <div className="flex-1">
            <div className="text-[15px] font-semibold text-navy">Take the Builder Assessment</div>
            <div className="text-xs text-gold-700">Unlock your archetype & capability profile.</div>
          </div>
          <Icon name="arrowRight" size={18} className="text-gold-700" />
        </button>
      )}

      {/* builder journey */}
      <div className="card mb-4 p-4">
        <div className="eyebrow mb-3">The Builder Journey</div>
        <div className="flex items-center justify-between">
          {BUILDER_JOURNEY.map((stage, i) => {
            const done = i <= stageIndex
            return (
              <div key={stage} className="flex flex-1 flex-col items-center">
                <div className="flex w-full items-center">
                  <span className={`h-0.5 flex-1 ${i === 0 ? 'opacity-0' : done ? 'bg-gold-500' : 'bg-ink-200'}`} />
                  <span className={`flex h-3 w-3 shrink-0 rounded-full ${done ? 'bg-gold-500' : 'bg-ink-200'} ${i === stageIndex ? 'ring-2 ring-gold-300' : ''}`} />
                  <span className={`h-0.5 flex-1 ${i === BUILDER_JOURNEY.length - 1 ? 'opacity-0' : i < stageIndex ? 'bg-gold-500' : 'bg-ink-200'}`} />
                </div>
                <span className={`mt-1.5 text-[8.5px] ${i === stageIndex ? 'font-bold text-gold-700' : 'text-ink-400'}`}>{stage}</span>
              </div>
            )
          })}
        </div>
      </div>

      <Field label="What I’m building" body={user.building} icon="spark" />
      <Field label="How I can help" body={user.canHelp} icon="heart" />

      <div className="card mb-4 p-4">
        <div className="eyebrow mb-3">Areas of expertise</div>
        <div className="flex flex-wrap gap-2">
          {user.expertise.map((e) => (<span key={e} className="chip">{e}</span>))}
        </div>
      </div>

      {/* builder code */}
      <button onClick={() => setShowCode(true)} className="card mb-4 w-full p-4 text-left active:scale-[0.99]">
        <div className="mb-3 flex items-center justify-between">
          <span className="eyebrow">The Builder Code</span>
          <span className="flex items-center gap-1 text-[11px] font-semibold text-gold-700">Read all <Icon name="chevronRight" size={13} /></span>
        </div>
        <div className="space-y-2">
          {BUILDER_CODE.map((c) => (
            <div key={c.title} className="flex items-center gap-2.5 text-sm text-ink-700">
              <Icon name="check" size={15} strokeWidth={2.2} className="text-gold-600" />
              {c.title}
            </div>
          ))}
        </div>
      </button>

      <button
        onClick={() => { signOut(); navigate('/welcome', { replace: true }) }}
        className="mb-6 flex w-full items-center justify-center gap-2 rounded-full border border-line bg-paper-0 py-3 text-sm font-semibold text-ink-600"
      >
        <Icon name="logout" size={17} /> Sign out
      </button>

      <BuilderCodeSheet open={showCode} onClose={() => setShowCode(false)} />
      <EditProfileSheet open={showEdit} onClose={() => setShowEdit(false)} />
    </Page>
  )
}

function Field({ label, body, icon }) {
  return (
    <div className="card mb-4 p-4">
      <div className="mb-2 flex items-center gap-2">
        <Icon name={icon} size={15} className="text-gold-700" />
        <span className="eyebrow">{label}</span>
      </div>
      <p className="text-body-md text-ink-700">{body}</p>
    </div>
  )
}
