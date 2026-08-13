create or replace function public.is_username_available(candidate text)
returns boolean language sql stable security definer set search_path = '' as $$
  select not exists (
    select 1 from public.profiles
    where lower(username) = lower(trim(candidate)) and id <> auth.uid()
  );
$$;
revoke all on function public.is_username_available(text) from public, anon;
grant execute on function public.is_username_available(text) to authenticated;
