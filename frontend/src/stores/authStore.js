import { create } from "zustand";
import { loginUser, registerUser, getUserProfile, logoutUser } from "../api/auth";

const useAuthStore = create((set) => ({
  user: null,
  token: localStorage.getItem("access_token") || null,
  loading: true,
  sessionExpired: false,

  // ✅ Fetch user profile
  fetchUser: async () => {
    const token = localStorage.getItem("access_token");
    if (!token) {
      set({ user: null, loading: false });
      return;
    }

    try {
      const userData = await getUserProfile();
      set({ user: userData, sessionExpired: false });
    } catch (error) {
      if (error.message === "Session expired") {
        set({ user: null, sessionExpired: true });
        logoutUser();
      }
    } finally {
      set({ loading: false });
    }
  },

  // ✅ Handle login
  login: async (credentials) => {
    const data = await loginUser(credentials);
    localStorage.setItem("access_token", data.access_token); // ✅ Store token
    await useAuthStore.getState().fetchUser(); // ✅ Fetch user data after login
    set({ sessionExpired: false });
  },

  // ✅ Fix: Implement register function
  register: async (userData) => {
    await registerUser(userData); // 🔹 Call registerUser function
  },

  // ✅ Handle logout
  logout: () => {
    logoutUser();
    set({ user: null, token: null, sessionExpired: false });
  },

  // ✅ Handle session expiration
  setSessionExpired: (expired) => set({ sessionExpired: expired }),
}));

export default useAuthStore;