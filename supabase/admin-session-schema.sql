-- =========================================================
-- Afradikid — Admin Session schema (admin_sessions, admin_devices)
-- اجرا در SQL Editor پروژه‌ی Supabase افRadi
-- =========================================================

-- ۱) دستگاه‌های واردشده به پنل
create table if not exists public.admin_devices (
  id text primary key,
  device_name text default '',
  platform text default '',
  browser text default '',
  user_agent text default '',
  owner_phone text not null,
  is_revoked boolean not null default false,
  is_active boolean not null default true,
  revoked_at timestamptz,
  biometric_enabled boolean not null default false,
  created_at timestamptz not null default now(),
  last_seen_at timestamptz not null default now()
);

create index if not exists idx_admin_devices_owner_phone
  on public.admin_devices (owner_phone);

-- ۲) نشست‌های ادمین
create table if not exists public.admin_sessions (
  id bigint generated always as identity primary key,
  token_hash text not null unique,
  device_id text not null references public.admin_devices(id) on delete cascade,
  owner_phone text not null,
  is_revoked boolean not null default false,
  revoked_at timestamptz,
  created_at timestamptz not null default now(),
  expires_at timestamptz not null,
  last_seen_at timestamptz not null default now()
);

create index if not exists idx_admin_sessions_token_hash
  on public.admin_sessions (token_hash);

create index if not exists idx_admin_sessions_owner_phone
  on public.admin_sessions (owner_phone);

create index if not exists idx_admin_sessions_device_id
  on public.admin_sessions (device_id);

-- ۳) RLS: فقط سرویس‌رول (Edge Functions) بتواند این جداول را بخواند/بنویسد
alter table public.admin_devices enable row level security;
alter table public.admin_sessions enable row level security;

drop policy if exists "admin_sessions_service_role" on public.admin_sessions;
create policy "admin_sessions_service_role" on public.admin_sessions
  for all to service_role using (true) with check (true);

drop policy if exists "admin_devices_service_role" on public.admin_devices;
create policy "admin_devices_service_role" on public.admin_devices
  for all to service_role using (true) with check (true);
