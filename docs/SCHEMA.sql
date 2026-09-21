-- =============================================================================
-- CareerPilot — PostgreSQL schema (23 tables, 6 groups)
-- This file is the source of truth and is copied verbatim to
--   backend/src/main/resources/db/migration/V1__init.sql
-- Conventions: BIGINT identity PKs · TIMESTAMPTZ · snake_case · CHECK constraints
-- instead of Postgres enums · ON DELETE CASCADE for every user-owned row.
-- updated_at is maintained by the application layer (@PreUpdate).
-- =============================================================================

-- ---------------------------------------------------------------- 1. identity
CREATE TABLE users (
  id              BIGINT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
  email           TEXT        NOT NULL,
  password_hash   TEXT        NOT NULL,
  name            TEXT        NOT NULL,
  handle          TEXT,
  college         TEXT,
  batch           TEXT,
  location        TEXT,
  headline        TEXT,
  bio             TEXT,
  avatar_hue      SMALLINT    NOT NULL DEFAULT 258,
  readiness_score SMALLINT    NOT NULL DEFAULT 0,
  resume_progress SMALLINT    NOT NULL DEFAULT 0,
  role            TEXT        NOT NULL DEFAULT 'USER' CHECK (role IN ('USER', 'ADMIN')),
  created_at      TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at      TIMESTAMPTZ NOT NULL DEFAULT now()
);
CREATE UNIQUE INDEX ux_users_email  ON users (lower(email));
CREATE UNIQUE INDEX ux_users_handle ON users (lower(handle)) WHERE handle IS NOT NULL;

-- skills live in their own table rather than a Postgres array: portable across JPA and H2
CREATE TABLE user_skills (
  user_id    BIGINT NOT NULL REFERENCES users (id) ON DELETE CASCADE,
  sort_order INT    NOT NULL,
  skill      TEXT   NOT NULL,
  PRIMARY KEY (user_id, sort_order)
);

