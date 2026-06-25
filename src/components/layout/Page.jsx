import { motion } from 'framer-motion'

// Shared screen transition + scroll container.
const variants = {
  initial: { opacity: 0, y: 10 },
  enter: { opacity: 1, y: 0, transition: { duration: 0.35, ease: [0.16, 1, 0.3, 1] } },
  exit: { opacity: 0, y: -8, transition: { duration: 0.2 } },
}

export default function Page({ children, className = '', noPad = false }) {
  return (
    <motion.main
      variants={variants}
      initial="initial"
      animate="enter"
      exit="exit"
      className={`screen no-scrollbar ${noPad ? '' : 'px-5'} ${className}`}
    >
      {children}
    </motion.main>
  )
}
