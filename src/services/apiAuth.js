import { createClient } from "@supabase/supabase-js";
import supabase, { supabaseUrl } from "./supabase";

// For user creation by an admin, we don't want to replace the current session.
// So we create a separate client that does not persist the session.
const supabaseKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

let adminAuthClient;

function getAdminAuthClient() {
  if (!adminAuthClient) {
    adminAuthClient = createClient(supabaseUrl, supabaseKey, {
      auth: {
        persistSession: false,
        autoRefreshToken: false,
        detectSessionInUrl: false,
      },
    });
  }
  return adminAuthClient;
}

export async function login({ email, password }) {
  const { data, error } = await supabase.auth.signInWithPassword({
    email,
    password,
  });

  if (error) throw new Error(error.message);
  return data;
}

export async function getCurrentUser() {
  const { data: session } = await supabase.auth.getSession();
  if (!session.session) return null;

  const { data, error } = await supabase.auth.getUser();
  if (error) throw new Error(error.message);
  return data?.user;
}

export async function logout() {
  const { error } = await supabase.auth.signOut();
  if (error) throw new Error(error.message);
}

export async function signup({ fullName, email, password, role = "guest" }) {
  const { data, error } = await getAdminAuthClient().auth.signUp({
    email,
    password,
    options: {
      data: {
        fullName,
        avatar: "",
      },
    },
  });
  if (error) throw new Error(error.message);

  if (data?.user?.id) {
    // Call RPC using the MAIN client which has the admin's session
    const { error: rpcError } = await supabase.rpc("set_user_role", {
      target_user_id: data.user.id,
      new_role: role,
    });

    if (rpcError) {
      console.error("Failed to set user role:", rpcError);
      throw new Error(
        "User created but role assignment failed: " + rpcError.message,
      );
    }
  }

  return data;
}

export async function updateCurrentUser({ fullName, password, avatar }) {
  let updateData;
  if (password) updateData = { password };
  if (fullName) updateData = { data: { fullName } };
  const { data, error } = await supabase.auth.updateUser(updateData);

  if (error) throw new Error(error.message);
  if (!avatar) return data;

  const fileName = `avatar-${data.user.id}-${Math.random()}`;
  const { error: storageError } = await supabase.storage
    .from("avatars")
    .upload(fileName, avatar);
  if (storageError) throw new Error(error.message);

  const { data: updatedUser, error: updateError } =
    await supabase.auth.updateUser({
      data: {
        avatar: `${supabaseUrl}/storage/v1/object/public/avatars/${fileName}`,
      },
    });
  if (updateError) throw new Error(error.message);
  return updatedUser;
}
