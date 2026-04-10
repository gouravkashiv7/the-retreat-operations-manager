import { useQuery } from "@tanstack/react-query";

/**
 * Fetches external availability from a Supabase Edge Function
 * that already handles fetching and parsing iCal data for a specific accommodation.
 */
export function useExternalAvailability(id, url, enabled = false) {
  const {
    isLoading,
    isFetching,
    data: externalBookings,
    error,
    refetch,
  } = useQuery({
    queryKey: ["external-availability", id],
    queryFn: async () => {
      if (!id) return [];
      try {
        const type = id.split("-")[0]; // 'room' or 'cabin'
        const rawId = id.split("-")[1];
        const paramName = type === "room" ? "roomId" : "cabinId";

        const response = await fetch(
          `${import.meta.env.VITE_SUPABASE_URL}/functions/v1/get-live-availability?${paramName}=${rawId}`,
          {
            method: "GET", // The function uses url.searchParams, so GET is appropriate
            headers: {
              Authorization: `Bearer ${import.meta.env.VITE_SUPABASE_ANON_KEY}`,
            },
          },
        );

        if (!response.ok) {
          const errText = await response.text();
          throw new Error(
            `Failed to fetch live availability: ${response.statusText} - ${errText}`,
          );
        }

        const data = await response.json();

        // Map the backend structure to the frontend structure
        // Backend returns: { blocked_dates: [{ startDate, endDate, source, ... }] }
        // We filter for external_ota events (internal ones are handled by useCalendarBookings)
        return (data.blocked_dates || [])
          .filter((b) => b.source === "external_ota")
          .map((booking) => ({
            startDate: new Date(booking.startDate).toISOString(),
            endDate: new Date(booking.endDate).toISOString(),
            summary: "External Booking",
            platform: "external",
            isExternal: true,
            status: "confirmed",
          }));
      } catch (err) {
        console.error("External Calendar could not be loaded:", err.message);
        throw err;
      }
    },
    enabled: enabled && !!id,
    staleTime: 5 * 60 * 1000, // 5 minutes
    retry: 2,
  });

  return { isLoading, isFetching, externalBookings, error, refetch };
}


