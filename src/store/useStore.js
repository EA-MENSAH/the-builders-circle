import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import { CURRENT_USER, FEED, EVENTS } from '../data/mockData'
import { scoreAssessment, ARCHETYPES } from '../data/archetypes'

// Single source of truth for the prototype. Persisted to localStorage so the
// app remembers your assessment, RSVPs, cheers and posts between visits.
export const useStore = create(
  persist(
    (set, get) => ({
      // --- onboarding / auth (mock) ---
      onboarded: false,
      signedIn: false,
      completeOnboarding: () => set({ onboarded: true }),
      signIn: () => set({ signedIn: true, onboarded: true }),
      signOut: () => set({ signedIn: false }),

      // --- the current user + builder profile ---
      user: CURRENT_USER,
      builderProfile: null, // set after the assessment

      saveAssessment: (answers) => {
        const profile = scoreAssessment(answers)
        set((s) => ({
          builderProfile: profile,
          user: { ...s.user, archetype: profile.primary },
        }))
        return profile
      },
      resetAssessment: () =>
        set((s) => ({ builderProfile: null, user: { ...s.user, archetype: null } })),

      updateUser: (patch) => set((s) => ({ user: { ...s.user, ...patch } })),

      // --- community feed ---
      feed: FEED,
      cheered: {}, // {postId: true}
      toggleCheer: (postId) =>
        set((s) => {
          const on = !!s.cheered[postId]
          return {
            cheered: { ...s.cheered, [postId]: !on },
            feed: s.feed.map((p) =>
              p.id === postId ? { ...p, cheers: p.cheers + (on ? -1 : 1) } : p
            ),
          }
        }),
      addPost: (type, body) =>
        set((s) => ({
          feed: [
            {
              id: 'f-' + Math.random().toString(36).slice(2, 8),
              type,
              authorId: s.user.id,
              time: 'now',
              body,
              cheers: 0,
              comments: 0,
            },
            ...s.feed,
          ],
        })),

      // --- events / RSVP ---
      events: EVENTS,
      rsvps: {}, // {eventId: true}
      toggleRsvp: (eventId) =>
        set((s) => ({ rsvps: { ...s.rsvps, [eventId]: !s.rsvps[eventId] } })),

      // --- derived helpers ---
      isGoing: (eventId) => !!get().rsvps[eventId],
      myArchetype: () => {
        const a = get().user.archetype
        return a ? ARCHETYPES[a] : null
      },
    }),
    {
      name: 'tbc-store-v1',
      partialize: (s) => ({
        onboarded: s.onboarded,
        signedIn: s.signedIn,
        user: s.user,
        builderProfile: s.builderProfile,
        cheered: s.cheered,
        feed: s.feed,
        rsvps: s.rsvps,
      }),
    }
  )
)
