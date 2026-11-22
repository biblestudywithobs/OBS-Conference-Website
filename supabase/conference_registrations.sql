-- OBS Conference '27 registrations. Run once in the Supabase SQL editor (safe to re-run).
-- Only the website's server (secret / service_role key) can read or write: RLS is on with no policies,
-- and the functions can't be called with the public (anon) key.

create table if not exists public.conference_registrations (
  seat_no          bigint generated always as identity primary key,
  seat             text generated always as ('OBS27-' || lpad(seat_no::text, 4, '0')) stored,
  name             text not null,
  email            text not null unique,          -- stored lower-case
  phone            text not null,
  phone_normalized text not null unique,          -- digits only, without +234 / leading 0
  city             text,
  other_city       text,
  org              text,
  first_time       text,
  accommodation    text,
  merch            text,
  created_at       timestamptz not null default now()
);
alter table public.conference_registrations enable row level security;

create table if not exists public.conference_registration_attempts (
  key          text primary key,
  attempts     int not null,
  window_start timestamptz not null
);
alter table public.conference_registration_attempts enable row level security;

-- One registration per email and per phone. Serialised with a lock so two people can never get the same
-- seat and a duplicate never uses up a seat number.
create or replace function public.conference_register(r jsonb)
returns table (created boolean, seat text)
language plpgsql security definer set search_path = public as $$
declare existing text;
begin
  perform pg_advisory_xact_lock(hashtext('obs27-registrations'));
  select g.seat into existing from conference_registrations g
   where g.email = r->>'email' or g.phone_normalized = r->>'phone_normalized' limit 1;
  if existing is not null then
    return query select false, existing; return;
  end if;
  return query
  insert into conference_registrations (name, email, phone, phone_normalized, city, other_city, org, first_time, accommodation, merch)
  values (r->>'name', r->>'email', r->>'phone', r->>'phone_normalized', r->>'city', r->>'otherCity', r->>'org',
          r->>'first', r->>'accom', r->>'merch')
  returning true, conference_registrations.seat;
end $$;

-- Counts an attempt; returns the number of attempts in the current window.
create or replace function public.conference_registration_attempt(k text, window_seconds int)
returns int
language plpgsql security definer set search_path = public as $$
declare n int;
begin
  insert into conference_registration_attempts as a (key, attempts, window_start) values (k, 1, now())
  on conflict (key) do update set
    attempts     = case when a.window_start < now() - make_interval(secs => window_seconds) then 1 else a.attempts + 1 end,
    window_start = case when a.window_start < now() - make_interval(secs => window_seconds) then now() else a.window_start end
  returning attempts into n;
  return n;
end $$;

revoke all on function public.conference_register(jsonb) from public, anon, authenticated;
revoke all on function public.conference_registration_attempt(text, int) from public, anon, authenticated;
grant execute on function public.conference_register(jsonb) to service_role;
grant execute on function public.conference_registration_attempt(text, int) to service_role;
