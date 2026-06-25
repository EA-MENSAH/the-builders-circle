# The Builders Circle — App (MVP Prototype)

> *Level Up. Link Up. Lift Up.*

A mobile-first web app for **The Builders Circle (TBC)** — a trusted community of
builders who learn, belong, and lift one another. Built from the *Founding
Framework* and the *Platform Requirements & Development Roadmap*.

The design language is **“Architectural Prestige”**, matched to the Stitch
designs: warm off-white paper (`#F8F8F6`), **deep navy** (`#04122E`) and
**architectural gold** (`#B8960C` / `#FED752`), **Inter** throughout, and
"hairline minimalism" — white cards with 0.5px borders and generous whitespace.

---

## Run it

```bash
cd tbc-app
npm install      # already done if node_modules exists
npm run dev      # → http://localhost:5173
```

Then open it on a phone-sized viewport (or your browser's device toolbar). On
desktop it renders inside a floating phone frame.

Build for production: `npm run build` → `dist/`.

## Stack

- **React 18 + Vite** — fast SPA
- **Tailwind CSS** — the design system (tokens in `tailwind.config.js`)
- **Framer Motion** — screen transitions & micro-interactions
- **React Router** — navigation
- **Zustand** (+ `persist`) — state, saved to `localStorage` (this is a
  front-end prototype with realistic mock data; no backend yet)

---

## What's built (Phase 1 — Core Platform)

Every feature in the Platform Requirements doc is here:

| Spec feature | Where it lives |
|---|---|
| **Member Profiles** | `Profile` (you) · `MemberDetail` (others) — name, photo, location, profession, role, expertise, what they're building, how they can help |
| **Builder Assessment → Builder Profile** | `Assessment` (12-statement quiz) → `AssessmentResult` — primary & secondary archetype, capability radar, contribution style, growth areas |
| **Member Directory** | `Circle → Directory` — searchable by name/skill/city, founders filter |
| **Community Feed** | `Circle → Feed` + Home — wins, opportunities, resources, updates; post composer; cheers |
| **Events & Calendar** | `Events` (filter by pillar) · `EventDetail` — RSVP, attendees, host |
| **Learning Hub** | `Grow → Learning Hub` — talks, podcasts, articles grouped by topic |
| **Opportunity Board** | `Grow → Opportunities` — jobs, internships, grants, fellowships, collaborations |
| **Founder Dashboard** | `FounderDashboard` — members, assessment completion, RSVPs, engagement, archetype mix, success criteria |

### The 5 onboarding screens (aligned to the framework)
1. **Welcome** — constellation hero, brand, tagline, *Enter the Circle*
2. **Pillars** — the three pillars carousel (Build / Belong / Bridge)
3. **Join** — mock sign-in + commitment to the Builder Code
   …which link directly into the four main tabs + assessment.

### Navigation
Bottom tabs: **Home · Circle · Events · Grow · Profile**, plus stacked detail
screens (member, event, assessment, founder dashboard).

---

## The Builder Archetypes

The assessment scores six capabilities — Vision, Execution, Influence,
Connection, Stewardship, Contribution — and maps them to one of six archetypes:
**Visionary, Architect, Catalyst, Connector, Steward, Cultivator**, each tied to
a pillar. Scoring logic lives in `src/data/archetypes.js`.

---

## Project structure

```
src/
  data/        archetypes (assessment + scoring), mockData (seed content)
  store/       zustand store with localStorage persistence
  components/  ui primitives, shared cards, layout (shell, tab bar), ConstellationHero
  screens/     one file per screen
  App.jsx      routes + auth gate + page transitions
```

## Notes for the next phase

- **Theme**: matched to the real Stitch “Architectural Prestige” design system
  (light navy + gold, Inter). Tune tokens in `tailwind.config.js` →
  `colors.navy` / `colors.gold` / `colors.paper`.
- **Backend**: swap the Zustand mock store for an API/Supabase layer; the data
  shapes in `src/data/` are the contract.
- **Phase 2 (built):** Builder Introductions (Home), **Builder Marketplace**
  (`/marketplace` — I'm Building / I Need / I Can Offer), **Goal Tracking**
  (`/goals` — personal/professional/learning with progress), **Mentorship
  Matching** (`/mentorship` — seek/offer + request). Surfaced via the "Builder
  tools" section on the Dashboard. Still open: Recognition, Discussion Groups,
  Project Spaces.
- **Immersive intro:** `/welcome/immersive` — a navy 3D landing (faithful port
  of the Stitch "Calm 3D" Three.js scene: Core / Network / Rays = the three
  pillars). Code-split so three.js only loads on that route. Reachable from the
  classic Welcome via "View the immersive intro".
```
