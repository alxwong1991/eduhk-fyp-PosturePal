import { create } from "zustand";
import { loginUser, registerUser, getUserProfile, logoutUser } from "../api/auth";
import { jwtDecode } from "jwt-decode";

// ✅ Helper function to safely parse JSON
const getStoredUser = () => {
  try {
    const storedUser = localStorage.getItem("user");
    return storedUser ? JSON.parse(storedUser) : null;
  } catch {
    return null;
  }
};

const getStoredToken = () => localStorage.getItem("access_token") || null;

const useAuthStore = create((set, get) => ({
  user: getStoredUser(),
  token: getStoredToken(),
  loading: true,
  sessionExpired: false,

  // ✅ Check if token is expired
  isTokenExpired: () => {
    const token = get().token;
    if (!token) return true;

    try {
      const decoded = jwtDecode(token);
      return decoded.exp * 1000 < Date.now();
    } catch {
      return true;
    }
  },

  // ✅ Fetch user profile & handle expired token
  fetchUser: async () => {
    if (get().isTokenExpired()) {
      get().handleSessionExpiration();
      return;
    }

    try {
      const userData = await getUserProfile();
      sessionStorage.setItem("user", JSON.stringify(userData));
      set({ user: userData, sessionExpired: false });
    } catch (error) {
      console.error("Failed to fetch user:", error);
      if (error.message === "Session expired") {
        get().handleSessionExpiration();
      }
    } finally {
      set({ loading: false });
    }
  },

  // ✅ Handle login & persist token
  login: async (credentials) => {
    try {
      const data = await loginUser(credentials);
      sessionStorage.setItem("access_token", data.access_token);
      set({ token: data.access_token, sessionExpired: false });

      await get().fetchUser(); // ✅ Auto-fetch user after login
    } catch (error) {
      console.error("Login failed:", error);
      throw error;
    }
  },

  // ✅ Handle user registration
  register: async (userData) => {
    try {
      await registerUser(userData);
    } catch (error) {
      console.error("Registration failed:", error);
      throw error;
    }
  },

  // ✅ Handle logout & clear storage
  logout: () => {
    logoutUser();
    sessionStorage.removeItem("access_token");
    sessionStorage.removeItem("user");
    set({ user: null, token: null, sessionExpired: false });
  },

  // ✅ Handle session expiration gracefully
  handleSessionExpiration: () => {
    if (get().sessionExpired) return; // Prevents repeated logouts

    console.warn("Session expired. Logging out...");
    sessionStorage.removeItem("access_token");
    sessionStorage.removeItem("user");
    set({ user: null, token: null, sessionExpired: true });
  },
}));

export default useAuthStore;