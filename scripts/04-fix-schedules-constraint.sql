-- Remove the unique constraint that prevents multiple bookings per time slot
-- The system should allow up to 2 bookings per time slot (capacity = 2)

ALTER TABLE public.schedules DROP CONSTRAINT IF EXISTS schedules_schedule_date_schedule_time_key;

-- Add a comment explaining the capacity logic
COMMENT ON TABLE public.schedules IS 'Allows up to 2 concurrent bookings per time slot. Capacity is enforced at application level.';
