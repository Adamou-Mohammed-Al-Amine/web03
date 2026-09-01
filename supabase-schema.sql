-- ============================================================================
-- editedbyamine portfolio — CMS schema
-- Run this once in Supabase: Dashboard → SQL Editor → New query → paste → Run
-- ============================================================================

-- One unified table for every section (long_form, short_form, saas,
-- collaborations). Collaboration "nodes" reuse the same row shape via
-- platform/handle/ring instead of video_url/duration, so we don't need
-- a separate table per section.
create table if not exists public.projects (
  id           uuid primary key default gen_random_uuid(),
  section      text not null check (section in ('long_form','short_form','saas','collaborations')),

  -- video-project fields (long_form / short_form / saas)
  title        text,
  description  text,
  category     text,
  year         text,
  duration     text,
  video_url    text,
  thumbnail_url text,
  client       text,
  featured     boolean not null default false,

  -- collaboration-node fields (collaborations only)
  platform     text,              -- 'youtube' | 'instagram' | 'tiktok'
  handle       text,              -- '@handle' or 'handle'
  link_url     text,              -- external profile link
  ring         smallint,          -- 1 = inner ring, 2 = outer ring

  position     integer not null default 0,
  visible      boolean not null default true,

  created_at   timestamptz not null default now(),
  updated_at   timestamptz not null default now()
);

create index if not exists projects_section_idx on public.projects (section, position);

-- keep updated_at current on every edit
create or replace function public.set_updated_at()
returns trigger language plpgsql as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

drop trigger if exists trg_projects_updated_at on public.projects;
create trigger trg_projects_updated_at
  before update on public.projects
  for each row execute function public.set_updated_at();

-- ============================================================================
-- Row Level Security
-- ============================================================================
alter table public.projects enable row level security;

-- Public (anon) visitors: read-only, and only rows marked visible.
drop policy if exists "public can read visible projects" on public.projects;
create policy "public can read visible projects"
  on public.projects for select
  to anon
  using (visible = true);

-- Logged-in admin (any authenticated Supabase user): full read/write.
-- This project has a single admin, so "authenticated" is sufficient —
-- nobody can authenticate without a login you created yourself in
-- Supabase Auth (see the setup steps in the chat reply).
drop policy if exists "authenticated can read all projects" on public.projects;
create policy "authenticated can read all projects"
  on public.projects for select
  to authenticated
  using (true);

drop policy if exists "authenticated can insert projects" on public.projects;
create policy "authenticated can insert projects"
  on public.projects for insert
  to authenticated
  with check (true);

drop policy if exists "authenticated can update projects" on public.projects;
create policy "authenticated can update projects"
  on public.projects for update
  to authenticated
  using (true)
  with check (true);

drop policy if exists "authenticated can delete projects" on public.projects;
create policy "authenticated can delete projects"
  on public.projects for delete
  to authenticated
  using (true);

-- ============================================================================
-- Seed data — this is exactly what's currently hard-coded on the live
-- site, so running this migrates you to the CMS with zero content loss.
-- Safe to re-run: it only inserts if the table is empty.
-- ============================================================================
insert into public.projects (section, title, category, year, duration, video_url, featured, position, visible)
select * from (values
  ('long_form', null, 'Featured',    '2026', '',      'https://www.youtube.com/watch?v=NXQTS1J31Tg', true,  0, true),
  ('long_form', null, 'Podcast',     '2026', '18:24', 'https://www.youtube.com/watch?v=yw6jr3jXrEI', false, 1, true),
  ('long_form', null, 'Interview',   '2026', '24:10', 'https://www.youtube.com/watch?v=PTnRYDBoS98', false, 2, true),
  ('long_form', null, 'Documentary', '2025', '15:47', 'https://www.youtube.com/watch?v=Z9P_fJGcFUA', false, 3, true),
  ('long_form', null, 'Podcast',     '2025', '21:33', 'https://www.youtube.com/watch?v=ij8dMxFkbug', false, 4, true),
  ('long_form', null, 'Brand Story', '2025', '9:52',  'https://www.youtube.com/watch?v=X2Rfjeh4QwI', false, 5, true),
  ('long_form', null, 'Interview',   '2025', '27:05', 'https://www.youtube.com/watch?v=-qQsvqKB1_Y', false, 6, true),
  ('long_form', null, 'Documentary', '2024', '19:38', 'https://www.youtube.com/watch?v=jAKU_YR0YDs', false, 7, true)
) as v(section, title, category, year, duration, video_url, featured, position, visible)
where not exists (select 1 from public.projects where section = 'long_form');

insert into public.projects (section, category, duration, year, video_url, position, visible)
select * from (values
  ('saas', 'Commercial', '0:30', '2026', 'https://www.youtube.com/watch?v=cXuI_S4f6BY', 0, true),
  ('saas', 'SaaS Ad',    '0:45', '2026', 'https://www.youtube.com/watch?v=iPB5hUqP3eU', 1, true)
) as v(section, category, duration, year, video_url, position, visible)
where not exists (select 1 from public.projects where section = 'saas');

insert into public.projects (section, year, video_url, position, visible)
select * from (values
  ('short_form', '2026', 'https://youtube.com/shorts/RHbh1ggzc5w', 0,  true),
  ('short_form', '2026', 'https://youtube.com/shorts/DpmTiegTgSg', 1,  true),
  ('short_form', '2026', 'https://youtube.com/shorts/9UYD9wNuOrE', 2,  true),
  ('short_form', '2026', 'https://youtube.com/shorts/o3Fa0lyHC-w', 3,  true),
  ('short_form', '2026', 'https://youtube.com/shorts/YUtNjogUrlU', 4,  true),
  ('short_form', '2026', 'https://youtube.com/shorts/1DY0rg1EdwA', 5,  true),
  ('short_form', '2026', 'https://youtube.com/shorts/bqh0P_7SKos', 6,  true),
  ('short_form', '2026', 'https://youtube.com/shorts/5NeUdeqINiM', 7,  true),
  ('short_form', '2026', 'https://youtube.com/shorts/hqzEK0Sb_RE', 8,  true),
  ('short_form', '2026', 'https://youtube.com/shorts/8x8if3PDtcY', 9,  true),
  ('short_form', '2026', 'https://youtube.com/shorts/auPxAjLg-qE', 10, true),
  ('short_form', '2026', 'https://youtube.com/shorts/vU1waaMwUn8', 11, true)
) as v(section, year, video_url, position, visible)
where not exists (select 1 from public.projects where section = 'short_form');

insert into public.projects (section, platform, handle, link_url, ring, position, visible)
select * from (values
  ('collaborations', 'youtube',   'mjrmgames909',       'https://www.youtube.com/@mjrmgames909',       1, 0, true),
  ('collaborations', 'youtube',   'AnasAction',         'https://www.youtube.com/@AnasAction',         1, 1, true),
  ('collaborations', 'youtube',   'Abunoo7',            'https://www.youtube.com/@Abunoo7',            1, 2, true),
  ('collaborations', 'youtube',   'POWR.Kmstka',        'https://www.youtube.com/@POWR.Kmstka',        1, 3, true),
  ('collaborations', 'instagram', 'muaazmarwah',        'https://www.instagram.com/muaazmarwah/',      2, 0, true),
  ('collaborations', 'instagram', 'h4hbm',              'https://www.instagram.com/h4hbm/',            2, 1, true),
  ('collaborations', 'youtube',   'CaptainSanshiroX',   'https://www.youtube.com/@CaptainSanshiroX',   2, 2, true)
) as v(section, platform, handle, link_url, ring, position, visible)
where not exists (select 1 from public.projects where section = 'collaborations');
