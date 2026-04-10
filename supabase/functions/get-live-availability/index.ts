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

    // Filter by specific room/cabin ONLY if requested. Otherwise return all.
    const internalBookings = (bookings || []).filter((b: any) => {
      if (roomId)
        return b.booking_rooms?.some(
          (br: any) => br.roomId === parseInt(roomId),
        );
      if (cabinId)
        return b.booking_cabins?.some(
          (bc: any) => bc.cabinId === parseInt(cabinId),
        );
      return true;
    });

    // Format Internal Bookings
    const availabilityData: any[] = [];

    internalBookings.forEach((b: any) => {
      const startDate = b.startDate.split("T")[0];
      const endDate = b.endDate.split("T")[0];

      b.booking_rooms?.forEach((br: any) => {
        if (!roomId || br.roomId === parseInt(roomId)) {
          availabilityData.push({
            roomId: br.roomId,
            type: "room",
            startDate,
            endDate,
            source: "internal_db",
          });
        }
      });

      b.booking_cabins?.forEach((bc: any) => {
        if (!cabinId || bc.cabinId === parseInt(cabinId)) {
          availabilityData.push({
            cabinId: bc.cabinId,
            type: "cabin",
            startDate,
            endDate,
            source: "internal_db",
          });
        }
      });
    });

    // 2. Fetch External iCal
    const propertiesToFetch: any[] = [];

    if (roomId) {
      const { data } = await supabase
        .from("rooms")
        .select("id, icalUrl")
        .eq("id", roomId)
        .single();
      if (data?.icalUrl)
        propertiesToFetch.push({
          id: data.id,
          type: "room",
          icalUrl: data.icalUrl,
        });
    } else if (cabinId) {
      const { data } = await supabase
        .from("cabins")
        .select("id, icalUrl")
        .eq("id", cabinId)
        .single();
      if (data?.icalUrl)
        propertiesToFetch.push({
          id: data.id,
          type: "cabin",
          icalUrl: data.icalUrl,
        });
    } else {
      const [roomsRes, cabinsRes] = await Promise.all([
        supabase.from("rooms").select("id, icalUrl").not("icalUrl", "is", null),
        supabase
          .from("cabins")
          .select("id, icalUrl")
          .not("icalUrl", "is", null),
      ]);

      if (roomsRes.data) {
        roomsRes.data.forEach((r: any) =>
          propertiesToFetch.push({
            id: r.id,
            type: "room",
            icalUrl: r.icalUrl,
          }),
        );
      }
      if (cabinsRes.data) {
        cabinsRes.data.forEach((c: any) =>
          propertiesToFetch.push({
            id: c.id,
            type: "cabin",
            icalUrl: c.icalUrl,
          }),
        );
      }
    }

    console.log(`[iCal] Properties to fetch: ${propertiesToFetch.length}`);

    // Process all iCals concurrently
    const icalResults = await Promise.allSettled(
      propertiesToFetch.map(async (property: any) => {
        const timestampedUrl = `${property.icalUrl}${property.icalUrl.includes("?") ? "&" : "?"}t=${Date.now()}`;
        console.log(
          `[iCal] Fetching ${property.type} #${property.id}: ${timestampedUrl.substring(0, 80)}...`,
        );

        const fetchResponse = await fetch(timestampedUrl, {
          headers: {
            Accept: "text/calendar, */*",
            "User-Agent": "Mozilla/5.0 (compatible; CalendarSync/1.0)",
            "Cache-Control": "no-cache",
          },
        });

        console.log(
          `[iCal] ${property.type} #${property.id} response: status=${fetchResponse.status}, content-type=${fetchResponse.headers.get("content-type")}`,
        );

        if (!fetchResponse.ok) {
          const body = await fetchResponse.text();
          console.error(
            `[iCal] ${property.type} #${property.id} FAILED: ${fetchResponse.status} - ${body.substring(0, 200)}`,
          );
          return [];
        }

        const icalData = await fetchResponse.text();
        console.log(
          `[iCal] ${property.type} #${property.id} received ${icalData.length} chars`,
        );

        const events: any[] = [];
        const veventRegex = /BEGIN:VEVENT[\s\S]*?END:VEVENT/g;
        const todayStr = new Date().toISOString().split("T")[0];
        let match;

        while ((match = veventRegex.exec(icalData)) !== null) {
          const eventContent = match[0];
          // Support both DTSTART;VALUE=DATE:20260303 and DTSTART:20260303T120000Z formats
          const startMatch = eventContent.match(
            /DTSTART(?:;VALUE=DATE)?:?\s*(\d{4})(\d{2})(\d{2})/,
          );
          const endMatch = eventContent.match(
            /DTEND(?:;VALUE=DATE)?:?\s*(\d{4})(\d{2})(\d{2})/,
          );

          if (startMatch) {
            const formattedStart = `${startMatch[1]}-${startMatch[2]}-${startMatch[3]}`;
            const formattedEnd = endMatch
              ? `${endMatch[1]}-${endMatch[2]}-${endMatch[3]}`
              : formattedStart;

            // Skip past events — guests can't book dates that have already passed
            if (formattedEnd >= todayStr) {
              events.push({
                [property.type === "room" ? "roomId" : "cabinId"]: property.id,
                type: property.type,
                startDate: formattedStart,
                endDate: formattedEnd,
                source: "external_ota",
              });
            }
          }
        }

        console.log(
          `[iCal] ${property.type} #${property.id}: parsed ${events.length} future events`,
        );
        return events;
      }),
    );

    // Collect results from settled promises
    icalResults.forEach((result, i) => {
      if (result.status === "fulfilled") {
        availabilityData.push(...result.value);
      } else {
        console.error(
          `[iCal] ${propertiesToFetch[i].type} #${propertiesToFetch[i].id} REJECTED: ${result.reason}`,
        );
      }
    });

    console.log(
      `[iCal] Total availability entries: ${availabilityData.length} (internal + external)`,
    );

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
