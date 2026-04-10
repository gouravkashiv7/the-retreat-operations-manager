-- Migration: Add guestIDCard column and setup RLS for storage
-- Date: 2024-04-10

-- 1. Add column to guests table if it doesn't exist
-- We'll use guestIDCard to store the storage path/URL
DO $$ 
BEGIN
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='guests' AND column_name='guestIDCard') THEN
        ALTER TABLE public.guests ADD COLUMN "guestIDCard" TEXT;
    END IF;
END $$;

-- 2. Setup Storage Bucket policies
-- Ensure RLS is enabled
-- ALTER TABLE storage.objects ENABLE ROW LEVEL SECURITY;

-- 3. Create RLS Policies for the 'guest-ids' bucket
-- We first drop to avoid "already exists" errors during manual re-runs
DROP POLICY IF EXISTS "Admin full access to guest-ids" ON storage.objects;
DROP POLICY IF EXISTS "Guests can view their own ID" ON storage.objects;

-- POLICY: Admin can do anything
CREATE POLICY "Admin full access to guest-ids"
ON storage.objects
FOR ALL
TO authenticated
USING (
  bucket_id = 'guest-ids' AND 
  (auth.jwt() -> 'app_metadata' ->> 'role' = 'admin' OR auth.jwt() -> 'app_metadata' ->> 'role' = 'staff')
)
WITH CHECK (
  bucket_id = 'guest-ids' AND 
  (auth.jwt() -> 'app_metadata' ->> 'role' = 'admin' OR auth.jwt() -> 'app_metadata' ->> 'role' = 'staff')
);

-- POLICY: Individual guests can only see their own ID
-- Path format: guest-{guestId}/{filename}
CREATE POLICY "Guests can view their own ID"
ON storage.objects
FOR SELECT
TO authenticated
USING (
  bucket_id = 'guest-ids' AND 
  (storage.foldername(name))[1] = 'guest-' || (SELECT id::text FROM public.guests WHERE "email" = auth.jwt() ->> 'email' LIMIT 1)
);
