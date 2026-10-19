# CareerPilot — Frontend (V1)

The all-in-one student placement OS. Dark, glassmorphic, animated React SPA built for version 1 of the CareerPilot platform — fully interactive on **mock data** today, architected so every screen can be swapped to live API calls.

## Stack

React 19 · Vite 8 · TypeScript · Tailwind CSS v4 · React Router 7 · Framer Motion · Recharts · lucide-react

## Run it

```bash
cd frontend
npm install
npm run dev        # http://localhost:5173
npm run build      # typecheck + production build
```

The API must be running for sign-in to work (see `../backend`). Vite is pinned to port 5173
because the backend only accepts browser requests from its `CORS_ALLOWED_ORIGINS`
(`http://localhost:5173` and `:5174` by default) — if you move the dev server, add that origin to
the backend's config.

## What's inside

| Area | Routes |
| --- | --- |
| Auth | `/auth/login` · `/auth/register` · `/auth/forgot` |
| Dashboard | `/app/dashboard` — hero, daily plan, stat tiles, weekly chart, goals, GitHub heatmap, activity, contests, roadmaps, quote |
| DSA Analytics | `/app/dsa` — platform cards, difficulty donut, monthly solve volume, topic intelligence with weak-zone flags, Codeforces rating trend, practice heatmap |
| Projects | `/app/projects` — GitHub portfolio analyzer: account strip, repo cards (search + language filters, live-demo links, README previews), top languages, portfolio quality scoring, top-repos ranking |
| Placement | `/app/contests` · `/app/hackathons` (search, filters, live bookmarks) |
| Productivity | `/app/goals` · `/app/notes` · `/app/roadmaps` · `/app/interview` |
| Profile | `/app/profile` — connections, skills, achievements, readiness |

## Authentication (live)

Sign-in is wired to the Spring Boot API end to end; every other page still renders from
`src/data/mock.ts`.

| File | Role |
| --- | --- |
| `src/lib/api.ts` | Typed fetch client. Base URL from `VITE_API_BASE_URL` (defaults to `http://localhost:8080` — see `.env.example`). Maps the backend's error envelope onto an `ApiError` with `status`, `code` and `fieldErrors`, and replays a request once after refreshing an expired access token. |
| `src/store/useAuth.tsx` | Session provider: bootstraps from the refresh cookie on load, exposes `login` / `register` / `logout` / `updateProfile`. |
| `src/components/RouteGuards.tsx` | `RequireAuth` bounces anonymous visitors to `/auth/login` remembering where they were headed; `RequireGuest` keeps signed-in users off the auth pages. |

How the session works: the **access token lives in memory only** (never `localStorage`, so XSS cannot
read it) and the **refresh token is an httpOnly cookie** the browser sends for us. A page reload
therefore restores the session through `POST /api/auth/refresh` rather than a stored credential.
Refresh calls are single-flighted, because the backend revokes each refresh token as it is used.

Sign-out calls `POST /api/auth/logout`, which clears the cookie server-side; the guards then take
over the redirect.

## Brand

The logo is drawn in code, not loaded as a bitmap — `src/components/Logo.tsx` exports
`BrandMark` (the CP monogram + paper-plane mark), `Logo` (mark + wordmark, optional tagline) and
`Tagline` ("Plan · Prepare · Perform · Succeed"). Because it is SVG, it stays crisp at favicon size,
needs no background knockout against the dark UI, and inherits its gradients from the same palette
as the rest of the app. The only raster copy is `public/branding/careerpilot-logo.png` — the original
flattened artwork, used for the Open Graph preview and anywhere a light background is expected.

## Architecture notes (future-proofing)

- `src/data/mock.ts` is the single typed data layer — its shapes mirror the REST API (user, coding stats, contests, hackathons, goals, roadmaps, notes…), which is also why the API client's `ApiUser` lines up field-for-field with the backend's `UserResponse`.
- Bookmark + goal + note state persist to `localStorage` behind small hooks (`src/store`, `src/pages/*`) so the swap to React Query + axios is localized.
- Platform badges & icons are centralized in `src/components/platform.tsx` — CodeChef/AtCoder "coming soon" tiles already exist for when their APIs are wired.
- Design system lives in `src/index.css` (tokens, glass, glow, background) + `src/components/ui.tsx` + `src/components/motion.tsx`.
- Brand marks live in `src/components/Logo.tsx` as SVG, so retheming the app recolours the logo with it.

## Where v2 goes

AI recommendation engine, live profile syncing (LeetCode / Codeforces / GitHub APIs), AI-generated portfolio copy (resume bullets, README suggestions), and career readiness scoring. The Spring Boot + PostgreSQL backend with JWT auth already exists in `../backend` and backs the auth screens today; the remaining pages migrate to it feature by feature.
