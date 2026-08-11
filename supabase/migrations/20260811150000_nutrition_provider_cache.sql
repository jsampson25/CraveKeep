create table public.nutrition_provider_cache (
  provider text not null check (provider in ('open_food_facts', 'usda', 'fatsecret')),
  query_key text not null,
  payload jsonb not null,
  fetched_at timestamptz not null default now(),
  expires_at timestamptz not null,
  primary key (provider, query_key)
);

alter table public.nutrition_provider_cache enable row level security;
revoke all on public.nutrition_provider_cache from anon, authenticated;
grant all on public.nutrition_provider_cache to service_role;
create index nutrition_provider_cache_expiry_idx on public.nutrition_provider_cache (expires_at);
