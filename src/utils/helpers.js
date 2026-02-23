import { formatDistance, parseISO } from "date-fns";
import { differenceInDays } from "date-fns";

// We want to make this function work for both Date objects and strings (which come from Supabase)
export const subtractDates = (dateStr1, dateStr2) =>
  differenceInDays(parseISO(String(dateStr1)), parseISO(String(dateStr2)));

export const formatDistanceFromNow = (dateStr) =>
  formatDistance(parseISO(dateStr), new Date(), {
    addSuffix: true,
  })
    .replace("about ", "")
    .replace("in", "In");

// Supabase needs an ISO date string. However, that string will be different on every render because the MS or SEC have changed, which isn't good. So we use this trick to remove any time
// IST is UTC+5:30, so we need to offset correctly so Supabase queries align with Indian dates.
export const getToday = function (options = {}) {
  // Work in IST: create current time then offset to IST midnight
  const now = new Date();
  // IST offset in minutes: +5h30m = +330 minutes
  const IST_OFFSET_MS = 5.5 * 60 * 60 * 1000;

  if (options?.end) {
    // End of today in IST = IST midnight next day - 1ms, expressed in UTC
    // e.g. IST 23:59:59.999 = UTC 18:29:59.999
    const istMidnightNextDay = new Date(
      Date.UTC(
        now.getFullYear(),
        now.getMonth(),
        now.getDate() + 1,
        0,
        0,
        0,
        0,
      ) - IST_OFFSET_MS,
    );
    // subtract 1ms to get 23:59:59.999 IST
    return new Date(istMidnightNextDay.getTime() - 1).toISOString();
  } else {
    // Start of today in IST = IST 00:00:00, expressed in UTC
    const istMidnightToday = new Date(
      Date.UTC(now.getFullYear(), now.getMonth(), now.getDate(), 0, 0, 0, 0) -
        IST_OFFSET_MS,
    );
    return istMidnightToday.toISOString();
  }
};

// Returns today's date string in IST format "YYYY-MM-DD"
// Used for comparing dates without time component.
export const getTodayIST = () => {
  const now = new Date();
  // Convert to IST by adding 5h30m offset
  const istNow = new Date(now.getTime() + 5.5 * 60 * 60 * 1000);
  return istNow.toISOString().split("T")[0];
};

export const formatCurrency = (value) => {
  const formattedString = new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(value);

  return formattedString;
};
export const formatCurrencyNoDecimals = (value) => {
  return new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(value);
};

// return formattedString.replace("₹", "₹ ");

export function calculateDiscount(regularPrice, discountPercentage) {
  // 1. Convert inputs to numbers
  const price = Number(regularPrice);
  const percentage = Number(discountPercentage);

  // 2. Check for invalid or non-numeric results (NaN)
  if (isNaN(price) || isNaN(percentage)) {
    return 0;
  }

  // 3. Calculate the raw discount amount
  // Formula: price * (percentage / 100)
  const rawDiscountAmount = price * (percentage / 100);

  // 4. Round to the nearest integer
  return Math.round(rawDiscountAmount);
}

export function getAccommodationName(booking) {
  const cabinNames =
    booking.booking_cabins?.map((bc) => bc.cabins?.name).filter(Boolean) || [];
  const roomNames =
    booking.booking_rooms?.map((br) => br.rooms?.name).filter(Boolean) || [];

  const allNames = [...cabinNames, ...roomNames];
  return allNames.join(" ") || "No accommodation";
}
