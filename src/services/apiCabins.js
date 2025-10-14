import supabase, { supabaseUrl } from "./supabase";

export async function getCabins() {
  const { data, error } = await supabase.from("cabins").select("*");
  if (error) {
    console.error(error);
    throw new Error("Cabins could not be loaded.");
  }
  return data;
}

export async function deleteCabin(id) {
  const { data, error } = await supabase.from("cabins").delete().eq("id", id);
  if (error) {
    console.error(error);
    throw new Error("Cabin could not be deleted.");
  }
  return data;
}

export async function createEditCabin(newCabin, id) {
  // 1. First, check if image is a File object or string
  const isImageFile = newCabin.image instanceof File;

  const hasImagePath =
    typeof newCabin.image === "string" &&
    newCabin.image?.startsWith?.(supabaseUrl);
  let imagePath = newCabin.image;
  let imageName;

  // 2. Only generate image name if it's a File object
  if (isImageFile) {
    imageName = `${Math.random()}-${newCabin.image.name}`.replaceAll("/", "");
    imagePath = `${supabaseUrl}/storage/v1/object/public/cabin-images/${imageName}`;
  }

  //3
  let query = supabase.from("cabins");
  //ADD
  if (!id) query = query.insert([{ ...newCabin, image: imagePath }]);
  //EDIT
  if (id) query = query.update({ ...newCabin, image: imagePath }).eq("id", id);
  const { data, error } = await query.select().single();

  if (error) {
    console.error(error);
    throw new Error("Cabin could not be created.");
  }

  // Upload image only if it's a File object
  if (hasImagePath) return data;

  const { error: storageError } = await supabase.storage
    .from("cabin-images")
    .upload(imageName, newCabin.image);

  if (storageError) {
    await supabase.from("cabins").delete().eq("id", data.id);
    console.error(storageError);
    throw new Error(
      "Cabin image could not be uploaded and the cabin was not created"
    );
  }
  return data;
}
