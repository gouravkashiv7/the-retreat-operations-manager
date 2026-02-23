# Live Availability API Integration Guide

This guide explains how to connect your customer-facing website to The Retreat's unified availability system.

To prevent customers from booking dates that are already blocked in your admin system or sold on MakeMyTrip/Goibibo, you must use the `get-live-availability` Edge Function. This single API endpoint securely combines both your internal database bookings and live external OTA availability into one fast JSON response.

## API Endpoint Details

- **Method**: `GET`
- **URL**: `https://kckngulhvwryekywvutn.supabase.co/functions/v1/get-live-availability`
- **Parameters**:
  - `roomId` (optional) - The ID of a specific room. Example: `?roomId=4`
  - `cabinId` (optional) - The ID of a specific cabin. Example: `?cabinId=1`

### Example Request

```javascript
const response = await fetch(
  "https://kckngulhvwryekywvutn.supabase.co/functions/v1/get-live-availability?roomId=4",
);
const data = await response.json();
```

### Example Response

The API returns an array of `blocked_dates`. Each object contains the `startDate` and `endDate` of the block, as well as the `source` (`internal_db` or `external_ota`).

```json
{
  "blocked_dates": [
    {
      "startDate": "2026-02-23",
      "endDate": "2026-02-25",
      "source": "internal_db"
    },
    {
      "startDate": "2026-03-01",
      "endDate": "2026-03-05",
      "source": "external_ota"
    }
  ]
}
```

## How to use Date-Fns to Block Dates in React

If your customer-facing website uses React and a standard DatePicker (like `react-datepicker` or `react-day-picker`), you can use the `date-fns` library to easily disable these fetched dates.

### 1. Fetch and process the booked dates array

```jsx
import { eachDayOfInterval, parseISO } from "date-fns";
import { useEffect, useState } from "react";

function useBookedDates(roomId) {
  const [bookedDates, setBookedDates] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function fetchAvailability() {
      try {
        const res = await fetch(
          `https://kckngulhvwryekywvutn.supabase.co/functions/v1/get-live-availability?roomId=${roomId}`,
        );
        const data = await res.json();

        if (data.blocked_dates) {
          // Flatten the start/end ranges into an array of individual Date objects
          const allDates = data.blocked_dates.flatMap((block) => {
            return eachDayOfInterval({
              start: parseISO(block.startDate),
              end: parseISO(block.endDate),
            });
          });

          setBookedDates(allDates);
        }
      } catch (err) {
        console.error("Failed to fetch availability", err);
      } finally {
        setIsLoading(false);
      }
    }

    fetchAvailability();
  }, [roomId]);

  return { bookedDates, isLoading };
}
```

### 2. Disable them in your frontend calendar

Most React date pickers take a `disabled` or `excludeDates` prop. You just pass your mapped array directly into it!

```jsx
import { format, isPast, isToday, isSameDay } from "date-fns";
import { DayPicker } from "react-day-picker"; // Example calendar library

function BookingCalendar({ roomId }) {
  const { bookedDates, isLoading } = useBookedDates(roomId);

  // Disable past dates, today, and any date we fetched from our API
  const disabledDates = [
    { before: new Date() }, // past dates
    ...bookedDates,
  ];

  if (isLoading) return <p>Loading live availability...</p>;

  return <DayPicker disabled={disabledDates} />;
}
```
