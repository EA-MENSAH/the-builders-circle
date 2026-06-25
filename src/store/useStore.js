import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import { CURRENT_USER, FEED, EVENTS, MARKETPLACE, SEED_GOALS } from '../data/mockData'
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

      // --- comments ---
      comments: {}, // {postId: [{id, authorId, body, time}]}
      addComment: (postId, body) =>
        set((s) => {
          const c = {
            id: 'c-' + Math.random().toString(36).slice(2, 8),
            authorId: s.user.id,
            body,
            time: 'now',
          }
          return {
            comments: { ...s.comments, [postId]: [...(s.comments[postId] || []), c] },
            feed: s.feed.map((p) => (p.id === postId ? { ...p, comments: p.comments + 1 } : p)),
          }
        }),

      // --- events / RSVP ---
      events: EVENTS,
      rsvps: {}, // {eventId: true}
      toggleRsvp: (eventId) =>
        set((s) => ({ rsvps: { ...s.rsvps, [eventId]: !s.rsvps[eventId] } })),

      // --- Phase 2: Builder Marketplace ---
      marketplace: MARKETPLACE,
      addMarketplacePost: (post) =>
        set((s) => ({
          marketplace: [
            { id: 'mk-' + Math.random().toString(36).slice(2, 8), authorId: s.user.id, time: 'now', ...post },
            ...s.marketplace,
          ],
        })),

      // --- Phase 2: Goals ---
      goals: SEED_GOALS,
      addGoal: (category, title) =>
        set((s) => ({
          goals: [...s.goals, { id: 'g-' + Math.random().toString(36).slice(2, 8), category, title, progress: 0 }],
        })),
      setGoalProgress: (id, progress) =>
        set((s) => ({
          goals: s.goals.map((g) => (g.id === id ? { ...g, progress: Math.max(0, Math.min(100, progress)) } : g)),
        })),
      removeGoal: (id) => set((s) => ({ goals: s.goals.filter((g) => g.id !== id) })),

      // --- Phase 2: Mentorship ---
      mentorRequests: {}, // {memberId: true}
      requestMentor: (memberId) =>
        set((s) => ({ mentorRequests: { ...s.mentorRequests, [memberId]: true } })),
      offeringMentorship: false,
      toggleOfferMentorship: () => set((s) => ({ offeringMentorship: !s.offeringMentorship })),

      // --- onboarding checklist (First 90 Days) ---
      checklist: {}, // {itemId: true}
      toggleChecklistItem: (id) =>
        set((s) => ({ checklist: { ...s.checklist, [id]: !s.checklist[id] } })),
      setChecklistItem: (id, value) =>
        set((s) =>
          s.checklist[id] === value ? {} : { checklist: { ...s.checklist, [id]: value } }
        ),

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
        comments: s.comments,
        checklist: s.checklist,
        marketplace: s.marketplace,
        goals: s.goals,
        mentorRequests: s.mentorRequests,
        offeringMentorship: s.offeringMentorship,
      }),
    }
  )
)
