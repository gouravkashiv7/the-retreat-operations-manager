import supabase from "./supabase";

export async function getRooms() {
  const { data, error } = await supabase.from("room").select("*");
  if (error) {
    console.error(error);
    throw new Error("rooms could not be loaded.");
  }
  return data;
}
