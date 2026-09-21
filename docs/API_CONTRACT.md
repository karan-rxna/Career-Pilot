# CareerPilot — API Contract (v1)

Frozen in Stage 0 so the backend and the frontend share one source of truth. Field names mirror
`frontend/src/data/mock.ts` exactly — the frontend swap later touches only the fetch layer.

## Conventions

| Topic | Rule |
|---|---|
| Base URL | `https://<api-host>/api` (local: `http://localhost:8080/api`) |
| Auth | `Authorization: Bearer <accessToken>` on everything except `/api/auth/*` |
| Content type | `application/json; charset=UTF-8` |
| Timestamps | ISO-8601 UTC — `2026-09-20T18:04:05Z` |
| Dates | `YYYY-MM-DD` (`planDate`) |
| Enums | `SCREAMING_SNAKE_CASE` (`HIGH`, `INTERMEDIATE`, `WEAK_TOPIC`) |
| Field names | camelCase, identical to the frontend mock layer |
| Collections | `{ "items": [...], "page": 0, "size": 20, "total": 42 }` |
| Single resource | returned unwrapped (no envelope) |
| Errors | `{ status, error, message, path, timestamp, fieldErrors? }` |
| Cursor/limits | `?page=0&size=20`, `size` capped at 100 |
| Idempotency | `PUT` for set-membership (bookmarks, progress), `PATCH` for partial updates |

### Error codes

`VALIDATION_FAILED` (400) · `UNAUTHENTICATED` (401) · `FORBIDDEN` (403) ·
`NOT_FOUND` (404) · `CONFLICT` (409 — duplicate email, duplicate goal title toggle) ·
`RATE_LIMITED` (429) · `PLATFORM_UNAVAILABLE` (503 — upstream sync failure, stale data still served).

```json
{
  "status": 400,
  "error": "VALIDATION_FAILED",
  "message": "Request validation failed",
  "path": "/api/goals",
  "timestamp": "2026-09-20T18:04:05Z",
  "fieldErrors": { "target": "must be greater than 0" }
}
```

## 1. Auth — `/api/auth`

| Method | Path | Body | Response |
|---|---|---|---|
| POST | `/register` | `{ name, email, password, college? }` | `AuthResponse` (201) |
| POST | `/login` | `{ email, password }` | `AuthResponse` |
| POST | `/refresh` | refresh cookie | `{ accessToken, expiresIn }` |
| POST | `/logout` | refresh cookie | `204` |
| POST | `/forgot` | `{ email }` | `204` (always, no user enumeration) |
| POST | `/reset` | `{ token, newPassword }` | `204` |

```json
// AuthResponse
{
  "accessToken": "eyJhbGciOiJIUzI1NiJ9...",
  "expiresIn": 900,
  "user": {
    "id": 1, "name": "Karan Rana", "email": "karan@careerpilot.app", "handle": "@karan.codes",
    "college": "B.Tech CSE · Madhav Institute of Technology and Science, Gwalior",
    "batch": "2nd Year · Class of 2028", "location": "Gwalior, India",
    "headline": "2nd-year SDE aspirant · Competitive programmer · Open source",
    "bio": "Building my way through DSA, systems and real products.",
    "avatarHue": 258, "readinessScore": 78, "resumeProgress": 82,
    "skills": ["Java", "Spring Boot", "TypeScript", "React", "SQL", "DSA"],
    "role": "USER", "joinedOn": "2026-01-14"
  }
}
```
*Refresh token is set as an httpOnly, Secure, SameSite=Lax cookie scoped to `/api/auth` and rotated on every use.*

## 2. Users — `/api/users`

| Method | Path | Body | Response |
|---|---|---|---|
| GET | `/me` | — | `User` |
| PATCH | `/me` | partial `User` (name, headline, bio, college, batch, location, skills, avatarHue) | `User` |
| GET | `/me/stats` | — | `{ goalsCompleted, readinessScore, resumeProgress, streak, solvedTotal }` |

## 3. Dashboard — `/api/dashboard`

| Method | Path | Query | Response |
|---|---|---|---|
| GET | `/` | `range=7d\|30d\|90d` | `DashboardResponse` |

One aggregate call replaces the many mock imports on the Dashboard page.

