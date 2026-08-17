alter table public.household_dependents
  add column if not exists loved_foods text[] not null default '{}',
  add column if not exists avoided_foods text[] not null default '{}',
  add column if not exists dietary_preferences text[] not null default '{}';

update public.household_dependents
set loved_foods = preferences
where cardinality(loved_foods) = 0
  and cardinality(preferences) > 0;

comment on column public.household_dependents.loved_foods is
  'Foods this household member enjoys and should be prioritized in meal recommendations.';
comment on column public.household_dependents.avoided_foods is
  'Foods this household member dislikes or does not want recommended.';
comment on column public.household_dependents.dietary_preferences is
  'Dietary patterns applied specifically to this household member.';
