import { AnimatePresence, motion } from 'framer-motion'
import { useEffect } from 'react'
import Icon from './ui/Icon'
import { Mark } from './ui/Logo'
import { BUILDER_CODE } from '../data/mockData'

// Bottom sheet revealing the full Builder Code (§1.8). Light theme.
export default function BuilderCodeSheet({ open, onClose, onCommit }) {
  useEffect(() => {
    if (!open) return
    const onKey = (e) => e.key === 'Escape' && onClose()
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [open, onClose])

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          className="absolute inset-0 z-50 flex flex-col justify-end"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.2 }}
        >
          <button
            aria-label="Close"
            onClick={onClose}
            className="absolute inset-0 bg-navy/40 backdrop-blur-[2px]"
          />

          <motion.div
            initial={{ y: '100%' }}
            animate={{ y: 0 }}
            exit={{ y: '100%' }}
            transition={{ type: 'spring', stiffness: 360, damping: 36 }}
            className="relative max-h-[88%] overflow-hidden rounded-t-[1.5rem] border-t border-line-subtle bg-paper shadow-[0_-20px_60px_rgba(4,18,46,0.25)]"
          >
            <div className="relative flex items-center justify-between px-6 pt-3">
              <span className="absolute left-1/2 top-3 h-1.5 w-10 -translate-x-1/2 rounded-full bg-ink-200" />
              <Mark size={26} />
              <button
                onClick={onClose}
                className="flex h-9 w-9 items-center justify-center rounded-full border border-line bg-paper-0 text-ink-600 active:scale-95"
                aria-label="Close"
              >
                <Icon name="plus" size={18} className="rotate-45" />
              </button>
            </div>

            <div className="relative overflow-y-auto px-6 pb-8 pt-3 no-scrollbar" style={{ maxHeight: '76vh' }}>
              <p className="eyebrow mb-2">Culture is how we behave</p>
              <h2 className="h-display text-display-hero">The Builder Code</h2>
              <p className="mt-2 text-body-md text-ink-600">
                The standards we commit to as builders. Ten promises we make to one another.
              </p>

              <ol className="mt-6 space-y-3">
                {BUILDER_CODE.map((c, i) => (
                  <motion.li
                    key={c.title}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.04 * i + 0.1, duration: 0.35 }}
                    className="flex items-start gap-3.5 rounded-md border border-line-subtle bg-paper-0 p-3.5"
                  >
                    <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-gold-100 text-xs font-bold text-gold-700">
                      {String(i + 1).padStart(2, '0')}
                    </span>
                    <div className="min-w-0">
                      <div className="text-sm font-semibold text-navy">{c.title}</div>
                      <div className="text-[12px] leading-relaxed text-ink-600">{c.why}</div>
                    </div>
                  </motion.li>
                ))}
              </ol>

              <button onClick={onCommit || onClose} className="btn-navy mt-6 w-full">
                I commit to the Code
              </button>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
