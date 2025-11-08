-- Make batch_id and category_id optional in items table
-- This allows direct entry without requiring a batch or category

-- Drop the NOT NULL constraints if they exist
ALTER TABLE public.items 
  ALTER COLUMN batch_id DROP NOT NULL,
  ALTER COLUMN category_id DROP NOT NULL;

-- Add donor_id column to items for direct donor tracking
ALTER TABLE public.items 
  ADD COLUMN IF NOT EXISTS donor_id UUID REFERENCES public.donors(id) ON DELETE SET NULL;

-- Create index for better query performance
CREATE INDEX IF NOT EXISTS idx_items_donor_id ON public.items(donor_id);

-- Add comment
COMMENT ON COLUMN public.items.donor_id IS 'Direct reference to donor, useful when item is not part of a batch';
