-- ============================================
-- URGENT FIX: Applications Table Schema
-- ============================================
-- Run this in Supabase SQL Editor NOW
-- ============================================

-- Step 1: Add missing columns
ALTER TABLE public.applications 
ADD COLUMN IF NOT EXISTS created_at TIMESTAMPTZ DEFAULT NOW(),
ADD COLUMN IF NOT EXISTS updated_at TIMESTAMPTZ DEFAULT NOW(),
ADD COLUMN IF NOT EXISTS documents_submitted TEXT,
ADD COLUMN IF NOT EXISTS notes TEXT;

-- Step 2: Update any NULL values
UPDATE public.applications
SET 
    created_at = COALESCE(created_at, NOW()),
    updated_at = COALESCE(updated_at, NOW())
WHERE created_at IS NULL OR updated_at IS NULL;

-- Step 3: Make columns NOT NULL
ALTER TABLE public.applications 
ALTER COLUMN created_at SET NOT NULL,
ALTER COLUMN created_at SET DEFAULT NOW(),
ALTER COLUMN updated_at SET NOT NULL,
ALTER COLUMN updated_at SET DEFAULT NOW();

-- Step 4: Fix the status check constraint
-- Drop the old constraint
ALTER TABLE public.applications 
DROP CONSTRAINT IF EXISTS applications_status_check;

-- Add the correct constraint
ALTER TABLE public.applications 
ADD CONSTRAINT applications_status_check 
CHECK (status IN ('pending', 'shortlisted', 'selected', 'rejected'));

-- Step 5: Remove duplicate applications (if any)
WITH duplicates AS (
    SELECT 
        id,
        ROW_NUMBER() OVER (
            PARTITION BY user_id, scholarship_id 
            ORDER BY created_at ASC, id ASC
        ) as row_num
    FROM public.applications
)
DELETE FROM public.applications
WHERE id IN (
    SELECT id FROM duplicates WHERE row_num > 1
);

-- Step 6: Add unique constraint to prevent duplicate applications
ALTER TABLE public.applications 
DROP CONSTRAINT IF EXISTS applications_user_id_scholarship_id_key;

ALTER TABLE public.applications 
ADD CONSTRAINT applications_user_id_scholarship_id_key 
UNIQUE (user_id, scholarship_id);

-- Step 7: Create update trigger
CREATE OR REPLACE FUNCTION update_applications_updated_at()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

DROP TRIGGER IF EXISTS update_applications_updated_at ON public.applications;

CREATE TRIGGER update_applications_updated_at 
    BEFORE UPDATE ON public.applications 
    FOR EACH ROW 
    EXECUTE FUNCTION update_applications_updated_at();

-- Step 8: Create indexes
CREATE INDEX IF NOT EXISTS idx_applications_user_id ON public.applications(user_id);
CREATE INDEX IF NOT EXISTS idx_applications_scholarship_id ON public.applications(scholarship_id);
CREATE INDEX IF NOT EXISTS idx_applications_status ON public.applications(status);
CREATE INDEX IF NOT EXISTS idx_applications_created_at ON public.applications(created_at);

-- Step 9: Verify the schema
SELECT 
    column_name, 
    data_type, 
    column_default,
    is_nullable
FROM information_schema.columns
WHERE table_schema = 'public' 
  AND table_name = 'applications'
ORDER BY ordinal_position;

-- Step 10: Check the constraint
SELECT
    conname as constraint_name,
    pg_get_constraintdef(oid) as constraint_definition
FROM pg_constraint
WHERE conrelid = 'public.applications'::regclass
  AND conname = 'applications_status_check';

-- SUCCESS MESSAGE
DO $$
BEGIN
    RAISE NOTICE '✅ Applications table schema has been fixed!';
    RAISE NOTICE 'You can now test the Apply button in your application.';
END $$;
