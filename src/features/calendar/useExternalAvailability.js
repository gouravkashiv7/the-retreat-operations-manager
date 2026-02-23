import { useQuery } from "@tanstack/react-query";
import { parse } from "date-fns";

const PROXY_URL = "https://api.allorigins.win/get?url=";
const FALLBACK_PROXY_URL = "https://api.codetabs.com/v1/proxy?quest=";

export function useExternalAvailability(id, url, enabled = false) {
  const {
    isLoading,
    data: externalBookings,
    error,
  } = useQuery({
    queryKey: ["external-availability", id, url],
    queryFn: async () => {
      if (!url) return [];
      try {
        const timestampedUrl = `${url}${url.includes("?") ? "&" : "?"}t=${Date.now()}`;
        let icalData;

        try {
          const response = await fetch(timestampedUrl, {
            headers: {
              Accept:
                "text/calendar, text/html, application/xhtml+xml, application/xml;q=0.9, image/webp, */*;q=0.8",
              "Accept-Language": "en-US,en;q=0.5",
              "Cache-Control": "no-cache",
              Pragma: "no-cache",
            },
          });

          if (!response.ok)
            throw new Error("Fetch failed: " + response.statusText);
          icalData = await response.text();
        } catch (err) {
          console.error("Direct fetch failed:", err.message);
          throw err;
        }

        if (!icalData) throw new Error("No data received");

        // Handle base64 encoded data URI if proxy returns it that way
        if (
          typeof icalData === "string" &&
          icalData.startsWith("data:text/calendar;base64,")
        ) {
          const base64Part = icalData.split(",")[1];
          icalData = atob(base64Part);
        }

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
          if (startMatch) {
            const startDateStr = startMatch[1];
            const endDateStr =
              endMatch && endMatch[1] ? endMatch[1] : startDateStr;

            const summary = summaryMatch
              ? summaryMatch[1].trim().replace(/\\,/g, ",")
              : "External Booking";

            const platform =
              summary.toLowerCase().includes("ingoibibo") ||
              summary.toLowerCase().includes("mmt") ||
              summary.toLowerCase().includes("makemytrip")
                ? "goibibo"
                : "external";

            events.push({
              startDate: parse(
                startMatch[1],
                "yyyyMMdd",
                new Date(),
              ).toISOString(),
              endDate: parse(endDateStr, "yyyyMMdd", new Date()).toISOString(),
              summary,
              platform,
              isExternal: true,
              status: "confirmed",
            });
          }
        }

        return events;
      } catch (err) {
        // Log and throw the error so React Query captures it and passes to the UI!
        console.error("External Calendar could not be loaded:", err.message);
        throw err;
      }
    },
    enabled: enabled && !!url,
    staleTime: 5 * 60 * 1000, // 5 minutes
    retry: 2,
  });

  return { isLoading, externalBookings, error };
}
