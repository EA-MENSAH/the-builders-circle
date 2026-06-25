# Deploying The Builders Circle (free)

This app is a **static client-side SPA** (React + Vite, data in `localStorage`,
no backend). That means **free hosting forever** — there's no server or database
to pay for. Build output is the `dist/` folder.

Config already included for you:
- `vercel.json` — SPA routing for Vercel
- `netlify.toml` + `public/_redirects` — SPA routing for Netlify / Cloudflare

---

## Option 1 — Vercel + GitHub (recommended: auto HTTPS + auto-redeploy)

**A. Put the app on GitHub** (run inside `tbc-app/`):

```bash
cd tbc-app
git init
git add .
git commit -m "The Builders Circle — MVP"

# with GitHub CLI:
gh repo create the-builders-circle --public --source=. --push
# …or create an empty repo on github.com, then:
#   git remote add origin https://github.com/<you>/the-builders-circle.git
#   git branch -M main && git push -u origin main
```

**B. Deploy on Vercel**
1. Go to https://vercel.com → **Sign up with GitHub** (free Hobby plan).
2. **Add New… → Project** → import the `the-builders-circle` repo.
3. Vercel auto-detects Vite (Build `vite build`, Output `dist`). Click **Deploy**.
4. You get a live `https://<name>.vercel.app` URL with HTTPS.

Every `git push` now auto-redeploys.

---

## Option 2 — Netlify Drop (fastest, no git, ~60 seconds)

```bash
cd tbc-app
npm run build      # creates dist/
```
1. Open https://app.netlify.com/drop
2. Drag the **`tbc-app/dist`** folder onto the page.
3. Instant live URL. (Sign in to keep it / rename it.)

To update later: rebuild and drag `dist` again, or connect the GitHub repo for
auto-deploys (Netlify reads `netlify.toml` automatically).

---

## Option 3 — Cloudflare Pages

1. Push to GitHub (Option 1A).
2. https://pages.cloudflare.com → **Create project** → connect the repo.
3. Framework preset **Vite**, build command `npm run build`, output dir `dist`.
4. Deploy → `https://<name>.pages.dev`. `public/_redirects` handles routing.

---

## Custom domain (optional, also free)
All three give a free subdomain. If you own a domain (e.g. from Namecheap),
add it under the host's **Domains** settings and point DNS as instructed —
the hosting itself stays free.

## Note
Data is per-browser (`localStorage`) — great for a demo, but members won't share
data. When you're ready for real shared data + login, swap the Zustand store for
a backend (e.g. Supabase free tier) and redeploy.
