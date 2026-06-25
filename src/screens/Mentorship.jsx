import { useNavigate } from 'react-router-dom'
import Page from '../components/layout/Page'
import ScreenHeader from '../components/layout/ScreenHeader'
import Avatar from '../components/ui/Avatar'
import Icon from '../components/ui/Icon'
import { useStore } from '../store/useStore'
import { toast } from '../store/useToast'
import { MENTORS, memberById } from '../data/mockData'

export default function Mentorship() {
  const navigate = useNavigate()
  const offering = useStore((s) => s.offeringMentorship)
  const toggleOffer = useStore((s) => s.toggleOfferMentorship)
  const mentorRequests = useStore((s) => s.mentorRequests)
  const requestMentor = useStore((s) => s.requestMentor)

  return (
    <Page>
      <ScreenHeader back eyebrow="Lift Up · Bridge" title="Mentorship" />
      <p className="-mt-1 mb-4 text-body-md text-ink-600">
        Each member mentors, and is mentored. Connect with experienced builders — and offer your own time as you climb.
      </p>

      {/* offer toggle */}
      <button
        onClick={() => { toggleOffer(); toast(offering ? 'No longer offering mentorship' : 'You’re now offering mentorship', { icon: 'handshake' }) }}
        className={`mb-5 flex w-full items-center gap-3 rounded-md border p-4 text-left transition-colors active:scale-[0.99] ${
          offering ? 'border-gold-300 bg-gold-100' : 'border-line-subtle bg-paper-0 shadow-card'
        }`}
      >
        <span className={`flex h-11 w-11 items-center justify-center rounded-md ${offering ? 'bg-gold-grad text-navy' : 'bg-navy text-gold-300'}`}>
          <Icon name="handshake" size={22} />
        </span>
        <div className="flex-1">
          <div className="text-sm font-semibold text-navy">Offer to mentor</div>
          <div className="text-[11px] text-ink-600">{offering ? 'You’re listed as a mentor — lift as you climb.' : 'Make your time available to other builders.'}</div>
        </div>
        <span className={`flex h-6 w-11 items-center rounded-full p-0.5 transition-colors ${offering ? 'bg-navy' : 'bg-ink-200'}`}>
          <span className={`h-5 w-5 rounded-full bg-white transition-transform ${offering ? 'translate-x-5' : ''}`} />
        </span>
      </button>

      <div className="mb-3 flex items-center gap-2">
        <span className="h-1.5 w-1.5 rounded-full bg-gold-500" />
        <h2 className="h-display text-headline-sm">Available mentors</h2>
      </div>

      <div className="space-y-3">
        {MENTORS.map((mt) => {
          const m = memberById(mt.id)
          if (!m) return null
          const requested = !!mentorRequests[mt.id]
          return (
            <div key={mt.id} className="card p-4">
              <div className="flex items-center gap-3.5">
                <button onClick={() => navigate(`/member/${m.id}`)}><Avatar member={m} size={50} /></button>
                <div className="min-w-0 flex-1">
                  <div className="flex items-center gap-1.5">
                    <span className="truncate text-sm font-semibold text-navy">{m.name}</span>
                    {m.founder && <span className="text-gold-600" title="Founder">✦</span>}
                  </div>
                  <div className="truncate text-xs text-ink-600">{m.profession}</div>
                  <div className="mt-0.5 text-[11px] text-ink-400">Open to {mt.capacity}</div>
                </div>
              </div>
              <div className="mt-3 flex flex-wrap gap-1.5">
                {mt.topics.map((t) => (<span key={t} className="chip">{t}</span>))}
              </div>
              <button
                onClick={() => { if (!requested) { requestMentor(mt.id); toast(`Mentorship requested with ${m.name.split(' ')[0]}`, { icon: 'handshake' }) } }}
                disabled={requested}
                className={requested ? 'btn-ghost mt-3 w-full py-2.5 text-xs' : 'btn-navy mt-3 w-full py-2.5 text-xs'}
              >
                {requested ? <><Icon name="check" size={14} strokeWidth={2.4} /> Request sent</> : <>Request mentorship</>}
              </button>
            </div>
          )
        })}
      </div>

      {/* Fellows — future */}
      <div className="mt-5 rounded-md border border-dashed border-line-strong bg-paper-0 p-4 text-center">
        <Icon name="sparkle" size={20} className="mx-auto mb-1.5 text-gold-600" />
        <div className="text-sm font-semibold text-navy">Fellows — coming soon</div>
        <p className="mx-auto mt-1 max-w-[18rem] text-[11px] text-ink-600">
          Experienced industry leaders and mentors who’ll contribute expertise, opportunities, and guidance to the Circle.
        </p>
      </div>
      <div className="pb-6" />
    </Page>
  )
}
