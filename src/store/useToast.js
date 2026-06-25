import { create } from 'zustand'

let seq = 0

// Tiny toast store. Call toast('Saved') anywhere.
export const useToast = create((set) => ({
  toasts: [],
  push: (message, opts = {}) => {
    const id = ++seq
    set((s) => ({ toasts: [...s.toasts, { id, message, icon: opts.icon || 'check' }] }))
    setTimeout(() => {
      set((s) => ({ toasts: s.toasts.filter((t) => t.id !== id) }))
    }, opts.duration || 2200)
  },
  dismiss: (id) => set((s) => ({ toasts: s.toasts.filter((t) => t.id !== id) })),
}))

// convenience helper
export const toast = (message, opts) => useToast.getState().push(message, opts)
