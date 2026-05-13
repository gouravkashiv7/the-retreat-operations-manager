import { useMutation, useQueryClient } from "@tanstack/react-query";
import { updateBooking } from "../../services/apiBookings";
import toast from "react-hot-toast";

export function useSetFullPayment() {
  const queryClient = useQueryClient();

  const { mutate: setFullPayment, isPending: isSettingPayment } = useMutation({
    mutationFn: ({ bookingId, totalPrice }) =>
      updateBooking(bookingId, {
        paymenttype: "full",
        amountpaid: totalPrice,
        isPaid: true,
      }),
    onSuccess: (data) => {
      toast.success(`Booking #${data.id} marked as fully paid.`);
      queryClient.invalidateQueries({ active: true });
    },
    onError: () => toast.error("There was an error updating the payment status."),
  });

  return { isSettingPayment, setFullPayment };
}
