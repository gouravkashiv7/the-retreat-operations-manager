import supabase, { supabaseUrl } from "./supabase";

export const apiGuests = {
  // Get all guests
  async getGuests() {
    const { data, error } = await supabase
      .from("guests")
      .select("*")
      .order("created_at", { ascending: false });

    if (error) throw new Error(error.message);
    return data;
  },

  async getGuestsWithBookings() {
    const { data, error } = await supabase
      .from("guests")
      .select(
        `
        *,
        bookings!inner(
          id,
          startDate,
          endDate,
          status
        )
      `,
      )
      .order("created_at", { ascending: false });

    if (error) throw new Error(error.message);
    return data;
  },

  // Get all guest bookings separately
  async getAllBookings() {
    const PAGE = 1000;
    let allData = [];
    let from = 0;
    let hasMore = true;

    while (hasMore) {
      const { data, error } = await supabase
        .from("bookings")
        .select("id, status, guestId")
        .order("created_at", { ascending: false })
        .range(from, from + PAGE - 1);

      if (error) throw new Error(error.message);

      allData = allData.concat(data);
      hasMore = data.length === PAGE;
      from += PAGE;
    }

    return allData;
  },

  // Get guest by ID
  async getGuestById(id) {
    const { data, error } = await supabase
      .from("guests")
      .select("*")
      .eq("id", id)
      .single();

    if (error) throw new Error(error.message);
    return data;
  },

  // Create new guest
  async createGuest(guestData) {
    const { guestIDCard, guestIDCardBack, ...dataToInsert } = guestData;

    // 1. Insert guest data first to get the ID
    const { data, error } = await supabase
      .from("guests")
      .insert([dataToInsert])
      .select()
      .single();

    if (error) throw new Error(error.message);

    const updates = {};
    let hasUpdates = false;

    // 2. Upload Front ID
    if (guestIDCard instanceof File) {
      const fileName = `${Math.random()}-${guestIDCard.name}`.replaceAll("/", "");
      const filePath = `guest-${data.id}/${fileName}`;
      const { error: storageError } = await supabase.storage.from("guest-ids").upload(filePath, guestIDCard);

      if (!storageError) {
        updates.guestIDCard = `${supabaseUrl}/storage/v1/object/public/guest-ids/${filePath}`;
        hasUpdates = true;
      }
    }

    // 3. Upload Back ID
    if (guestIDCardBack instanceof File) {
      const fileName = `${Math.random()}-back-${guestIDCardBack.name}`.replaceAll("/", "");
      const filePath = `guest-${data.id}/${fileName}`;
      const { error: storageError } = await supabase.storage.from("guest-ids").upload(filePath, guestIDCardBack);

      if (!storageError) {
        updates.guestIDCardBack = `${supabaseUrl}/storage/v1/object/public/guest-ids/${filePath}`;
        hasUpdates = true;
      }
    }

    // 4. Final Update if images were uploaded
    let finalData = data;
    if (hasUpdates) {
      const { data: updatedData, error: updateError } = await supabase
        .from("guests")
        .update(updates)
        .eq("id", data.id)
        .select()
        .single();
      
      if (!updateError) finalData = updatedData;
    }

    // 5. Send welcome email (asynchronously)
    if (finalData.email) {
      supabase.functions.invoke("send-welcome-email", {
        body: { guestName: finalData.fullName, guestEmail: finalData.email },
      }).catch(err => console.error("Failed to send welcome email:", err));
    }

    return finalData;
  },

  // Update guest
  async updateGuest(id, updates) {
    const { guestIDCard, guestIDCardBack, ...dataToUpdate } = updates;
    const updatePayload = { ...dataToUpdate };

    // Handle Front ID
    if (guestIDCard instanceof File) {
      const fileName = `${Math.random()}-${guestIDCard.name}`.replaceAll("/", "");
      const filePath = `guest-${id}/${fileName}`;
      const { error: storageError } = await supabase.storage.from("guest-ids").upload(filePath, guestIDCard);
      if (!storageError) {
        updatePayload.guestIDCard = `${supabaseUrl}/storage/v1/object/public/guest-ids/${filePath}`;
      }
    } else if (guestIDCard === null || typeof guestIDCard === 'string') {
      updatePayload.guestIDCard = guestIDCard;
    }

    // Handle Back ID
    if (guestIDCardBack instanceof File) {
      const fileName = `${Math.random()}-back-${guestIDCardBack.name}`.replaceAll("/", "");
      const filePath = `guest-${id}/${fileName}`;
      const { error: storageError } = await supabase.storage.from("guest-ids").upload(filePath, guestIDCardBack);
      if (!storageError) {
        updatePayload.guestIDCardBack = `${supabaseUrl}/storage/v1/object/public/guest-ids/${filePath}`;
      }
    } else if (guestIDCardBack === null || typeof guestIDCardBack === 'string') {
      updatePayload.guestIDCardBack = guestIDCardBack;
    }

    const { data, error } = await supabase
      .from("guests")
      .update(updatePayload)
      .eq("id", id)
      .select()
      .single();

    if (error) throw new Error(error.message);
    return data;
  },

  // Delete guest
  async deleteGuest(id) {
    if (String(id) === "1" || id === 1) {
      throw new Error("This is the system admin block guest record. It cannot be deleted.");
    }
    const { error } = await supabase.from("guests").delete().eq("id", id);
    if (error) throw new Error(error.message);
  },

  // Search guests
  async searchGuests(query) {
    const { data, error } = await supabase
      .from("guests")
      .select("*")
      .or(`fullName.ilike.%${query}%,email.ilike.%${query}%,nationalId.ilike.%${query}%,id.eq.${query}`)
      .order("created_at", { ascending: false });

    if (error) throw new Error(error.message);
    return data;
  },
};
