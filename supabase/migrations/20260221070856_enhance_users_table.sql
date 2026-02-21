-- Drop the old get_all_users function since we are changing its return signature
DROP FUNCTION IF EXISTS get_all_users();

-- Recreate it to include avatar
CREATE OR REPLACE FUNCTION get_all_users()
RETURNS TABLE (
  id uuid,
  email varchar,
  role varchar,
  full_name varchar,
  avatar varchar,
  created_at timestamptz
)
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
  calling_user_role text;
BEGIN
  calling_user_role := (auth.jwt() -> 'user_metadata' ->> 'role')::text;

  IF calling_user_role != 'admin' THEN
    RAISE EXCEPTION 'Access denied: User must be an admin to fetch all users.';
  END IF;

  RETURN QUERY
  SELECT 
    au.id, 
    au.email, 
    (au.raw_user_meta_data->>'role')::varchar as role,
    (au.raw_user_meta_data->>'fullName')::varchar as full_name,
    (au.raw_user_meta_data->>'avatar')::varchar as avatar,
    au.created_at
  FROM auth.users au;
END;
$$;


-- Function to DELETE a user
CREATE OR REPLACE FUNCTION delete_user(user_id uuid)
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
  calling_user_role text;
BEGIN
  calling_user_role := (auth.jwt() -> 'user_metadata' ->> 'role')::text;

  IF calling_user_role != 'admin' THEN
    RAISE EXCEPTION 'Access denied: User must be an admin to delete a user.';
  END IF;

  DELETE FROM auth.users WHERE id = user_id;
END;
$$;


-- Function to explicitly UPDATE a user's password using pgcrypto
CREATE EXTENSION IF NOT EXISTS pgcrypto;

CREATE OR REPLACE FUNCTION reset_user_password(user_id uuid, new_password text)
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
  calling_user_role text;
BEGIN
  calling_user_role := (auth.jwt() -> 'user_metadata' ->> 'role')::text;

  IF calling_user_role != 'admin' THEN
    RAISE EXCEPTION 'Access denied: User must be an admin to reset a password.';
  END IF;

  UPDATE auth.users 
  SET encrypted_password = crypt(new_password, gen_salt('bf'))
  WHERE id = user_id;
END;
$$;
