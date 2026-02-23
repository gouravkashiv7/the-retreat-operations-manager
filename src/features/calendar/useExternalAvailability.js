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
        const targetUrl = encodeURIComponent(timestampedUrl);
        let icalData;

        // Use /raw instead of /get for allorigins to bypass JSON wrapping and avoid some 500 errors
        const targetUrlRaw = encodeURIComponent(timestampedUrl);
        const proxy1 = `https://api.allorigins.win/raw?url=${targetUrlRaw}`;
        const proxy2 = `https://api.allorigins.hexartogo.com/raw?url=${targetUrlRaw}`;
        const proxy3 = `https://corsproxy.io/?${targetUrlRaw}`;

        try {
          const response = await fetch(proxy1);
          if (!response.ok) throw new Error("Primary proxy failed");
          icalData = await response.text();
        } catch (err) {
          console.warn("Primary proxy failed, trying fallback 1:", err.message);
          try {
            const response = await fetch(proxy2);
            if (!response.ok) throw new Error("Fallback 1 failed");
            icalData = await response.text();
          } catch (err2) {
            console.warn(
              "Fallback 1 failed, trying fallback 2 (corsproxy):",
              err2.message,
            );
            const response = await fetch(proxy3);
            if (!response.ok) throw new Error("All proxies failed");
            icalData = await response.text();

            // corsproxy.io might return the raw string or wrapping JSON depending on headers
            try {
              const json = JSON.parse(icalData);
              if (json.contents) icalData = json.contents;
            } catch (e) {
              // Ignore JSON parse error, it's raw text
            }
          }
        }

        if (!icalData) throw new Error("No data received from proxy");

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
