import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { jwtDecode } from "jwt-decode";
import { registerUser, loginUser, getUserProfile, logoutUser } from "../api/auth";
import { useWebsocket } from "../hooks/useWebsocket";

export function useAuth() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [sessionExpired, setSessionExpired] = useState(false);
  const [sessionHandled, setSessionHandled] = useState(false); // ✅ Prevent repeat alerts
  const navigate = useNavigate();
  const { isExerciseRunning } = useWebsocket();

  const checkSessionExpiration = () => {
    const token = localStorage.getItem("access_token");
    if (!token) return;

    try {
      const decoded = jwtDecode(token);
      const currentTime = Math.floor(Date.now() / 1000);

      if (decoded.exp < currentTime) {
        console.warn("Session expired detected.");
        handleSessionExpired();
      }
    } catch (error) {
      console.error("Error decoding JWT:", error);
    }
  };

  const handleSessionExpired = () => {
    if (isExerciseRunning) {
      console.warn("Delaying session expiration until exercise is finished.");
      return;
    }

    if (!sessionHandled) {
      logoutUser();
      setUser(null);
      setSessionExpired(true);
      setSessionHandled(true); // ✅ Prevent multiple alerts
      navigate("/login");
    }
  };

  useEffect(() => {
    const fetchUser = async () => {
      checkSessionExpiration();

      try {
        const userData = await getUserProfile();
        setUser(userData);
        setSessionHandled(false); // ✅ Reset session handling if user logs in
      } catch (error) {
        // console.error("Not authenticated:", error);
        setUser(null);

        if (error.message === "Session expired") {
          handleSessionExpired();
        }
      } finally {
        setLoading(false);
      }
    };

    fetchUser();
    const interval = setInterval(fetchUser, 60000);
    return () => clearInterval(interval);
  }, []);

  return {
    user,
    loading,
    sessionExpired,
    register: async (userData) => {
      await registerUser(userData);
      navigate("/login");
    },
    login: async (credentials) => {
      const data = await loginUser(credentials);
      setUser(data);
      setSessionHandled(false); // ✅ Reset session handling after login
      navigate("/profile");
    },
    logout: () => {
      logoutUser();
      setUser(null);
    },
  };
}