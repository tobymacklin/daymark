-- Daymark initial schema.
-- Plain PostgreSQL so the same file runs on the embedded PGlite development
-- driver and on a hosted Postgres (Supabase) later.
--
-- Not included yet (see docs/ROADMAP.md): row-level security policies, media and
-- evidence tables, subscriptions, analytics. Until RLS exists, authorization is
-- enforced in the server data layer: every user-data query filters by user_id.

-- ---------------------------------------------------------------------------
-- Identity
-- ---------------------------------------------------------------------------

create table profiles (
  id            uuid primary key default gen_random_uuid(),
  display_name  text not null check (char_length(display_name) between 1 and 40),
  timezone      text not null default 'UTC',
  created_at    timestamptz not null default now()
);

-- Local development session adapter. Replaced by Supabase Auth in production.
create table sessions (
  id          uuid primary key default gen_random_uuid(),
  user_id     uuid not null references profiles (id) on delete cascade,
  token_hash  text not null unique,
  created_at  timestamptz not null default now(),
  expires_at  timestamptz not null
);
create index sessions_user_id_idx on sessions (user_id);

-- ---------------------------------------------------------------------------
-- TODAY: daily experiences
-- ---------------------------------------------------------------------------

create table experiences (
  id                  uuid primary key default gen_random_uuid(),
  slug                text not null unique,
  title               text not null,
  prompt              text not null,
  steps               text[] not null default '{}',
  category            text not null,
  minutes_min         integer not null check (minutes_min > 0),
  minutes_max         integer not null check (minutes_max >= minutes_min),
  cost_cents          integer not null default 0 check (cost_cents >= 0),
  setting             text not null,
  required_items      text[] not null default '{}',
  accessibility_note  text,
  is_alternative      boolean not null default false,
  alternative_id      uuid references experiences (id),
  sort_order          integer not null default 0,
  status              text not null default 'approved'
                        check (status in ('draft', 'approved', 'retired')),
  version             integer not null default 1,
  created_at          timestamptz not null default now()
);

-- One global experience per calendar date. Each user sees the row for the
-- current date in their own timezone.
create table daily_experience_schedule (
  local_date                  date primary key,
  experience_id               uuid not null references experiences (id),
  alternative_experience_ids  uuid[] not null default '{}',
  publication_status          text not null default 'published'
                                check (publication_status in ('draft', 'published')),
  created_at                  timestamptz not null default now()
);
create index daily_experience_schedule_experience_idx
  on daily_experience_schedule (experience_id);

create table user_experience_completions (
  id                 uuid primary key default gen_random_uuid(),
  user_id            uuid not null references profiles (id) on delete cascade,
  scheduled_date     date not null references daily_experience_schedule (local_date),
  experience_id      uuid not null references experiences (id),
  completion_method  text not null check (completion_method in ('primary', 'alternative')),
  completed_at       timestamptz not null default now(),
  -- A user can complete a given day once, whichever experience they chose.
  unique (user_id, scheduled_date)
);

-- ---------------------------------------------------------------------------
-- ACHIEVE: hobby collections
-- ---------------------------------------------------------------------------

create table hobby_collections (
  id           uuid primary key default gen_random_uuid(),
  slug         text not null unique,
  name         text not null,
  tagline      text not null,
  description  text not null,
  theme        text not null,
  emblem_motif text not null,
  sort_order   integer not null default 0,
  status       text not null default 'published'
                 check (status in ('draft', 'published', 'retired')),
  version      integer not null default 1
);

create table achievements (
  id                   uuid primary key default gen_random_uuid(),
  collection_id        uuid not null references hobby_collections (id),
  slug                 text not null,
  title                text not null,
  description          text not null,
  criteria             text[] not null default '{}',
  rarity               text not null
                         check (rarity in ('bronze', 'silver', 'gold', 'platinum', 'legendary')),
  xp_reward            integer not null check (xp_reward > 0),
  estimated_time       text not null,
  estimated_cost       text not null,
  materials            text[] not null default '{}',
  safety_notes         text,
  verification_method  text not null default 'self_report'
                         check (verification_method in ('self_report')),
  badge_motif          text not null,
  sort_order           integer not null default 0,
  status               text not null default 'published'
                         check (status in ('draft', 'published', 'retired')),
  version              integer not null default 1,
  unique (collection_id, slug)
);

create table achievement_prerequisites (
  achievement_id               uuid not null references achievements (id) on delete cascade,
  prerequisite_achievement_id  uuid not null references achievements (id) on delete cascade,
  primary key (achievement_id, prerequisite_achievement_id),
  check (achievement_id <> prerequisite_achievement_id)
);

create table user_achievements (
  id                   uuid primary key default gen_random_uuid(),
  user_id              uuid not null references profiles (id) on delete cascade,
  achievement_id       uuid not null references achievements (id),
  verification_status  text not null default 'self_reported'
                         check (verification_status in ('self_reported')),
  unlocked_at          timestamptz not null default now(),
  unique (user_id, achievement_id)
);

-- ---------------------------------------------------------------------------
-- REMEMBER: memories and recall
-- ---------------------------------------------------------------------------

create table memory_entries (
  id           uuid primary key default gen_random_uuid(),
  user_id      uuid not null references profiles (id) on delete cascade,
  source_type  text not null check (source_type in ('daily_experience', 'achievement')),
  -- user_experience_completions.id or user_achievements.id, depending on source_type.
  source_id    uuid not null,
  title        text not null,
  note         text check (note is null or char_length(note) <= 2000),
  occurred_on  date not null,
  visibility   text not null default 'private' check (visibility in ('private')),
  created_at   timestamptz not null default now(),
  updated_at   timestamptz not null default now(),
  unique (user_id, source_type, source_id)
);
create index memory_entries_user_date_idx on memory_entries (user_id, occurred_on desc);

-- Each row is one review instance. Completing a review inserts the next one.
create table memory_reviews (
  id               uuid primary key default gen_random_uuid(),
  user_id          uuid not null references profiles (id) on delete cascade,
  memory_entry_id  uuid not null references memory_entries (id) on delete cascade,
  interval_days    integer not null check (interval_days > 0),
  due_on           date not null,
  completed_at     timestamptz,
  user_response    text check (user_response is null or char_length(user_response) <= 2000),
  result           text check (result in ('remembered', 'recognized', 'revealed')),
  created_at       timestamptz not null default now(),
  check ((completed_at is null) = (result is null))
);
-- At most one pending review per memory.
create unique index memory_reviews_one_pending_idx
  on memory_reviews (memory_entry_id) where completed_at is null;
create index memory_reviews_user_due_idx
  on memory_reviews (user_id, due_on) where completed_at is null;

-- ---------------------------------------------------------------------------
-- Progression
-- ---------------------------------------------------------------------------

-- Append-only XP ledger. Totals and levels are derived from it; application
-- code only ever inserts. The idempotency key stops a repeated submission from
-- awarding the same XP twice.
create table xp_transactions (
  id               uuid primary key default gen_random_uuid(),
  user_id          uuid not null references profiles (id) on delete cascade,
  amount           integer not null check (amount > 0),
  event_type       text not null
                     check (event_type in ('daily_experience', 'achievement', 'collection_mastery')),
  source_id        uuid,
  idempotency_key  text not null,
  created_at       timestamptz not null default now(),
  unique (user_id, idempotency_key)
);
