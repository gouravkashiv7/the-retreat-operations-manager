import { useMutation, useQueryClient } from "@tanstack/react-query";
import toast from "react-hot-toast";

import { createUpdateCabin } from "../../services/apiCabins.js";
import { createUpdateRoom } from "../../services/apiRooms.js";

export function useCreateItem(itemName, queryKey) {
  const queryClient = useQueryClient();

  // Determine the correct mutation function based on itemName
  const getMutationFn = () => {
    switch (itemName) {
      case "cabin":
        return (itemData) => createUpdateCabin(itemData);
      case "room":
        return (itemData) => createUpdateRoom(itemData);
      default:
        throw new Error(`Unknown item type: ${itemName}`);
    }
  };

  const { isPending: isCreating, mutate: createItem } = useMutation({
    mutationFn: getMutationFn(),
    onSuccess: () => {
      toast.success(
        `${
          itemName.charAt(0).toUpperCase() + itemName.slice(1)
        } Successfully Created!!`
      );
      queryClient.invalidateQueries({
        queryKey: [queryKey],
      });
    },
    onError: (err) => toast.error(err.message),
  });

  return { isCreating, createItem };
}
