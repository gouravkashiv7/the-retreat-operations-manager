import { useQuery } from "@tanstack/react-query";
import { getOrdersByBookingId } from "../../services/apiOrders";

export function useOrdersByBooking(bookingId) {
  const {
    isLoading,
    data: orders,
    error,
  } = useQuery({
    queryKey: ["orders", "booking", bookingId],
    queryFn: () => getOrdersByBookingId(bookingId),
    enabled: !!bookingId,
  });

  return { isLoading, error, orders: orders || [] };
}
