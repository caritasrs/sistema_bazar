-- Add registration_source field to users table to track how clients signed up
ALTER TABLE public.users 
ADD COLUMN IF NOT EXISTS registration_source VARCHAR(50) DEFAULT 'operator_created';

-- Update index for better query performance
CREATE INDEX IF NOT EXISTS idx_users_registration_source ON public.users(registration_source);

-- Add comment for documentation
COMMENT ON COLUMN public.users.registration_source IS 'Tracks how the client account was created: self_registered, operator_created, admin_created';
