# CareerPilot — Build Plan (Frontend V1 → Complete Product)

**Status:** V1 frontend shipped (`frontend/`, 36 files) running on a typed mock layer that mirrors
the REST API below. No UI rewrite is required anywhere in this plan — each stage replaces mock
imports with API calls, page by page.

**Architecture**

```
React 19 + Vite + TS + Tailwind v4        (Vercel)
        │  axios + React Query
        ▼
Spring Boot 4.1.1 + Spring Security + JWT (Render)
        │  Spring Data JPA + Flyway
        ▼
   PostgreSQL (Neon)
        ├── GitHub REST · Codeforces API · LeetCode GraphQL   (sync engine)
        └── AI provider (OpenAI / Gemini)                     (recommendations)
```

## Stack versions (locked)

Java 21 · Spring Boot **4.1.1** (Spring Framework 7 / Spring Security 7) · Maven · PostgreSQL (Neon)
· React 19 · Vite 8 · Tailwind v4 · Flyway.

Two Boot 4 traps worth remembering — both already handled in `backend/`:

1. **Starters were reorganized.** `spring-boot-starter-web` is now `spring-boot-starter-webmvc`, every
   technology has its own starter (`spring-boot-starter-flyway`, `spring-boot-starter-jackson`, …), and
   test support moved into companions (`spring-boot-starter-webmvc-test`, `spring-boot-starter-security-test`)
   which already bring `spring-boot-starter-test` transitively.
2. **`iss` must be a URL.** Spring's `Jwt#getIssuer()` parses that claim as a URI, so a plain string such
   as `careerpilot` throws at runtime. The API now uses `https://careerpilot.app`.

## Progress log

| Stage | Status | Notes |
|---|---|---|
| 0 — Contracts & docs | ✅ done | `docs/API_CONTRACT.md` + `docs/SCHEMA.sql` now live in the repo |
| 1 — Neon DB + migrations | ⏳ code ready, needs a Neon project | `V1__init.sql` (23 tables) + `V2__seed.sql` (127 rows); applied by starting the backend against a Neon URL |
| 2 — Backend skeleton | ✅ done | Boot 4.1.1, package-by-feature, error envelope, Actuator health, Dockerfile, CI |
| 3 — Auth & identity | ✅ done (email delivery pending) | JWT access + rotated refresh cookie, BCrypt, forgot/reset; reset links log to console in dev until Resend is wired |
| 4 — Goals vertical slice | ⏳ next | Backend CRUD + axios/React Query swap on the Goals page |

Verified locally: `mvn -B verify` green (3 unit tests, fat jar builds), `tsc --noEmit` green on the
frontend, SQL lint clean. The only manual step left in Stage 1 is creating the Neon database.

## Milestone map

| # | Stage | Est. | Exit criteria |
|---|-------|------|---------------|
| 0 | Contracts & docs | ½ day | API contract + schema frozen in `docs/` |
| 1 | Neon DB + migrations + seeds | 1–2 d | Flyway V1 runs clean; seed content loads |
| 2 | Backend skeleton deployed | 2 d | `/actuator/health` live on Render; CI green |
| 3 | Auth & identity | 3–4 d | register / login / refresh / reset / me + tests |
| 4 | Goals vertical slice | 2 d | Goals page reads + writes the real DB end-to-end |
| 5 | Feature fan-out | 1.5–2 wk | All 11 sections on real data; `mock.ts` retired |
| 6 | Platform sync engine | 1.5 wk | GitHub / Codeforces / LeetCode auto-sync into snapshots |
| 7 | Recommendations + daily plan | 1 wk | Weak-topic picks + flight plan generated server-side |
| 8 | AI layer | 1.5–2 wk | Portfolio AI, resume bullets, README suggestions |
| 9 | Hardening & ship | ongoing | Rate limits, tests, monitoring, prod envs, docs |

**Solo timeline: 8–10 weeks part-time** to a complete product (through Stage 8).

---

## Stage 0 — Contracts & foundations (½ day)
Freeze `docs/API_CONTRACT.md` (JSON field names mirror `frontend/src/data/mock.ts`, so the frontend
swap touches only the data-fetch layer) and `docs/SCHEMA.sql`. Repo discipline: `main` auto-deploys,
feature branches, conventional commits, `backend/` is a sibling of `frontend/`.

## Stage 1 — Database & migrations (1–2 days)
Neon project with **dev** and **prod** branches. `docs/SCHEMA.sql` becomes Flyway
`V1__init.sql`; `V2__seed.sql` loads global content (5 roadmaps + stages, 7 interview categories +
topics, contest + hackathon samples). Always use Neon's **pooled** connection string. Hibernate
never owns the schema: `ddl-auto=validate`, Flyway owns DDL.

