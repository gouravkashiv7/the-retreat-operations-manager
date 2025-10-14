import { useMutation, useQueryClient } from "@tanstack/react-query";
import { createEditCabin } from "../../services/apiCabins";
import toast from "react-hot-toast";

export function useCreateCabin() {
  const queryClient = useQueryClient();

  const { isPending: isCreating, mutate: createCabin } = useMutation({
    mutationFn: (cabinData) => createEditCabin(cabinData),
    onSuccess: () => {
      toast.success("Cabin Sucessfully Created!!");
      queryClient.invalidateQueries({
        queryKey: ["cabins"],
      });
    },
  });
  return { isCreating, createCabin };
}
