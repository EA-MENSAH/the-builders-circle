import { createClient } from '@supabase/supabase-js'

// Reads Vite env vars. If they're absent, the app runs in offline "mock" mode
// (local seed data + mock sign-in) — nothing breaks. Once you set both vars in
// .env (see SETUP-SUPABASE.md), the app switches to real auth + shared data.
const url = import.meta.env.VITE_SUPABASE_URL
const anonKey = import.meta.env.VITE_SUPABASE_ANON_KEY

export const isSupabaseConfigured = Boolean(url && anonKey)

export const supabase = isSupabaseConfigured
  ? createClient(url, anonKey, {
      auth: {
        persistSession: true,
        autoRefreshToken: true,
        detectSessionInUrl: true, // handles the magic-link redirect
      },
    })
  : null
