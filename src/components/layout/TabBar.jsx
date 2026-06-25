import { NavLink } from 'react-router-dom'
import Icon from '../ui/Icon'

const TABS = [
  { to: '/home', icon: 'gauge', label: 'Dashboard' },
  { to: '/circle', icon: 'users', label: 'Circle' },
  { to: '/events', icon: 'calendar', label: 'Events' },
  { to: '/grow', icon: 'compass', label: 'Grow' },
  { to: '/profile', icon: 'user', label: 'Profile' },
]

export default function TabBar() {
  return (
    <nav className="relative z-20 shrink-0 border-t border-line-subtle bg-paper-0/95 px-2 pb-safe backdrop-blur-xl">
      <div className="flex items-stretch justify-around pt-2">
        {TABS.map((t) => (
          <NavLink
            key={t.to}
            to={t.to}
            className="group relative flex flex-1 flex-col items-center gap-1 py-1.5"
          >
            {({ isActive }) => (
              <>
                <span
                  className={`flex h-9 w-9 items-center justify-center rounded-lg transition-all duration-300 ${
                    isActive ? 'bg-gold-100 text-gold-700' : 'text-ink-400 group-active:text-ink-600'
                  }`}
                >
                  <Icon name={t.icon} size={20} strokeWidth={isActive ? 2 : 1.7} />
                </span>
                <span
                  className={`text-[10px] font-semibold tracking-wide transition-colors ${
                    isActive ? 'text-navy' : 'text-ink-400'
                  }`}
                >
                  {t.label}
                </span>
              </>
            )}
          </NavLink>
        ))}
      </div>
    </nav>
  )
}
