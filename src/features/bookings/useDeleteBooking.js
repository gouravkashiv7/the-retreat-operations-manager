import { useMutation, useQueryClient } from "@tanstack/react-query";
import { deleteBooking as deleteBookingApi } from "../../services/apiBookings";
import toast from "react-hot-toast";

export function useDeleteBooking() {
  const queryClient = useQueryClient();

  const { mutate: deleteBooking, isPending: isDeleting } = useMutation({
    mutationFn: (bookingId) => deleteBookingApi(bookingId),
    onSuccess: (_, variables) => {
      toast.success(`Booking #${variables} was successfully deleted.`);
      queryClient.invalidateQueries(["bookings"]);
    },
    onError: (err) => {
      console.error("Delete booking error:", err);
      toast.error(err.message || "There was an error deleting the booking.");
    },
  });
  return { isDeleting, deleteBooking };
}
