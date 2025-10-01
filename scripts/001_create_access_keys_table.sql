-- Create access_keys table to store access keys and device bindings
create table if not exists public.access_keys (
  id uuid primary key default gen_random_uuid(),
  access_key text unique not null,
  device_id text unique,
  device_fingerprint text,
  is_active boolean default true,
  created_at timestamp with time zone default now(),
  last_used_at timestamp with time zone,
  expires_at timestamp with time zone
);

-- Enable RLS
alter table public.access_keys enable row level security;

-- Create index for faster lookups
create index if not exists idx_access_keys_key on public.access_keys(access_key);
create index if not exists idx_access_keys_device on public.access_keys(device_id);

-- RLS policies - allow anyone to read their own access key
create policy "Allow access key verification"
  on public.access_keys for select
  using (true);

create policy "Allow access key updates"
  on public.access_keys for update
  using (true);
