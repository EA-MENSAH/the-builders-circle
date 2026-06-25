import { useParams } from 'react-router-dom'
import Page from '../components/layout/Page'
import ScreenHeader from '../components/layout/ScreenHeader'
import Avatar from '../components/ui/Avatar'
import Icon from '../components/ui/Icon'
import { memberById } from '../data/mockData'
import { ARCHETYPES } from '../data/archetypes'
import { toast } from '../store/useToast'

export default function MemberDetail() {
  const { id } = useParams()
  const m = memberById(id)
  if (!m) return <Page><ScreenHeader back title="Not found" /></Page>
  const arch = m.archetype ? ARCHETYPES[m.archetype] : null
  const first = m.name.split(' ')[0]

  return (
    <Page>
      <ScreenHeader back eyebrow="Member Profile" />
      <div className="flex flex-col items-center pb-2 pt-1 text-center">
        <Avatar member={m} size={92} />
        <h1 className="h-display mt-4 text-display-hero">{m.name}</h1>
        <p className="mt-1 text-sm font-medium text-gold-700">{m.role}</p>
        <div className="mt-2 flex items-center gap-3 text-xs text-ink-400">
          <span className="flex items-center gap-1"><Icon name="briefcase" size={13} /> {m.profession}</span>
          <span className="flex items-center gap-1"><Icon name="pin" size={13} /> {m.location}</span>
        </div>
      </div>

      <div className="my-5 grid grid-cols-2 gap-3">
        <button onClick={() => toast(`Message sent to ${first}`, { icon: 'send' })} className="btn-navy">Message</button>
        <button onClick={() => toast(`Intro requested with ${first}`, { icon: 'handshake' })} className="btn-ghost">Request intro</button>
      </div>

      {arch && (
        <div className="card mb-4 flex items-center gap-3 p-4">
          <span className="flex h-12 w-12 items-center justify-center rounded-md bg-navy text-xl text-gold-300">
            {arch.glyph}
          </span>
          <div>
            <div className="eyebrow">Builder Archetype</div>
            <div className="text-headline-sm text-navy">{arch.name}</div>
            <div className="text-[11px] text-ink-600">{arch.contributionStyle}</div>
          </div>
        </div>
      )}

      <Field label="What they’re building" body={m.building} icon="spark" />
      <Field label="How they can help" body={m.canHelp} icon="heart" />

      <div className="card mb-6 p-4">
        <div className="eyebrow mb-3">Areas of expertise</div>
        <div className="flex flex-wrap gap-2">
          {m.expertise.map((e) => (
            <span key={e} className="chip">{e}</span>
          ))}
        </div>
      </div>
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
