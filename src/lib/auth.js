import { create } from 'zustand'
import { supabase, isSupabaseConfigured } from './supabase'

// Tracks the Supabase auth session. In mock mode (no env) it stays inert and
// the app uses the local mock sign-in in the store instead.
export const useAuth = create((set) => ({
  // in mock mode there's nothing to wait for, so we're "ready" immediately
  ready: !isSupabaseConfigured,
  session: null,
  user: null,

  init: () => {
    if (!isSupabaseConfigured) return
    supabase.auth.getSession().then(({ data }) => {
      set({ session: data.session, user: data.session?.user ?? null, ready: true })
    })
    const { data: sub } = supabase.auth.onAuthStateChange((_event, session) => {
      set({ session, user: session?.user ?? null, ready: true })
    })
    return () => sub.subscription.unsubscribe()
  },

  // magic link
  signInWithEmail: async (email) => {
    if (!isSupabaseConfigured) return { error: { message: 'Backend not configured' } }
    const redirectTo = `${window.location.origin}/home`
    return supabase.auth.signInWithOtp({ email, options: { emailRedirectTo: redirectTo } })
  },

  signOut: async () => {
    if (isSupabaseConfigured) await supabase.auth.signOut()
    set({ session: null, user: null })
  },
}))
