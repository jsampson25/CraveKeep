create table public.daily_nutrition_targets (
  owner_id uuid primary key references auth.users(id) on delete cascade,
  calories numeric not null check (calories >= 0),
  protein_grams numeric not null check (protein_grams >= 0),
  carbohydrate_grams numeric not null check (carbohydrate_grams >= 0),
  fat_grams numeric not null check (fat_grams >= 0),
  sodium_milligrams numeric not null check (sodium_milligrams >= 0),
  updated_at timestamptz not null default now()
);

create table public.planned_meals (
  id uuid primary key default gen_random_uuid(),
  owner_id uuid not null references auth.users(id) on delete cascade,
  meal_date date not null,
  slot text not null check (slot in ('breakfast', 'lunch', 'dinner', 'snack')),
  recipe_id uuid not null references public.recipes(id) on delete cascade,
  servings numeric not null check (servings > 0 and servings <= 20),
  status text not null default 'planned' check (status in ('planned', 'eaten')),
  created_at timestamptz not null default now()
);

create index planned_meals_owner_date_idx on public.planned_meals (owner_id, meal_date);
alter table public.daily_nutrition_targets enable row level security;
alter table public.planned_meals enable row level security;
create policy "daily_targets_own" on public.daily_nutrition_targets for all to authenticated using (owner_id = (select auth.uid())) with check (owner_id = (select auth.uid()));
create policy "planned_meals_own" on public.planned_meals for all to authenticated using (owner_id = (select auth.uid())) with check (owner_id = (select auth.uid()));
revoke all on public.daily_nutrition_targets, public.planned_meals from anon;
grant select, insert, update, delete on public.daily_nutrition_targets, public.planned_meals to authenticated;
