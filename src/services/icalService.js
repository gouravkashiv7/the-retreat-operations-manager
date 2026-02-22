/**
 * Converts a list of bookings into a valid iCal (RFC 5545) string.
 * @param {Array} bookings - List of booking objects with startDate, endDate, and guests.fullName
 * @param {string} roomName - The name of the room for the calendar metadata
 * @returns {string} - iCal formatted string
 */
export function generateICalString(bookings, roomName = "Accommodation") {
  const now = new Date().toISOString().replace(/[-:]/g, "").split(".")[0] + "Z";

  let ical = [
    "BEGIN:VCALENDAR",
    "VERSION:2.0",
    "PRODID:-//The Retreat Operations Manager//iCal Export//EN",
    "CALSCALE:GREGORIAN",
    "METHOD:PUBLISH",
    `X-WR-CALNAME:${roomName} Availability`,
    "X-WR-TIMEZONE:UTC",
  ];

  bookings.forEach((booking) => {
    // iCal dates are YYYYMMDD (for all-day events)
    const start = booking.startDate.replace(/-/g, "").split("T")[0];
    const end = booking.endDate.replace(/-/g, "").split("T")[0];
    const uid = booking.id || Math.random().toString(36).substring(7);
    const summary = booking.guests?.fullName
      ? `Booking: ${booking.guests.fullName}`
      : "Reserved";

    ical.push("BEGIN:VEVENT");
    ical.push(`UID:${uid}@the-retreat.com`);
    ical.push(`DTSTAMP:${now}`);
    ical.push(`DTSTART;VALUE=DATE:${start}`);
    ical.push(`DTEND;VALUE=DATE:${end}`);
    ical.push(`SUMMARY:${summary}`);
    ical.push("STATUS:CONFIRMED");
    ical.push("TRANSP:OPAQUE");
    ical.push("END:VEVENT");
  });

  ical.push("END:VCALENDAR");

  return ical.join("\r\n");
}
