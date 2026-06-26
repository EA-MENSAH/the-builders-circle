import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import {
  CURRENT_USER, FEED, EVENTS, MARKETPLACE, SEED_GOALS, RECOGNITIONS, PROJECT_SPACES,
  MEMBERS, registerProfiles,
} from '../data/mockData'
import { scoreAssessment, ARCHETYPES } from '../data/archetypes'
import { isSupabaseConfigured } from '../lib/supabase'
import * as db from '../lib/db'

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
      members: MEMBERS, // directory (replaced by real profiles when backend is live)
      backendReady: !isSupabaseConfigured,

      // Load everything for the signed-in user from Supabase (live mode only).
      hydrate: async (authUser) => {
        if (!isSupabaseConfigured || !authUser) return
        const [me0, profiles, feed, cheered, assessment] = await Promise.all([
          db.getMyProfile(authUser.id),
          db.getProfiles(),
          db.getFeed(),
          db.getCheered(authUser.id),
          db.getAssessment(authUser.id),
        ])
        const me =
          me0 ||
          profiles.find((p) => p.id === authUser.id) || {
            id: authUser.id,
            name: (authUser.email || 'Builder').split('@')[0],
            role: 'Member', profession: '', location: '', expertise: [],
            building: '', canHelp: '', archetype: null,
            initials: (authUser.email || 'B').slice(0, 2).toUpperCase(),
            accent: '#CFA646', founder: false, joinedStage: 'Participate',
          }
        const map = Object.fromEntries(profiles.map((p) => [p.id, p]))
        map[me.id] = me
        registerProfiles(map)
        set({
          user: me,
          members: profiles.filter((p) => p.id !== me.id),
          feed,
          cheered,
          builderProfile: assessment,
          signedIn: true,
          backendReady: true,
        })
      },

      saveAssessment: (answers) => {
        const profile = scoreAssessment(answers)
        set((s) => ({ builderProfile: profile, user: { ...s.user, archetype: profile.primary } }))
        if (isSupabaseConfigured) {
          db.saveAssessment(get().user.id, profile)
          db.updateProfile(get().user.id, { archetype: profile.primary })
        }
        return profile
      },
      resetAssessment: () =>
        set((s) => ({ builderProfile: null, user: { ...s.user, archetype: null } })),

      updateUser: (patch) => {
        set((s) => ({ user: { ...s.user, ...patch } }))
        if (isSupabaseConfigured) db.updateProfile(get().user.id, patch)
      },

      // --- community feed ---
      feed: FEED,
      cheered: {}, // {postId: true}
      toggleCheer: (postId) => {
        const on = !!get().cheered[postId]
        set((s) => ({
          cheered: { ...s.cheered, [postId]: !on },
          feed: s.feed.map((p) => (p.id === postId ? { ...p, cheers: p.cheers + (on ? -1 : 1) } : p)),
        }))
        if (isSupabaseConfigured) db.setCheer(get().user.id, postId, !on)
      },
      addPost: async (type, body) => {
        if (isSupabaseConfigured) {
          const post = await db.addPost(get().user.id, type, body)
          if (post) set((s) => ({ feed: [post, ...s.feed] }))
          return
        }
        set((s) => ({
          feed: [
            { id: 'f-' + Math.random().toString(36).slice(2, 8), type, authorId: s.user.id, time: 'now', body, cheers: 0, comments: 0 },
            ...s.feed,
          ],
        }))
      },

      // --- comments ---
      comments: {}, // {postId: [{id, authorId, body, time}]}
      loadComments: async (postId) => {
        if (!isSupabaseConfigured) return
        const list = await db.getComments(postId)
        set((s) => ({ comments: { ...s.comments, [postId]: list } }))
      },
      addComment: async (postId, body) => {
        if (isSupabaseConfigured) {
          const c = await db.addComment(get().user.id, postId, body)
          if (c)
            set((s) => ({
              comments: { ...s.comments, [postId]: [...(s.comments[postId] || []), c] },
              feed: s.feed.map((p) => (p.id === postId ? { ...p, comments: p.comments + 1 } : p)),
            }))
          return
        }
        const c = { id: 'c-' + Math.random().toString(36).slice(2, 8), authorId: get().user.id, body, time: 'now' }
        set((s) => ({
          comments: { ...s.comments, [postId]: [...(s.comments[postId] || []), c] },
          feed: s.feed.map((p) => (p.id === postId ? { ...p, comments: p.comments + 1 } : p)),
        }))
      },

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

      // --- Phase 2: Recognition ---
      recognitions: RECOGNITIONS,
      giveRecognition: ({ toId, type, note }) =>
        set((s) => ({
          recognitions: [
            { id: 'rc-' + Math.random().toString(36).slice(2, 8), fromId: s.user.id, toId, type, note, time: 'now' },
            ...s.recognitions,
          ],
        })),

      // --- Phase 2: Discussion Groups ---
      joinedGroups: {}, // {groupId: true}
      toggleGroup: (id) => set((s) => ({ joinedGroups: { ...s.joinedGroups, [id]: !s.joinedGroups[id] } })),

      // --- Phase 2: Project Spaces ---
      projectSpaces: PROJECT_SPACES,
      joinedSpaces: {}, // {spaceId: true}
      toggleSpace: (id) => set((s) => ({ joinedSpaces: { ...s.joinedSpaces, [id]: !s.joinedSpaces[id] } })),
      addProjectSpace: ({ name, desc }) =>
        set((s) => {
          const id = 'ps-' + Math.random().toString(36).slice(2, 8)
          return {
            projectSpaces: [
              { id, name, ownerId: s.user.id, status: 'Forming', desc, memberIds: [s.user.id], updates: [] },
              ...s.projectSpaces,
            ],
            joinedSpaces: { ...s.joinedSpaces, [id]: true },
          }
        }),

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
        recognitions: s.recognitions,
        joinedGroups: s.joinedGroups,
        projectSpaces: s.projectSpaces,
        joinedSpaces: s.joinedSpaces,
      }),
    }
  )
)