```json
{
  "user": { "name": "Karan Rana", "handle": "@karan.codes", "streak": 23 },
  "todayPlan": {
    "planDate": "2026-09-20", "generatedBy": "RULES", "completedCount": 1, "totalCount": 4,
    "items": [
      { "id": 11, "task": "Review 2 DP patterns — LIS & knapsack", "category": "DSA",
        "source": "WEAK_TOPIC", "sourceRef": "Dynamic Prog.", "estMinutes": 45,
        "link": "/app/dsa", "done": true, "doneAt": "2026-09-20T07:12:00Z", "sortOrder": 0 }
    ]
  },
  "stats": {
    "solvedTotal": 526, "solvedThisWeek": 16, "streak": 23,
    "githubContributions": 1284, "contestRating": 1523, "portfolioScore": 86
  },
  "weeklyActivity": [ { "week": "W1", "solved": 9, "commits": 18, "hours": 14 } ],
  "goals": [ { "id": 1, "title": "Solve 200 DSA questions", "current": 152, "target": 200,
               "unit": "questions", "priority": "HIGH", "status": "ACTIVE",
               "deadline": "2026-10-11T10:00:00Z" } ],
  "contests": [ { "id": 3, "name": "CodeChef Starters 220", "platform": "CODECHEF",
                  "startTime": "2026-09-21T20:00:00Z", "duration": "2h", "bookmarked": false } ],
  "activity": [ { "id": 88, "source": "LEETCODE", "text": "Solved 3 medium problems",
                  "meta": "Two Pointers", "occurredAt": "2026-09-20T17:29:00Z" } ],
  "roadmapProgress": [ { "slug": "java-backend", "title": "Java Backend", "doneStages": 8, "totalStages": 14 } ],
  "quote": { "text": "Consistency beats intensity. Show up daily.", "author": "CareerPilot" }
}
```

## 4. Coding profiles & analytics — `/api/coding`

`{platform}` ∈ `github | leetcode | codeforces | codechef | atcoder`.

| Method | Path | Body / Query | Response |
|---|---|---|---|
| POST | `/{platform}/connect` | `{ username }` | `PlatformAccount` (201, triggers first sync) |
| DELETE | `/{platform}` | — | `204` |
| POST | `/{platform}/sync` | — | `PlatformAccount` (sync now) |
| GET | `/stats` | — | `CodingStats` |
| GET | `/topics` | — | `TopicStat[]` |
| GET | `/heatmap` | `platform?`, `weeks=26` | `number[][]` (7 rows × N weeks, levels 0–4) |
| GET | `/rating-history` | `platform=codeforces`, `range=1y` | `{ t, rating, rank }[]` |
| GET | `/solve-volume` | `months=6` | `{ month, easy, medium, hard }[]` |

```json
// GET /api/coding/stats
{
  "platforms": [
    { "platform": "LEETCODE", "username": "karan_codes", "label": "LeetCode", "connected": true,
      "rating": 1723, "rankTitle": "Knight", "solved": 312, "easy": 141, "medium": 126, "hard": 45,
      "streak": 23, "globalRank": "Top 8.2%", "accent": "#ffb020",
      "syncStatus": "OK", "lastSyncedAt": "2026-09-20T17:58:00Z" },
    { "platform": "CODEFORCES", "username": "karanSh", "label": "Codeforces", "connected": true,
      "rating": 1523, "maxRating": 1591, "rankTitle": "Specialist", "solved": 214,
      "streak": 12, "globalRank": "#41,280", "accent": "#3f9cfb",
      "syncStatus": "OK", "lastSyncedAt": "2026-09-20T17:58:00Z" },
    { "platform": "GITHUB", "username": "karan-rana", "label": "GitHub", "connected": true,
      "solved": 0, "streak": 9, "accent": "#8b5cf6" }
  ],
  "connectable": [ { "platform": "CODECHEF", "label": "CodeChef", "note": "API sync coming soon" } ]
}
```
```json
// GET /api/coding/topics
[ { "name": "Arrays", "solved": 46, "accuracy": 84, "weak": false },
  { "name": "Graphs", "solved": 18, "accuracy": 46, "weak": true } ]
```
*Notes: `/heatmap` is served from snapshots, never a live call. `accuracy` refreshes when the sync engine
observes verdicts; `weak` is `accuracy < 60 && solved >= 10` until the AI layer refines it.*

## 5. Recommendations & daily plan — `/api/recommendations`, `/api/plan`

| Method | Path | Body / Query | Response |
|---|---|---|---|
| GET | `/api/recommendations/dsa` | `limit=4` | `Recommendation[]` |
| GET | `/api/plan/today` | — | `DailyPlan` (generates once per day, then stable) |
| POST | `/api/plan/today/regenerate` | — | `DailyPlan` (explicit user refresh) |
| PATCH | `/api/plan/today/items/{id}` | `{ done }` | `PlanItem` |

