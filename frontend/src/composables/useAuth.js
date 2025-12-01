import { jwtDecode } from "jwt-decode";

const TOKEN_KEY = "JWT_token";

export function useAuth() {
  function login(token) {
    localStorage.setItem(TOKEN_KEY, token);
  }

  function logout() {
    localStorage.removeItem(TOKEN_KEY);
  }

  function getToken() {
    return localStorage.getItem(TOKEN_KEY);
  }

  function getUserFromToken() {
    const token = getToken();
    if (!token) return null;

    try {
      return jwtDecode(token);
    } catch {
      return null;
    }
  }

  function getUserId() {
    const user = getUserFromToken();
    console.log(user.id);
    return user?.id ?? null;
  }

  function getUsername() {
    const user = getUserFromToken();
    return user?.username || null;
  }

  function getRole() {
    const user = getUserFromToken();
    return user?.role || null;
  }

  function getUser() {
    return getUserFromToken();
  }

  function isLoggedIn() {
    const user = getUserFromToken();
    if (!user?.exp) return false;

    const isValid = Date.now() < user.exp * 1000;

    if (!isValid) {
      logout();
    }

    return isValid;
  }

  return {
    login,
    logout,
    getToken,
    isLoggedIn,
    getUserId,
    getUsername,
    getRole,
    getUser,
  };
}
