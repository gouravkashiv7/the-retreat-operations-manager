-- Create a function to fetch all users
-- This function is SECURITY DEFINER so it runs with the privileges of the user who created it (superuser)
-- We add an intentional check inside the function to ensure the caller has the 'admin' role in their metadata.

CREATE OR REPLACE FUNCTION get_all_users()
RETURNS TABLE (
  id uuid,
  email varchar,
  role varchar,
  full_name varchar,
  created_at timestamptz
)
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
  calling_user_role text;
BEGIN
  -- Get the role of the user executing this function
  -- We extract it from the JWT's app_metadata or user_metadata
  -- In our implementation, we stored it in user_metadata.role
  calling_user_role := (auth.jwt() -> 'user_metadata' ->> 'role')::text;

  -- Verify the user has the 'admin' role
  IF calling_user_role != 'admin' THEN
    RAISE EXCEPTION 'Access denied: User must be an admin to fetch all users.';
  END IF;

  -- Return the formatted user data
  RETURN QUERY
  SELECT 
    au.id, 
    au.email, 
    (au.raw_user_meta_data->>'role')::varchar as role,
    (au.raw_user_meta_data->>'fullName')::varchar as full_name,
    au.created_at
  FROM auth.users au;
END;
$$;
