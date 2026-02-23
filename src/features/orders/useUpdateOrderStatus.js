import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "react-hot-toast";
import { updateOrderStatus as updateOrderStatusApi } from "../../services/apiOrders";

export function useUpdateOrderStatus() {
  const queryClient = useQueryClient();

  const { mutate: updateOrderStatus, isLoading: isUpdating } = useMutation({
    mutationFn: updateOrderStatusApi,
    onSuccess: () => {
      toast.success("Order status successfully updated");
      queryClient.invalidateQueries({ queryKey: ["orders"] });
    },
    onError: (err) => toast.error(err.message),
  });

  return { isUpdating, updateOrderStatus };
}
