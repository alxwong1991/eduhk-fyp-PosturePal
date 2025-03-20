import { BrowserRouter as Router, Routes, Route, useNavigate, Navigate } from "react-router-dom";
import { useEffect, useState } from "react";
import Swal from "sweetalert2";
import { useAuth } from "./hooks/useAuth";
import Dashboard from "./pages/Dashboard";
import Profile from "./pages/Profile";
import BicepCurls from "./pages/BicepCurls";
import Squats from "./pages/Squats";
import Login from "./pages/Login";
import Register from "./pages/Register";

function GlobalSessionAlert() {
  const navigate = useNavigate();
  const { sessionExpired, loading, setSessionExpired } = useAuth();
  const [alertShown, setAlertShown] = useState(false); // ✅ Track if alert has been shown

  useEffect(() => {
    if (!loading && sessionExpired && !alertShown) { // ✅ Prevent multiple alerts
      setAlertShown(true); // ✅ Mark alert as shown

      Swal.fire({
        title: "Session Expired",
        text: "Your session has expired. Please log in again.",
        icon: "warning",
        confirmButtonText: "OK",
        allowOutsideClick: false,
        allowEscapeKey: false,
      }).then(() => {
        setSessionExpired(false); // ✅ Reset session state
        setAlertShown(false); // ✅ Allow future alerts after login
        navigate("/login");
      });
    }
  }, [sessionExpired, loading, alertShown, navigate, setSessionExpired]);

  return null;
}

export default function App() {
  return (
    <Router>
      <GlobalSessionAlert />
      <Routes>
        <Route path="/" element={<Navigate to="/dashboard" />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/profile" element={<Profile />} />
        <Route path="/bicep-curls" element={<BicepCurls />} />
        <Route path="/squats" element={<Squats />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
      </Routes>
    </Router>
  );
}