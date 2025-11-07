-- Add role column to users table if it doesn't exist
ALTER TABLE public.users ADD COLUMN IF NOT EXISTS role VARCHAR(50) DEFAULT 'client';

-- Create indexes for performance
CREATE INDEX IF NOT EXISTS idx_users_role ON public.users(role);
CREATE INDEX IF NOT EXISTS idx_users_status_role ON public.users(status, role);

-- Delete existing super admins to avoid CPF conflicts, then seed new ones
DELETE FROM public.users WHERE email IN ('sistema@caritasrs.org.br', 'gerente@caritasrs.org.br', 'diretor@caritasrs.org.br');

-- Seed 3 super admins with bcrypt hashed passwords (same hash for all: Caritas@2025Admin!)
-- SuperAdmin1: sistema@caritasrs.org.br | Password: Caritas@2025Admin!
-- SuperAdmin2: gerente@caritasrs.org.br | Password: Caritas@2025Admin!
-- SuperAdmin3: diretor@caritasrs.org.br | Password: Caritas@2025Admin!
-- Bcrypt hash: $2b$12$LQv3c1yqBWVHxkd0LHAkCOYz6TtxMQJqhN8/LewY5YmMxSUaqvFm2

INSERT INTO public.users (email, cpf, name, phone, address, password_hash, role, status, created_at, updated_at) 
VALUES 
  ('sistema@caritasrs.org.br', '111.111.111-11', 'Sistema - Caritas RS', '(51) 3000-0001', 'Porto Alegre, RS', '$2b$12$LQv3c1yqBWVHxkd0LHAkCOYz6TtxMQJqhN8/LewY5YmMxSUaqvFm2', 'super_admin', 'active', now(), now()),
  ('gerente@caritasrs.org.br', '222.222.222-22', 'Gerente - Caritas RS', '(51) 3000-0002', 'Porto Alegre, RS', '$2b$12$LQv3c1yqBWVHxkd0LHAkCOYz6TtxMQJqhN8/LewY5YmMxSUaqvFm2', 'super_admin', 'active', now(), now()),
  ('diretor@caritasrs.org.br', '333.333.333-33', 'Diretor - Caritas RS', '(51) 3000-0003', 'Porto Alegre, RS', '$2b$12$LQv3c1yqBWVHxkd0LHAkCOYz6TtxMQJqhN8/LewY5YmMxSUaqvFm2', 'super_admin', 'active', now(), now());
