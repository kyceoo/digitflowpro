-- Insert some sample access keys for testing
-- In production, these would be generated and distributed securely
insert into public.access_keys (access_key, is_active, expires_at)
values 
  ('DFP-2024-ALPHA-001', true, now() + interval '1 year'),
  ('DFP-2024-ALPHA-002', true, now() + interval '1 year'),
  ('DFP-2024-ALPHA-003', true, now() + interval '1 year'),
  ('DFP-2024-BETA-001', true, now() + interval '6 months'),
  ('DFP-2024-BETA-002', true, now() + interval '6 months')
on conflict (access_key) do nothing;