```json
// GET /api/recommendations/dsa?limit=4
[ { "id": "lc-213", "title": "House Robber II", "difficulty": "MEDIUM",
    "topics": ["Dynamic Programming"], "reason": "Your DP accuracy is 54% — this is the pattern you miss",
    "estMinutes": 40, "url": "https://leetcode.com/problems/house-robber-ii/", "source": "WEAK_TOPIC" } ]
```
```json
// PATCH /api/plan/today/items/11
{ "id": 11, "task": "Review 2 DP patterns — LIS & knapsack", "source": "WEAK_TOPIC",
  "estMinutes": 45, "done": true, "doneAt": "2026-09-20T07:12:00Z" }
```
*`generatedBy` is `RULES` in V1 and switches to `AI` in Stage 8 without any contract change — the
rule engine remains the fallback.*

## 6. Projects / portfolio analyzer — `/api/projects`

| Method | Path | Query | Response |
|---|---|---|---|
| GET | `/github/{username}` | `refresh=false` | `PortfolioResponse` |
| GET | `/github/{username}/repos/{name}` | — | `RepoDetail` (adds full `readmeMd` + scores) |
| POST | `/github/{username}/analyze` | — | `PortfolioResponse` (recompute scores) |

```json
// GET /api/projects/github/karan-rana
{
  "account": { "username": "karan-rana", "contributionsYear": 1284, "currentStreak": 9,
               "longestStreak": 41, "repos": 47, "stars": 318, "forks": 94,
               "followers": 128, "following": 96, "syncedAt": "2026-09-20T17:58:00Z" },
  "repos": [
    { "name": "careerpilot",
      "description": "All-in-one placement OS — connect coding profiles, track goals, prep for interviews.",
      "stars": 186, "forks": 47, "language": "TypeScript", "langColor": "#3178c6",
      "updatedAt": "2 days ago", "pushedAt": "2026-09-18T09:20:00Z",
      "readmePreview": "# CareerPilot 🚀 ...", "readmeQuality": "DEEP",
      "score": 94, "docsScore": 96, "tractionScore": 88,
      "topics": ["react", "spring-boot", "ai", "education"],
      "demoUrl": "https://careerpilot.app", "repoUrl": "https://github.com/karan-rana/careerpilot",
      "featured": true }
  ],
  "languages": [ { "name": "TypeScript", "pct": 38, "color": "#3178c6" } ],
  "quality": { "portfolioScore": 86, "docsCoverage": 67, "avgQuality": 84, "topLanguage": "TypeScript" }
}
```
*Scores are deterministic (`README` depth, topics, structure, traction) so the UI never shows fabricated
numbers; the AI layer only adds explanations and suggestions on top.*

## 7. Contests & hackathons — `/api/contests`, `/api/hackathons`

| Method | Path | Query / Body | Response |
|---|---|---|---|
| GET | `/api/contests` | `platform?`, `upcoming=true`, `page`, `size` | `Paged<Contest>` |
| GET | `/api/contests/{id}` | — | `Contest` |
| GET | `/api/hackathons` | `q?`, `mode?`, `difficulty?`, `bookmarked?` | `Paged<Hackathon>` |
| POST | `/api/hackathons` | `Hackathon` (**ADMIN**) | `Hackathon` (201) |
| PUT | `/api/hackathons/{id}` | `Hackathon` (**ADMIN**) | `Hackathon` |
| DELETE | `/api/hackathons/{id}` | — (**ADMIN**) | `204` |

```json
// Contest
{ "id": 3, "name": "CodeChef Starters 220", "platform": "CODECHEF",
  "startTime": "2026-09-21T20:00:00Z", "duration": "2h", "difficulty": "EASY",
  "rated": true, "url": "https://www.codechef.com/contests", "bookmarked": true }
// Hackathon
{ "id": 7, "name": "Smart India Hackathon 2026", "organizer": "MoE · Govt. of India",
  "mode": "OFFLINE", "deadline": "2026-10-02T10:00:00Z", "theme": "EdTech & Accessibility",
  "teamSize": "6", "prize": "₹1,00,000 + incubation", "difficulty": "INTERMEDIATE",
  "city": "Pan-India", "registrationUrl": "https://sih.gov.in", "bookmarked": false }
```

## 8. Bookmarks — `/api/bookmarks`

| Method | Path | Body / Query | Response |
|---|---|---|---|
| GET | `/` | `itemType=CONTEST\|HACKATHON` | `Bookmark[]` |
| PUT | `/` | `{ itemType, itemKey }` | `Bookmark` (idempotent) |
| DELETE | `/{itemType}/{itemKey}` | — | `204` |

