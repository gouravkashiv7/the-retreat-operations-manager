import supabase, { supabaseUrl } from "./supabase";

export async function getRooms() {
  const { data, error } = await supabase.from("rooms").select("*");
  if (error) throw new Error("Rooms could not be loaded");
  return data;
}

export async function deleteRoom(id) {
  const { data, error } = await supabase.from("rooms").delete().eq("id", id);
  if (error) throw new Error("Room could not be deleted");
  return data;
}

export async function createUpdateRoom(newRoom, id) {
  // Room-specific logic (can copy from cabins initially)
  const isImageFile = newRoom.image instanceof File;
  const hasImagePath =
    typeof newRoom.image === "string" &&
    newRoom.image?.startsWith?.(supabaseUrl);

  let imagePath = newRoom.image;
  let imageName;

  if (isImageFile) {
    imageName = `${Math.random()}-${newRoom.image.name}`.replaceAll("/", "");
    imagePath = `${supabaseUrl}/storage/v1/object/public/room-images/${imageName}`;
  }

  let query = supabase.from("rooms");
  // Remove UI-specific 'type' property
  const { type, ...roomData } = newRoom;

  if (!id)
    query = query.insert([
      { ...roomData, image: imagePath, icalUrl: newRoom.icalUrl },
    ]);
  if (id)
    query = query
      .update({ ...roomData, image: imagePath, icalUrl: newRoom.icalUrl })
      .eq("id", id);

  const { data, error } = await query.select().single();
  if (error) throw new Error("Room could not be created");

  if (hasImagePath) return data;

  const { error: storageError } = await supabase.storage
    .from("room-images") // Different bucket for rooms
    .upload(imageName, newRoom.image);

  if (storageError) {
    await supabase.from("rooms").delete().eq("id", data.id);
    console.error(storageError);
    throw new Error("Room image could not be uploaded");
  }

  return data;
}

export async function updateRoomIcalUrl(id, icalUrl) {
  const { data, error } = await supabase
    .from("rooms")
    .update({ icalUrl })
    .eq("id", id)
    .select()
    .single();
  if (error) throw new Error(error.message);
  return data;
}
