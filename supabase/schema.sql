-- ============================================================================
-- The Builders Circle — Supabase schema
-- Run this once in your Supabase project: Dashboard → SQL Editor → paste → Run.
-- Safe to re-run (idempotent). See SETUP-SUPABASE.md for the full guide.
-- ============================================================================

-- ---------------------------------------------------------------------------
-- PROFILES  (1 row per signed-in member; auto-created on sign-up)
-- ---------------------------------------------------------------------------
create table if not exists public.profiles (
  id           uuid primary key references auth.users (id) on delete cascade,
  name         text not null default 'New Builder',
  role         text not null default 'Member',
  profession   text default '',
  location     text default '',
  expertise    text[] default '{}',
  building     text default '',
  can_help     text default '',
  archetype    text,
  initials     text default '··',
  accent       text default '#CFA646',
  founder      boolean not null default false,
  joined_stage text not null default 'Participate',
  created_at   timestamptz not null default now()
);

alter table public.profiles enable row level security;
drop policy if exists "profiles are viewable by authenticated" on public.profiles;
create policy "profiles are viewable by authenticated" on public.profiles
  for select to authenticated using (true);
drop policy if exists "users update own profile" on public.profiles;
create policy "users update own profile" on public.profiles
  for update to authenticated using (auth.uid() = id) with check (auth.uid() = id);
drop policy if exists "users insert own profile" on public.profiles;
create policy "users insert own profile" on public.profiles
  for insert to authenticated with check (auth.uid() = id);

-- Auto-create a profile row when a new auth user signs up.
create or replace function public.handle_new_user()
returns trigger language plpgsql security definer set search_path = public as $$
declare
  base text := coalesce(split_part(new.email, '@', 1), 'Builder');
begin
  insert into public.profiles (id, name, initials)
  values (
    new.id,
    initcap(replace(base, '.', ' ')),
    upper(left(base, 2))
  )
  on conflict (id) do nothing;
  return new;
end;
$$;

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute function public.handle_new_user();

-- ---------------------------------------------------------------------------
-- COMMUNITY FEED
-- ---------------------------------------------------------------------------
create table if not exists public.posts (
  id         uuid primary key default gen_random_uuid(),
  author_id  uuid not null references public.profiles (id) on delete cascade,
  type       text not null default 'update' check (type in ('win','opportunity','resource','update')),
  body       text not null,
  created_at timestamptz not null default now()
);
alter table public.posts enable row level security;
drop policy if exists "posts viewable" on public.posts;
create policy "posts viewable" on public.posts for select to authenticated using (true);
drop policy if exists "insert own post" on public.posts;
create policy "insert own post" on public.posts for insert to authenticated with check (auth.uid() = author_id);
drop policy if exists "delete own post" on public.posts;
create policy "delete own post" on public.posts for delete to authenticated using (auth.uid() = author_id);

create table if not exists public.comments (
  id         uuid primary key default gen_random_uuid(),
  post_id    uuid not null references public.posts (id) on delete cascade,
  author_id  uuid not null references public.profiles (id) on delete cascade,
  body       text not null,
  created_at timestamptz not null default now()
);
alter table public.comments enable row level security;
drop policy if exists "comments viewable" on public.comments;
create policy "comments viewable" on public.comments for select to authenticated using (true);
drop policy if exists "insert own comment" on public.comments;
create policy "insert own comment" on public.comments for insert to authenticated with check (auth.uid() = author_id);

create table if not exists public.cheers (
  post_id uuid not null references public.posts (id) on delete cascade,
  user_id uuid not null references public.profiles (id) on delete cascade,
  primary key (post_id, user_id)
);
alter table public.cheers enable row level security;
drop policy if exists "cheers viewable" on public.cheers;
create policy "cheers viewable" on public.cheers for select to authenticated using (true);
drop policy if exists "manage own cheer" on public.cheers;
create policy "manage own cheer" on public.cheers for all to authenticated
  using (auth.uid() = user_id) with check (auth.uid() = user_id);