## Stage 2 — Backend skeleton (2 days)
Spring Boot, Java 21, Maven, package-by-feature:
`auth/ user/ goal/ note/ coding/ project/ contest/ roadmap/ interview/ plan/ ai/ common/`.
`common/`: `ApiResponse<T>`, `ApiError`, `GlobalExceptionHandler`, audit `BaseEntity`.
Config: Security, CORS for the Vercel origin, Swagger UI. Wire Neon + HikariCP, Dockerfile,
deploy to Render on day 1, GitHub Actions build + test.

## Stage 3 — Auth & identity (3–4 days) — deliberately first
JWT access (~15 min) + refresh (~30 d, httpOnly cookie, rotated), BCrypt,
`POST /api/auth/{register,login,refresh,logout,forgot,reset}`, `GET|PATCH /api/users/me`.
Ownership enforced at the service layer — a user can only touch their own rows.
MailHog locally, Resend free tier in prod. MockMvc slice tests + Testcontainers.

## Stage 4 — Goals vertical slice (2 days) — the pattern every feature copies
Full Goals CRUD with DTOs, validation and ownership checks. Frontend gains `src/lib/api.ts`
(axios + JWT interceptor + auto-refresh retry), a `QueryClient` provider and feature hooks,
then the Goals page swaps off `mock.ts` with optimistic updates. This slice proves the whole
pipeline: Vercel ↔ Render ↔ Neon, auth headers, pooling, migrations, error envelope.

## Stage 5 — Feature fan-out (1.5–2 weeks, ~1 day each)
Notes CRUD → polymorphic Bookmarks wired into Contests + Hackathons → Contests/Hackathons lists +
`ADMIN` CRUD → Roadmaps read + persistent stage progress (fixes refresh-loss) → Interview hub reads +
topic progress → one aggregate `GET /api/dashboard` → Profile from real tables → retire `mock.ts`
(types move to `src/types/api.ts`; mock data survives only as seed content).

## Stage 6 — Platform sync engine (1.5 weeks)
`platform_accounts`, `coding_snapshots` (time-series + raw `payload JSONB` so charts recompute
without re-hitting rate limits), `topic_stats`, `repos`, `activity_events`. Sync order:
**Codeforces** (official API) → **GitHub** (REST + ETag + PAT) → **LeetCode** (unofficial GraphQL,
6 h cache, never blocks the UI). Sync on connect + `@Scheduled` guarded by a lock; always render the
last snapshot with a "synced X ago" badge so a platform outage never blanks the page.

## Stage 7 — Recommendation engine + daily plan, rule-based (1 week)
Weak-topic detection from snapshots/topic accuracy → `GET /api/recommendations/dsa` returning the
contract the placeholder card already renders. `GET /api/plan/today` +
`PATCH /api/plan/today/items/{id}`, computed at day start and **persisted per user+date so the plan
stays stable all day**, each item tagged with its source (weak topic · roadmap · contest · goal).
Auto-checks items when sync observes the matching solve. This engine is also the permanent
AI-off fallback.

## Stage 8 — AI layer (1.5–2 weeks)
One `AiProvider` interface + adapter (`OpenAiProvider` / `GeminiProvider`) and prompt templates, so
vendors can be swapped without touching controllers. Deterministic analytics stay deterministic —
AI explains and suggests, never invents numbers. Order: portfolio/repo review (resume bullets, README
suggestions, project improvements) → weak-topic explanations → roadmap personalization → interview
feedback. Streaming via SSE; per-user rate limits and token/cost accounting from day one.

## Stage 9 — Hardening & ship (continuous)
Rate limits on auth + AI routes, validation audit, correct 401/403/409 semantics, Testcontainers repo
tests + MockMvc slices per feature, structured logging, Actuator metrics, uptime monitoring, Neon PITR
backups, separate prod env, secrets never in git. Frontend: code-split the ~958 KB bundle via lazy
routes, a11y pass, root README + LICENSE, architecture diagram.

---

## Definition of "complete"

- [ ] Live frontend URL + live API URL, both auto-deploying from `main`
- [ ] Real accounts: register → login → JWT refresh → profile edit
- [ ] Zero mock data — all 11 sections served from Postgres
- [ ] Connect a real GitHub / Codeforces / LeetCode handle and watch stats sync
- [ ] Goals, notes, bookmarks and roadmap progress persist across sessions
- [ ] Daily plan + DSA recommendations generated server-side, stable per day
- [ ] At least one AI feature live behind a rate-limited endpoint
- [ ] Tests + CI green; schema owned by Flyway; content seeded in the DB
- [ ] README, Swagger API docs, architecture diagram

**V2 stretch ideas:** PWA install · resume builder (PDF export) · company question banks ·
AI mock interviews · college leaderboards + placement-cell admin dashboard · mentor matching ·
calendar sync for contests and deadlines.
