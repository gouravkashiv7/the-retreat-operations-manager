import { useMutation, useQueryClient } from "@tanstack/react-query";
import toast from "react-hot-toast";

import { createEditCabin } from "../../services/apiCabins.js";
import { createEditRoom } from "../../services/apiRooms.js";

export function useEditItem(itemName, queryKey) {
  const queryClient = useQueryClient();

  // Determine the correct mutation function based on itemName
  const getMutationFn = () => {
    switch (itemName) {
      case "cabin":
        return createEditCabin;
      case "room":
        return createEditRoom;
      default:
        throw new Error(`Unknown item type: ${itemName}`);
    }
  };

  const { isPending: isEditing, mutate: editItem } = useMutation({
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

  return { isEditing, editItem };
}
