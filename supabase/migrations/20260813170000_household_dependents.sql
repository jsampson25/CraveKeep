create table public.household_dependents (
  id uuid primary key default gen_random_uuid(),
  household_id uuid not null references public.households(id) on delete cascade,
  display_name text not null check (char_length(trim(display_name)) between 1 and 60),
  member_type text not null default 'adult' check (member_type in ('adult', 'child')),
  allergies text[] not null default '{}',
  preferences text[] not null default '{}',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

alter table public.household_dependents enable row level security;
create policy "household_dependents_owner" on public.household_dependents for all
  using (exists (select 1 from public.households h where h.id = household_id and h.owner_id = auth.uid()))
  with check (exists (select 1 from public.households h where h.id = household_id and h.owner_id = auth.uid()));
grant select, insert, update, delete on public.household_dependents to authenticated;
