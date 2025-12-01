import { useRouter } from "vue-router";
import { useRightManager } from "@/composables/useRightManager";
import { useAuth } from "@/composables/useAuth";

export function useNavigation() {
  const router = useRouter();
  const { hasRight } = useRightManager();
  const { isLoggedIn, logout } = useAuth();

  function goTo(path) {
    router.push(path);
  }

  function goHome() {
    router.push("/home");
  }

  function goLogin() {
    router.push("/");
  }

  function goBack() {
    router.back();
  }

  function goIfAllowed(path, requiredRole) {
    if (!isLoggedIn()) {
      logout();
      return router.push("/");
    }

    if (requiredRole && !hasRight(requiredRole)) {
      return router.push("/home");
    }

    router.push(path);
  }

  return {
    goTo,
    goHome,
    goLogin,
    goBack,
    goIfAllowed,
  };
}
