create table public.recipe_nutrition_estimates (
  id uuid primary key default gen_random_uuid(),
  recipe_id uuid not null unique references public.recipes(id) on delete cascade,
  owner_id uuid not null references auth.users(id) on delete cascade,
  servings integer not null check (servings > 0),
  calories numeric not null check (calories >= 0),
  protein_grams numeric not null check (protein_grams >= 0),
  carbohydrate_grams numeric not null check (carbohydrate_grams >= 0),
  fat_grams numeric not null check (fat_grams >= 0),
  sodium_milligrams numeric not null check (sodium_milligrams >= 0),
  coverage numeric not null check (coverage between 0 and 1),
  confidence text not null check (confidence in ('low', 'medium', 'high')),
  serving_assumption text not null,
  calculated_at timestamptz not null
);

create table public.nutrition_ingredient_matches (
  id uuid primary key default gen_random_uuid(),
  estimate_id uuid not null references public.recipe_nutrition_estimates(id) on delete cascade,
  position integer not null check (position >= 0),
  ingredient_id text not null,
  ingredient_name text not null,
  provider text not null check (provider in ('usda', 'open_food_facts', 'fatsecret')),
  provider_id text not null,
  serving_id text,
  matched_name text not null,
  grams numeric not null check (grams > 0),
  basis_grams numeric not null check (basis_grams > 0),
  calories numeric not null check (calories >= 0),
  protein_grams numeric not null check (protein_grams >= 0),
  carbohydrate_grams numeric not null check (carbohydrate_grams >= 0),
  fat_grams numeric not null check (fat_grams >= 0),
  sodium_milligrams numeric not null check (sodium_milligrams >= 0),
  confidence text not null check (confidence in ('low', 'medium', 'high')),
  unique (estimate_id, position)
);

alter table public.recipe_nutrition_estimates enable row level security;
alter table public.nutrition_ingredient_matches enable row level security;
create policy "nutrition_estimates_own" on public.recipe_nutrition_estimates for all to authenticated using (owner_id = (select auth.uid())) with check (owner_id = (select auth.uid()));
create policy "nutrition_matches_via_estimate" on public.nutrition_ingredient_matches for all to authenticated
using (exists (select 1 from public.recipe_nutrition_estimates e where e.id = estimate_id and e.owner_id = (select auth.uid())))
with check (exists (select 1 from public.recipe_nutrition_estimates e where e.id = estimate_id and e.owner_id = (select auth.uid())));
revoke all on public.recipe_nutrition_estimates, public.nutrition_ingredient_matches from anon;
grant select, insert, update, delete on public.recipe_nutrition_estimates, public.nutrition_ingredient_matches to authenticated;
