create or replace function public.is_username_available(candidate text)
returns boolean
language sql
stable
security definer
set search_path = ''
as $$
  select
    candidate is not null
    and trim(candidate) ~ '^[a-z0-9_]{3,24}$'
    and not exists (
      select 1
      from public.profiles
      where lower(username) = lower(trim(candidate))
        and id <> auth.uid()
    );
$$;

revoke all on function public.is_username_available(text) from public, anon;
grant execute on function public.is_username_available(text) to authenticated;

comment on function public.is_username_available(text) is
  'Checks username availability while allowing the signed-in user to keep their current username.';
