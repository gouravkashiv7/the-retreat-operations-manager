# Calendar Sync & Booking Management Architecture

This document explains how the two-way calendar synchronization and manual room blocking features are implemented at The Retreat.

## 1. Overview

The system implements a **Two-Way Sync** between the internal database and external Online Travel Agencies (OTAs) like Goibibo, MakeMyTrip, and Airbnb.

- **Inbound Sync**: Fetching availability from OTAs to show on our admin calendar.
- **Outbound Sync**: Exporting our internal bookings and manual blocks to OTAs via an iCal feed.

---

## 2. Inbound Sync (Exporting from OTAs to Site)

We pull external calendar feeds to ensure the admin sees "Real-Time" availability across all platforms.

- **Hook**: `src/features/calendar/useExternalAvailability.js`
- **Mechanism**:
  1. **CORS Proxy**: Because browsers block direct fetches to OTA domains, we use `allorigins.win` to proxy the request.
  2. **ICal Parsing**: We use regex to parse the `.ics` data for `VEVENT` blocks.
  3. **Platform Detection**: We detect the platform based on the `SUMMARY` or UID (e.g., "InGoibibo", "Airbnb").
  4. **Date Alignment**: All start/end dates are normalized to `startOfDay` (midnight) to ensure they overlap correctly with our grid days.
- **UI Element**: `CalendarBox.jsx` renders these as striped boxes with platform-specific colors (e.g., Orange for Goibibo, Red for Airbnb).

---

## 3. Outbound Sync (Exporting from Site to OTAs)

OTAs subscribe to our iCal feed to know when to close dates on their websites.

- **Endpoint**: Supabase Edge Function (`supabase/functions/ical/index.ts`)
- **Public URL**: `https://kckngulhvwryekywvutn.supabase.co/functions/v1/ical?roomId=[ID]`
- **Logic**:
  1. The function queries the `bookings` table for `confirmed`, `unconfirmed`, and `blocked` statuses.
  2. It filters bookings for the specific `roomId` or `cabinId`.
  3. It generates an RFC-5545 compliant `.ics` file.
  4. **Manual Blocks**: Entries with `status: 'blocked'` are included as "Blocked by Admin" so OTAs close those dates.
  5. **Dummy Event**: If no future events exist, it adds a "Sync Test" event 30 days out to ensure OTAs recognize the link as active.

---

## 4. Manual Room Blocking

Admins can manually toggle availability without creating a full guest booking.

- **API**: `createBlock` in `apiBookings.js`. This creates a booking entry with:
  - `status`: 'blocked'
  - `totalPrice`: 0
- **UI Interaction**: In `CalendarBox.jsx`, clicking an empty date triggers `handleDayClick`, which prompts to create a block.
- **Visuals**: Blocked dates are solid grey (`--color-grey-400`).

---

## 5. Deployment & Configuration

### Deploying the Edge Function

To update the iCal feed logic:

```bash
npx supabase functions deploy ical --no-verify-jwt
```

### Adding a new room to Sync

1. Find the `roomId` in the Supabase `rooms` table.
2. Get the iCal Export URL from your OTA dashboard.
3. Update `useExternalAvailability.js` or `.env` with the new URL mapping.
4. Provide the Supabase function URL (with the new `roomId`) back to the OTA.

---

## 6. Key Files

- `src/features/calendar/CalendarBox.jsx`: Main UI component.
- `src/features/calendar/useExternalAvailability.js`: Inbound sync hook.
- `src/features/calendar/useCalendarBookings.js`: Internal data hooks.
- `supabase/functions/ical/index.ts`: Outbound feed generator.
- `src/services/apiBookings.js`: Backend logic for blocks.
