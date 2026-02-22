# Calendar Sync & Booking Management Architecture

This document explains how the two-way calendar synchronization and manual room blocking features are implemented at The Retreat.

## 1. Overview

The system implements a **Two-Way Sync** between the internal database and external Online Travel Agencies (OTAs) like Goibibo, MakeMyTrip, and Airbnb.

- **Inbound Sync**: Fetching availability from OTAs to show on our admin calendar.
- **Outbound Sync**: Exporting our internal bookings and manual blocks to OTAs via an iCal feed.

---

## 2. Inbound Sync (OTA → Site)

We pull external calendar feeds to ensure the admin sees "Real-Time" availability across all platforms.

- **Hook**: `src/features/calendar/useExternalAvailability.js`
- **Data Storage**: Inbound iCal URLs are stored in the `icalUrl` column of the `rooms` and `cabins` tables.
- **Mechanism**:
  1. **CORS Proxy**: Because browsers block direct fetches to OTA domains, we use `api.allorigins.win` to proxy the request.
  2. **ICal Parsing**: We use regex to parse the `.ics` data for `VEVENT` blocks.
  3. **Date Alignment**: All start/end dates are normalized to `startOfDay` (midnight) to ensure they overlap correctly with our grid days.
- **UI Management**: Use the **"Sync Management"** button in the Calendar view to save/update these URLs for each room.

---

## 3. Outbound Sync (Site → OTA)

OTAs subscribe to our iCal feed to know when to close dates on their websites.

- **Endpoint**: Supabase Edge Function (`supabase/functions/ical/index.ts`)
- **Public URL**: `https://kckngulhvwryekywvutn.supabase.co/functions/v1/ical?roomId=[ID]` (or `cabinId=[ID]`)
- **Logic**:
  1. The function queries the `bookings` table for `confirmed`, `unconfirmed`, and `blocked` statuses.
  2. It filters bookings for the specific `roomId` or `cabinId`.
  3. It generates an RFC-5545 compliant `.ics` file.
  4. **Manual Blocks**: Entries with `status: 'blocked'` are included as "Blocked by Admin" so OTAs close those dates.
  5. **Dummy Event**: If no future events exist, it adds a "Sync Test" event 30 days out to ensure OTAs recognize the link as active.

---

## 4. Manual Room Blocking

Admins can manually toggle availability without creating a full guest booking.

- **API**: `createBlock` in `apiBookings.js`. This creates a booking entry with `status: 'blocked'`.
- **UI Interaction**: In `CalendarBox.jsx`, clicking an empty date triggers `handleDayClick`, which prompts to create a block.
- **Visuals**: Blocked dates are solid grey (`--color-grey-400`).

---

## 5. UI Components

- **`CalendarSyncSettings.jsx`**: The management panel where admins copy outbound links and save inbound links.
- **`CalendarLayout.jsx`**: Orchestrates state between the accommodation selector, bookings data, and external sync.

---

## 6. Key Files

- `src/features/calendar/CalendarBox.jsx`: Main UI component.
- `src/features/calendar/CalendarSyncSettings.jsx`: Sync configuration UI.
- `src/features/calendar/useExternalAvailability.js`: Inbound sync hook.
- `supabase/functions/ical/index.ts`: Outbound feed generator.
- `src/services/apiRooms.js` & `apiCabins.js`: Services updated to persist `icalUrl`.
