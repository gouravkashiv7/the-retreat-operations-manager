/// <reference lib="deno.ns" />

import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type",
};

serve(async (req: Request) => {
  if (req.method === "OPTIONS") {
    return new Response("ok", { headers: corsHeaders });
  }

  try {
    const url = new URL(req.url);
    const roomId = url.searchParams.get("roomId");
    const cabinId = url.searchParams.get("cabinId");
    const userAgent = req.headers.get("user-agent") || "Unknown OTA";

    console.log(`[iCal Export] Request for ${roomId ? `Room #${roomId}` : `Cabin #${cabinId}`} from: ${userAgent}`);

    if (!roomId && !cabinId) {
      return new Response("Missing roomId or cabinId", { status: 400 });
    }


    const supabase = createClient(
      Deno.env.get("SUPABASE_URL") ?? "",
      Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") ?? "",
    );

    // Fetch bookings (confirmed, checked-in, or blocked)
    const { data: bookings, error } = await supabase
      .from("bookings")
      .select(
        "id, startDate, endDate, status, observations, guests(fullName), booking_rooms(roomId), booking_cabins(cabinId)",
      )
      .in("status", ["confirmed", "checked-in", "blocked"])
      .neq("observations", "ADMIN_BLOCK_UNCONFIRMED"); // Just in case any old unconfirmed blocks lingered

    if (error) throw error;

    // Filter by specific room/cabin
    const filteredBookings = (bookings || []).filter((b: any) => {
      if (roomId)
        return b.booking_rooms?.some(
          (br: any) => br.roomId === parseInt(roomId),
        );
      if (cabinId)
        return b.booking_cabins?.some(
          (bc: any) => bc.cabinId === parseInt(cabinId),
        );
      return false;
    });

    // Generate iCal format
    const now =
      new Date().toISOString().replace(/[-:]/g, "").split(".")[0] + "Z";
    const ical = [
      "BEGIN:VCALENDAR",
      "VERSION:2.0",
      "PRODID:-//The Retreat Operations Manager//EN",
      "CALSCALE:GREGORIAN",
      "METHOD:PUBLISH",
    ];

    filteredBookings.forEach((b: any) => {
      const start = b.startDate.replace(/-/g, "").split("T")[0];
      const end = b.endDate.replace(/-/g, "").split("T")[0];
      const summary =
        b.status === "blocked" || b.observations === "ADMIN_BLOCK"
          ? "Blocked by Admin"
          : `Booking: ${b.guests?.fullName || "Confirmed"}`;

      ical.push("BEGIN:VEVENT");
      ical.push(`UID:${b.id}@the-retreat.com`);
      ical.push(`DTSTAMP:${now}`);
      ical.push(`DTSTART;VALUE=DATE:${start}`);
      ical.push(`DTEND;VALUE=DATE:${end}`);
      ical.push(`SUMMARY:${summary}`);
      ical.push("END:VEVENT");
    });

    // Add a dummy future event for verification if no future bookings exist
    const futureBookings = filteredBookings.filter(
      (b: any) => new Date(b.startDate) > new Date(),
    );
    if (futureBookings.length === 0) {
      const futureDate = new Date();
      futureDate.setDate(futureDate.getDate() + 365); // 1 year from now
      const start = futureDate.toISOString().replace(/-/g, "").split("T")[0];
      futureDate.setDate(futureDate.getDate() + 1);
      const end = futureDate.toISOString().replace(/-/g, "").split("T")[0];

      ical.push("BEGIN:VEVENT");
      ical.push(`UID:verification-dummy@the-retreat.com`);
      ical.push(`DTSTAMP:${now}`);
      ical.push(`DTSTART;VALUE=DATE:${start}`);
      ical.push(`DTEND;VALUE=DATE:${end}`);
      ical.push(`SUMMARY:MMT Sync Test (Auto-generated)`);
      ical.push("END:VEVENT");
    }

    ical.push("END:VCALENDAR");

    return new Response(ical.join("\r\n"), {
      headers: { ...corsHeaders, "Content-Type": "text/calendar" },
      status: 200,
    });
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : String(err);
    return new Response(JSON.stringify({ error: message }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
      status: 500,
    });
  }
});
