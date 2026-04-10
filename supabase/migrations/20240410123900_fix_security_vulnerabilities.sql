-- Fix for extension_in_public (security/best practice)
-- pg_net does not support SET SCHEMA, so we must drop and recreate it in the extensions schema.
CREATE SCHEMA IF NOT EXISTS extensions;
DROP EXTENSION IF EXISTS pg_net;
CREATE EXTENSION pg_net WITH SCHEMA extensions;

-- Fix for function_search_path_mutable (security)
-- Sets the search_path to public and extensions for the on_booking_change function.
-- Including 'extensions' ensures it can still find pg_net functions after they are moved.
ALTER FUNCTION public.on_booking_change() SET search_path = public, extensions;
