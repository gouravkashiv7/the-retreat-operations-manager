// supabase/functions/sync-external-bookings/index.ts
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

serve(async (req) => {
  if (req.method === "OPTIONS") return new Response("ok", { headers: corsHeaders });

  try {
    const supabase = createClient(
      Deno.env.get("SUPABASE_URL") ?? "",
      Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") ?? "",
    );

    const body = await req.json().catch(() => ({}));
    const bookingId = body.booking_id;
    
    // Fetch global sync settings
    const { data: settings } = await supabase.from("settings").select("syncTillDate").single();
    const syncTillDate = settings?.syncTillDate ? new Date(settings.syncTillDate) : null;
    
    console.log(`Starting sync... Triggered by: ${body.triggered_by || 'cron'}${syncTillDate ? ` (Sync hidden past ${settings.syncTillDate})` : ''}`);

    let properties = [];


    if (bookingId) {
      // 1. If triggered by a specific booking, only sync rooms/cabins in that booking
      console.log(`Targeted sync for booking #${bookingId}`);
      const [roomsRes, cabinsRes] = await Promise.all([
        supabase.from("booking_rooms").select("roomId").eq("bookingId", bookingId),
        supabase.from("booking_cabins").select("cabinId").eq("bookingId", bookingId),
      ]);

      const roomIds = (roomsRes.data || []).map(r => r.roomId);
      const cabinIds = (cabinsRes.data || []).map(c => c.cabinId);

      const [targetRooms, targetCabins] = await Promise.all([
        supabase.from("rooms").select("id, icalUrl").in("id", roomIds).not("icalUrl", "is", null),
        supabase.from("cabins").select("id, icalUrl").in("id", cabinIds).not("icalUrl", "is", null),
      ]);

      properties = [
        ...(targetRooms.data || []).map(p => ({ ...p, type: 'room' })),
        ...(targetCabins.data || []).map(p => ({ ...p, type: 'cabin' })),
      ];
    } else {
      // 2. Otherwise (Cron), sync everything
      const [roomsRes, cabinsRes] = await Promise.all([
        supabase.from("rooms").select("id, icalUrl").not("icalUrl", "is", null),
        supabase.from("cabins").select("id, icalUrl").not("icalUrl", "is", null),
      ]);

      properties = [
        ...(roomsRes.data || []).map(p => ({ ...p, type: 'room' })),
        ...(cabinsRes.data || []).map(p => ({ ...p, type: 'cabin' })),
      ];
    }

    if (properties.length === 0) {
      return new Response(JSON.stringify({ message: "No properties to sync." }), { headers: corsHeaders });
    }

    let totalSynced = 0;

    for (const prop of properties) {
      try {
        console.log(`[Sync] Fetching ${prop.type} #${prop.id}: ${prop.icalUrl}`);
        const response = await fetch(prop.icalUrl, {
          headers: {
            "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36",
            "Accept": "text/calendar, text/plain, */*",
          }
        });

        if (!response.ok) throw new Error(`Fetch failed: ${response.status}`);
        const icalData = await response.text();

        const veventRegex = /BEGIN:VEVENT[\s\S]*?END:VEVENT/g;
        let match;
        const newBookings = [];

        while ((match = veventRegex.exec(icalData)) !== null) {
          const eventContent = match[0];
          const startMatch = eventContent.match(/DTSTART(?:;VALUE=DATE)?:?\s*(\d{4})(\d{2})(\d{2})/);
          const endMatch = eventContent.match(/DTEND(?:;VALUE=DATE)?:?\s*(\d{4})(\d{2})(\d{2})/);

          if (startMatch && endMatch) {
            const startDateStr = `${startMatch[1]}-${startMatch[2]}-${startMatch[3]}`;
            const endDateStr = `${endMatch[1]}-${endMatch[2]}-${endMatch[3]}`;
            
            // Skip if record is past the sync horizon
            if (syncTillDate && new Date(startDateStr) > syncTillDate) {
              continue;
            }

            newBookings.push({
              startDate: startDateStr,
              endDate: endDateStr,
              numNights: 1, // Placeholder
              status: "confirmed",
              guestId: 1,
              observations: "EXTERNAL_SYNC",
            });
          }

        }

        // Atomic update for this property
        const junctionTable = prop.type === "room" ? "booking_rooms" : "booking_cabins";
        const foreignKey = prop.type === "room" ? "roomId" : "cabinId";

        // Delete old syncs for THIS property
        const { data: old } = await supabase.from("bookings").select(`id, ${junctionTable}!inner(${foreignKey})`)
          .eq("observations", "EXTERNAL_SYNC").eq(`${junctionTable}.${foreignKey}`, prop.id);
        
        const oldIds = old?.map(b => b.id) || [];
        if (oldIds.length > 0) {
          await supabase.from(junctionTable).delete().in("bookingId", oldIds);
          await supabase.from("bookings").delete().in("id", oldIds);
        }

        // Insert new syncs
        for (const b of newBookings) {
          const { data: created } = await supabase.from("bookings").insert([b]).select().single();
          if (created) {
            await supabase.from(junctionTable).insert([{ bookingId: created.id, [foreignKey]: prop.id }]);
            totalSynced++;
          }
        }
      } catch (err) {
        console.error(`Error on ${prop.type} #${prop.id}:`, err.message);
      }
    }

    return new Response(JSON.stringify({ message: `Sync successful. ${totalSynced} dates updated.` }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (error) {
    return new Response(JSON.stringify({ error: error.message }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
      status: 500,
    });
  }
});
