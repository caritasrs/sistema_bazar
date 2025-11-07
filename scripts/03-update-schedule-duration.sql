-- Update default duration for schedules to 60 minutes (1 hour)
ALTER TABLE public.schedules 
  ALTER COLUMN duration_minutes SET DEFAULT 60;

-- Update any existing schedules with 30-minute duration to 60 minutes
UPDATE public.schedules 
SET duration_minutes = 60 
WHERE duration_minutes = 30;

-- Add comment for documentation
COMMENT ON COLUMN public.schedules.duration_minutes IS 'Duration in minutes - Default 60 (1 hour), Business hours: 8h-12h and 13h-18h';
