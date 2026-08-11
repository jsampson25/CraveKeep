drop policy "profiles_select_own" on public.profiles;
drop policy "profiles_insert_own" on public.profiles;
drop policy "profiles_update_own" on public.profiles;

create policy "profiles_select_own" on public.profiles for select to authenticated
using ((select auth.uid()) = id);
create policy "profiles_insert_own" on public.profiles for insert to authenticated
with check ((select auth.uid()) = id);
create policy "profiles_update_own" on public.profiles for update to authenticated
using ((select auth.uid()) = id) with check ((select auth.uid()) = id);

drop policy "recipes_select_own" on public.recipes;
drop policy "recipes_insert_own" on public.recipes;
drop policy "recipes_update_own" on public.recipes;
drop policy "recipes_delete_own" on public.recipes;

create policy "recipes_select_own" on public.recipes for select to authenticated
using ((select auth.uid()) = owner_id);
create policy "recipes_insert_own" on public.recipes for insert to authenticated
with check ((select auth.uid()) = owner_id and privacy = 'private');
create policy "recipes_update_own" on public.recipes for update to authenticated
using ((select auth.uid()) = owner_id)
with check ((select auth.uid()) = owner_id and privacy = 'private');
create policy "recipes_delete_own" on public.recipes for delete to authenticated
using ((select auth.uid()) = owner_id);

drop policy "ingredients_via_owned_recipe" on public.recipe_ingredients;
create policy "ingredients_via_owned_recipe" on public.recipe_ingredients for all to authenticated
using (exists (
  select 1 from public.recipes
  where recipes.id = recipe_id and recipes.owner_id = (select auth.uid())
))
with check (exists (
  select 1 from public.recipes
  where recipes.id = recipe_id and recipes.owner_id = (select auth.uid())
));

drop policy "steps_via_owned_recipe" on public.recipe_steps;
create policy "steps_via_owned_recipe" on public.recipe_steps for all to authenticated
using (exists (
  select 1 from public.recipes
  where recipes.id = recipe_id and recipes.owner_id = (select auth.uid())
))
with check (exists (
  select 1 from public.recipes
  where recipes.id = recipe_id and recipes.owner_id = (select auth.uid())
));

drop policy "capture_jobs_select_own" on public.capture_jobs;
drop policy "capture_jobs_insert_own" on public.capture_jobs;
drop policy "capture_jobs_update_own" on public.capture_jobs;
drop policy "capture_jobs_delete_own" on public.capture_jobs;

create policy "capture_jobs_select_own" on public.capture_jobs for select to authenticated
using ((select auth.uid()) = owner_id);
create policy "capture_jobs_insert_own" on public.capture_jobs for insert to authenticated
with check ((select auth.uid()) = owner_id);
create policy "capture_jobs_update_own" on public.capture_jobs for update to authenticated
using ((select auth.uid()) = owner_id) with check ((select auth.uid()) = owner_id);
create policy "capture_jobs_delete_own" on public.capture_jobs for delete to authenticated
using ((select auth.uid()) = owner_id);
