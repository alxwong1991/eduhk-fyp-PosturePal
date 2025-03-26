import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Swal from "sweetalert2";
import useAuthStore from "../stores/authStore";

function GlobalSessionAlert() {
  const navigate = useNavigate();
  const { sessionExpired, loading, handleSessionExpiration, logout, token } = useAuthStore();
  const [alertShown, setAlertShown] = useState(false);

  useEffect(() => {
    let interval;

    if (token) { // ✅ Only run interval if the user is logged in
      interval = setInterval(() => {
        if (!loading && useAuthStore.getState().isTokenExpired()) {
          handleSessionExpiration();
        }
      }, 60000); // Check every 60 seconds
    }

    return () => {
      if (interval) clearInterval(interval); // ✅ Stop interval on unmount or logout
    };
  }, [loading, handleSessionExpiration, token]); // ✅ Depend on `token`

  useEffect(() => {
    if (!loading && sessionExpired && !alertShown) {
      setAlertShown(true);

      Swal.fire({
        title: "Session Expired",
        text: "Your session has expired. Please log in again.",
        icon: "warning",
        confirmButtonText: "OK",
        allowOutsideClick: false,
        allowEscapeKey: false,
      }).then(() => {
        logout(); // ✅ Ensure the user is fully logged out
        setAlertShown(false);
        navigate("/login");
      });
    }
  }, [sessionExpired, loading, alertShown, navigate, logout]);

  return null;
}

export default GlobalSessionAlert;