import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { apiGuests } from "../../services/apiGuests";
import toast from "react-hot-toast";

export function useGuests() {
  return useQuery({
    queryKey: ["guests"],
    queryFn: apiGuests.getGuests,
  });
}

export function useGuestsWithBookings() {
  return useQuery({
    queryKey: ["guests-with-bookings"],
    queryFn: apiGuests.getGuestsWithBookings,
  });
}

export function useAllBookings() {
  return useQuery({
    queryKey: ["all-bookings"],
    queryFn: () => apiGuests.getAllBookings(),
  });
}

export function useGuestById(id) {
  return useQuery({
    queryKey: ["guests", id],
    queryFn: () => apiGuests.getGuestById(id),
    enabled: !!id,
  });
}

export function useCreateGuest() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: apiGuests.createGuest,
    onSuccess: (data) => {
      queryClient.invalidateQueries(["guests"]);
      toast.success(`Guest created successfully with ID #${data.id}`);
    },
    onError: (error) => {
      toast.error(error.message);
    },
  });
}

export function useUpdateGuest() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, updates }) => apiGuests.updateGuest(id, updates),
    onSuccess: () => {
      queryClient.invalidateQueries(["guests"]);
      toast.success("Guest updated successfully");
    },
    onError: (error) => {
      toast.error(error.message);
    },
  });
}

export function useDeleteGuest() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: apiGuests.deleteGuest,
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries(["guests"]);
      toast.success(`Guest #${variables} deleted successfully`);
    },
    onError: (error) => {
      toast.error(error.message);
    },
  });
}

export function useSearchGuests() {
  return useMutation({
    mutationFn: apiGuests.searchGuests,
  });
}
