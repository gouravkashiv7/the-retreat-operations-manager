import supabase from "./supabase";

export async function getAllUsers() {
  const { data, error } = await supabase.rpc("get_all_users");

  if (error) {
    console.error(error);
    throw new Error("Users could not be loaded");
  }

  return data;
}

export async function deleteUser(id) {
  const { error } = await supabase.rpc("delete_user", { user_id: id });

  if (error) {
    console.error(error);
    throw new Error("User could not be deleted");
  }
}

export async function resetUserPassword(id, newPassword) {
  const { error } = await supabase.rpc("reset_user_password", {
    user_id: id,
    new_password: newPassword,
  });

  if (error) {
    console.error(error);
    throw new Error("Password could not be reset");
  }
}
