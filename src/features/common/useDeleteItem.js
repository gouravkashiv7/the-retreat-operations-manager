import { useMutation, useQueryClient } from "@tanstack/react-query";
import toast from "react-hot-toast";

import { deleteCabin } from "../../services/apiCabins.js";
import { deleteRoom } from "../../services/apiRooms.js";

export function useDeleteItem(itemName, queryKey) {
  const queryClient = useQueryClient();

  // Determine the correct mutation function based on itemName
  const getMutationFn = () => {
    switch (itemName) {
      case "cabin":
        return deleteCabin;
      case "room":
        return deleteRoom;
      default:
        throw new Error(`Unknown item type: ${itemName}`);
    }
  };

  const { isPending: isDeleting, mutate: deleteItem } = useMutation({
    mutationFn: getMutationFn(),
    onSuccess: () => {
      toast.success(
        `${
          itemName.charAt(0).toUpperCase() + itemName.slice(1)
        } Successfully Deleted!!`
      );
      queryClient.invalidateQueries({
        queryKey: [queryKey],
      });
    },
    onError: (err) => toast.error(err.message),
  });

  return { isDeleting, deleteItem };
}
