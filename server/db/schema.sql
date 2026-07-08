-- Virelto Tools — Supabase schema
-- Run this once in the Supabase SQL editor for your project.
-- Stores only user metadata and subscription status — never any PDF/file data.

create table if not exists public.profiles (
  id uuid primary key references auth.users (id) on delete cascade,
  email text not null,
  role text not null default 'user' check (role in ('user', 'admin')),
  created_at timestamptz not null default now()
);

-- Safe to re-run against a database that already has `profiles` without `role`.
alter table public.profiles
  add column if not exists role text not null default 'user' check (role in ('user', 'admin'));

-- Promote an existing user to admin (removes the usage limit for them):
--   update public.profiles set role = 'admin' where email = 'you@example.com';

create table if not exists public.subscriptions (
  user_id uuid primary key references auth.users (id) on delete cascade,
  stripe_customer_id text unique,
  stripe_subscription_id text unique,
  plan text not null default 'free' check (plan in ('free', 'pro')),
  status text not null default 'inactive'
    check (status in ('inactive', 'active', 'past_due', 'canceled')),
  current_period_end timestamptz,
  updated_at timestamptz not null default now()
);

alter table public.profiles enable row level security;
alter table public.subscriptions enable row level security;

-- Users can read their own profile / subscription only.
create policy "Users read own profile"
  on public.profiles for select
  using (auth.uid() = id);

create policy "Users read own subscription"
  on public.subscriptions for select
  using (auth.uid() = user_id);

-- Only the service role (Stripe webhook) writes subscription data.
create policy "Service role manages subscriptions"
  on public.subscriptions for all
  using (auth.role() = 'service_role')
  with check (auth.role() = 'service_role');

-- Auto-create a profile row whenever a new auth user signs up.
create or replace function public.handle_new_user()
returns trigger as $$
begin
  insert into public.profiles (id, email)
  values (new.id, new.email)
  on conflict (id) do nothing;

  insert into public.subscriptions (user_id, plan, status)
  values (new.id, 'free', 'inactive')
  on conflict (user_id) do nothing;

  return new;
end;
$$ language plpgsql security definer;

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute procedure public.handle_new_user();
