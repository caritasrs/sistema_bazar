-- Add role column if it doesn't exist
ALTER TABLE public.users ADD COLUMN IF NOT EXISTS role VARCHAR(50) DEFAULT 'client';

-- Delete existing records by both email and CPF to avoid conflicts
DELETE FROM public.users WHERE email IN (
  'sistema@caritasrs.org.br',
  'admin2@caritasrs.org.br',
  'admin3@caritasrs.org.br'
) OR cpf IN (
  '111.111.111-11',
  '222.222.222-22',
  '333.333.333-33'
);

-- Insert three super admins with correct password hash for "Caritas@2025Admin!"
-- Hash: $2a$12$9R8uJSCHCf/u1.SV3QKJ/uLi1r7NxEVZ6oc5FvYW6XdYKK.c3jRWa
INSERT INTO public.users (
  email,
  cpf,
  name,
  phone,
  address,
  password_hash,
  status,
  email_verified,
  email_verified_at,
  role
) VALUES
(
  'sistema@caritasrs.org.br',
  '111.111.111-11',
  'Super Admin Sistema',
  '(51) 9999-0001',
  'Rua Sistema, 1 - Porto Alegre, RS',
  '$2a$12$9R8uJSCHCf/u1.SV3QKJ/uLi1r7NxEVZ6oc5FvYW6XdYKK.c3jRWa',
  'active',
  true,
  now(),
  'super_admin'
),
(
  'admin2@caritasrs.org.br',
  '222.222.222-22',
  'Super Admin Dois',
  '(51) 9999-0002',
  'Rua Admin, 2 - Porto Alegre, RS',
  '$2a$12$9R8uJSCHCf/u1.SV3QKJ/uLi1r7NxEVZ6oc5FvYW6XdYKK.c3jRWa',
  'active',
  true,
  now(),
  'super_admin'
),
(
  'admin3@caritasrs.org.br',
  '333.333.333-33',
  'Super Admin Três',
  '(51) 9999-0003',
  'Rua Admin, 3 - Porto Alegre, RS',
  '$2a$12$9R8uJSCHCf/u1.SV3QKJ/uLi1r7NxEVZ6oc5FvYW6XdYKK.c3jRWa',
  'active',
  true,
  now(),
  'super_admin'
);
