import { useAuth } from "./useAuth";

export function useRightManager() {
  const { getRole } = useAuth();

  const hierarchy = {
    Speler: 1,
    DM: 2,
    Admin: 3,
  };

  function hasRight(requiredRole) {
    const role = getRole();
    if (!role) return false;

    return hierarchy[role] >= hierarchy[requiredRole];
  }

  return { hasRight };
}
