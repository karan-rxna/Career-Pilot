# CareerPilot API

Spring Boot backend for CareerPilot — Java 21, PostgreSQL (Neon), Flyway migrations, JWT auth.

See [`docs/BUILD_PLAN.md`](../docs/BUILD_PLAN.md) for the staged plan, [`docs/API_CONTRACT.md`](../docs/API_CONTRACT.md)
for every endpoint, and [`docs/SCHEMA.sql`](../docs/SCHEMA.sql) for the schema (identical to `V1__init.sql`).

## Requirements

- JDK 21
- Maven 3.9+ (or use the wrapper once generated)
- A PostgreSQL database — [Neon](https://neon.tech) free tier is what this project targets

## Configuration

Everything is environment-driven; nothing secret lives in the repo.

| Variable | Default | Notes |
|---|---|---|
| `DATABASE_URL` | `jdbc:postgresql://localhost:5432/careerpilot` | Neon gives `postgresql://…` — prefix with `jdbc:` and keep `?sslmode=require` |
| `DATABASE_USER` | `careerpilot` | |
| `DATABASE_PASSWORD` | `careerpilot` | |
| `JWT_SECRET` | dev placeholder | **must be ≥ 32 bytes** — override in production |
| `COOKIE_SECURE` | `false` | set `true` in production (HTTPS) |
| `CORS_ALLOWED_ORIGINS` | `http://localhost:5173,http://localhost:5174` | your Vercel URL in production |
| `PORT` | `8080` | injected by Render |

## Run

```bash
# 1. point at a database (Neon connection string, pooled)
export DATABASE_URL="jdbc:postgresql://<host>/<db>?sslmode=require&user=<user>&password=<pw>"
export JWT_SECRET="a-long-random-string-of-at-least-32-bytes"

# 2. Flyway creates the schema and seeds the global content on first start
mvn spring-boot:run

# 3. check it
curl http://localhost:8080/actuator/health
```

Flyway owns the schema (`V1__init.sql`, `V2__seed.sql`); Hibernate runs with `ddl-auto=validate` and
will refuse to start if an entity drifts from the database.

## What exists today (Stage 2 + 3)

| Area | Status |
|---|---|
| Schema + seeds | 23 tables, 5 roadmaps, 7 interview categories, contests, hackathons |
| Security | JWT resource server (HS256), BCrypt, CORS, `ROLE_ADMIN` on `/api/admin/**` |
| Auth | register · login · refresh (rotated httpOnly cookie) · logout · forgot · reset |
| Profile | `GET/PATCH /api/users/me`, `GET /api/users/me/stats` |
| Health | `/actuator/health`, `/actuator/health/liveness`, `/actuator/health/readiness` |

Next: Goals CRUD (Stage 4) — the vertical slice that proves the deployed pipeline end-to-end.

## Notes

- Password-reset tokens are stored hashed and are **logged** in dev instead of emailed
  (`COOKIE_SECURE=false`); wire Resend/SMTP before production.
- Refresh tokens are single-use: every `/refresh` call revokes the presented token and issues a new
  one. A password reset revokes all sessions.
- Tests are unit-level so CI needs no database. Testcontainers-based repository tests arrive with the
  next feature stage.

## Deploy (Render)

1. New → Web Service → connect this repo.
2. Runtime: **Docker**, Dockerfile path `backend/Dockerfile`, root directory `backend`.
3. Add the env vars above (`COOKIE_SECURE=true`, your Vercel origin in `CORS_ALLOWED_ORIGINS`).
4. Health check path `/actuator/health`.
