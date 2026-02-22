-- Migration to explicitly deny deletion of guests for all users
-- AND re-establishing strict CRUD policies for guests

-- 1. Drop the existing "Strict ALL" policy
DROP POLICY IF EXISTS "Strict ALL for non-guests" ON public.guests;

-- 2. Create specific policies for SELECT, INSERT, and UPDATE
-- (Same logic as before (non-guests only), but split into separate actions)

CREATE POLICY "Guests SELECT for non-guests" ON public.guests
FOR SELECT TO authenticated
USING ( 
    coalesce(auth.jwt()->'user_metadata'->>'role', 'guest') != 'guest'
);

CREATE POLICY "Guests INSERT for non-guests" ON public.guests
FOR INSERT TO authenticated
WITH CHECK ( 
    coalesce(auth.jwt()->'user_metadata'->>'role', 'guest') != 'guest'
);

CREATE POLICY "Guests UPDATE for non-guests" ON public.guests
FOR UPDATE TO authenticated
USING ( 
    coalesce(auth.jwt()->'user_metadata'->>'role', 'guest') != 'guest'
)
WITH CHECK ( 
    coalesce(auth.jwt()->'user_metadata'->>'role', 'guest') != 'guest'
);

-- 3. Explicitly DENY DELETE for everyone (unnecessary if no policy allows it, but good for clarity)
CREATE POLICY "Deny DELETE for everyone" ON public.guests
FOR DELETE TO authenticated
USING (false);
