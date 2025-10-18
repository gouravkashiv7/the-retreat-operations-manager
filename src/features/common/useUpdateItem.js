import { useMutation, useQueryClient } from "@tanstack/react-query";
import toast from "react-hot-toast";

import { createUpdateCabin } from "../../services/apiCabins.js";
import { createUpdateRoom } from "../../services/apiRooms.js";

export function useUpdateItem(itemName, queryKey) {
  const queryClient = useQueryClient();

  // Determine the correct mutation function based on itemName
  const getMutationFn = () => {
    switch (itemName) {
      case "cabin":
        return createUpdateCabin;
      case "room":
        return createUpdateRoom;
      default:
        throw new Error(`Unknown item type: ${itemName}`);
    }
  };

  const { isPending: isUpdating, mutate: updateItem } = useMutation({
    mutationFn: ({ newItemData, id }) => getMutationFn()(newItemData, id),
    onSuccess: () => {
      toast.success(
        `${
          itemName.charAt(0).toUpperCase() + itemName.slice(1)
        } Successfully Updated!!`
      );
      queryClient.invalidateQueries({
        queryKey: [queryKey],
      });
    },
    onError: (err) => toast.error(err.message),
  });

  return { isUpdating, updateItem };
}
