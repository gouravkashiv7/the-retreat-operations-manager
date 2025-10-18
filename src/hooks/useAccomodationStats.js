import { useItems } from "../features/common/useItems";
import { getCabins } from "../services/apiCabins";
import { getRooms } from "../services/apiRooms";

export function useAccommodationStats() {
  const { items: cabins, isLoading: isLoadingCabins } = useItems(
    "cabins",
    getCabins
  );
  const { items: rooms, isLoading: isLoadingRooms } = useItems(
    "rooms",
    getRooms
  );

  const totalAccommodation = (cabins?.length || 0) + (rooms?.length || 0);
  const isLoading = isLoadingCabins || isLoadingRooms;

  return {
    totalAccommodation,
    cabinCount: cabins?.length || 0,
    roomCount: rooms?.length || 0,
    isLoading,
  };
}
