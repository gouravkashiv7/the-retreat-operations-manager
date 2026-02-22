import { useQuery } from "@tanstack/react-query";
import { getBookingsInDateRange } from "../../services/apiBookings";

export function useCalendarBookings(startDate, endDate) {
  const {
    isLoading,
    data: bookings,
    error,
  } = useQuery({
    queryKey: ["bookings-calendar", startDate, endDate],
    queryFn: () => getBookingsInDateRange(startDate, endDate),
    enabled: !!startDate && !!endDate,
  });

  return { isLoading, bookings, error };
}
