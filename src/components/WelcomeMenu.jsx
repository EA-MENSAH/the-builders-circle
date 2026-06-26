import { useNavigate } from 'react-router-dom'
import Sheet from './ui/Sheet'
import Icon from './ui/Icon'

// Lightweight menu for the welcome screens' header icon.
export default function WelcomeMenu({ open, onClose, variant = 'classic' }) {
  const navigate = useNavigate()
  const go = (to) => { onClose(); navigate(to) }

  const items = [
    { icon: 'arrowRight', label: 'Begin your journey', to: '/code' },
    { icon: 'user', label: 'Sign in', to: '/join' },
    variant === 'classic'
      ? { icon: 'sparkle', label: 'Immersive intro', to: '/welcome/immersive' }
      : { icon: 'menu', label: 'Classic intro', to: '/welcome' },
  ]

  return (
    <Sheet open={open} onClose={onClose} eyebrow="Level Up · Link Up · Lift Up" title="The Builders Circle">
      <div className="space-y-2 pt-1">
        {items.map((it) => (
          <button
            key={it.label}
            onClick={() => go(it.to)}
            className="flex w-full items-center gap-3 rounded-md border border-line-subtle bg-paper-0 p-4 text-left active:scale-[0.99]"
          >
            <span className="flex h-10 w-10 items-center justify-center rounded-md bg-navy text-gold-300">
              <Icon name={it.icon} size={18} />
            </span>
            <span className="flex-1 text-sm font-semibold text-navy">{it.label}</span>
            <Icon name="chevronRight" size={18} className="text-ink-200" />
          </button>
        ))}
        <p className="px-1 pt-2 text-[11px] leading-relaxed text-ink-400">
          A trusted community of builders committed to growth, meaningful relationships, and lasting impact.
        </p>
      </div>
    </Sheet>
  )
}
