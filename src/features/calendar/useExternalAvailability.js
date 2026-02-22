import { useQuery } from "@tanstack/react-query";
import { parse } from "date-fns";

const EXTERNAL_ICAL_URL =
  "https://in.goibibo.com/api/v2/ingoibibo/calendar/45001074167/?bid=b57f0e8adcad2f049b7b94f5fb70bb42&name=Official%20site";

export function useExternalAvailability(enabled = false) {
  const {
    isLoading,
    data: externalBookings,
    error,
  } = useQuery({
    queryKey: ["external-availability"],
    queryFn: async () => {
      // Note: This might face CORS issues in the browser if Goibibo doesn't allow it.
      // In a real production app, this would typically go through a backend proxy.
      try {
        const response = await fetch(`${EXTERNAL_ICAL_URL}&t=${Date.now()}`);
        if (!response.ok)
          throw new Error("Failed to fetch external availability");
        const icalData = await response.text();

        const events = [];
        const veventRegex = /BEGIN:VEVENT[\s\S]*?END:VEVENT/g;
        let match;

        while ((match = veventRegex.exec(icalData)) !== null) {
          const eventContent = match[0];
          // Robust regex for dates and summary
          const startMatch = eventContent.match(
            /DTSTART(?:;VALUE=DATE)?:?(\d{8})/,
          );
          const endMatch = eventContent.match(/DTEND(?:;VALUE=DATE)?:?(\d{8})/);
          const summaryMatch = eventContent.match(/SUMMARY(?::|;)(.*)/);

          if (startMatch && endMatch) {
            events.push({
              startDate: parse(
                startMatch[1],
                "yyyyMMdd",
                new Date(),
              ).toISOString(),
              endDate: parse(endMatch[1], "yyyyMMdd", new Date()).toISOString(),
              summary: summaryMatch
                ? summaryMatch[1].trim().replace(/\\,/g, ",")
                : "External Booking",
              isExternal: true,
              status: "confirmed", // External blocks are treated as confirmed
            });
          }
        }
        return events;
      } catch (err) {
        console.error("External Calendar Error:", err);
        return [];
      }
    },
    enabled: enabled,
    staleTime: 60 * 60 * 1000, // 1 hour
  });

  return { isLoading, externalBookings, error };
}
