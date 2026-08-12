create table public.grocery_items (
  id uuid primary key default gen_random_uuid(), owner_id uuid not null references auth.users(id) on delete cascade,
  item_key text not null, name text not null, quantity text not null default '', source_recipe_ids uuid[] not null default '{}',
  checked boolean not null default false, uncertain boolean not null default false, updated_at timestamptz not null default now(),
  unique (owner_id, item_key)
);
alter table public.grocery_items enable row level security;
create policy "grocery_items_own" on public.grocery_items for all to authenticated using (owner_id = (select auth.uid())) with check (owner_id = (select auth.uid()));
revoke all on public.grocery_items from anon;
grant select, insert, update, delete on public.grocery_items to authenticated;
