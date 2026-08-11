create extension if not exists pgcrypto;

create type public.recipe_source_kind as enum ('manual', 'sample', 'imported');
create type public.import_status as enum ('queued', 'processing', 'needs_review', 'completed', 'failed');
create type public.import_stage as enum ('reading_source', 'finding_ingredients', 'building_steps', 'checking_details', 'preparing_recipe');

create table public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  display_name text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table public.recipes (
  id uuid primary key default gen_random_uuid(),
  owner_id uuid not null references auth.users(id) on delete cascade,
  title text not null check (char_length(title) between 1 and 200),
  description text not null default '',
  servings integer not null default 1 check (servings between 1 and 100),
  prep_minutes integer not null default 0 check (prep_minutes >= 0),
  cook_minutes integer not null default 0 check (cook_minutes >= 0),
  source_kind public.recipe_source_kind not null,
  source_label text not null,
  source_url text,
  source_creator text,
  source_captured_at timestamptz not null default now(),
  privacy text not null default 'private' check (privacy = 'private'),
  favorite boolean not null default false,
  original_recipe_id uuid references public.recipes(id) on delete restrict,
  version_number integer not null default 1 check (version_number > 0),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table public.recipe_ingredients (
  id uuid primary key default gen_random_uuid(),
  recipe_id uuid not null references public.recipes(id) on delete cascade,
  position integer not null check (position >= 0),
  quantity text not null default '',
  name text not null check (char_length(name) > 0),
  unique (recipe_id, position)
);

create table public.recipe_steps (
  id uuid primary key default gen_random_uuid(),
  recipe_id uuid not null references public.recipes(id) on delete cascade,
  position integer not null check (position >= 0),
  instruction text not null check (char_length(instruction) > 0),
  unique (recipe_id, position)
);

create table public.capture_jobs (
  id uuid primary key default gen_random_uuid(),
  owner_id uuid not null references auth.users(id) on delete cascade,
  source_url text not null,
  source_host text not null,
  source_title text,
  source_creator text,
  status public.import_status not null default 'queued',
  stage public.import_stage,
  stage_index integer not null default 0 check (stage_index between 0 and 5),
  extracted_recipe_id uuid references public.recipes(id) on delete set null,
  recovery_code text,
  error_message text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index recipes_owner_updated_idx on public.recipes(owner_id, updated_at desc);
create index capture_jobs_owner_created_idx on public.capture_jobs(owner_id, created_at desc);

alter table public.profiles enable row level security;
alter table public.recipes enable row level security;
alter table public.recipe_ingredients enable row level security;
alter table public.recipe_steps enable row level security;
alter table public.capture_jobs enable row level security;

create policy "profiles_select_own" on public.profiles for select using (auth.uid() = id);
create policy "profiles_insert_own" on public.profiles for insert with check (auth.uid() = id);
create policy "profiles_update_own" on public.profiles for update using (auth.uid() = id) with check (auth.uid() = id);

create policy "recipes_select_own" on public.recipes for select using (auth.uid() = owner_id);
create policy "recipes_insert_own" on public.recipes for insert with check (auth.uid() = owner_id and privacy = 'private');
create policy "recipes_update_own" on public.recipes for update using (auth.uid() = owner_id) with check (auth.uid() = owner_id and privacy = 'private');
create policy "recipes_delete_own" on public.recipes for delete using (auth.uid() = owner_id);

create policy "ingredients_via_owned_recipe" on public.recipe_ingredients for all
using (exists (select 1 from public.recipes where recipes.id = recipe_id and recipes.owner_id = auth.uid()))
with check (exists (select 1 from public.recipes where recipes.id = recipe_id and recipes.owner_id = auth.uid()));

create policy "steps_via_owned_recipe" on public.recipe_steps for all
using (exists (select 1 from public.recipes where recipes.id = recipe_id and recipes.owner_id = auth.uid()))
with check (exists (select 1 from public.recipes where recipes.id = recipe_id and recipes.owner_id = auth.uid()));

create policy "capture_jobs_select_own" on public.capture_jobs for select using (auth.uid() = owner_id);
create policy "capture_jobs_insert_own" on public.capture_jobs for insert with check (auth.uid() = owner_id);
create policy "capture_jobs_update_own" on public.capture_jobs for update using (auth.uid() = owner_id) with check (auth.uid() = owner_id);
create policy "capture_jobs_delete_own" on public.capture_jobs for delete using (auth.uid() = owner_id);

revoke all on public.profiles, public.recipes, public.recipe_ingredients, public.recipe_steps, public.capture_jobs from anon;
grant select, insert, update, delete on public.profiles, public.recipes, public.recipe_ingredients, public.recipe_steps, public.capture_jobs to authenticated;
