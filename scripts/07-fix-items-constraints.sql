-- Remove NOT NULL constraint from batch_id to make it optional
ALTER TABLE public.items ALTER COLUMN batch_id DROP NOT NULL;

-- Add donor_id column if it doesn't exist (for direct donor tracking)
DO $$ 
BEGIN
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns 
                   WHERE table_name = 'items' AND column_name = 'donor_id') THEN
        ALTER TABLE public.items ADD COLUMN donor_id UUID REFERENCES public.donors(id);
    END IF;
END $$;

-- Add index on donor_id
CREATE INDEX IF NOT EXISTS idx_items_donor_id ON public.items(donor_id);

-- Verify the changes
SELECT column_name, is_nullable, data_type 
FROM information_schema.columns 
WHERE table_name = 'items' 
  AND column_name IN ('batch_id', 'category_id', 'donor_id', 'status')
ORDER BY column_name;
