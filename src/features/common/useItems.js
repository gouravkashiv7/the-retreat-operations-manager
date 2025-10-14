import { useQuery } from "@tanstack/react-query";

export function useItems(queryKey, queryFn) {
  const {
    isLoading,
    data: items,
    error,
  } = useQuery({
    queryKey: [queryKey],
    queryFn: queryFn,
  });

  return { isLoading, items, error };
}
