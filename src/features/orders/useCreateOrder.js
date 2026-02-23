import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "react-hot-toast";
import { createOrder as createOrderApi } from "../../services/apiOrders";

export function useCreateOrder() {
  const queryClient = useQueryClient();

  const { mutate: createOrder, isLoading: isCreating } = useMutation({
    mutationFn: createOrderApi,
    onSuccess: () => {
      toast.success("New order successfully created");
      queryClient.invalidateQueries({ queryKey: ["orders"] });
    },
    onError: (err) => toast.error(err.message),
  });

  return { isCreating, createOrder };
}
