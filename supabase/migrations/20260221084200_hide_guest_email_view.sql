-- 1. Restore Guest Select permissions to all authenticated (including Guests) so the row returns instead of nulling out
DROP POLICY IF EXISTS "Guests: allow read all for admin and staff" ON public.guests;
CREATE POLICY "Guests: allow read for all authenticated" ON public.guests FOR SELECT TO authenticated USING (true);

-- 2. Rename the guests table and actual email column to protect it
ALTER TABLE public.guests RENAME TO guests_base;
ALTER TABLE public.guests_base RENAME COLUMN email TO email_private;

-- 3. Create an Updatable View called 'guests'
CREATE VIEW public.guests AS
SELECT
  id,
  created_at,
  "fullName",
  -- Mask the email if the role equals 'guest'
  CASE 
    WHEN coalesce(auth.jwt()->'user_metadata'->>'role', 'guest') = 'guest' THEN 'hidden@data.com'
    ELSE email_private
  END AS email,
  nationality,
  "nationalID",
  "countryFlag"
FROM public.guests_base;

-- 4. Re-assign permissions to the new View
GRANT SELECT, INSERT, UPDATE, DELETE ON public.guests TO authenticated;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.guests TO service_role;

-- 5. Create INSTEAD OF triggers for INSERT and UPDATE 
-- Because we have a CASE statement on the 'email' column, the View is not simply updatable natively.

-- INSTEAD OF INSERT
CREATE OR REPLACE FUNCTION public.guests_instead_of_insert()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.guests_base (created_at, "fullName", email_private, nationality, "nationalID", "countryFlag")
  VALUES (COALESCE(NEW.created_at, now()), NEW."fullName", NEW.email, NEW.nationality, NEW."nationalID", NEW."countryFlag")
  RETURNING id, created_at, "fullName", email_private, nationality, "nationalID", "countryFlag"
  INTO NEW.id, NEW.created_at, NEW."fullName", NEW.email, NEW.nationality, NEW."nationalID", NEW."countryFlag";
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER guests_insert_trigger
INSTEAD OF INSERT ON public.guests
FOR EACH ROW EXECUTE FUNCTION public.guests_instead_of_insert();

-- INSTEAD OF UPDATE
CREATE OR REPLACE FUNCTION public.guests_instead_of_update()
RETURNS TRIGGER AS $$
BEGIN
  UPDATE public.guests_base
  SET
    "fullName" = NEW."fullName",
    email_private = NEW.email,
    nationality = NEW.nationality,
    "nationalID" = NEW."nationalID",
    "countryFlag" = NEW."countryFlag"
  WHERE id = OLD.id;
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER guests_update_trigger
INSTEAD OF UPDATE ON public.guests
FOR EACH ROW EXECUTE FUNCTION public.guests_instead_of_update();