## 9. Goals — `/api/goals`

| Method | Path | Body | Response |
|---|---|---|---|
| GET | `/` | `status?`, `category?` | `Paged<Goal>` |
| POST | `/` | `{ title, category, target, unit, deadline?, priority }` | `Goal` (201) |
| PATCH | `/{id}` | partial (`current`, `status`, `priority`, `deadline`, `title`) | `Goal` |
| DELETE | `/{id}` | — | `204` |

```json
{ "id": 1, "title": "Solve 200 DSA questions", "category": "DSA", "target": 200, "current": 152,
  "unit": "questions", "deadline": "2026-10-11T10:00:00Z", "priority": "HIGH", "status": "ACTIVE" }
```
*A goal auto-flips to `DONE` when `current >= target`; `FORBIDDEN` if the goal belongs to another user.*

## 10. Notes — `/api/notes`

| Method | Path | Body / Query | Response |
|---|---|---|---|
| GET | `/` | `q?` (title + content), `category?`, `pinned?` | `Paged<Note>` |
| POST | `/` | `{ title, category, contentMd }` | `Note` (201) |
| PATCH | `/{id}` | partial (`title`, `contentMd`, `category`, `pinned`) | `Note` |
| DELETE | `/{id}` | — | `204` |

```json
{ "id": 2, "title": "Spring Security + JWT flow", "category": "JAVA",
  "contentMd": "## Filter chain order\n1. SecurityContextHolder\n2. JwtAuthFilter ...",
  "pinned": true, "updatedAt": "2026-09-19T11:02:00Z" }
```

## 11. Roadmaps & interview hub — `/api/roadmaps`, `/api/interview`

| Method | Path | Body | Response |
|---|---|---|---|
| GET | `/api/roadmaps` | — | `RoadmapWithProgress[]` |
| GET | `/api/roadmaps/{slug}` | — | `RoadmapDetail` |
| PUT | `/api/roadmaps/{slug}/stages/{stageId}` | `{ done }` | `RoadmapDetail` |
| GET | `/api/interview/categories` | — | `InterviewCategory[]` (with topics + `done` flags) |
| PUT | `/api/interview/topics/{id}` | `{ done }` | `InterviewTopic` |
| GET | `/api/interview/progress` | — | `{ done, total, byCategory: [{ slug, done, total }] }` |

```json
// GET /api/roadmaps
[ { "slug": "java-backend", "title": "Java Backend", "tagline": "Spring Boot · REST · Microservices",
    "emoji": "☕", "gradient": "from-orange-500 to-amber-600", "estWeeks": "12–16 wks",
    "totalStages": 14, "doneStages": 8,
    "stages": [ { "id": 9, "stageIndex": 8, "title": "Spring Security + JWT", "eta": "wk 8", "done": false } ],
    "resources": ["Spring Boot docs", "Baeldung", "Amigoscode"] } ]
```
*Progress lives in `roadmap_progress` — this is what fixes the frontend's current refresh-loss bug.*

## 12. AI — `/api/ai` (Stage 8; endpoints reserved from day one)

| Method | Path | Body | Response |
|---|---|---|---|
| POST | `/resume-bullets` | `{ repoName }` | `{ bullets: string[] }` |
| POST | `/readme-suggestions` | `{ repoName }` | `{ suggestions: [{ title, detail }] }` |
| POST | `/project-improvements` | `{ repoName }` | `{ improvements: string[] }` |
| POST | `/explain-topic` | `{ topic }` | `{ explanation, resources: string[] }` |
| POST | `/roadmap-personalize` | `{ slug, weeksAvailable }` | `RoadmapDetail` |
| POST | `/interview-feedback` | `{ topicId, answer }` | `{ score, strengths: string[], gaps: string[] }` |

All AI routes are rate-limited per user and return `503 AI_UNAVAILABLE` when the provider is down —
the UI degrades to the rule engine instead of erroring.

---

## Frontend integration checklist (Stage 4 onward)

1. `src/lib/api.ts` — axios instance, base URL from `VITE_API_URL`, JWT interceptor, 401 → refresh → retry once.
2. `QueryClient` provider in `main.tsx`; keys: `['goals']`, `['dashboard']`, `['coding','stats']`, …
3. Feature hooks (`src/features/<feature>/use*.ts`) wrap the endpoints above.
4. Retire `mock.ts` incrementally, page by page; keep types in `src/types/api.ts`.
5. Optimistic updates for Goal progress, plan-item ticks, bookmarks and roadmap stages.
