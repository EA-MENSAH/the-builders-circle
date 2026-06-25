import { AnimatePresence, motion } from 'framer-motion'
import Icon from './Icon'
import { useToast } from '../../store/useToast'

// Floating navy-pill toasts, anchored above the tab bar inside the phone frame.
export default function Toaster() {
  const toasts = useToast((s) => s.toasts)
  return (
    <div className="pointer-events-none absolute inset-x-0 bottom-24 z-[60] flex flex-col items-center gap-2 px-6">
      <AnimatePresence>
        {toasts.map((t) => (
          <motion.div
            key={t.id}
            initial={{ opacity: 0, y: 16, scale: 0.96 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 8, scale: 0.96 }}
            transition={{ duration: 0.25, ease: [0.16, 1, 0.3, 1] }}
            className="pointer-events-auto flex items-center gap-2.5 rounded-full bg-navy px-4 py-2.5 text-sm font-medium text-white shadow-navy"
          >
            <Icon name={t.icon} size={16} strokeWidth={2.4} className="text-gold-300" />
            {t.message}
          </motion.div>
        ))}
      </AnimatePresence>
    </div>
  )
}
