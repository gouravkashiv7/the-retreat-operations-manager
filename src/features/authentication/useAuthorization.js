import { useUser } from "./useUser";

export function useAuthorization() {
  const { user, isAuthenticated, isLoading } = useUser();

  const role = user?.app_metadata?.role || "guest"; // Default to guest if no role is found

  const isAdmin = role === "admin";
  const isStaff = role === "staff";
  const isCook = role === "cook";
  const isGuest = role === "guest";

  return {
    isLoading,
    isAuthenticated,
    user,
    role,
    isAdmin,
    isStaff,
    isCook,
    isGuest,
  };
}
