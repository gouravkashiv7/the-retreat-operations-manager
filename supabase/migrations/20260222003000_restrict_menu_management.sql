-- Migration: Restrict Menu Management
-- This migration enables RLS on menu_items and ensures guests have read-only access.

-- 1. Enable RLS
ALTER TABLE public.menu_items ENABLE ROW LEVEL SECURITY;

-- 2. Drop existing policies if any (to be safe)
DO $$ 
DECLARE 
    r RECORD;
BEGIN
    FOR r IN (SELECT policyname FROM pg_policies WHERE schemaname = 'public' AND tablename = 'menu_items') 
    LOOP
        EXECUTE 'DROP POLICY ' || quote_ident(r.policyname) || ' ON public.menu_items';
    END LOOP;
END $$;

-- 3. Create SELECT policy (Allow all authenticated users to view)
CREATE POLICY "Allow authenticated SELECT" ON public.menu_items
FOR SELECT TO authenticated
USING (true);

-- 4. Create management policy (Deny ALL if role is guest or missing)
CREATE POLICY "Restrict management to non-guests" ON public.menu_items
FOR ALL TO authenticated
USING ( 
    coalesce(auth.jwt()->'user_metadata'->>'role', 'guest') != 'guest'
)
WITH CHECK ( 
    coalesce(auth.jwt()->'user_metadata'->>'role', 'guest') != 'guest'
);
