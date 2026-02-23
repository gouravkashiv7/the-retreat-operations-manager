import { useMutation, useQueryClient } from "@tanstack/react-query";
import { updateBooking } from "../../services/apiBookings";
import toast from "react-hot-toast";

export function useConfirmBooking() {
  const queryClient = useQueryClient();

  const { mutate: confirmBooking, isPending: isConfirming } = useMutation({
    mutationFn: (bookingId) =>
      updateBooking(bookingId, {
        status: "confirmed",
        isPaid: true,
      }),
    onSuccess: (data) => {
      toast.success(`Booking #${data.id} has been successfully confirmed.`);
      queryClient.invalidateQueries({ active: true });
    },
    onError: () => toast.error("There was an error confirming the booking."),
  });

  return { isConfirming, confirmBooking };
}
