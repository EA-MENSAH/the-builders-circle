import { useNavigate } from 'react-router-dom'
import Icon from '../ui/Icon'

// Sticky top bar: optional back button, eyebrow, title, optional right action.
export default function ScreenHeader({ title, eyebrow, back = false, action, sticky = true }) {
  const navigate = useNavigate()
  return (
    <header
      className={`${
        sticky ? 'sticky top-0 z-20' : ''
      } -mx-5 mb-3 flex items-center gap-3 border-b border-line-subtle bg-paper/85 px-5 pb-3 pt-safe backdrop-blur-xl`}
    >
      <div className="flex min-h-[44px] flex-1 items-center gap-3 pt-3">
        {back && (
          <button
            onClick={() => navigate(-1)}
            className="flex h-9 w-9 items-center justify-center rounded-full border border-line bg-paper-0 text-ink-600 active:scale-95"
            aria-label="Back"
          >
            <Icon name="arrowLeft" size={18} />
          </button>
        )}
        <div className="min-w-0 flex-1">
          {eyebrow && <div className="eyebrow mb-0.5">{eyebrow}</div>}
          {title && (
            <h1 className="h-display truncate text-headline-sm leading-tight">{title}</h1>
          )}
        </div>
        {action}
      </div>
    </header>
  )
}
