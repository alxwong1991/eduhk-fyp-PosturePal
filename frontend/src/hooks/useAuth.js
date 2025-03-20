import { useState, useEffect, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { jwtDecode } from "jwt-decode";
import { registerUser, loginUser, getUserProfile, logoutUser } from "../api/auth";
import { useWebsocket } from "./useWebsocket";

export function useAuth() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [sessionExpired, setSessionExpired] = useState(false);
  const navigate = useNavigate();
  const { isExerciseRunning } = useWebsocket();

  // ✅ Memoized function to check session expiration
  const checkSessionExpiration = useCallback(() => {
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
  }, []);

  // ✅ Handles session expiration and prevents multiple triggers
  const handleSessionExpired = useCallback(() => {
    if (isExerciseRunning) {
      console.warn("Delaying session expiration until exercise is finished.");
      return;
    }

    if (!sessionExpired) {
      console.warn("Logging out due to session expiration.");
      logoutUser();
      setUser(null);
      setSessionExpired(true);
      navigate("/login");
    }
  }, [isExerciseRunning, sessionExpired, navigate]);

  // ✅ Fetch user data on mount and every minute if a token exists
  useEffect(() => {
    const fetchUser = async () => {
      const token = localStorage.getItem("access_token");
      if (!token) {
        setUser(null);  // ✅ If no token, set user to null and stop fetching
        setLoading(false);
        return;
      }

      checkSessionExpiration();

      try {
        const userData = await getUserProfile();
        setUser(userData);
        setSessionExpired(false);
      } catch (error) {
        if (error.message === "Session expired") {
          handleSessionExpired();
        } else {
          console.warn("User not authenticated:", error.message);
          setUser(null);
        }
      } finally {
        setLoading(false);
      }
    };

    fetchUser();
    const interval = setInterval(fetchUser, 60000);
    return () => clearInterval(interval);
  }, [checkSessionExpiration, handleSessionExpired]);

  return {
    user,
    loading,
    sessionExpired,
    setSessionExpired,
    register: async (userData) => {
      await registerUser(userData);
      navigate("/login");
    },
    login: async (credentials) => {
      const data = await loginUser(credentials);
      setUser(data);
      setSessionExpired(false);
      navigate("/profile");
    },
    logout: () => {
      logoutUser();
      setUser(null);
      setSessionExpired(false);
    },
  };
}