import supabase from "./supabase";

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
    const { data, error } = await supabase
      .from("bookings")
      .select("id, status, guestId")
      .order("created_at", { ascending: false });

    if (error) throw new Error(error.message);
    return data;
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
    const { data, error } = await supabase
      .from("guests")
      .insert([guestData])
      .select()
      .single();

    if (error) throw new Error(error.message);
    return data;
  },

  // Update guest
  async updateGuest(id, updates) {
    const { data, error } = await supabase
      .from("guests")
      .update(updates)
      .eq("id", id)
      .select()
      .single();

    if (error) throw new Error(error.message);
    return data;
  },

  // Delete guest
  async deleteGuest(id) {
    // Prevent deletion of the dummy guest used for admin blocks
    if (String(id) === "1" || id === 1) {
      throw new Error(
        "This is the system admin block guest record. It cannot be deleted.",
      );
    }

    const { error } = await supabase.from("guests").delete().eq("id", id);

    if (error) throw new Error(error.message);
  },

  // Search guests
  async searchGuests(query) {
    const { data, error } = await supabase
      .from("guests")
      .select("*")
      .or(
        `fullName.ilike.%${query}%,email.ilike.%${query}%,nationalId.ilike.%${query}%,id.eq.${query}`,
      )
      .order("created_at", { ascending: false });

    if (error) throw new Error(error.message);
    return data;
  },
};