-- ---------------------------------------------------------------------------
-- BUILDER ASSESSMENT  (1 row per user)
-- ---------------------------------------------------------------------------
create table if not exists public.builder_profiles (
  user_id            uuid primary key references public.profiles (id) on delete cascade,
  scores             jsonb not null,
  primary_archetype  text not null,
  secondary_archetype text not null,
  contribution_style text,
  growth_areas       text[] default '{}',
  completed_at       timestamptz not null default now()
);
alter table public.builder_profiles enable row level security;
drop policy if exists "assessments viewable" on public.builder_profiles;
create policy "assessments viewable" on public.builder_profiles for select to authenticated using (true);
drop policy if exists "upsert own assessment" on public.builder_profiles;
create policy "upsert own assessment" on public.builder_profiles for all to authenticated
  using (auth.uid() = user_id) with check (auth.uid() = user_id);

-- ---------------------------------------------------------------------------
-- EVENTS & RSVPs  (events are shared/seeded; RSVPs are per-user)
-- ---------------------------------------------------------------------------
create table if not exists public.events (
  id          text primary key,
  title       text not null,
  kind        text,
  pillar      text,
  date        date,
  time        text,
  duration    text,
  mode        text,
  location    text,
  host_name   text,
  description text,
  blurb       text
);
alter table public.events enable row level security;
drop policy if exists "events viewable" on public.events;
create policy "events viewable" on public.events for select to authenticated using (true);

create table if not exists public.rsvps (
  event_id text not null references public.events (id) on delete cascade,
  user_id  uuid not null references public.profiles (id) on delete cascade,
  primary key (event_id, user_id)
);
alter table public.rsvps enable row level security;
drop policy if exists "rsvps viewable" on public.rsvps;
create policy "rsvps viewable" on public.rsvps for select to authenticated using (true);
drop policy if exists "manage own rsvp" on public.rsvps;
create policy "manage own rsvp" on public.rsvps for all to authenticated
  using (auth.uid() = user_id) with check (auth.uid() = user_id);

-- ---------------------------------------------------------------------------
-- PHASE 2 (schema ready; client wiring can follow the same pattern)
-- ---------------------------------------------------------------------------
create table if not exists public.marketplace_posts (
  id uuid primary key default gen_random_uuid(),
  author_id uuid not null references public.profiles (id) on delete cascade,
  building text, need text, offer text,
  created_at timestamptz not null default now()
);
alter table public.marketplace_posts enable row level security;
drop policy if exists "mk viewable" on public.marketplace_posts;
create policy "mk viewable" on public.marketplace_posts for select to authenticated using (true);
drop policy if exists "mk insert own" on public.marketplace_posts;
create policy "mk insert own" on public.marketplace_posts for insert to authenticated with check (auth.uid() = author_id);

create table if not exists public.goals (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references public.profiles (id) on delete cascade,
  category text not null, title text not null, progress int not null default 0,
  created_at timestamptz not null default now()
);
alter table public.goals enable row level security;
drop policy if exists "goals own" on public.goals;
create policy "goals own" on public.goals for all to authenticated
  using (auth.uid() = user_id) with check (auth.uid() = user_id);

create table if not exists public.recognitions (
  id uuid primary key default gen_random_uuid(),
  from_id uuid not null references public.profiles (id) on delete cascade,
  to_id   uuid not null references public.profiles (id) on delete cascade,
  type text not null, note text not null,
  created_at timestamptz not null default now()
);
alter table public.recognitions enable row level security;
drop policy if exists "rec viewable" on public.recognitions;
create policy "rec viewable" on public.recognitions for select to authenticated using (true);
drop policy if exists "rec insert own" on public.recognitions;
create policy "rec insert own" on public.recognitions for insert to authenticated with check (auth.uid() = from_id);

create table if not exists public.groups (
  id text primary key, name text not null, icon text, description text
);
alter table public.groups enable row level security;
drop policy if exists "groups viewable" on public.groups;
create policy "groups viewable" on public.groups for select to authenticated using (true);

