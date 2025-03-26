import { create } from "zustand";
import { loginUser, registerUser, getUserProfile, logoutUser } from "../api/auth";
import { jwtDecode } from "jwt-decode";

// ✅ Safely parse JSON from localStorage
const getStoredUser = () => {
  try {
    const storedUser = localStorage.getItem("user");
    return storedUser ? JSON.parse(storedUser) : null;
  } catch {
    return null;
  }
};

const useAuthStore = create((set, get) => ({
  user: getStoredUser(),
  token: localStorage.getItem("access_token") || null,
  loading: true,
  sessionExpired: false,

  // ✅ Check if token is expired
  isTokenExpired: () => {
    const token = localStorage.getItem("access_token");
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
      localStorage.setItem("user", JSON.stringify(userData));
      set({ user: userData, sessionExpired: false });
    } catch (error) {
      if (error.message === "Session expired") {
        get().handleSessionExpiration();
      }
    } finally {
      set({ loading: false });
    }
  },

  // ✅ Handle login & persist token
  login: async (credentials) => {
    const data = await loginUser(credentials);
    localStorage.setItem("access_token", data.access_token);
    await get().fetchUser();
    set({ token: data.access_token, sessionExpired: false });
  },

  // ✅ Handle user registration
  register: async (userData) => {
    await registerUser(userData);
  },

  // ✅ Handle logout & clear storage
  logout: () => {
    logoutUser();
    localStorage.removeItem("access_token");
    localStorage.removeItem("user");
    set({ user: null, token: null, sessionExpired: false });
  },

  // ✅ Prevent session expiration from looping
  handleSessionExpiration: () => {
    if (get().sessionExpired) return;

    localStorage.removeItem("access_token");
    localStorage.removeItem("user");
    set({ user: null, token: null, sessionExpired: true });
  },
}));

export default useAuthStore;