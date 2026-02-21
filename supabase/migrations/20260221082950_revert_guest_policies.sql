-- 1. Drop triggers
DROP TRIGGER IF EXISTS guests_insert_trigger ON public.guests;
DROP TRIGGER IF EXISTS guests_update_trigger ON public.guests;

-- 2. Drop the functions
DROP FUNCTION IF EXISTS public.guests_instead_of_insert();
DROP FUNCTION IF EXISTS public.guests_instead_of_update();

-- 3. Drop the view
DROP VIEW IF EXISTS public.guests;

-- 4. Rename columns and table back
ALTER TABLE public.guests_base RENAME COLUMN email_private TO email;
ALTER TABLE public.guests_base RENAME TO guests;

-- 5. Restore original policy
DROP POLICY IF EXISTS "Guests: allow read for all authenticated" ON public.guests;
CREATE POLICY "Guests: allow read all for admin and staff" ON public.guests FOR SELECT TO authenticated USING (true);