CREATE TABLE refresh_tokens (
  id         BIGINT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
  user_id    BIGINT      NOT NULL REFERENCES users (id) ON DELETE CASCADE,
  token_hash TEXT        NOT NULL UNIQUE,
  user_agent TEXT,
  expires_at TIMESTAMPTZ NOT NULL,
  revoked_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
CREATE INDEX ix_refresh_tokens_user ON refresh_tokens (user_id) WHERE revoked_at IS NULL;

CREATE TABLE password_reset_tokens (
  id         BIGINT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
  user_id    BIGINT      NOT NULL REFERENCES users (id) ON DELETE CASCADE,
  token_hash TEXT        NOT NULL UNIQUE,
  expires_at TIMESTAMPTZ NOT NULL,
  used_at    TIMESTAMPTZ,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
CREATE INDEX ix_password_reset_user ON password_reset_tokens (user_id);

-- ------------------------------------------------------------ 2. coding sync
CREATE TABLE platform_accounts (
  id             BIGINT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
  user_id        BIGINT      NOT NULL REFERENCES users (id) ON DELETE CASCADE,
  platform       TEXT        NOT NULL CHECK (platform IN ('GITHUB', 'LEETCODE', 'CODEFORCES', 'CODECHEF', 'ATCODER')),
  username       TEXT        NOT NULL,
  sync_status    TEXT        NOT NULL DEFAULT 'OK' CHECK (sync_status IN ('OK', 'STALE', 'ERROR')),
  sync_error     TEXT,
  connected_at   TIMESTAMPTZ NOT NULL DEFAULT now(),
  last_synced_at TIMESTAMPTZ,
  UNIQUE (user_id, platform)
);

-- time-series: one row per sync so trend charts never need a live API call
CREATE TABLE coding_snapshots (
  id            BIGINT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
  user_id       BIGINT      NOT NULL REFERENCES users (id) ON DELETE CASCADE,
  platform      TEXT        NOT NULL CHECK (platform IN ('GITHUB', 'LEETCODE', 'CODEFORCES', 'CODECHEF', 'ATCODER')),
  captured_at   TIMESTAMPTZ NOT NULL DEFAULT now(),
  solved        INT,
  easy          INT,
  medium        INT,
  hard          INT,
  rating        INT,
  max_rating    INT,
  rank_title    TEXT,
  global_rank   TEXT,
  streak        INT,
  contributions INT,
  payload       JSONB
);
CREATE INDEX ix_snapshots_lookup ON coding_snapshots (user_id, platform, captured_at DESC);

CREATE TABLE topic_stats (
  id         BIGINT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
  user_id    BIGINT      NOT NULL REFERENCES users (id) ON DELETE CASCADE,
  topic      TEXT        NOT NULL,
  solved     INT         NOT NULL DEFAULT 0,
  accuracy   SMALLINT    NOT NULL DEFAULT 0,
  weak       BOOLEAN     NOT NULL DEFAULT false,
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  UNIQUE (user_id, topic)
);

CREATE TABLE repos (
  id             BIGINT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
  user_id        BIGINT      NOT NULL REFERENCES users (id) ON DELETE CASCADE,
  gh_id          BIGINT,
  name           TEXT        NOT NULL,
  description    TEXT,
  stars          INT         NOT NULL DEFAULT 0,
  forks          INT         NOT NULL DEFAULT 0,
  language       TEXT,
  lang_color     TEXT,
  topics         TEXT[]      NOT NULL DEFAULT '{}',
  readme_md      TEXT,
  demo_url       TEXT,
  repo_url       TEXT,
  quality_score  SMALLINT,
  docs_score     SMALLINT,
  traction_score SMALLINT,
  featured       BOOLEAN     NOT NULL DEFAULT false,
  pushed_at      TIMESTAMPTZ,
  cached_at      TIMESTAMPTZ NOT NULL DEFAULT now(),
  UNIQUE (user_id, name)
);

CREATE TABLE activity_events (
  id          BIGINT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
  user_id     BIGINT      NOT NULL REFERENCES users (id) ON DELETE CASCADE,
  source      TEXT        NOT NULL CHECK (source IN ('GITHUB', 'LEETCODE', 'CODEFORCES', 'GOAL', 'SYSTEM')),
  text        TEXT        NOT NULL,
  meta        TEXT,
  occurred_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
CREATE INDEX ix_activity_user_time ON activity_events (user_id, occurred_at DESC);

-- ---------------------------------------------------------- 3. productivity
CREATE TABLE goals (
  id         BIGINT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
  user_id    BIGINT      NOT NULL REFERENCES users (id) ON DELETE CASCADE,
  title      TEXT        NOT NULL,
  category   TEXT        NOT NULL CHECK (category IN ('DSA', 'BACKEND', 'SQL', 'PROJECTS', 'INTERVIEWS')),
  target     INT         NOT NULL CHECK (target > 0),
  current    INT         NOT NULL DEFAULT 0 CHECK (current >= 0),
  unit       TEXT        NOT NULL DEFAULT 'items',
  deadline   TIMESTAMPTZ,
  priority   TEXT        NOT NULL DEFAULT 'MEDIUM' CHECK (priority IN ('HIGH', 'MEDIUM', 'LOW')),
  status     TEXT        NOT NULL DEFAULT 'ACTIVE' CHECK (status IN ('ACTIVE', 'DONE', 'ARCHIVED')),
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
CREATE INDEX ix_goals_user ON goals (user_id, status);

CREATE TABLE notes (
  id         BIGINT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
  user_id    BIGINT      NOT NULL REFERENCES users (id) ON DELETE CASCADE,
  title      TEXT        NOT NULL,
  category   TEXT        NOT NULL DEFAULT 'GENERAL' CHECK (category IN ('DSA', 'JAVA', 'INTERVIEW', 'REVISION', 'GENERAL')),
  content_md TEXT        NOT NULL DEFAULT '',
  pinned     BOOLEAN     NOT NULL DEFAULT false,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
CREATE INDEX ix_notes_user ON notes (user_id, pinned DESC, updated_at DESC);

-- ------------------------------------------- 4. global content (seeded, read-only)
CREATE TABLE roadmaps (
  id         BIGINT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
  slug       TEXT NOT NULL UNIQUE,
  title      TEXT NOT NULL,
  tagline    TEXT,
  emoji      TEXT,
  gradient   TEXT,
  est_weeks  TEXT,
  sort_order INT  NOT NULL DEFAULT 0
);

CREATE TABLE roadmap_stages (
  id          BIGINT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
  roadmap_id  BIGINT NOT NULL REFERENCES roadmaps (id) ON DELETE CASCADE,
  stage_index INT    NOT NULL,
  title       TEXT   NOT NULL,
  eta         TEXT,
  UNIQUE (roadmap_id, stage_index)
);

CREATE TABLE roadmap_resources (
  roadmap_id BIGINT NOT NULL REFERENCES roadmaps (id) ON DELETE CASCADE,
  sort_order INT    NOT NULL,
  resource   TEXT   NOT NULL,
  PRIMARY KEY (roadmap_id, sort_order)
);

CREATE TABLE interview_categories (
  id         BIGINT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
  slug       TEXT NOT NULL UNIQUE,
  name       TEXT NOT NULL,
  blurb      TEXT,
  sort_order INT  NOT NULL DEFAULT 0
);

CREATE TABLE interview_topics (
  id          BIGINT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
  category_id BIGINT NOT NULL REFERENCES interview_categories (id) ON DELETE CASCADE,
  title       TEXT   NOT NULL,
  summary     TEXT,
  difficulty  TEXT   CHECK (difficulty IN ('BEGINNER', 'INTERMEDIATE', 'ADVANCED')),
  minutes     INT,
  sort_order  INT    NOT NULL DEFAULT 0
);
CREATE INDEX ix_interview_topics_category ON interview_topics (category_id, sort_order);

CREATE TABLE contests (
  id          BIGINT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
  external_id TEXT,
  name        TEXT        NOT NULL,
  platform    TEXT        NOT NULL CHECK (platform IN ('LEETCODE', 'CODEFORCES', 'CODECHEF', 'ATCODER')),
  start_time  TIMESTAMPTZ NOT NULL,
  duration    TEXT,
  difficulty  TEXT,
  rated       BOOLEAN     NOT NULL DEFAULT true,
  url         TEXT,
  UNIQUE (platform, external_id)
);
CREATE INDEX ix_contests_start ON contests (start_time);

CREATE TABLE hackathons (
  id               BIGINT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
  name             TEXT        NOT NULL,
  organizer        TEXT,
  mode             TEXT        CHECK (mode IN ('ONLINE', 'HYBRID', 'OFFLINE')),
  deadline         TIMESTAMPTZ,
  theme            TEXT,
  team_size        TEXT,
  prize            TEXT,
  difficulty       TEXT        CHECK (difficulty IN ('BEGINNER_FRIENDLY', 'INTERMEDIATE', 'ADVANCED')),
  city             TEXT,
  registration_url TEXT,
  is_published     BOOLEAN     NOT NULL DEFAULT true,
  created_by       BIGINT      REFERENCES users (id) ON DELETE SET NULL,
  created_at       TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at       TIMESTAMPTZ NOT NULL DEFAULT now()
);
CREATE INDEX ix_hackathons_deadline ON hackathons (deadline) WHERE is_published;

-- -------------------------------------------------------- 5. user x content
CREATE TABLE roadmap_progress (
  id       BIGINT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
  user_id  BIGINT      NOT NULL REFERENCES users (id) ON DELETE CASCADE,
  stage_id BIGINT      NOT NULL REFERENCES roadmap_stages (id) ON DELETE CASCADE,
  done_at  TIMESTAMPTZ NOT NULL DEFAULT now(),
  UNIQUE (user_id, stage_id)
);

CREATE TABLE interview_progress (
  id       BIGINT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
  user_id  BIGINT      NOT NULL REFERENCES users (id) ON DELETE CASCADE,
  topic_id BIGINT      NOT NULL REFERENCES interview_topics (id) ON DELETE CASCADE,
  done_at  TIMESTAMPTZ NOT NULL DEFAULT now(),
  UNIQUE (user_id, topic_id)
);

-- polymorphic bookmark: one mechanism serves contests and hackathons
CREATE TABLE bookmarks (
  id         BIGINT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
  user_id    BIGINT      NOT NULL REFERENCES users (id) ON DELETE CASCADE,
  item_type  TEXT        NOT NULL CHECK (item_type IN ('CONTEST', 'HACKATHON')),
  item_key   TEXT        NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  UNIQUE (user_id, item_type, item_key)
);

-- ------------------------------------------------------------ 6. planner / AI
-- one plan per user per day, so the flight plan stays stable all day long
CREATE TABLE daily_plans (
  id           BIGINT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
  user_id      BIGINT      NOT NULL REFERENCES users (id) ON DELETE CASCADE,
  plan_date    DATE        NOT NULL,
  generated_by TEXT        NOT NULL DEFAULT 'RULES' CHECK (generated_by IN ('RULES', 'AI')),
  created_at   TIMESTAMPTZ NOT NULL DEFAULT now(),
  UNIQUE (user_id, plan_date)
);

CREATE TABLE daily_plan_items (
  id          BIGINT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
  plan_id     BIGINT      NOT NULL REFERENCES daily_plans (id) ON DELETE CASCADE,
  task        TEXT        NOT NULL,
  category    TEXT,
  source      TEXT        NOT NULL CHECK (source IN ('WEAK_TOPIC', 'ROADMAP', 'CONTEST', 'GOAL', 'REVISION')),
  source_ref  TEXT,
  est_minutes INT,
  link        TEXT,
  done        BOOLEAN     NOT NULL DEFAULT false,
  done_at     TIMESTAMPTZ,
  sort_order  INT         NOT NULL DEFAULT 0
);
CREATE INDEX ix_plan_items_plan ON daily_plan_items (plan_id, sort_order);
