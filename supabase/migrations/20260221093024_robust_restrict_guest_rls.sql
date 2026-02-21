-- 1. Programmatically drop ALL existing policies on bookings and guests to clear the slate
DO $$ 
DECLARE 
    r RECORD;
BEGIN
    -- Drop policies for bookings
    FOR r IN (SELECT policyname FROM pg_policies WHERE schemaname = 'public' AND tablename = 'bookings') 
    LOOP
        EXECUTE 'DROP POLICY ' || quote_ident(r.policyname) || ' ON public.bookings';
    END LOOP;

    -- Drop policies for guests
    FOR r IN (SELECT policyname FROM pg_policies WHERE schemaname = 'public' AND tablename = 'guests') 
    LOOP
        EXECUTE 'DROP POLICY ' || quote_ident(r.policyname) || ' ON public.guests';
    END LOOP;
END $$;

-- 2. Ensure RLS is enabled
ALTER TABLE public.bookings ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.guests ENABLE ROW LEVEL SECURITY;

-- 3. Create strict SELECT policies
-- Deny if role is guest or missing
CREATE POLICY "Strict SELECT for non-guests" ON public.bookings
FOR SELECT TO authenticated
USING ( 
    coalesce(auth.jwt()->'user_metadata'->>'role', 'guest') != 'guest'
);

CREATE POLICY "Strict SELECT for non-guests" ON public.guests
FOR SELECT TO authenticated
USING ( 
    coalesce(auth.jwt()->'user_metadata'->>'role', 'guest') != 'guest'
);

-- 4. Create strict ALL (INSERT, UPDATE, DELETE) policies
CREATE POLICY "Strict ALL for non-guests" ON public.bookings
FOR ALL TO authenticated
USING ( 
    coalesce(auth.jwt()->'user_metadata'->>'role', 'guest') != 'guest'
)
WITH CHECK ( 
    coalesce(auth.jwt()->'user_metadata'->>'role', 'guest') != 'guest'
);

CREATE POLICY "Strict ALL for non-guests" ON public.guests
FOR ALL TO authenticated
USING ( 
    coalesce(auth.jwt()->'user_metadata'->>'role', 'guest') != 'guest'
)
WITH CHECK ( 
    coalesce(auth.jwt()->'user_metadata'->>'role', 'guest') != 'guest'
);
