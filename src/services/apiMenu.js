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

  const imageName = `${Math.random()}-${newItem.image.name}`.replaceAll(
    "/",
    "",
  );
  const imagePath = hasImagePath
    ? newItem.image
    : `${supabaseUrl}/storage/v1/object/public/menu-images/${imageName}`;

  // 1. Create/edit menu item
  let query = supabase.from("menu_items");

  // A) CREATE
  if (!id) query = query.insert([{ ...newItem, image: imagePath }]);

  // B) EDIT
  if (id) query = query.update({ ...newItem, image: imagePath }).eq("id", id);

  const { data, error } = await query.select().single();

  if (error) {
    console.error(error);
    throw new Error("Menu item could not be created");
  }

  // 2. Upload image
  if (hasImagePath) return data;

  const { error: storageError } = await supabase.storage
    .from("menu-images")
    .upload(imageName, newItem.image);

  // 3. Delete the menu item IF there was an error uploading image
  if (storageError) {
    await supabase.from("menu_items").delete().eq("id", data.id);
    console.error(storageError);
    throw new Error(
      "Menu item image could not be uploaded and the item was not created",
    );
  }

  return data;
}
