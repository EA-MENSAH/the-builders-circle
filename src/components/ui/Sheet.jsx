import { AnimatePresence, motion } from 'framer-motion'
import { useEffect } from 'react'
import Icon from './Icon'

// Reusable bottom sheet — backdrop + slide-up panel with a header.
export default function Sheet({ open, onClose, title, eyebrow, children, maxHeight = '86%' }) {
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
          <button aria-label="Close" onClick={onClose} className="absolute inset-0 bg-navy/40 backdrop-blur-[2px]" />
          <motion.div
            initial={{ y: '100%' }}
            animate={{ y: 0 }}
            exit={{ y: '100%' }}
            transition={{ type: 'spring', stiffness: 360, damping: 36 }}
            className="relative flex flex-col overflow-hidden rounded-t-[1.5rem] border-t border-line-subtle bg-paper shadow-[0_-20px_60px_rgba(4,18,46,0.25)]"
            style={{ maxHeight }}
          >
            <div className="relative flex items-center justify-between px-6 pb-3 pt-5">
              <span className="absolute left-1/2 top-2.5 h-1.5 w-10 -translate-x-1/2 rounded-full bg-ink-200" />
              <div className="min-w-0">
                {eyebrow && <div className="eyebrow mb-0.5">{eyebrow}</div>}
                {title && <h2 className="h-display text-headline-sm">{title}</h2>}
              </div>
              <button
                onClick={onClose}
                className="ml-3 flex h-9 w-9 shrink-0 items-center justify-center rounded-full border border-line bg-paper-0 text-ink-600 active:scale-95"
                aria-label="Close"
              >
                <Icon name="plus" size={18} className="rotate-45" />
              </button>
            </div>
            <div className="overflow-y-auto px-6 pb-8 no-scrollbar">{children}</div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
