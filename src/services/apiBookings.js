import { PAGE_SIZE } from "../utils/constants";
import { getToday } from "../utils/helpers";
import supabase from "./supabase";
import { getAccommodationName } from "../utils/helpers";

export async function getBookings({ filter, sortBy, page }) {
  let query = supabase.from("bookings").select(
    `
            id,
            created_at,
            startDate,
            endDate,
            numNights,
            numGuests,
            totalPrice,
            status,
            guests:guestId  (
              fullName,
              email
            ),
            booking_cabins (
              cabins (
                name
              )
            ),
            booking_rooms (
              rooms (
                name
              )
            )
          `,
    { count: "exact" }
  );

  //Filter
  if (filter) query = query[filter.method || "eq"](filter.field, filter.value);
  //Sort
  if (sortBy)
    query = query.order(sortBy.field, {
      ascending: sortBy.direction === "asc",
    });
  //Pagination
  if (page) {
    const from = (page - 1) * PAGE_SIZE;
    const to = from + PAGE_SIZE - 1;
    query = query.range(from, to);
  }

  const { data, error, count } = await query;

  if (error) {
    console.error(error);
    throw new Error("Bookings could not be loaded.");
  }
  // Transform the data
  const transformedData = data.map((booking) => ({
    id: booking.id,
    created_at: booking.created_at,
    startDate: booking.startDate,
    endDate: booking.endDate,
    numNights: booking.numNights,
    numGuests: booking.numGuests,
    totalPrice: booking.totalPrice,
    status: booking.status,
    guests: {
      fullName: booking.guests?.fullName || "",
      email: booking.guests?.email || "",
    },
    accommodation: {
      name: getAccommodationName(booking),
    },
  }));

  return { transformedData, count };
}

export async function getBooking(id) {
  const { data, error } = await supabase
    .from("bookings")
    .select(
      `
        id,
        created_at,
        startDate,
        endDate,
        numNights,
        numGuests,
        totalPrice,
        status,
        hasBreakfast,
        isPaid,
        observations,
        extrasPrice,
        accommodationPrice,
        guests:guestId (
          fullName,
          email,
          country,
          countryFlag,
          nationalId
        ),
        booking_cabins (
          cabins (
            name,
            regularPrice
          )
        ),
        booking_rooms (
          rooms (
            name,
            regularPrice
          )
        )
      `
    )
    .eq("id", id);

  if (error) {
    console.error(error);
    throw new Error("Booking not found");
  }

  const booking = data[0];

  const transformedBooking = {
    id: booking.id,
    created_at: booking.created_at,
    startDate: booking.startDate,
    endDate: booking.endDate,
    numNights: booking.numNights,
    numGuests: booking.numGuests,
    totalPrice: booking.totalPrice,
    status: booking.status,
    hasBreakfast: booking.hasBreakfast || false,
    isPaid: booking.isPaid || false,
    observations: booking.observations || "",
    extrasPrice: booking.extrasPrice || 0,
    accommodationPrice: booking.accommodationPrice || 0,
    guests: {
      fullName: booking.guests?.fullName || "",
      email: booking.guests?.email || "",
      country: booking.guests?.country || "",
      countryFlag: booking.guests?.countryFlag || "",
      nationalId: booking.guests?.nationalId || "",
    },
    accommodation: {
      name: getAccommodationName(booking),
    },
    booking_cabins: booking.booking_cabins || [],
    booking_rooms: booking.booking_rooms || [],
  };

  return transformedBooking;
}

// Returns all BOOKINGS that are were created after the given date. Useful to get bookings created in the last 30 days, for example.
export async function getBookingsAfterDate(date) {
  const { data, error } = await supabase
    .from("bookings")
    .select("created_at, totalPrice, extrasPrice")
    .gte("created_at", date)
    .lte("created_at", getToday({ end: true }));

  if (error) {
    console.error(error);
    throw new Error("Bookings could not get loaded");
  }

  return data;
}

// Returns all STAYS that are were created after the given date
export async function getStaysAfterDate(date) {
  const { data, error } = await supabase
    .from("bookings")
    // .select('*')
    .select("*, guests(fullName)")
    .gte("startDate", date)
    .lte("startDate", getToday());

  if (error) {
    console.error(error);
    throw new Error("Bookings could not get loaded");
  }

  return data;
}

export async function getStaysTodayActivity() {
  // First get all relevant bookings
  const { data, error } = await supabase
    .from("bookings")
    .select("*, guests(fullName, country, countryFlag)")
    .in("status", ["unconfirmed", "checked-in"])
    .order("created_at");

  if (error) {
    console.error(error);
    throw new Error("Bookings could not get loaded");
  }

  // Then filter manually for today
  const today = new Date().toISOString().split("T")[0];
  const todayActivity = (data || []).filter((booking) => {
    const startDate = new Date(booking.startDate).toISOString().split("T")[0];
    const endDate = new Date(booking.endDate).toISOString().split("T")[0];

    return (
      (booking.status === "unconfirmed" && startDate === today) ||
      (booking.status === "checked-in" && endDate === today)
    );
  });

  return todayActivity;
}

export async function updateBooking(id, obj) {
  const { data, error } = await supabase
    .from("bookings")
    .update(obj)
    .eq("id", id)
    .select()
    .single();

  if (error) {
    console.error(error);
    throw new Error("Booking could not be updated");
  }
  return data;
}

export async function deleteBooking(id) {
  // First, delete all related records from booking_cabins and booking_rooms
  const { error: cabinsError } = await supabase
    .from("booking_cabins")
    .delete()
    .eq("bookingId", id);

  if (cabinsError) {
    console.error("Error deleting booking cabins:", cabinsError);
    throw new Error("Booking cabins could not be deleted");
  }

  const { error: roomsError } = await supabase
    .from("booking_rooms")
    .delete()
    .eq("bookingId", id);

  if (roomsError) {
    console.error("Error deleting booking rooms:", roomsError);
    throw new Error("Booking rooms could not be deleted");
  }

  // Now delete the main booking record
  const { data, error } = await supabase.from("bookings").delete().eq("id", id);

  if (error) {
    console.error("Error deleting booking:", error);
    throw new Error("Booking could not be deleted");
  }

  return data;
}
