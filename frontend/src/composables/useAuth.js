import { useRouter } from "vue-router";
import { jwtDecode } from "jwt-decode";

export function useAuth() {
  const router = useRouter();
  const TOKEN_KEY = "JWT_token";

  function login(token) {
    localStorage.setItem(TOKEN_KEY, token);
    router.push("/home");
  }

  function logout() {
    localStorage.removeItem(TOKEN_KEY);
    router.push("/");
  }

  function getToken() {
    return localStorage.getItem(TOKEN_KEY);
  }

  function isLoggedIn() {
    const token = getToken();
    if (!token) return false;

    try {
      const { exp } = jwtDecode(token);
      if (!exp) return false;
      return Date.now() < exp * 1000; // exp in seconden, Date.now in ms
    } catch {
      return false;
    }
  }

  // 🔹 UserId uit token halen
  function getUserId() {
    const token = getToken();
    if (!token) return null;

    try {
      const { id } = jwtDecode(token);
      console.log(id);
      return id;
    } catch {
      return null;
    }
  }

  function getUsername() {
    const token = getToken();
    if (!token) return null;

    try {
      const { username } = jwtDecode(token);
      return username;
    } catch {
      return null;
    }
  }

  return {
    login,
    logout,
    getToken,
    isLoggedIn,
    getUserId,
    getUsername,
  };
}
