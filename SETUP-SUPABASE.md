# Connect the real backend (Supabase) — free

The app ships in **offline mock mode** (local seed data + mock sign-in) and works
with no setup. Follow these steps to switch on **real magic-link login + shared
data**. Everything is free on Supabase's free tier.

> The whole backend is behind an `isSupabaseConfigured` flag. With no `.env`, the
> app stays in mock mode. The moment both env vars are set, it goes live.

---

## 1. Create a Supabase project (free)
1. Go to **https://supabase.com** → sign in → **New project**.
2. Name it (e.g. `builders-circle`), set a database password, pick a region, create.
3. Wait ~2 minutes for it to provision.

## 2. Run the schema
1. In the project: **SQL Editor → New query**.
2. Open [`supabase/schema.sql`](supabase/schema.sql) from this repo, copy all of it, paste, **Run**.
3. You should see "Success". This creates every table, security policy (RLS), the
   auto-create-profile trigger, and seeds events + discussion groups.

## 3. Turn on magic-link email
1. **Authentication → Providers → Email**: make sure **Email** is enabled.
   (Magic link / OTP is on by default; you don't need "Confirm password".)
2. **Authentication → URL Configuration**:
   - **Site URL**: your deployed URL (e.g. `https://the-builders-circle.vercel.app`)
     — or `http://localhost:5173` while developing.
   - **Redirect URLs**: add both your local and production URLs, e.g.
     `http://localhost:5173/**` and `https://the-builders-circle.vercel.app/**`.

## 4. Add your keys
1. **Project Settings → API**. Copy the **Project URL** and the **anon public** key.
2. In `tbc-app/`, copy `.env.example` → `.env` and fill it:
   ```env
   VITE_SUPABASE_URL=https://YOUR-PROJECT.supabase.co
   VITE_SUPABASE_ANON_KEY=eyJhbGciOi...your-anon-key...
   ```
3. Restart the dev server (`npm run dev`). For the deployed site, add the same two
   vars in your host's dashboard (Vercel → Project → Settings → **Environment
   Variables**) and redeploy.

> The anon key is safe to expose in the browser — Row Level Security protects the
> data. The `.env` file is gitignored so it won't be committed.

---

## 5. Test checklist (once connected)
- [ ] Open the app → **Join** now shows an **email** field and **"Email me a magic link"**.
- [ ] Enter your email → "Check your email" screen → open the email → tap the link →
      you land in the app **signed in**.
- [ ] **Profile** shows your account; **Edit profile** changes persist after refresh.
- [ ] **Circle → Feed**: post something → it persists after refresh, and a second
      account sees it too. Comments work the same way.
- [ ] **Builder Assessment** result is saved to your account (survives refresh).
- [ ] **Sign out** returns you to Welcome and clears the session.

## What's live vs. still local
**Live now:** magic-link auth, member profiles, the member directory, the community
feed (posts + comments + cheers), and the Builder Assessment result.

**Still local (this pass):** events/RSVPs and the Phase 2 tools (marketplace, goals,
mentorship, recognition, discussion groups, project spaces). Their **tables already
exist** in `schema.sql` — wiring them follows the exact same pattern as the feed
(`src/lib/db.js` + the matching store action), so they can be switched on next.

## Troubleshooting
- **Still says "Enter the Circle" / no email field** → env vars not loaded. Confirm
  `.env` has both values and you restarted `npm run dev`.
- **Magic link opens but you're not signed in** → your app URL isn't in
  Auth → URL Configuration → Redirect URLs.
- **Empty feed / permission errors in console** → the schema/RLS didn't run; re-run
  `supabase/schema.sql`.
