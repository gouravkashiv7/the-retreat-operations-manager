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

    if (!roomId && !cabinId) {
      return new Response(
        JSON.stringify({ error: "Missing roomId or cabinId" }),
        {
          status: 400,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        },
      );
    }

    const supabase = createClient(
      Deno.env.get("SUPABASE_URL") ?? "",
      Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") ?? "",
    );

    const today = new Date().toISOString().split("T")[0];

    // 1. Fetch Internal Bookings (Confirmed, Unconfirmed, Blocked) that haven't passed yet
    const { data: bookings, error: bookingsError } = await supabase
      .from("bookings")
      .select(
        "id, startDate, endDate, status, booking_rooms(roomId), booking_cabins(cabinId)",
      )
      .in("status", ["confirmed", "unconfirmed", "blocked"])
      .gte("endDate", today);

    if (bookingsError) throw bookingsError;

    // Filter by specific room/cabin
    const internalBookings = (bookings || []).filter((b: any) => {
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

    // Format Internal Bookings
    const availabilityData = internalBookings.map((b: any) => ({
      startDate: b.startDate.split("T")[0],
      endDate: b.endDate.split("T")[0],
      source: "internal_db",
    }));

    // 2. Fetch External iCal
    let icalUrl = null;
    if (roomId) {
      const { data } = await supabase
        .from("rooms")
        .select("icalUrl")
        .eq("id", roomId)
        .single();
      icalUrl = data?.icalUrl;
    } else if (cabinId) {
      const { data } = await supabase
        .from("cabins")
        .select("icalUrl")
        .eq("id", cabinId)
        .single();
      icalUrl = data?.icalUrl;
    }

    if (icalUrl) {
      // Append timestamp to bypass caching
      const timestampedUrl = `${icalUrl}${icalUrl.includes("?") ? "&" : "?"}t=${Date.now()}`;

      const fetchResponse = await fetch(timestampedUrl, {
        headers: {
          Accept:
            "text/calendar, text/html, application/xhtml+xml, application/xml;q=0.9, image/webp, */*;q=0.8",
          "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64)",
          "Accept-Language": "en-US,en;q=0.5",
          "Cache-Control": "no-cache",
        },
      });

      if (fetchResponse.ok) {
        const icalData = await fetchResponse.text();
        const veventRegex = /BEGIN:VEVENT[\s\S]*?END:VEVENT/g;
        let match;

        while ((match = veventRegex.exec(icalData)) !== null) {
          const eventContent = match[0];
          const startMatch = eventContent.match(
            /DTSTART(?:;VALUE=DATE)?:?\s*(\d{8})/,
          );
          const endMatch = eventContent.match(
            /DTEND(?:;VALUE=DATE)?:?\s*(\d{8})/,
          );

          if (startMatch) {
            const startStr = startMatch[1];
            const endStr = endMatch && endMatch[1] ? endMatch[1] : startStr;

            // Convert YYYYMMDD to YYYY-MM-DD
            const formattedStart = `${startStr.slice(0, 4)}-${startStr.slice(4, 6)}-${startStr.slice(6, 8)}`;
            const formattedEnd = `${endStr.slice(0, 4)}-${endStr.slice(4, 6)}-${endStr.slice(6, 8)}`;

            availabilityData.push({
              startDate: formattedStart,
              endDate: formattedEnd,
              source: "external_ota",
            });
          }
        }
      } else {
        console.warn(
          `Failed to fetch external iCal: ${fetchResponse.statusText}`,
        );
      }
    }

    return new Response(JSON.stringify({ blocked_dates: availabilityData }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
      status: 200,
    });
  } catch (error: unknown) {
    const err = error instanceof Error ? error : new Error(String(error));
    console.error("Live Availability Error:", err.message);
    return new Response(JSON.stringify({ error: err.message }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
      status: 500,
    });
  }
});
