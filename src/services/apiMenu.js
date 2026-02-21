import supabase, { supabaseUrl } from "./supabase";

export async function getMenuItems() {
  const { data, error } = await supabase.from("menu_items").select("*");

  if (error) {
    console.error(error);
    throw new Error("Menu items could not be loaded");
  }

  return data;
}

export async function deleteMenuItem(id) {
  const { data, error } = await supabase
    .from("menu_items")
    .delete()
    .eq("id", id);

  if (error) {
    console.error(error);
    throw new Error("Menu item could not be deleted");
  }

  return data;
}

export async function createUpdateMenuItem(newItem, id) {
  const hasImagePath = newItem.image?.startsWith?.(supabaseUrl);

  const imageName = newItem.image?.name
    ? `${Math.random()}-${newItem.image.name}`.replaceAll("/", "")
    : "";

  const imagePath = hasImagePath
    ? newItem.image
    : imageName
      ? `${supabaseUrl}/storage/v1/object/public/menu-images/${imageName}`
      : newItem.image; // Fallback to whatever it is if no new file is provided

  // 1. Create/edit menu item
  let query = supabase.from("menu_items");

  // Prepare data (strip internal fields that shouldn't be updated manually)
  const { id: _id, created_at, ...updateData } = newItem;
  const finalData = { ...updateData, image: imagePath };

  // A) CREATE
  if (!id) query = query.insert([finalData]);

  // B) EDIT
  if (id) query = query.update(finalData).eq("id", id);

  const { data, error } = await query.select().single();

  if (error) {
    console.error(error);
    throw new Error(`Menu item could not be ${id ? "updated" : "created"}`);
  }

  // 2. Upload image only if it's a new file
  if (hasImagePath || !imageName) return data;

  const { error: storageError } = await supabase.storage
    .from("menu-images")
    .upload(imageName, newItem.image);

  // 3. Delete the menu item IF there was an error uploading image (only for new creations)
  if (storageError) {
    if (!id) await supabase.from("menu_items").delete().eq("id", data.id);
    console.error(storageError);
    throw new Error(
      "Menu item image could not be uploaded and the item was not saved",
    );
  }

  return data;
}
