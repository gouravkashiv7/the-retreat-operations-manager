import { useQuery } from "@tanstack/react-query";
import { parse } from "date-fns";

const EXTERNAL_ICAL_URL =
  "https://in.goibibo.com/api/v2/ingoibibo/calendar/45001074167/?bid=b57f0e8adcad2f049b7b94f5fb70bb42&name=Official%20site";

const PROXY_URL = "https://api.allorigins.win/get?url=";

export function useExternalAvailability(enabled = false) {
  const {
    isLoading,
    data: externalBookings,
    error,
  } = useQuery({
    queryKey: ["external-availability"],
    queryFn: async () => {
      try {
        const targetUrl = encodeURIComponent(
          `${EXTERNAL_ICAL_URL}&t=${Date.now()}`,
        );
        const response = await fetch(`${PROXY_URL}${targetUrl}`);

        if (!response.ok)
          throw new Error("Failed to fetch external availability via proxy");

        const proxyData = await response.json();
        let icalData = proxyData.contents;

        if (!icalData) throw new Error("No data received from proxy");

        // Handle base64 encoded data URI if proxy returns it that way
        if (
          typeof icalData === "string" &&
          icalData.startsWith("data:text/calendar;base64,")
        ) {
          console.log("Decoding base64 ICAL data...");
          const base64Part = icalData.split(",")[1];
          icalData = atob(base64Part);
        }

        console.log("--- RAW GOIBIBO ICAL DATA ---", icalData);

        const events = [];
        const veventRegex = /BEGIN:VEVENT[\s\S]*?END:VEVENT/g;
        let match;

        while ((match = veventRegex.exec(icalData)) !== null) {
          const eventContent = match[0];

          // Improved robust regex for dates and summary
          const startMatch = eventContent.match(
            /DTSTART(?:;VALUE=DATE)?:?\s*(\d{8})/,
          );
          const endMatch = eventContent.match(
            /DTEND(?:;VALUE=DATE)?:?\s*(\d{8})/,
          );
          const summaryMatch = eventContent.match(/SUMMARY(?:;|:)\s*(.*)/);

          if (startMatch && endMatch) {
            const summary = summaryMatch
              ? summaryMatch[1].trim().replace(/\\,/g, ",")
              : "External Booking";

            const platform = summary.toLowerCase().includes("ingoibibo")
              ? "goibibo"
              : summary.toLowerCase().includes("airbnb")
                ? "airbnb"
                : summary.toLowerCase().includes("booking")
                  ? "booking"
                  : "external";

            events.push({
              startDate: parse(
                startMatch[1],
                "yyyyMMdd",
                new Date(),
              ).toISOString(),
              endDate: parse(endMatch[1], "yyyyMMdd", new Date()).toISOString(),
              summary,
              platform,
              isExternal: true,
              status: "confirmed",
            });
          }
        }

        console.log("--- PARSED EXTERNAL EVENTS ---", events);
        return events;
      } catch (err) {
        console.error("External Calendar Error:", err);
        throw err;
      }
    },
    enabled: enabled,
    staleTime: 5 * 60 * 1000, // 5 minutes
    retry: 2,
  });

  return { isLoading, externalBookings, error };
}
