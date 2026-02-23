import { useQuery } from "@tanstack/react-query";
import { getCheckedInBookings } from "../../services/apiOrders";

export function useCheckedInBookings() {
  const {
    isLoading,
    data: checkedInBookings,
    error,
  } = useQuery({
    queryKey: ["checkedInBookings"],
    queryFn: getCheckedInBookings,
  });

  return { isLoading, error, checkedInBookings };
}
