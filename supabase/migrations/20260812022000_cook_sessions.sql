create table public.cook_sessions (
  id uuid primary key default gen_random_uuid(),
  owner_id uuid not null references auth.users(id) on delete cascade,
  recipe_id uuid not null references public.recipes(id) on delete cascade,
  taste smallint not null check (taste between 1 and 5),
  effort text not null check (effort in ('easy', 'expected', 'hard')),
  repeat_intent boolean not null,
  notes text not null default '' check (char_length(notes) <= 2000),
  cooked_at timestamptz not null default now()
);

create index cook_sessions_owner_cooked_idx on public.cook_sessions(owner_id, cooked_at desc);
create index cook_sessions_recipe_cooked_idx on public.cook_sessions(recipe_id, cooked_at desc);
alter table public.cook_sessions enable row level security;
create policy "cook_sessions_select_own" on public.cook_sessions for select to authenticated using ((select auth.uid()) = owner_id);
create policy "cook_sessions_insert_own" on public.cook_sessions for insert to authenticated with check ((select auth.uid()) = owner_id);
create policy "cook_sessions_update_own" on public.cook_sessions for update to authenticated using ((select auth.uid()) = owner_id) with check ((select auth.uid()) = owner_id);
create policy "cook_sessions_delete_own" on public.cook_sessions for delete to authenticated using ((select auth.uid()) = owner_id);
revoke all on public.cook_sessions from anon;
grant select, insert, update, delete on public.cook_sessions to authenticated;
