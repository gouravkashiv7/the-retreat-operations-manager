-- Enable RLS for bookings and guests
ALTER TABLE public.bookings ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.guests ENABLE ROW LEVEL SECURITY;

-- Drop any default or previously created read policies 
DROP POLICY IF EXISTS "Enable read access for all users" ON public.bookings;
DROP POLICY IF EXISTS "Enable read access for all users" ON public.guests;
DROP POLICY IF EXISTS "Guests: allow read all for admin and staff" ON public.guests;
DROP POLICY IF EXISTS "Guests: allow read for all authenticated" ON public.guests;

-- Add policies for non-guests on Bookings
CREATE POLICY "Allow SELECT for non-guests" ON public.bookings
FOR SELECT TO authenticated
USING ( coalesce(auth.jwt()->'user_metadata'->>'role', 'guest') != 'guest' );

CREATE POLICY "Allow ALL other operations for non-guests" ON public.bookings
FOR ALL TO authenticated
USING ( coalesce(auth.jwt()->'user_metadata'->>'role', 'guest') != 'guest' )
WITH CHECK ( coalesce(auth.jwt()->'user_metadata'->>'role', 'guest') != 'guest' );

-- Add policies for non-guests on Guests
CREATE POLICY "Allow SELECT for non-guests" ON public.guests
FOR SELECT TO authenticated
USING ( coalesce(auth.jwt()->'user_metadata'->>'role', 'guest') != 'guest' );

CREATE POLICY "Allow ALL other operations for non-guests" ON public.guests
FOR ALL TO authenticated
USING ( coalesce(auth.jwt()->'user_metadata'->>'role', 'guest') != 'guest' )
WITH CHECK ( coalesce(auth.jwt()->'user_metadata'->>'role', 'guest') != 'guest' );
