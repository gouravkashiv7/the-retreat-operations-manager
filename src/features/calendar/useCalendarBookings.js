import { useMutation, useQueryClient, useQuery } from "@tanstack/react-query";
import { toast } from "react-hot-toast";
import {
  getBookingsInDateRange,
  createBlock,
  deleteBooking,
} from "../../services/apiBookings";

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

export function useCreateBlock() {
  const queryClient = useQueryClient();

  const { mutate: blockRoom, isLoading: isBlocking } = useMutation({
    mutationFn: createBlock,
    onSuccess: () => {
      toast.success("Room blocked successfully");
      queryClient.invalidateQueries({ queryKey: ["bookings-calendar"] });
    },
    onError: (err) => toast.error(err.message),
  });

  return { blockRoom, isBlocking };
}

export function useUnblock() {
  const queryClient = useQueryClient();

  const { mutate: unblockRoom, isLoading: isUnblocking } = useMutation({
    mutationFn: deleteBooking,
    onSuccess: () => {
      toast.success("Room opened successfully");
      queryClient.invalidateQueries({ queryKey: ["bookings-calendar"] });
    },
    onError: (err) => toast.error(err.message),
  });

  return { unblockRoom, isUnblocking };
}
