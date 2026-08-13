alter table public.profiles
  add column if not exists username text,
  add column if not exists avatar_url text,
  add column if not exists onboarding_completed boolean not null default false;

create unique index if not exists profiles_username_unique
  on public.profiles (lower(username)) where username is not null;

alter table public.profiles
  drop constraint if exists profiles_username_format,
  add constraint profiles_username_format check (
    username is null or username ~ '^[a-z0-9_]{3,24}$'
  );

create table public.food_profiles (
  owner_id uuid primary key references auth.users(id) on delete cascade,
  loved_foods text[] not null default '{}',
  avoided_foods text[] not null default '{}',
  never_suggest_foods text[] not null default '{}',
  allergies text[] not null default '{}',
  dietary_preferences text[] not null default '{}',
  cooking_time text not null default 'Any',
  cooking_skill text not null default 'Intermediate',
  appliances text[] not null default '{}',
  updated_at timestamptz not null default now()
);

create table public.nutrition_goals (
  owner_id uuid primary key references auth.users(id) on delete cascade,
  goal text not null default 'balanced',
  calculation_mode text not null default 'manual' check (calculation_mode in ('manual', 'calculated')),
  calories integer not null default 2000 check (calories between 800 and 6000),
  protein_grams integer not null default 100 check (protein_grams between 0 and 500),
  carbohydrate_grams integer not null default 225 check (carbohydrate_grams between 0 and 800),
  fat_grams integer not null default 67 check (fat_grams between 0 and 300),
  fiber_grams integer not null default 25 check (fiber_grams between 0 and 100),
  age integer check (age between 13 and 120),
  sex_for_calculation text check (sex_for_calculation in ('female', 'male')),
  height_cm numeric check (height_cm between 100 and 250),
  current_weight_kg numeric check (current_weight_kg between 30 and 400),
  target_weight_kg numeric check (target_weight_kg between 30 and 400),
  activity_level text,
  weekly_average boolean not null default true,
  flexible_day boolean not null default true,
  updated_at timestamptz not null default now()
);

create table public.households (
  id uuid primary key default gen_random_uuid(),
  owner_id uuid not null references auth.users(id) on delete cascade,
  name text not null check (char_length(trim(name)) between 1 and 80),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table public.household_members (
  household_id uuid not null references public.households(id) on delete cascade,
  user_id uuid not null references auth.users(id) on delete cascade,
  role text not null default 'member' check (role in ('owner', 'adult', 'child', 'member')),
  display_name text,
  primary key (household_id, user_id)
);

alter table public.food_profiles enable row level security;
alter table public.nutrition_goals enable row level security;
alter table public.households enable row level security;
alter table public.household_members enable row level security;

create policy "food_profiles_own" on public.food_profiles for all using (auth.uid() = owner_id) with check (auth.uid() = owner_id);
create policy "nutrition_goals_own" on public.nutrition_goals for all using (auth.uid() = owner_id) with check (auth.uid() = owner_id);
create policy "households_members_read" on public.households for select using (exists (select 1 from public.household_members m where m.household_id = id and m.user_id = auth.uid()));
create policy "households_owner_write" on public.households for all using (auth.uid() = owner_id) with check (auth.uid() = owner_id);
create policy "household_members_read" on public.household_members for select using (user_id = auth.uid() or exists (select 1 from public.households h where h.id = household_id and h.owner_id = auth.uid()));
create policy "household_members_owner_write" on public.household_members for all using (exists (select 1 from public.households h where h.id = household_id and h.owner_id = auth.uid())) with check (exists (select 1 from public.households h where h.id = household_id and h.owner_id = auth.uid()));

grant select, insert, update, delete on public.food_profiles, public.nutrition_goals, public.households, public.household_members to authenticated;

create or replace function public.create_my_household(household_name text)
returns uuid language plpgsql security definer set search_path = '' as $$
declare new_id uuid;
begin
  insert into public.households (owner_id, name) values (auth.uid(), trim(household_name)) returning id into new_id;
  insert into public.household_members (household_id, user_id, role) values (new_id, auth.uid(), 'owner');
  return new_id;
end; $$;

revoke all on function public.create_my_household(text) from public, anon;
grant execute on function public.create_my_household(text) to authenticated;