create table if not exists public.group_members (
  group_id text not null references public.groups (id) on delete cascade,
  user_id  uuid not null references public.profiles (id) on delete cascade,
  primary key (group_id, user_id)
);
alter table public.group_members enable row level security;
drop policy if exists "gm viewable" on public.group_members;
create policy "gm viewable" on public.group_members for select to authenticated using (true);
drop policy if exists "gm manage own" on public.group_members;
create policy "gm manage own" on public.group_members for all to authenticated
  using (auth.uid() = user_id) with check (auth.uid() = user_id);

create table if not exists public.project_spaces (
  id uuid primary key default gen_random_uuid(),
  name text not null, owner_id uuid references public.profiles (id) on delete set null,
  status text not null default 'Forming', description text,
  created_at timestamptz not null default now()
);
alter table public.project_spaces enable row level security;
drop policy if exists "spaces viewable" on public.project_spaces;
create policy "spaces viewable" on public.project_spaces for select to authenticated using (true);
drop policy if exists "spaces insert own" on public.project_spaces;
create policy "spaces insert own" on public.project_spaces for insert to authenticated with check (auth.uid() = owner_id);

create table if not exists public.space_members (
  space_id uuid not null references public.project_spaces (id) on delete cascade,
  user_id  uuid not null references public.profiles (id) on delete cascade,
  primary key (space_id, user_id)
);
alter table public.space_members enable row level security;
drop policy if exists "sm viewable" on public.space_members;
create policy "sm viewable" on public.space_members for select to authenticated using (true);
drop policy if exists "sm manage own" on public.space_members;
create policy "sm manage own" on public.space_members for all to authenticated
  using (auth.uid() = user_id) with check (auth.uid() = user_id);

-- ---------------------------------------------------------------------------
-- SEED shared read-only content (events + discussion groups)
-- ---------------------------------------------------------------------------
insert into public.events (id,title,kind,pillar,date,time,duration,mode,location,host_name,description,blurb) values
 ('e1','Builder Session — Personal Brand & Leadership','Builder Session','Build','2026-06-26','21:00','90 min','Virtual','Zoom','Deborah Asante','August’s learning cycle: making your values, strengths, and work clearly understood — then the Builder Hot Seat.','Learn · Discuss · Experience · Apply · Reflect'),
 ('e2','Builder’s Table — Stories That Shaped Us','Builder''s Table','Belong','2026-06-28','19:00','3 hrs','In-person','East Legon, Accra','Angel Mensah','The heart of the Circle. Good food, deep conversation, no agenda. Each founder shares one experience that changed their life.','Vulnerability · Reflection · Trust-building'),
 ('e3','Builder Marketplace — What I’m Building','Builder Marketplace','Bridge','2026-07-11','17:00','2 hrs','In-person','Impact Hub, Accra','Elisha Boateng','Each builder presents a project, a challenge, an opportunity, and a goal in 5 minutes. The group answers: how can we help?','Projects · Ideas · Opportunities'),
 ('e4','Builder Walk — Sunrise at the Ridge','Builder Walk','Belong','2026-07-19','06:30','75 min','In-person','Aburi Gardens','Zara Mwangi','Walk and talk. No presentations. Just conversation and good company.','Walk · Talk · Connect'),
 ('e5','Founder Session — Alignment & Planning','Founder Session','Build','2026-07-09','21:00','90 min','Virtual','Zoom','Deborah Asante','Bi-weekly founder rhythm: learning, accountability, alignment, planning.','Learning · Accountability · Alignment')
on conflict (id) do nothing;

insert into public.groups (id,name,icon,description) values
 ('dg-entrepreneurship','Entrepreneurship','trendingUp','Founders & operators trading playbooks on building ventures.'),
 ('dg-technology','Technology','sparkle','AI, product, and engineering — what we’re building and learning.'),
 ('dg-finance','Finance','briefcase','Investing, fundraising, and financial discipline for builders.'),
 ('dg-leadership','Leadership','groups','Becoming the kind of leaders the Circle is built on.'),
 ('dg-faith','Faith & Purpose','compass','Calling, ethics, stewardship, and building with meaning.')
on conflict (id) do nothing;

-- Done. ✦
