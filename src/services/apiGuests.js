import supabase, { supabaseUrl } from "./supabase";

export const apiGuests = {
  // Helper to generate signed URLs for secure private images
  async getSignedUrl(filePathOrUrl) {
    if (!filePathOrUrl) return null;
    if (filePathOrUrl.startsWith('blob:')) return filePathOrUrl;

    let path = filePathOrUrl;
    if (filePathOrUrl.includes('/storage/v1/object/public/guest-ids/')) {
        path = filePathOrUrl.split('/storage/v1/object/public/guest-ids/')[1];
    } else if (filePathOrUrl.includes('/storage/v1/object/sign/guest-ids/')) {
        path = filePathOrUrl.split('/storage/v1/object/sign/guest-ids/')[1].split('?')[0];
    }
    
    // If it's an external HTTP link, return as is
    if (path.startsWith('http')) return path;

    const { data, error } = await supabase.storage.from('guest-ids').createSignedUrl(path, 60 * 60); // 1 hour expiry
    if (error) {
       console.error("Error creating signed URL:", error);
       return filePathOrUrl;
    }
    return data.signedUrl;
  },

  async enrichGuestWithUrls(guest) {
    if (!guest) return guest;
    const enriched = { ...guest };
    if (enriched.guestIDCard) enriched.guestIDCard = await apiGuests.getSignedUrl(enriched.guestIDCard);
    if (enriched.guestIDCardBack) enriched.guestIDCardBack = await apiGuests.getSignedUrl(enriched.guestIDCardBack);
    return enriched;
  },
  // Get all guests
  async getGuests() {
    const { data, error } = await supabase
      .from("guests")
      .select("*")
      .order("created_at", { ascending: false });

    if (error) throw new Error(error.message);
    
    // Enrich all guests with signed URLs in parallel
    const enrichedData = await Promise.all(data.map(g => apiGuests.enrichGuestWithUrls(g)));
    return enrichedData;
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

    const enrichedData = await Promise.all(data.map(g => apiGuests.enrichGuestWithUrls(g)));
    return enrichedData;
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
    return await apiGuests.enrichGuestWithUrls(data);
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
      const sanitizedName = guestIDCard.name.replace(/[^a-z0-9.]/gi, '-').replace(/-+/g, '-');
      const fileName = `${Math.random()}-${sanitizedName}`;
      const filePath = `guest-${data.id}/${fileName}`;
      const { error: storageError } = await supabase.storage.from("guest-ids").upload(filePath, guestIDCard);

      if (storageError) {
        console.error("Front ID Upload Error:", storageError);
      } else {
        updates.guestIDCard = filePath;
        hasUpdates = true;
      }
    }

    // 3. Upload Back ID
    if (guestIDCardBack instanceof File) {
      const sanitizedName = guestIDCardBack.name.replace(/[^a-z0-9.]/gi, '-').replace(/-+/g, '-');
      const fileName = `${Math.random()}-back-${sanitizedName}`;
      const filePath = `guest-${data.id}/${fileName}`;
      const { error: storageError } = await supabase.storage.from("guest-ids").upload(filePath, guestIDCardBack);

      if (storageError) {
        console.error("Back ID Upload Error:", storageError);
      } else {
        updates.guestIDCardBack = filePath;
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
      const sanitizedName = guestIDCard.name.replace(/[^a-z0-9.]/gi, '-').replace(/-+/g, '-');
      const fileName = `${Math.random()}-${sanitizedName}`;
      const filePath = `guest-${id}/${fileName}`;
      const { error: storageError } = await supabase.storage.from("guest-ids").upload(filePath, guestIDCard);
      if (storageError) {
        console.error("Update Front ID Upload Error:", storageError);
      } else {
        updatePayload.guestIDCard = filePath;
      }
    } else if (guestIDCard === null || typeof guestIDCard === 'string') {
      updatePayload.guestIDCard = guestIDCard;
    }

    // Handle Back ID
    if (guestIDCardBack instanceof File) {
      const sanitizedName = guestIDCardBack.name.replace(/[^a-z0-9.]/gi, '-').replace(/-+/g, '-');
      const fileName = `${Math.random()}-back-${sanitizedName}`;
      const filePath = `guest-${id}/${fileName}`;
      const { error: storageError } = await supabase.storage.from("guest-ids").upload(filePath, guestIDCardBack);
      if (storageError) {
        console.error("Update Back ID Upload Error:", storageError);
      } else {
        updatePayload.guestIDCardBack = filePath;
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
    return await apiGuests.enrichGuestWithUrls(data);
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
    
    const enrichedData = await Promise.all(data.map(g => apiGuests.enrichGuestWithUrls(g)));
    return enrichedData;
  },
};
