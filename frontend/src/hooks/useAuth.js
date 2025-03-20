import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { jwtDecode } from "jwt-decode"; // ✅ Decode JWT token
import { registerUser, loginUser, getUserProfile, logoutUser } from "../api/auth";

export function useAuth() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  // ✅ Function to check if token is expired
  const checkSessionExpiration = () => {
    const token = localStorage.getItem("access_token");
    if (!token) return;

    try {
      const decoded = jwtDecode(token);
      const currentTime = Math.floor(Date.now() / 1000);

      if (decoded.exp < currentTime) {
        console.warn("Session expired detected via JWT decoding.");
        handleSessionExpired();
      }
    } catch (error) {
      console.error("Error decoding JWT:", error);
    }
  };

  // ✅ Handle session expiration
  const handleSessionExpired = () => {
    logoutUser();
    setUser(null); // ✅ This will trigger the alert in NavMenu.jsx
    navigate("/login"); // ✅ Redirect to login page
  };

  // ✅ Load user profile on mount & detect session expiration
  useEffect(() => {
    const fetchUser = async () => {
      checkSessionExpiration(); // ✅ Check token expiration first

      try {
        const userData = await getUserProfile();
        setUser(userData);
      } catch (error) {
        console.error("Not authenticated:", error);
        setUser(null);

        if (error.message === "Session expired") {
          handleSessionExpired();
        }
      } finally {
        setLoading(false);
      }
    };

    fetchUser();

    // ✅ Check session expiration every 60 seconds
    const interval = setInterval(fetchUser, 60000);

    return () => clearInterval(interval); // ✅ Cleanup interval on unmount
  }, []);

  return {
    user,
    loading,
    register: async (userData) => {
      await registerUser(userData);
      navigate("/login");
    },
    login: async (credentials) => {
      const data = await loginUser(credentials);
      setUser(data);
      navigate("/profile");
    },
    logout: () => {
      logoutUser();
      setUser(null);
    },
  };
}