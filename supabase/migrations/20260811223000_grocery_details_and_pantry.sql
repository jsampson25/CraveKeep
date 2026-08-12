alter table public.grocery_items add column aisle text not null default 'other' check (aisle in ('produce','meat_seafood','dairy_eggs','bakery','pantry','frozen','other'));
alter table public.grocery_items add column note text not null default '';
create table public.pantry_items (
  owner_id uuid not null references auth.users(id) on delete cascade, item_key text not null, name text not null,
  quantity text not null default '', confidence text not null default 'unknown' check (confidence in ('confirmed','estimated','unknown')),
  expires_on date, updated_at timestamptz not null default now(), primary key (owner_id, item_key)
);
alter table public.pantry_items enable row level security;
create policy "pantry_items_own" on public.pantry_items for all to authenticated using (owner_id = (select auth.uid())) with check (owner_id = (select auth.uid()));
revoke all on public.pantry_items from anon;
grant select, insert, update, delete on public.pantry_items to authenticated;
