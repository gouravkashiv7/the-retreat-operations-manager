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
    .eq("id", id)
    .select();

  if (error) {
    console.error(error);
    throw new Error("Menu item could not be deleted");
  }

  if (data?.length === 0) {
    throw new Error("You do not have permission to delete this item");
  }

  return data;
}

export async function createUpdateMenuItem(newItem, id) {
  // 1. Check if we have a new image file or just a string path
  const isImageFile = newItem.image instanceof File;
  const hasImagePath =
    typeof newItem.image === "string" &&
    newItem.image?.startsWith?.(supabaseUrl);

  let imagePath = newItem.image;
  let imageName;

  // 2. If it's a new file, generate name and path
  if (isImageFile) {
    imageName = `${Math.random()}-${newItem.image.name}`.replaceAll("/", "");
    imagePath = `${supabaseUrl}/storage/v1/object/public/menu-images/${imageName}`;
  }

  // 3. Get the old item if we are updating, to delete old image later
  let oldItem = null;
  if (id && isImageFile) {
    const { data } = await supabase
      .from("menu_items")
      .select("image")
      .eq("id", id)
      .single();
    oldItem = data;
  }

  // 4. Create/edit menu item
  let query = supabase.from("menu_items");

  // Prepare data
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

  // 5. Upload image only if it's a new file
  if (!isImageFile) return data;

  const { error: storageError } = await supabase.storage
    .from("menu-images")
    .upload(imageName, newItem.image);

  // 6. Error handling for storage
  if (storageError) {
    // If it was a new creation, rollback the database entry
    if (!id) await supabase.from("menu_items").delete().eq("id", data.id);
    console.error("Storage Error Details:", storageError);
    throw new Error(
      `Menu item image could not be uploaded (${storageError.message || "Unknown error"}) and the item was not saved`,
    );
  }

  // 7. Delete old image if a new one was successfully uploaded
  if (oldItem?.image) {
    const oldImageName = oldItem.image.split("/").pop();
    if (oldImageName) {
      await supabase.storage.from("menu-images").remove([oldImageName]);
    }
  }

  return data;
}
