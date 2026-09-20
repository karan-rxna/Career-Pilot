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

## Architecture notes (future-proofing)

- `src/data/mock.ts` is the single typed data layer — its shapes mirror the future REST API (user, coding stats, contests, hackathons, goals, roadmaps, notes…).
- Bookmark + goal + note state persist to `localStorage` behind small hooks (`src/store`, `src/pages/*`) so the swap to React Query + axios is localized.
- Platform badges & icons are centralized in `src/components/platform.tsx` — CodeChef/AtCoder "coming soon" tiles already exist for when their APIs are wired.
- Design system lives in `src/index.css` (tokens, glass, glow, background) + `src/components/ui.tsx` + `src/components/motion.tsx`.

## Where v2 goes

AI recommendation engine, live profile syncing (LeetCode / Codeforces / GitHub APIs), AI-generated portfolio copy (resume bullets, README suggestions), career readiness scoring, and a Spring Boot + PostgreSQL backend with JWT auth.
